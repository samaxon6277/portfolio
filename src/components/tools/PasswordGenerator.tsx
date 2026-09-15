import React, { useState, useEffect, useCallback } from 'react';
import { 
  KeyRound, Copy, RefreshCw, Download, ShieldCheck, Eye, EyeOff, 
  Sparkles, Check, AlertCircle, Lock, Sliders, ChevronDown, ChevronUp, FileText, Trash2
} from 'lucide-react';
import { useCustomUi } from '../../context/CustomUiContext';
import { PASSPHRASE_DICTIONARY } from '../../utils/wordList';

type PasswordMode = 'random' | 'passphrase';
type PasswordStrength = 'Weak' | 'Moderate' | 'Strong' | 'Very strong';

interface PasswordItem {
  id: string;
  value: string;
  strength: PasswordStrength;
  entropyBits: number;
}

const AMBIGUOUS_CHARS = new Set(['l', '1', 'I', 'O', '0', 'o', '|', '`', "'", '"']);

export default function PasswordGenerator() {
  const { showToast, showAlert } = useCustomUi();
  
  // Mode selection
  const [mode, setMode] = useState<PasswordMode>('random');
  
  // Random Password Options
  const [length, setLength] = useState<number>(16);
  const [useUppercase, setUseUppercase] = useState<boolean>(true);
  const [useLowercase, setUseLowercase] = useState<boolean>(true);
  const [useNumbers, setUseNumbers] = useState<boolean>(true);
  const [useSymbols, setUseSymbols] = useState<boolean>(true);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState<boolean>(false);
  const [avoidRepeated, setAvoidRepeated] = useState<boolean>(false);
  const [batchCount, setBatchCount] = useState<number>(1);
  
  // Passphrase Options
  const [wordCount, setWordCount] = useState<number>(4);
  const [separator, setSeparator] = useState<string>('-');
  const [capitalization, setCapitalization] = useState<'title' | 'lower' | 'upper'>('title');
  const [includeNumber, setIncludeNumber] = useState<boolean>(true);
  const [includeSymbol, setIncludeSymbol] = useState<boolean>(false);

  // Results State
  const [passwords, setPasswords] = useState<PasswordItem[]>([]);
  const [showValues, setShowValues] = useState<boolean>(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Cryptographically secure random integer in [0, max)
  const getSecureRandomInt = (max: number): number => {
    if (max <= 0) return 0;
    const array = new Uint32Array(1);
    const maxUint32 = 0xFFFFFFFF;
    const limit = maxUint32 - (maxUint32 % max);
    let randomVal = 0;
    do {
      window.crypto.getRandomValues(array);
      randomVal = array[0];
    } while (randomVal >= limit);
    return randomVal % max;
  };

  // Calculate password strength
  const evaluateStrength = (pwd: string, poolSize: number): { strength: PasswordStrength; bits: number } => {
    if (!pwd) return { strength: 'Weak', bits: 0 };
    const entropy = Math.round(pwd.length * (Math.log2(Math.max(poolSize, 2))));
    
    if (entropy < 40 || pwd.length < 8) {
      return { strength: 'Weak', bits: entropy };
    } else if (entropy < 60 || pwd.length < 12) {
      return { strength: 'Moderate', bits: entropy };
    } else if (entropy < 90 || pwd.length < 16) {
      return { strength: 'Strong', bits: entropy };
    } else {
      return { strength: 'Very strong', bits: entropy };
    }
  };

  // Generate single random password
  const generateRandomPassword = (): PasswordItem | null => {
    let charPool = '';
    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const numberChars = '0123456789';
    const symbolChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    const requiredChars: string[] = [];

    if (useUppercase) {
      const pool = excludeAmbiguous ? uppercaseChars.split('').filter(c => !AMBIGUOUS_CHARS.has(c)).join('') : uppercaseChars;
      charPool += pool;
      if (pool.length > 0) requiredChars.push(pool[getSecureRandomInt(pool.length)]);
    }
    if (useLowercase) {
      const pool = excludeAmbiguous ? lowercaseChars.split('').filter(c => !AMBIGUOUS_CHARS.has(c)).join('') : lowercaseChars;
      charPool += pool;
      if (pool.length > 0) requiredChars.push(pool[getSecureRandomInt(pool.length)]);
    }
    if (useNumbers) {
      const pool = excludeAmbiguous ? numberChars.split('').filter(c => !AMBIGUOUS_CHARS.has(c)).join('') : numberChars;
      charPool += pool;
      if (pool.length > 0) requiredChars.push(pool[getSecureRandomInt(pool.length)]);
    }
    if (useSymbols) {
      const pool = excludeAmbiguous ? symbolChars.split('').filter(c => !AMBIGUOUS_CHARS.has(c)).join('') : symbolChars;
      charPool += pool;
      if (pool.length > 0) requiredChars.push(pool[getSecureRandomInt(pool.length)]);
    }

    if (!charPool) {
      setErrorMessage('Please select at least one character set (Uppercase, Lowercase, Numbers, or Symbols).');
      return null;
    }

    if (avoidRepeated && length > charPool.length) {
      setErrorMessage(`Cannot avoid repeated characters: requested length (${length}) exceeds the available character pool size (${charPool.length}).`);
      return null;
    }

    setErrorMessage(null);

    let result = '';
    const poolArray = charPool.split('');
    const usedChars = new Set<string>();

    // First, guarantee at least one char from each selected category
    for (const ch of requiredChars) {
      result += ch;
      if (avoidRepeated) usedChars.add(ch);
    }

    // Fill the remainder
    while (result.length < length) {
      let candidate = poolArray[getSecureRandomInt(poolArray.length)];
      if (avoidRepeated) {
        let attempts = 0;
        while (usedChars.has(candidate) && attempts < 100) {
          candidate = poolArray[getSecureRandomInt(poolArray.length)];
          attempts++;
        }
        usedChars.add(candidate);
      }
      result += candidate;
    }

    // Cryptographic shuffle (Fisher-Yates)
    const chars = result.split('');
    for (let i = chars.length - 1; i > 0; i--) {
      const j = getSecureRandomInt(i + 1);
      const temp = chars[i];
      chars[i] = chars[j];
      chars[j] = temp;
    }
    const finalPassword = chars.join('');

    const { strength, bits } = evaluateStrength(finalPassword, charPool.length);
    return {
      id: `${Date.now()}-${getSecureRandomInt(100000)}`,
      value: finalPassword,
      strength,
      entropyBits: bits
    };
  };

  // Generate single passphrase
  const generatePassphrase = (): PasswordItem | null => {
    if (!PASSPHRASE_DICTIONARY || PASSPHRASE_DICTIONARY.length === 0) {
      setErrorMessage('Dictionary is not available for passphrase generation.');
      return null;
    }

    setErrorMessage(null);
    const chosenWords: string[] = [];

    for (let i = 0; i < wordCount; i++) {
      let word = PASSPHRASE_DICTIONARY[getSecureRandomInt(PASSPHRASE_DICTIONARY.length)];
      if (capitalization === 'title') {
        word = word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      } else if (capitalization === 'upper') {
        word = word.toUpperCase();
      } else {
        word = word.toLowerCase();
      }
      chosenWords.push(word);
    }

    let finalPhrase = chosenWords.join(separator);

    if (includeNumber) {
      const num = getSecureRandomInt(100);
      finalPhrase += `${separator}${num}`;
    }

    if (includeSymbol) {
      const symList = ['!', '@', '#', '$', '%', '*', '?'];
      const sym = symList[getSecureRandomInt(symList.length)];
      finalPhrase += `${sym}`;
    }

    const effectivePool = PASSPHRASE_DICTIONARY.length;
    const entropy = Math.round(wordCount * Math.log2(effectivePool) + (includeNumber ? 6.6 : 0) + (includeSymbol ? 2.8 : 0));
    
    let strength: PasswordStrength = 'Strong';
    if (entropy < 45) strength = 'Moderate';
    else if (entropy >= 75) strength = 'Very strong';

    return {
      id: `${Date.now()}-${getSecureRandomInt(100000)}`,
      value: finalPhrase,
      strength,
      entropyBits: entropy
    };
  };

  // Generate primary action
  const handleGenerate = useCallback(() => {
    const list: PasswordItem[] = [];
    const count = Math.min(Math.max(batchCount, 1), 10);

    for (let i = 0; i < count; i++) {
      const item = mode === 'random' ? generateRandomPassword() : generatePassphrase();
      if (item) list.push(item);
      else break;
    }

    if (list.length > 0) {
      setPasswords(list);
    }
  }, [
    mode, length, useUppercase, useLowercase, useNumbers, useSymbols, 
    excludeAmbiguous, avoidRepeated, batchCount, wordCount, separator, 
    capitalization, includeNumber, includeSymbol
  ]);

  // Initial generation on load
  useEffect(() => {
    handleGenerate();
  }, [handleGenerate]);

  // Copy handler
  const handleCopy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      showToast('Copied to clipboard.', 'success');
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      showToast('Failed to copy. Please copy manually.', 'error');
    }
  };

  // Copy all
  const handleCopyAll = async () => {
    if (passwords.length === 0) return;
    const allText = passwords.map(p => p.value).join('\n');
    try {
      await navigator.clipboard.writeText(allText);
      showToast('All passwords copied to clipboard.', 'success');
    } catch {
      showToast('Failed to copy. Please copy manually.', 'error');
    }
  };

  // Download plain text with warning
  const handleDownloadTxt = () => {
    if (passwords.length === 0) return;
    
    showAlert({
      title: 'Security Notice',
      message: 'Downloaded passwords will be stored as unencrypted plain text on your device. Do not share this file or store it in insecure cloud folders.',
      buttonText: 'I Understand & Download'
    });

    const content = passwords.map((p, idx) => `Password ${idx + 1} (${p.strength}, ~${p.entropyBits} bits entropy):\n${p.value}\n`).join('\n');
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `passwords-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Reset
  const handleReset = () => {
    setPasswords([]);
    setErrorMessage(null);
    handleGenerate();
    showToast('Generator reset to default settings.', 'info');
  };

  // Color badge for strength
  const getStrengthBadge = (strength: PasswordStrength) => {
    switch (strength) {
      case 'Weak':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'Moderate':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Strong':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Very strong':
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  return (
    <div className="space-y-8 text-left max-w-4xl mx-auto" id="password-generator-tool">
      {/* 1. Header & Privacy Note */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="p-2 bg-[#111111] text-[#D6B46A] rounded-lg">
            <KeyRound className="w-5 h-5" />
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#111111] font-display">
            Password Generator
          </h2>
        </div>
        <p className="text-sm sm:text-base text-[#554F49]">
          Generate strong random passwords and memorable passphrases locally in your browser with cryptographically secure randomness.
        </p>
        <div className="flex items-center gap-2 text-xs font-mono text-emerald-800 bg-emerald-50/80 border border-emerald-200 px-3 py-1.5 rounded-md w-fit">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>100% Client-Side: Generated via window.crypto. Passwords are never sent to a server, logged, or saved.</span>
        </div>
      </div>

      {/* 2. Workspace Card */}
      <div className="bg-white border border-[#D6B46A]/30 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        
        {/* Mode Selector */}
        <div className="flex items-center justify-between border-b border-neutral-100 pb-5 flex-wrap gap-4">
          <span className="text-xs font-mono uppercase tracking-wider font-bold text-[#554F49]">
            Generation Mode
          </span>
          <div className="inline-flex p-1 bg-neutral-100 rounded-xl">
            <button
              type="button"
              onClick={() => { setMode('random'); setErrorMessage(null); }}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                mode === 'random' 
                  ? 'bg-white text-[#111111] shadow-sm' 
                  : 'text-neutral-600 hover:text-[#111111]'
              }`}
            >
              Random Password
            </button>
            <button
              type="button"
              onClick={() => { setMode('passphrase'); setErrorMessage(null); }}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                mode === 'passphrase' 
                  ? 'bg-white text-[#111111] shadow-sm' 
                  : 'text-neutral-600 hover:text-[#111111]'
              }`}
            >
              Memorable Passphrase
            </button>
          </div>
        </div>

        {/* Primary Result Preview Box */}
        {passwords.length > 0 && (
          <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 text-xs font-bold font-mono border rounded-full ${getStrengthBadge(passwords[0].strength)}`}>
                  {passwords[0].strength}
                </span>
                <span className="text-xs text-neutral-500 font-mono">
                  ~{passwords[0].entropyBits} bits entropy
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowValues(!showValues)}
                  className="p-1.5 text-neutral-600 hover:text-[#111111] hover:bg-neutral-200 rounded-md transition-colors cursor-pointer"
                  title={showValues ? 'Hide password' : 'Show password'}
                  aria-label={showValues ? 'Hide password' : 'Show password'}
                >
                  {showValues ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 bg-white border border-neutral-200/80 rounded-lg p-3">
              <span className={`font-mono text-base sm:text-lg tracking-wide break-all select-all ${
                showValues ? 'text-[#111111] font-semibold' : 'text-neutral-400 tracking-widest'
              }`}>
                {showValues ? passwords[0].value : '••••••••••••••••'}
              </span>
              <button
                type="button"
                onClick={() => handleCopy(passwords[0].value, passwords[0].id)}
                className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-[#111111] text-[#D6B46A] hover:bg-black text-xs font-bold rounded-lg transition-colors cursor-pointer"
              >
                {copiedId === passwords[0].id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedId === passwords[0].id ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Error Notification if settings are impossible */}
        {errorMessage && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-800 text-sm">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Invalid Settings</p>
              <p>{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Basic Configuration Controls */}
        {mode === 'random' ? (
          <div className="space-y-5">
            {/* Length Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <label htmlFor="pwd-length" className="font-bold text-[#111111]">
                  Password Length: <span className="font-mono text-[#A68936] text-base">{length}</span> characters
                </label>
                <span className="text-xs text-neutral-500 font-mono">Range: 8 - 64</span>
              </div>
              <input
                id="pwd-length"
                type="range"
                min="8"
                max="64"
                value={length}
                onChange={(e) => setLength(parseInt(e.target.value, 10))}
                className="w-full accent-[#A68936] cursor-pointer h-2 bg-neutral-200 rounded-lg"
              />
            </div>

            {/* Character Set Toggles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <label className="flex items-center gap-3 p-3 border border-neutral-200 rounded-xl cursor-pointer hover:bg-neutral-50 transition-colors">
                <input
                  type="checkbox"
                  checked={useUppercase}
                  onChange={(e) => setUseUppercase(e.target.checked)}
                  className="w-4 h-4 accent-[#A68936] rounded"
                />
                <div className="text-xs">
                  <p className="font-bold text-[#111111]">Uppercase Letters</p>
                  <p className="text-neutral-500 font-mono">A B C D E ...</p>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 border border-neutral-200 rounded-xl cursor-pointer hover:bg-neutral-50 transition-colors">
                <input
                  type="checkbox"
                  checked={useLowercase}
                  onChange={(e) => setUseLowercase(e.target.checked)}
                  className="w-4 h-4 accent-[#A68936] rounded"
                />
                <div className="text-xs">
                  <p className="font-bold text-[#111111]">Lowercase Letters</p>
                  <p className="text-neutral-500 font-mono">a b c d e ...</p>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 border border-neutral-200 rounded-xl cursor-pointer hover:bg-neutral-50 transition-colors">
                <input
                  type="checkbox"
                  checked={useNumbers}
                  onChange={(e) => setUseNumbers(e.target.checked)}
                  className="w-4 h-4 accent-[#A68936] rounded"
                />
                <div className="text-xs">
                  <p className="font-bold text-[#111111]">Numbers</p>
                  <p className="text-neutral-500 font-mono">0 1 2 3 4 5 6 7 8 9</p>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 border border-neutral-200 rounded-xl cursor-pointer hover:bg-neutral-50 transition-colors">
                <input
                  type="checkbox"
                  checked={useSymbols}
                  onChange={(e) => setUseSymbols(e.target.checked)}
                  className="w-4 h-4 accent-[#A68936] rounded"
                />
                <div className="text-xs">
                  <p className="font-bold text-[#111111]">Symbols</p>
                  <p className="text-neutral-500 font-mono">! @ # $ % ^ & * ...</p>
                </div>
              </label>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Passphrase Word Count */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <label htmlFor="passphrase-words" className="font-bold text-[#111111]">
                  Number of Words: <span className="font-mono text-[#A68936] text-base">{wordCount}</span>
                </label>
                <span className="text-xs text-neutral-500 font-mono">Recommended: 4 - 6</span>
              </div>
              <input
                id="passphrase-words"
                type="range"
                min="3"
                max="8"
                value={wordCount}
                onChange={(e) => setWordCount(parseInt(e.target.value, 10))}
                className="w-full accent-[#A68936] cursor-pointer h-2 bg-neutral-200 rounded-lg"
              />
            </div>

            {/* Separator & Capitalization */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="passphrase-separator" className="text-xs font-bold text-[#111111]">Word Separator</label>
                <select
                  id="passphrase-separator"
                  value={separator}
                  onChange={(e) => setSeparator(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono bg-white border border-neutral-200 rounded-lg focus:outline-none focus:border-[#A68936]"
                >
                  <option value="-">Hyphen (-)</option>
                  <option value="_">Underscore (_)</option>
                  <option value=" ">Space ( )</option>
                  <option value=".">Period (.)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="passphrase-capital" className="text-xs font-bold text-[#111111]">Capitalization</label>
                <select
                  id="passphrase-capital"
                  value={capitalization}
                  onChange={(e) => setCapitalization(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs font-mono bg-white border border-neutral-200 rounded-lg focus:outline-none focus:border-[#A68936]"
                >
                  <option value="title">Title Case (Word-Word)</option>
                  <option value="lower">lowercase (word-word)</option>
                  <option value="upper">UPPERCASE (WORD-WORD)</option>
                </select>
              </div>
            </div>

            {/* Passphrase extras */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <label className="flex items-center gap-3 p-3 border border-neutral-200 rounded-xl cursor-pointer hover:bg-neutral-50 transition-colors">
                <input
                  type="checkbox"
                  checked={includeNumber}
                  onChange={(e) => setIncludeNumber(e.target.checked)}
                  className="w-4 h-4 accent-[#A68936] rounded"
                />
                <div className="text-xs">
                  <p className="font-bold text-[#111111]">Append Random Number</p>
                  <p className="text-neutral-500">e.g., -42</p>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 border border-neutral-200 rounded-xl cursor-pointer hover:bg-neutral-50 transition-colors">
                <input
                  type="checkbox"
                  checked={includeSymbol}
                  onChange={(e) => setIncludeSymbol(e.target.checked)}
                  className="w-4 h-4 accent-[#A68936] rounded"
                />
                <div className="text-xs">
                  <p className="font-bold text-[#111111]">Append Special Symbol</p>
                  <p className="text-neutral-500">e.g., # or !</p>
                </div>
              </label>
            </div>
          </div>
        )}

        {/* Advanced Settings Expandable */}
        <div className="border-t border-neutral-100 pt-4">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-2 text-xs font-bold text-neutral-600 hover:text-[#111111] cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Advanced Controls</span>
            {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showAdvanced && (
            <div className="mt-4 p-4 bg-neutral-50 border border-neutral-200 rounded-xl space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {mode === 'random' && (
                  <>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={excludeAmbiguous}
                        onChange={(e) => setExcludeAmbiguous(e.target.checked)}
                        className="w-4 h-4 accent-[#A68936] rounded"
                      />
                      <span>Exclude ambiguous characters (l, 1, I, O, 0, |)</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={avoidRepeated}
                        onChange={(e) => setAvoidRepeated(e.target.checked)}
                        className="w-4 h-4 accent-[#A68936] rounded"
                      />
                      <span>Avoid repeated characters in password</span>
                    </label>
                  </>
                )}

                <div className="space-y-1">
                  <label htmlFor="batch-count" className="font-bold text-[#111111] block">
                    Generate Multiple Passwords
                  </label>
                  <select
                    id="batch-count"
                    value={batchCount}
                    onChange={(e) => setBatchCount(parseInt(e.target.value, 10))}
                    className="w-full px-3 py-1.5 font-mono bg-white border border-neutral-200 rounded-md focus:outline-none focus:border-[#A68936]"
                  >
                    <option value="1">1 password</option>
                    <option value="3">3 passwords</option>
                    <option value="5">5 passwords</option>
                    <option value="10">10 passwords</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Primary Action Button */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleGenerate}
            className="w-full sm:flex-1 py-3.5 px-6 bg-[#111111] hover:bg-black text-[#D6B46A] text-sm font-bold rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Generate Password</span>
          </button>

          {passwords.length > 1 && (
            <button
              type="button"
              onClick={handleCopyAll}
              className="w-full sm:w-auto py-3.5 px-5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Copy className="w-4 h-4" />
              <span>Copy All ({passwords.length})</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleDownloadTxt}
            className="w-full sm:w-auto py-3.5 px-5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
            title="Download plain text file"
          >
            <Download className="w-4 h-4" />
            <span>Download TXT</span>
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="p-3.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-xl transition-colors cursor-pointer"
            title="Reset to defaults"
            aria-label="Reset generator"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Multiple Passwords Batch List */}
        {passwords.length > 1 && (
          <div className="space-y-3 pt-4 border-t border-neutral-100">
            <h3 className="text-xs font-mono uppercase tracking-wider font-bold text-neutral-500">
              Generated Batch ({passwords.length})
            </h3>
            <div className="space-y-2">
              {passwords.map((p, idx) => (
                <div key={p.id} className="flex items-center justify-between p-3 bg-neutral-50 border border-neutral-200 rounded-lg text-xs">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <span className="font-mono text-neutral-400 font-bold w-5">{idx + 1}.</span>
                    <span className="font-mono font-medium text-neutral-900 truncate">
                      {showValues ? p.value : '••••••••••••••••'}
                    </span>
                    <span className={`hidden sm:inline px-2 py-0.5 font-mono text-[10px] rounded-full border ${getStrengthBadge(p.strength)}`}>
                      {p.strength}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(p.value, p.id)}
                    className="shrink-0 flex items-center gap-1 text-neutral-600 hover:text-[#111111] px-2 py-1 bg-white border border-neutral-200 rounded transition-colors cursor-pointer"
                  >
                    {copiedId === p.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === p.id ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 3. Usage Tips & Security Advice */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 bg-white border border-neutral-200 rounded-xl space-y-2">
          <h4 className="text-xs font-mono uppercase font-bold text-[#A68936]">
            Password Best Practices
          </h4>
          <p className="text-xs text-[#554F49] leading-relaxed">
            Never reuse passwords across multiple services. A password manager combined with two-factor authentication (2FA) gives you the highest level of account protection.
          </p>
        </div>

        <div className="p-5 bg-white border border-neutral-200 rounded-xl space-y-2">
          <h4 className="text-xs font-mono uppercase font-bold text-[#A68936]">
            Why Memorable Passphrases?
          </h4>
          <p className="text-xs text-[#554F49] leading-relaxed">
            Passphrases combining 4+ random words are easy for humans to type and remember, while offering equivalent or superior cryptographic entropy against brute-force attacks compared to short random strings.
          </p>
        </div>
      </div>

      {/* 4. Frequently Asked Questions */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-6 sm:p-8 space-y-4">
        <h3 className="text-lg font-bold text-[#111111]">Frequently Asked Questions</h3>
        <div className="space-y-3 text-xs text-neutral-700">
          <div>
            <p className="font-bold text-neutral-900">Are generated passwords sent over the network?</p>
            <p className="text-neutral-600 mt-0.5">No. All password generation uses your browser's native window.crypto.getRandomValues API. Zero network requests are made, and nothing is logged or saved.</p>
          </div>
          <div>
            <p className="font-bold text-neutral-900">What is entropy?</p>
            <p className="text-neutral-600 mt-0.5">Entropy measures password randomness in bits. A password with 60+ bits of entropy is computationally infeasible to brute-force with modern hardware.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
