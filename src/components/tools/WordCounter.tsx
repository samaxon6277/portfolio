import React, { useState, useMemo, useRef } from 'react';
import { 
  FileText, Copy, Download, Trash2, Clock, Volume2, 
  Search, ShieldCheck, Upload, AlertCircle, ArrowUpRight, BarChart2, Check
} from 'lucide-react';
import { useCustomUi } from '../../context/CustomUiContext';

// Common English stop words to filter out for meaningful keyword analysis
const STOP_WORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'aren\'t', 'as', 'at',
  'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by', 'can', 'can\'t', 'cannot',
  'could', 'couldn\'t', 'did', 'didn\'t', 'do', 'does', 'doesn\'t', 'doing', 'don\'t', 'down', 'during', 'each',
  'few', 'for', 'from', 'further', 'had', 'hadn\'t', 'has', 'hasn\'t', 'have', 'haven\'t', 'having', 'he', 'he\'d',
  'he\'ll', 'he\'s', 'her', 'here', 'here\'s', 'hers', 'herself', 'him', 'himself', 'his', 'how', 'how\'s', 'i',
  'i\'d', 'i\'ll', 'i\'m', 'i\'ve', 'if', 'in', 'into', 'is', 'isn\'t', 'it', 'it\'s', 'its', 'itself', 'let\'s',
  'me', 'more', 'most', 'mustn\'t', 'my', 'myself', 'no', 'nor', 'not', 'of', 'off', 'on', 'once', 'only', 'or',
  'other', 'ought', 'our', 'ours', 'ourselves', 'out', 'over', 'own', 'same', 'shan\'t', 'she', 'she\'d', 'she\'ll',
  'she\'s', 'should', 'shouldn\'t', 'so', 'some', 'such', 'than', 'that', 'that\'s', 'the', 'their', 'theirs', 'them',
  'themselves', 'then', 'there', 'there\'s', 'these', 'they', 'they\'d', 'they\'ll', 'they\'re', 'they\'ve', 'this',
  'those', 'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was', 'wasn\'t', 'we', 'we\'d', 'we\'ll', 'we\'re',
  'we\'ve', 'were', 'weren\'t', 'what', 'what\'s', 'when', 'when\'s', 'where', 'where\'s', 'which', 'while', 'who',
  'who\'s', 'whom', 'why', 'why\'s', 'with', 'won\'t', 'would', 'wouldn\'t', 'you', 'you\'d', 'you\'ll', 'you\'re',
  'you\'ve', 'your', 'yours', 'yourself', 'yourselves'
]);

export default function WordCounter() {
  const { showToast, showConfirm } = useCustomUi();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [text, setText] = useState<string>('');
  const [readingWpm, setReadingWpm] = useState<number>(225); // Average adult reading speed
  const [speakingWpm, setSpeakingWpm] = useState<number>(140); // Average speaking speed
  const [targetKeyword, setTargetKeyword] = useState<string>('');
  const [caseSensitiveKeyword, setCaseSensitiveKeyword] = useState<boolean>(false);
  const [wholeWordKeyword, setWholeWordKeyword] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  // Core metrics calculation
  const stats = useMemo(() => {
    const raw = text;
    const trimmed = raw.trim();

    if (!trimmed) {
      return {
        words: 0,
        charactersWithSpaces: raw.length,
        charactersNoSpaces: 0,
        sentences: 0,
        paragraphs: 0,
        lines: raw.length > 0 ? raw.split('\n').length : 0,
        avgWordLength: 0,
        avgSentenceLength: 0,
        readingTimeMinutes: 0,
        readingTimeSeconds: 0,
        speakingTimeMinutes: 0,
        speakingTimeSeconds: 0,
        longestWord: '',
        longestSentence: '',
        topWords: [] as { word: string; count: number; percent: number }[],
        keywordCount: 0,
        keywordDensity: 0
      };
    }

    // 1. Unicode & whitespace aware word tokenization (matching letters, numbers, hyphens, and Hindi/Devanagari \p{L})
    // Support modern Unicode regex
    let wordTokens: string[] = [];
    try {
      const matches = trimmed.match(/[\p{L}\p{N}'’\-_]+/gu);
      wordTokens = matches ? matches.map(w => w.replace(/^[-_']+|[-_']+$/g, '')).filter(w => w.length > 0) : [];
    } catch {
      wordTokens = trimmed.split(/\s+/).filter(w => w.length > 0);
    }

    const wordCount = wordTokens.length;
    const charCountWithSpaces = raw.length;
    const charCountNoSpaces = raw.replace(/\s/g, '').length;

    // 2. Sentence tokenization: split by '.', '!', '?', or newline with trailing punctuation
    const sentenceList = trimmed
      .split(/[.!?]+(?:\s+|$)|(?:\n\s*){2,}/)
      .map(s => s.trim())
      .filter(s => s.length > 0);
    const sentenceCount = Math.max(sentenceList.length, wordCount > 0 ? 1 : 0);

    // 3. Paragraphs: separated by double newline or non-empty lines
    const paragraphList = raw
      .split(/\n\s*\n/)
      .map(p => p.trim())
      .filter(p => p.length > 0);
    const paragraphCount = Math.max(paragraphList.length, wordCount > 0 ? 1 : 0);

    // 4. Lines
    const lineCount = raw.split('\n').length;

    // 5. Longest word
    let longestWord = '';
    let totalWordLength = 0;
    for (const w of wordTokens) {
      totalWordLength += w.length;
      if (w.length > longestWord.length) {
        longestWord = w;
      }
    }
    const avgWordLength = wordCount > 0 ? (totalWordLength / wordCount).toFixed(1) : '0';
    const avgSentenceLength = sentenceCount > 0 ? (wordCount / sentenceCount).toFixed(1) : '0';

    // 6. Longest sentence
    let longestSentence = '';
    for (const s of sentenceList) {
      if (s.length > longestSentence.length) {
        longestSentence = s;
      }
    }

    // 7. Estimated Reading & Speaking Time
    const totalReadingSeconds = wordCount > 0 ? Math.round((wordCount / readingWpm) * 60) : 0;
    const readingMin = Math.floor(totalReadingSeconds / 60);
    const readingSec = totalReadingSeconds % 60;

    const totalSpeakingSeconds = wordCount > 0 ? Math.round((wordCount / speakingWpm) * 60) : 0;
    const speakingMin = Math.floor(totalSpeakingSeconds / 60);
    const speakingSec = totalSpeakingSeconds % 60;

    // 8. Word Frequency Distribution (Filtering common stop words)
    const frequencyMap = new Map<string, number>();
    for (const w of wordTokens) {
      const lower = w.toLowerCase();
      if (lower.length > 2 && !STOP_WORDS.has(lower)) {
        frequencyMap.set(lower, (frequencyMap.get(lower) || 0) + 1);
      }
    }

    const sortedWords = Array.from(frequencyMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([word, count]) => ({
        word,
        count,
        percent: wordCount > 0 ? Math.round((count / wordCount) * 1000) / 10 : 0
      }));

    // 9. Target Keyword Frequency Analysis
    let keywordCount = 0;
    let keywordDensity = 0;

    if (targetKeyword.trim() && wordCount > 0) {
      const kw = targetKeyword.trim();
      const escapedKw = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const flags = caseSensitiveKeyword ? 'g' : 'gi';

      try {
        const regex = wholeWordKeyword 
          ? new RegExp(`\\b${escapedKw}\\b`, flags)
          : new RegExp(escapedKw, flags);
        const matches = raw.match(regex);
        keywordCount = matches ? matches.length : 0;
        keywordDensity = Math.round((keywordCount / wordCount) * 1000) / 10;
      } catch {
        keywordCount = 0;
        keywordDensity = 0;
      }
    }

    return {
      words: wordCount,
      charactersWithSpaces: charCountWithSpaces,
      charactersNoSpaces: charCountNoSpaces,
      sentences: sentenceCount,
      paragraphs: paragraphCount,
      lines: lineCount,
      avgWordLength,
      avgSentenceLength,
      readingTimeMinutes: readingMin,
      readingTimeSeconds: readingSec,
      speakingTimeMinutes: speakingMin,
      speakingTimeSeconds: speakingSec,
      longestWord,
      longestSentence,
      topWords: sortedWords,
      keywordCount,
      keywordDensity
    };
  }, [text, readingWpm, speakingWpm, targetKeyword, caseSensitiveKeyword, wholeWordKeyword]);

  // Handle Paste
  const handlePaste = async () => {
    try {
      const clip = await navigator.clipboard.readText();
      if (clip) {
        setText(prev => (prev ? `${prev}\n\n${clip}` : clip));
        showToast('Text pasted from clipboard.', 'success');
      } else {
        showToast('Clipboard is empty.', 'info');
      }
    } catch {
      showToast('Clipboard access was blocked. Please paste directly into the editor.', 'warning');
    }
  };

  // Handle Copy
  const handleCopy = async () => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      showToast('Text copied to clipboard.', 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast('Failed to copy. Please copy manually.', 'error');
    }
  };

  // Clear with custom confirm dialog
  const handleClear = () => {
    if (!text.trim()) return;
    showConfirm({
      title: 'Clear Text Editor?',
      message: 'Are you sure you want to clear your text? This action cannot be undone unless you have a copy.',
      confirmText: 'Yes, Clear All',
      cancelText: 'Keep Text',
      onConfirm: () => {
        setText('');
        setTargetKeyword('');
        showToast('Editor cleared.', 'info');
      }
    });
  };

  // Upload .txt or .md file
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showToast('File size exceeds the 5MB limit.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === 'string') {
        setText(content);
        showToast(`Loaded "${file.name}" successfully.`, 'success');
      }
    };
    reader.onerror = () => {
      showToast('Could not read the selected file.', 'error');
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Download raw TXT
  const handleDownloadTxt = () => {
    if (!text.trim()) return;
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `document-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('File downloaded.', 'success');
  };

  // Export comprehensive analysis report
  const handleExportReport = (format: 'txt' | 'json') => {
    if (!text.trim()) return;

    if (format === 'json') {
      const report = {
        generatedAt: new Date().toISOString(),
        metrics: {
          words: stats.words,
          charactersWithSpaces: stats.charactersWithSpaces,
          charactersNoSpaces: stats.charactersNoSpaces,
          sentences: stats.sentences,
          paragraphs: stats.paragraphs,
          lines: stats.lines,
          averageWordLength: stats.avgWordLength,
          averageSentenceLength: stats.avgSentenceLength,
          estimatedReadingTime: `${stats.readingTimeMinutes}m ${stats.readingTimeSeconds}s (at ${readingWpm} wpm)`,
          estimatedSpeakingTime: `${stats.speakingTimeMinutes}m ${stats.speakingTimeSeconds}s (at ${speakingWpm} wpm)`
        },
        keywordAnalysis: {
          targetKeyword: targetKeyword || null,
          occurrences: stats.keywordCount,
          densityPercent: stats.keywordDensity,
          topFrequentWords: stats.topWords
        }
      };

      const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `text-analysis-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('JSON report downloaded.', 'success');
    } else {
      const content = [
        `==================================================`,
        `SAMAXON WORD COUNTER & TEXT ANALYSIS REPORT`,
        `Generated: ${new Date().toLocaleString()}`,
        `==================================================`,
        ``,
        `CORE COUNTS:`,
        `- Total Words: ${stats.words}`,
        `- Characters (with spaces): ${stats.charactersWithSpaces}`,
        `- Characters (without spaces): ${stats.charactersNoSpaces}`,
        `- Sentences: ${stats.sentences}`,
        `- Paragraphs: ${stats.paragraphs}`,
        `- Lines: ${stats.lines}`,
        ``,
        `PACING & READABILITY:`,
        `- Estimated Reading Time: ${stats.readingTimeMinutes} min ${stats.readingTimeSeconds} sec (@ ${readingWpm} wpm)`,
        `- Estimated Speaking Time: ${stats.speakingTimeMinutes} min ${stats.speakingTimeSeconds} sec (@ ${speakingWpm} wpm)`,
        `- Average Word Length: ${stats.avgWordLength} chars`,
        `- Average Sentence Length: ${stats.avgSentenceLength} words`,
        `- Longest Word: "${stats.longestWord}"`,
        ``,
        `TOP MEANINGFUL KEYWORDS:`,
        ...stats.topWords.map((t, idx) => `  ${idx + 1}. ${t.word} (${t.count}x, ${t.percent}%)`),
        ``,
        targetKeyword ? `TARGET KEYWORD ("${targetKeyword}"): ${stats.keywordCount} occurrences (${stats.keywordDensity}% density)` : ``,
        `==================================================`
      ].filter(Boolean).join('\n');

      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `text-analysis-${new Date().toISOString().slice(0, 10)}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('Text report downloaded.', 'success');
    }
  };

  return (
    <div className="space-y-8 text-left max-w-5xl mx-auto" id="word-counter-tool">
      {/* 1. Header & Privacy Note */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="p-2 bg-[#111111] text-[#D6B46A] rounded-lg">
            <FileText className="w-5 h-5" />
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#111111] font-display">
            Word Counter
          </h2>
        </div>
        <p className="text-sm sm:text-base text-[#554F49]">
          Count words, characters, sentences, paragraphs, reading time, speaking time, and keyword frequency in real time.
        </p>
        <div className="flex items-center gap-2 text-xs font-mono text-emerald-800 bg-emerald-50/80 border border-emerald-200 px-3 py-1.5 rounded-md w-fit">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>100% Client-Side: Your text is analyzed strictly in memory. Nothing is sent to a server, logged, or saved.</span>
        </div>
      </div>

      {/* 2. Key Metrics Cards Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white border border-[#D6B46A]/30 rounded-xl p-4 shadow-sm text-center">
          <p className="text-xs font-mono uppercase text-neutral-500 font-bold">Words</p>
          <p className="text-2xl sm:text-3xl font-bold text-[#111111] font-mono mt-1">{stats.words}</p>
        </div>

        <div className="bg-white border border-[#D6B46A]/30 rounded-xl p-4 shadow-sm text-center">
          <p className="text-xs font-mono uppercase text-neutral-500 font-bold">Characters</p>
          <p className="text-2xl sm:text-3xl font-bold text-[#111111] font-mono mt-1">{stats.charactersWithSpaces}</p>
          <p className="text-[10px] text-neutral-400 font-mono mt-0.5">{stats.charactersNoSpaces} no spaces</p>
        </div>

        <div className="bg-white border border-[#D6B46A]/30 rounded-xl p-4 shadow-sm text-center">
          <p className="text-xs font-mono uppercase text-neutral-500 font-bold">Sentences</p>
          <p className="text-2xl sm:text-3xl font-bold text-[#111111] font-mono mt-1">{stats.sentences}</p>
        </div>

        <div className="bg-white border border-[#D6B46A]/30 rounded-xl p-4 shadow-sm text-center">
          <p className="text-xs font-mono uppercase text-neutral-500 font-bold">Paragraphs</p>
          <p className="text-2xl sm:text-3xl font-bold text-[#111111] font-mono mt-1">{stats.paragraphs}</p>
        </div>

        <div className="bg-white border border-[#D6B46A]/30 rounded-xl p-4 shadow-sm text-center">
          <div className="flex items-center justify-center gap-1 text-xs font-mono uppercase text-neutral-500 font-bold">
            <Clock className="w-3.5 h-3.5 text-[#A68936]" />
            <span>Reading</span>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-[#111111] font-mono mt-1">
            {stats.readingTimeMinutes}m {stats.readingTimeSeconds}s
          </p>
        </div>

        <div className="bg-white border border-[#D6B46A]/30 rounded-xl p-4 shadow-sm text-center">
          <div className="flex items-center justify-center gap-1 text-xs font-mono uppercase text-neutral-500 font-bold">
            <Volume2 className="w-3.5 h-3.5 text-[#A68936]" />
            <span>Speaking</span>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-[#111111] font-mono mt-1">
            {stats.speakingTimeMinutes}m {stats.speakingTimeSeconds}s
          </p>
        </div>
      </div>

      {/* 3. Main Workspace Card (Editor + Controls) */}
      <div className="bg-white border border-[#D6B46A]/30 rounded-2xl p-6 sm:p-8 shadow-sm space-y-4">
        
        {/* Editor Toolbar */}
        <div className="flex items-center justify-between flex-wrap gap-2 border-b border-neutral-100 pb-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePaste}
              className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-[#111111] text-xs font-bold rounded-lg transition-colors cursor-pointer"
            >
              Paste
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-[#111111] text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload TXT</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".txt,.md,.text"
              className="hidden"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              disabled={!text.trim()}
              className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 disabled:opacity-50 text-[#111111] text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
            <button
              type="button"
              onClick={handleClear}
              disabled={!text.trim()}
              className="px-3 py-1.5 text-red-700 hover:bg-red-50 disabled:opacity-50 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          </div>
        </div>

        {/* Textarea */}
        <div className="relative">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste or type your text here to begin..."
            rows={12}
            className="w-full p-4 text-sm sm:text-base font-sans text-[#111111] bg-neutral-50/50 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#A68936] focus:bg-white resize-y leading-relaxed"
          />
        </div>

        {/* Speed Adjustment Settings */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-neutral-100 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-[#111111] flex items-center justify-between">
              <span>Estimated Reading Speed</span>
              <span className="font-mono text-[#A68936]">{readingWpm} wpm</span>
            </label>
            <select
              value={readingWpm}
              onChange={(e) => setReadingWpm(parseInt(e.target.value, 10))}
              className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:border-[#A68936]"
            >
              <option value="180">Relaxed / Complex (180 words/min)</option>
              <option value="225">Average Adult (225 words/min)</option>
              <option value="275">Fast Skim (275 words/min)</option>
              <option value="350">Speed Reader (350 words/min)</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-[#111111] flex items-center justify-between">
              <span>Estimated Speaking Speed</span>
              <span className="font-mono text-[#A68936]">{speakingWpm} wpm</span>
            </label>
            <select
              value={speakingWpm}
              onChange={(e) => setSpeakingWpm(parseInt(e.target.value, 10))}
              className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:border-[#A68936]"
            >
              <option value="110">Deliberate Presentation (110 words/min)</option>
              <option value="140">Standard Speech / Podcast (140 words/min)</option>
              <option value="170">Conversational Fast (170 words/min)</option>
            </select>
          </div>
        </div>

        {/* Export Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-neutral-100">
          <div className="text-xs text-neutral-500 font-mono">
            Lines: <span className="font-bold text-neutral-800">{stats.lines}</span> · Avg Word: <span className="font-bold text-neutral-800">{stats.avgWordLength}</span> ch · Avg Sentence: <span className="font-bold text-neutral-800">{stats.avgSentenceLength}</span> w
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadTxt}
              disabled={!text.trim()}
              className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 disabled:opacity-50 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download TXT</span>
            </button>
            <button
              type="button"
              onClick={() => handleExportReport('txt')}
              disabled={!text.trim()}
              className="px-4 py-2 bg-[#111111] hover:bg-black text-[#D6B46A] disabled:opacity-50 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Export Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4. Keyword & Frequency Analysis Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Target Keyword Inspector */}
        <div className="bg-white border border-neutral-200 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-[#A68936]" />
            <h3 className="text-sm font-bold text-[#111111]">Target Keyword Inspector</h3>
          </div>

          <div className="space-y-3">
            <input
              type="text"
              value={targetKeyword}
              onChange={(e) => setTargetKeyword(e.target.value)}
              placeholder="Enter target keyword (e.g. digital, design)"
              className="w-full px-3.5 py-2.5 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#A68936] focus:bg-white"
            />

            <div className="flex items-center gap-4 text-xs text-neutral-600">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={caseSensitiveKeyword}
                  onChange={(e) => setCaseSensitiveKeyword(e.target.checked)}
                  className="w-3.5 h-3.5 accent-[#A68936] rounded"
                />
                <span>Case sensitive</span>
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={wholeWordKeyword}
                  onChange={(e) => setWholeWordKeyword(e.target.checked)}
                  className="w-3.5 h-3.5 accent-[#A68936] rounded"
                />
                <span>Whole word only</span>
              </label>
            </div>

            {targetKeyword.trim() && (
              <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-xl flex items-center justify-between text-xs">
                <div>
                  <span className="text-neutral-500">Occurrences: </span>
                  <span className="font-mono font-bold text-neutral-900">{stats.keywordCount} times</span>
                </div>
                <div>
                  <span className="text-neutral-500">Density: </span>
                  <span className="font-mono font-bold text-[#A68936]">{stats.keywordDensity}%</span>
                </div>
              </div>
            )}

            <p className="text-[11px] text-neutral-400 italic">
              Keyword frequency is informational and does not guarantee search engine ranking.
            </p>
          </div>
        </div>

        {/* Top Frequent Meaningful Words */}
        <div className="bg-white border border-neutral-200 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-[#A68936]" />
              <h3 className="text-sm font-bold text-[#111111]">Top Frequent Words</h3>
            </div>
            <span className="text-[11px] text-neutral-400 font-mono">Excludes common stop words</span>
          </div>

          {stats.topWords.length === 0 ? (
            <div className="p-8 text-center text-xs text-neutral-400 border border-dashed border-neutral-200 rounded-xl">
              Type or paste text above to calculate word frequency.
            </div>
          ) : (
            <div className="space-y-2">
              {stats.topWords.map((item, idx) => (
                <div key={item.word} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-neutral-400 font-bold w-4">{idx + 1}.</span>
                    <span className="font-medium text-neutral-800 font-mono">{item.word}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-neutral-400 font-mono">{item.count}x</span>
                    <span className="font-mono font-bold text-[#A68936] w-12 text-right">{item.percent}%</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 5. Frequently Asked Questions */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-6 sm:p-8 space-y-4">
        <h3 className="text-lg font-bold text-[#111111]">Frequently Asked Questions</h3>
        <div className="space-y-3 text-xs text-neutral-700">
          <div>
            <p className="font-bold text-neutral-900">How are words counted?</p>
            <p className="text-neutral-600 mt-0.5">Words are counted using Unicode-aware letter and number boundaries. Hyphenated compound words like "state-of-the-art" count as single word tokens. Empty whitespace is never counted as words.</p>
          </div>
          <div>
            <p className="font-bold text-neutral-900">Does Word Counter support Hindi and multilingual scripts?</p>
            <p className="text-neutral-600 mt-0.5">Yes. Devanagari (Hindi) and standard Unicode character sets are parsed using native regex Unicode categories (\p&#123;L&#125;).</p>
          </div>
        </div>
      </div>
    </div>
  );
}
