import React, { useState, useMemo } from 'react';
import { 
  KeyRound, CheckCircle2, AlertTriangle, Copy, RotateCcw, 
  Trash2, ShieldCheck, ShieldAlert, Clock, HelpCircle, Eye, Info
} from 'lucide-react';
import ToolHeader from './common/ToolHeader';
import { CopyButton, ResetButton, ClearButton } from './common/ToolActions';

// Production Sample JWT with future expiration for demo testing
const SAMPLE_JWT = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyXzAxOTRhYzA0ZTkyYiIsIm5hbWUiOiJBbGV4YW5kZXIgVmFobiIsImVtYWlsIjoiYWRtaW5Ac2FtYXhvbi5jb20iLCJyb2xlcyI6WyJzdXBlcl9hZG1pbiIsImVuZ2luZWVyIl0sImlzcyI6Imh0dHBzOi8vYXV0aC5zYW1heG9uLmNvbSIsImF1ZCI6InNhbWF4b24tc3R1ZGlvLXYzIiwiaWF0IjoxNzg0NzgwMDAwLCJuYmYiOjE3ODQ3ODAwMDAsImV4cCI6MTgwMDMxNjAwMCwianRpIjoiMDRmNGE2OGMtNzE2MS00OWJjLWFmYTgtYTllNGNlYzc1NWI2In0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c`;

// Standard Base64Url Decoder
function base64UrlDecode(str: string): string {
  let output = str.replace(/-/g, '+').replace(/_/g, '/');
  switch (output.length % 4) {
    case 0: break;
    case 2: output += '=='; break;
    case 3: output += '='; break;
    default: throw new Error('Illegal base64url string length');
  }
  return decodeURIComponent(
    atob(output)
      .split('')
      .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  );
}

interface DecodedClaim {
  key: string;
  value: any;
  standardName: string;
  isTimestamp?: boolean;
  dateUtc?: string;
  dateLocal?: string;
  statusText?: string;
  isExpired?: boolean;
}

export default function JwtDebugger() {
  const [token, setToken] = useState(SAMPLE_JWT);

  // Decode JWT Deterministically
  const decoded = useMemo(() => {
    const raw = token.trim();
    if (!raw) {
      return { valid: false, error: null, header: null, payload: null, signature: '', claims: [] };
    }

    const parts = raw.split('.');
    if (parts.length !== 3) {
      return {
        valid: false,
        error: `Invalid JWT format: A JSON Web Token must have exactly 3 dot-separated segments (Header, Payload, Signature). Found ${parts.length} segment(s).`,
        header: null,
        payload: null,
        signature: '',
        claims: []
      };
    }

    try {
      const headerJson = JSON.parse(base64UrlDecode(parts[0]));
      const payloadJson = JSON.parse(base64UrlDecode(parts[1]));
      const signature = parts[2];

      // Parse Recognized Standard Claims
      const claims: DecodedClaim[] = [];
      const standardKeys: Record<string, string> = {
        iss: 'Issuer (iss)',
        sub: 'Subject (sub)',
        aud: 'Audience (aud)',
        exp: 'Expiration Time (exp)',
        nbf: 'Not Before (nbf)',
        iat: 'Issued At (iat)',
        jti: 'JWT ID (jti)'
      };

      const nowSec = Math.floor(Date.now() / 1000);

      Object.entries(payloadJson).forEach(([key, val]) => {
        const claimObj: DecodedClaim = {
          key,
          value: val,
          standardName: standardKeys[key] || key
        };

        if (['exp', 'nbf', 'iat'].includes(key) && typeof val === 'number') {
          claimObj.isTimestamp = true;
          const d = new Date(val * 1000);
          claimObj.dateUtc = d.toUTCString();
          claimObj.dateLocal = d.toLocaleString();

          if (key === 'exp') {
            claimObj.isExpired = val < nowSec;
            const diffMin = Math.round(Math.abs(val - nowSec) / 60);
            if (claimObj.isExpired) {
              claimObj.statusText = `Expired ${diffMin} minute(s) ago`;
            } else {
              claimObj.statusText = `Active (expires in ${diffMin} minutes)`;
            }
          }
        }

        claims.push(claimObj);
      });

      return {
        valid: true,
        error: null,
        header: headerJson,
        payload: payloadJson,
        signature,
        claims
      };
    } catch (err: any) {
      return {
        valid: false,
        error: `Base64Url decoding or JSON parse failure: ${err.message}`,
        header: null,
        payload: null,
        signature: '',
        claims: []
      };
    }
  }, [token]);

  return (
    <div className="space-y-8 text-left" id="jwt-debugger">
      <ToolHeader
        title="JWT Debugger & Payload Decoder"
        description="Decode, inspect, and analyze JSON Web Tokens in real time with claim time-drift verification and 100% private in-browser decoding."
        icon={KeyRound}
        categoryName="Development & QA"
        categorySlug="development-qa"
        badgeText="100% CLIENT-SIDE · ZERO TELEMETRY"
      />

      {/* Security Banner Requirement */}
      <div className="p-4 bg-amber-50 border border-amber-200/80 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-amber-900">
        <div className="flex items-start gap-2.5">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <strong className="font-mono font-bold uppercase tracking-wider block">
              SIGNATURE VERIFICATION: NOT PERFORMED (INSPECTION ONLY)
            </strong>
            <p className="mt-0.5 text-amber-800">
              This tool decodes unencrypted Base64Url claims. It does not verify cryptographic signatures. Never trust client-provided claims without server-side validation.
            </p>
          </div>
        </div>
        <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-white text-amber-900 border border-amber-300 shrink-0">
          Client-Side Only
        </span>
      </div>

      {/* JWT Input Workspace */}
      <div className="bg-white border border-neutral-200/80 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-100 pb-3">
          <label htmlFor="jwt-input-textarea" className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-900">
            Encoded JWT Token (Base64Url Format)
          </label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setToken(SAMPLE_JWT)}
              className="px-3 py-1.5 rounded-xl text-xs font-mono font-bold bg-neutral-100 hover:bg-neutral-200 text-neutral-800 cursor-pointer"
            >
              Load Sample Token
            </button>
            <ClearButton onClear={() => setToken('')} />
          </div>
        </div>

        <textarea
          id="jwt-input-textarea"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="Paste your JSON Web Token (header.payload.signature) here..."
          rows={5}
          spellCheck={false}
          className="w-full p-4 bg-neutral-900 text-neutral-100 font-mono text-xs sm:text-sm rounded-2xl resize-y focus:outline-none selection:bg-[#D6B46A]/30 leading-relaxed border border-neutral-800 break-all"
        />

        {decoded.error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs text-rose-800 font-mono">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{decoded.error}</span>
          </div>
        )}
      </div>

      {/* Decoded Sections Grid */}
      {decoded.valid && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Header Panel */}
          <div className="lg:col-span-5 bg-white border border-neutral-200/80 rounded-3xl p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-rose-600">
                HEADER: Algorithm & Token Type
              </span>
              <CopyButton textToCopy={JSON.stringify(decoded.header, null, 2)} label="Copy" />
            </div>
            <pre className="p-4 bg-neutral-900 text-rose-300 font-mono text-xs rounded-2xl overflow-x-auto selection:bg-[#D6B46A]/30">
              {JSON.stringify(decoded.header, null, 2)}
            </pre>
          </div>

          {/* Payload Panel */}
          <div className="lg:col-span-7 bg-white border border-neutral-200/80 rounded-3xl p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-purple-600">
                PAYLOAD: Claims & Data
              </span>
              <CopyButton textToCopy={JSON.stringify(decoded.payload, null, 2)} label="Copy" />
            </div>
            <pre className="p-4 bg-neutral-900 text-purple-300 font-mono text-xs rounded-2xl overflow-x-auto selection:bg-[#D6B46A]/30">
              {JSON.stringify(decoded.payload, null, 2)}
            </pre>
          </div>

          {/* Claims Inspector Table */}
          <div className="lg:col-span-12 bg-white border border-neutral-200/80 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xs">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-2 border-b border-neutral-100 pb-3">
              <Clock className="w-4 h-4 text-[#A68936]" />
              Claims & Expiration Breakdown
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-neutral-200 text-neutral-500 uppercase text-[10px]">
                    <th className="pb-3 font-bold">Claim Name</th>
                    <th className="pb-3 font-bold">Raw Value</th>
                    <th className="pb-3 font-bold">Interpreted Meaning / Timestamp</th>
                    <th className="pb-3 font-bold">Evaluation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {decoded.claims.map((claim) => (
                    <tr key={claim.key} className="hover:bg-neutral-50">
                      <td className="py-3 font-bold text-neutral-900">{claim.standardName}</td>
                      <td className="py-3 text-neutral-600 max-w-[200px] truncate">
                        {typeof claim.value === 'object' ? JSON.stringify(claim.value) : String(claim.value)}
                      </td>
                      <td className="py-3 text-neutral-700">
                        {claim.isTimestamp ? (
                          <div className="space-y-0.5">
                            <div>UTC: {claim.dateUtc}</div>
                            <div className="text-neutral-400 text-[10px]">Local: {claim.dateLocal}</div>
                          </div>
                        ) : (
                          <span>—</span>
                        )}
                      </td>
                      <td className="py-3">
                        {claim.statusText ? (
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            claim.isExpired
                              ? 'bg-rose-100 text-rose-800 border border-rose-200'
                              : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          }`}>
                            {claim.statusText}
                          </span>
                        ) : (
                          <span className="text-neutral-400 text-[10px]">Standard Claim</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Signature Panel */}
          <div className="lg:col-span-12 bg-white border border-neutral-200/80 rounded-3xl p-6 space-y-3 shadow-xs">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-sky-600 block">
              SIGNATURE: Cryptographic Digest (Base64Url)
            </span>
            <div className="p-3 bg-neutral-900 text-sky-400 font-mono text-xs rounded-xl break-all">
              {decoded.signature}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
