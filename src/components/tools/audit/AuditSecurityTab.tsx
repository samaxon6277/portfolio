import React, { useState } from 'react';
import { 
  Shield, Lock, Unlock, AlertTriangle, CheckCircle2, 
  XCircle, Copy, Check, Terminal, Wrench, ExternalLink, 
  FileWarning, ShieldCheck, EyeOff
} from 'lucide-react';
import { ComprehensiveAuditReport, SecurityHeaderStatus } from '../../../utils/auditEngine/types';

interface AuditSecurityTabProps {
  report: ComprehensiveAuditReport;
  onRequestFix: (title: string) => void;
}

export const AuditSecurityTab: React.FC<AuditSecurityTabProps> = ({
  report,
  onRequestFix
}) => {
  const [copiedHeader, setCopiedHeader] = useState<string | null>(null);

  const sec = report.securityData || {
    isHttps: true,
    hsts: {
      name: 'Strict-Transport-Security',
      present: false,
      value: null,
      status: 'warn' as const,
      description: 'Forces modern browsers to only connect over HTTPS with SSL pinning.',
      recommendedHeader: 'max-age=31536000; includeSubDomains; preload'
    },
    csp: {
      name: 'Content-Security-Policy',
      present: false,
      value: null,
      status: 'warn' as const,
      description: 'Restricts script injection, XSS vectors, and unauthorized resource origins.',
      recommendedHeader: "default-src 'self'; script-src 'self' 'unsafe-inline'; object-src 'none';"
    },
    xFrameOptions: {
      name: 'X-Frame-Options',
      present: false,
      value: null,
      status: 'warn' as const,
      description: 'Prevents clickjacking attacks by forbidding iframe embedding.',
      recommendedHeader: 'DENY'
    },
    xContentTypeOptions: {
      name: 'X-Content-Type-Options',
      present: false,
      value: null,
      status: 'warn' as const,
      description: 'Disables MIME type sniffing by aggressive browsers.',
      recommendedHeader: 'nosniff'
    },
    referrerPolicy: {
      name: 'Referrer-Policy',
      present: false,
      value: null,
      status: 'warn' as const,
      description: 'Controls how much referrer information is sent along with requests.',
      recommendedHeader: 'strict-origin-when-cross-origin'
    },
    permissionsPolicy: {
      name: 'Permissions-Policy',
      present: false,
      value: null,
      status: 'warn' as const,
      description: 'Controls hardware API access such as camera, microphone, and geolocation.',
      recommendedHeader: 'camera=(), microphone=(), geolocation=()'
    },
    serverHeader: null,
    exposesServerVersion: false,
    mixedContentCount: 0,
    mixedContentSamples: [],
    unsafeBlankLinksCount: 0,
    inlineEventHandlersCount: 0,
    deprecatedTagsFound: []
  };

  const headersList: SecurityHeaderStatus[] = [
    sec.hsts,
    sec.csp,
    sec.xFrameOptions,
    sec.xContentTypeOptions,
    sec.referrerPolicy,
    sec.permissionsPolicy
  ].filter(Boolean);

  const copyConfigSnippet = (headerName: string, config: string) => {
    navigator.clipboard.writeText(config);
    setCopiedHeader(headerName);
    setTimeout(() => setCopiedHeader(null), 2000);
  };

  const presentCount = headersList.filter(h => h.present).length;

  return (
    <div className="space-y-6 text-left animate-fade-in">
      {/* Top Banner */}
      <div className="bg-white border border-[#D6B46A]/30 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D6B46A]/15 pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase text-[#85641C]">
              <Shield className="w-4 h-4 text-[#D6B46A]" />
              <span>Cryptographic Transport &amp; HTTP Security Headers</span>
            </div>
            <h3 className="font-display font-black text-xl sm:text-2xl text-[#111111]">
              TLS Transport &amp; Defensive Header Telemetry
            </h3>
            <p className="text-xs text-[#8A8178]">
              Automated audit of SSL encryption, Strict-Transport-Security, Content Security Policy, Clickjacking defense, and server version leakage.
            </p>
          </div>

          <div className="text-right">
            <span className="text-[10px] uppercase font-mono text-[#8A8178] block">Security Score</span>
            <span className="font-display font-black text-3xl text-[#111111]">
              {report.categoryStats?.security?.score ?? report.scores?.security ?? 0}
            </span>
            <span className="text-xs font-mono text-[#8A8178]">/100</span>
          </div>
        </div>

        {/* 4 Core Security Stat Blocks */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="p-4 bg-[#FFFDF8] border border-[#D6B46A]/20 rounded-2xl">
            <span className="text-[10px] font-mono uppercase text-[#8A8178] block">HTTPS Encryption</span>
            <span className={`font-display font-black text-2xl ${sec.isHttps ? 'text-emerald-700' : 'text-rose-600'}`}>
              {sec.isHttps ? 'Enforced' : 'Plaintext HTTP'}
            </span>
          </div>

          <div className="p-4 bg-[#FFFDF8] border border-[#D6B46A]/20 rounded-2xl">
            <span className="text-[10px] font-mono uppercase text-[#8A8178] block">Security Headers</span>
            <span className={`font-display font-black text-2xl ${presentCount >= 4 ? 'text-emerald-700' : 'text-amber-600'}`}>
              {presentCount} / {headersList.length}
            </span>
          </div>

          <div className="p-4 bg-[#FFFDF8] border border-[#D6B46A]/20 rounded-2xl">
            <span className="text-[10px] font-mono uppercase text-[#8A8178] block">Mixed Content</span>
            <span className={`font-display font-black text-2xl ${sec.mixedContentCount > 0 ? 'text-rose-600' : 'text-emerald-700'}`}>
              {sec.mixedContentCount}
            </span>
          </div>

          <div className="p-4 bg-[#FFFDF8] border border-[#D6B46A]/20 rounded-2xl">
            <span className="text-[10px] font-mono uppercase text-[#8A8178] block">Server Leakage</span>
            <span className={`font-display font-black text-2xl ${sec.exposesServerVersion ? 'text-rose-600' : 'text-emerald-700'}`}>
              {sec.exposesServerVersion ? 'Version Leaked' : 'Protected'}
            </span>
          </div>
        </div>
      </div>

      {/* Security Headers Inspection Table */}
      <div className="bg-white border border-[#D6B46A]/30 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-[#D6B46A]/15 pb-3">
          <div className="space-y-0.5">
            <h4 className="font-display font-black text-sm text-[#111111]">
              HTTP Response Header Defense Matrix
            </h4>
            <p className="text-xs text-[#8A8178]">
              Standard browser defensive headers required to mitigate XSS, Clickjacking, and MIME confusion.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {headersList.map((header) => (
            <div
              key={header.name}
              className={`p-4 rounded-2xl border text-xs flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${
                header.present 
                  ? 'bg-emerald-50/30 border-emerald-200 text-emerald-950' 
                  : 'bg-rose-50/30 border-rose-200 text-rose-950'
              }`}
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  {header.present ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  )}
                  <span className="font-mono font-bold text-[#111111] text-sm">
                    {header.name}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider ${
                    header.present ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {header.present ? 'Present' : 'Missing'}
                  </span>
                </div>

                <p className="text-[#8A8178] text-[11px] leading-relaxed">
                  {header.description}
                </p>

                {header.present && header.value && (
                  <div className="font-mono text-[11px] bg-white/80 p-2 rounded-lg border border-emerald-200/80 text-emerald-900 truncate">
                    Current value: {header.value}
                  </div>
                )}

                {!header.present && (
                  <div className="font-mono text-[11px] bg-white/80 p-2 rounded-lg border border-rose-200/80 text-rose-900 flex items-center justify-between gap-2">
                    <span className="truncate">Recommended: {header.recommendedHeader}</span>
                    <button
                      type="button"
                      onClick={() => copyConfigSnippet(header.name, `${header.name}: ${header.recommendedHeader}`)}
                      className="shrink-0 text-[10px] font-mono text-[#85641C] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      {copiedHeader === header.name ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedHeader === header.name ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                )}
              </div>

              {!header.present && (
                <button
                  type="button"
                  onClick={() => onRequestFix(`Configure ${header.name} Security Header`)}
                  className="px-3 py-1.5 bg-[#111111] hover:bg-[#222222] text-[#D6B46A] hover:text-[#FFFDF8] rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0 shadow-xs"
                >
                  <Wrench className="w-3.5 h-3.5" />
                  <span>Fix Header</span>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Subpage Vulnerabilities & Server Leaks */}
      {(sec.mixedContentCount > 0 || sec.unsafeBlankLinksCount > 0 || sec.exposesServerVersion) && (
        <div className="bg-rose-50/50 border border-rose-300 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-rose-900 font-bold font-display text-sm">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <span>Targeted Vulnerability Alerts</span>
          </div>

          <div className="space-y-2 text-xs">
            {sec.mixedContentCount > 0 && (
              <div className="p-3 bg-white rounded-xl border border-rose-200 space-y-1">
                <span className="font-bold text-rose-900 block">Mixed Content Detected ({sec.mixedContentCount} resources)</span>
                <p className="text-[#8A8178]">
                  Insecure HTTP resources loaded on an HTTPS document cause browser security warnings and script blocking.
                </p>
              </div>
            )}

            {sec.unsafeBlankLinksCount > 0 && (
              <div className="p-3 bg-white rounded-xl border border-rose-200 space-y-1">
                <span className="font-bold text-rose-900 block">Unsafe target="_blank" Links ({sec.unsafeBlankLinksCount} links)</span>
                <p className="text-[#8A8178]">
                  Links missing <code>rel="noopener noreferrer"</code> allow destination pages to manipulate the opener window location.
                </p>
              </div>
            )}

            {sec.exposesServerVersion && (
              <div className="p-3 bg-white rounded-xl border border-rose-200 space-y-1">
                <span className="font-bold text-rose-900 block">Server Software Fingerprinting ({sec.serverHeader})</span>
                <p className="text-[#8A8178]">
                  Disclose exact server software and version numbers to attackers scanning for known CVE vulnerabilities.
                </p>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => onRequestFix('Remediate Security Vulnerabilities & Headers')}
            className="w-full py-2.5 bg-rose-900 hover:bg-rose-800 text-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Harden Server Security Configurations</span>
          </button>
        </div>
      )}
    </div>
  );
};
