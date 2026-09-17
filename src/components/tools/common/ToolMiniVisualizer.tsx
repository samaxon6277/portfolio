import React from 'react';

interface ToolMiniVisualizerProps {
  toolId: string;
  className?: string;
}

export const ToolMiniVisualizer: React.FC<ToolMiniVisualizerProps> = ({ toolId, className = '' }) => {
  switch (toolId) {
    // 1. SVG Optimizer: Vector nodes transform into simplified, lightweight vector paths
    case 'svg-optimizer':
      return (
        <div className={`relative h-20 w-full rounded-xl bg-neutral-950/90 border border-neutral-800 p-2.5 overflow-hidden flex items-center justify-between text-[10px] font-mono text-neutral-400 ${className}`}>
          <div className="flex flex-col items-center gap-1 z-10">
            <span className="text-[8px] text-rose-400 font-bold uppercase">Sample Raw</span>
            <svg viewBox="0 0 36 36" className="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M 6 30 C 6 12, 14 6, 24 14 S 32 30, 18 30 Z" strokeDasharray="2 2" />
              <circle cx="6" cy="30" r="1.5" fill="#f43f5e" />
              <circle cx="14" cy="6" r="1.5" fill="#f43f5e" />
              <circle cx="24" cy="14" r="1.5" fill="#f43f5e" />
              <circle cx="32" cy="30" r="1.5" fill="#f43f5e" />
            </svg>
            <span className="text-[8px] text-neutral-500">Illustrative 14KB</span>
          </div>

          <div className="flex flex-col items-center gap-0.5 text-[#D6B46A] z-10">
            <span className="text-[9px] font-bold tracking-wider">-62%</span>
            <span className="text-xs">→</span>
            <span className="text-[7.5px] px-1 py-0.2 rounded bg-[#D6B46A]/20 text-[#D6B46A] border border-[#D6B46A]/40 font-bold">CLEAN</span>
          </div>

          <div className="flex flex-col items-center gap-1 z-10">
            <span className="text-[8px] text-emerald-400 font-bold uppercase">Sample Clean</span>
            <svg viewBox="0 0 36 36" className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M 6 30 C 8 14, 18 10, 24 14 S 30 30, 18 30 Z" />
              <circle cx="6" cy="30" r="1.5" fill="#10b981" />
              <circle cx="24" cy="14" r="1.5" fill="#10b981" />
            </svg>
            <span className="text-[8px] text-emerald-400 font-bold">Illustrative 5KB</span>
          </div>
        </div>
      );

    // 2. Regex Tester: Pattern scanner and color-coded match tokens
    case 'regex-tester':
      return (
        <div className={`relative h-20 w-full rounded-xl bg-neutral-950/90 border border-neutral-800 p-2 overflow-hidden flex flex-col justify-between font-mono text-[10px] ${className}`}>
          <div className="flex items-center justify-between border-b border-neutral-800/80 pb-1">
            <div className="flex items-center gap-1 text-[#D6B46A]">
              <span className="text-neutral-500">/</span>
              <span className="text-amber-300 font-bold">([a-z]+)</span>
              <span className="text-neutral-500">:</span>
              <span className="text-sky-300">\d+</span>
              <span className="text-neutral-500">/g</span>
            </div>
            <span className="text-[7.5px] px-1 rounded bg-neutral-900 text-neutral-400 border border-neutral-800">SAMPLE SPEC</span>
          </div>
          <div className="text-[9.5px] leading-relaxed text-neutral-400 pt-0.5">
            port:<span className="bg-sky-500/20 text-sky-300 px-1 py-0.5 rounded border border-sky-500/30">8080</span> host:<span className="bg-amber-500/20 text-amber-300 px-1 py-0.5 rounded border border-amber-500/30">api</span>
          </div>
          <div className="flex items-center justify-between text-[8px] text-neutral-500 border-t border-neutral-900 pt-0.5">
            <span>Group: "api"</span>
            <span>Offset: [16, 20]</span>
          </div>
        </div>
      );

    // 3. Cron Generator: POSIX timeline and scheduled execution nodes
    case 'cron-generator':
      return (
        <div className={`relative h-20 w-full rounded-xl bg-neutral-950/90 border border-neutral-800 p-2.5 overflow-hidden flex flex-col justify-between font-mono text-[10px] ${className}`}>
          <div className="flex items-center justify-between">
            <span className="text-neutral-500 text-[8.5px] uppercase tracking-wider">Sample POSIX Spec</span>
            <span className="text-[#D6B46A] font-bold text-xs tracking-widest">*/15 09 * * 1-5</span>
          </div>
          {/* Timeline Nodes */}
          <div className="relative w-full py-1">
            <div className="h-0.5 w-full bg-neutral-800 absolute top-1/2 -translate-y-1/2" />
            <div className="flex justify-between relative z-10">
              {['09:00', '09:15', '09:30', '09:45', '10:00'].map((time, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <div className={`w-2.5 h-2.5 rounded-full border ${idx === 1 ? 'bg-[#D6B46A] border-white shadow-[0_0_8px_rgba(214,180,106,0.8)]' : 'bg-neutral-900 border-neutral-700'}`} />
                  <span className={`text-[7.5px] mt-1 ${idx === 1 ? 'text-[#D6B46A] font-bold' : 'text-neutral-500'}`}>{time}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="text-[8px] text-neutral-400 truncate">
            Sample Trigger: Mon 09:15 AM
          </div>
        </div>
      );

    // 4. JWT Debugger: Header -> Payload -> Signature segmented blocks
    case 'jwt-debugger':
      return (
        <div className={`relative h-20 w-full rounded-xl bg-neutral-950/90 border border-neutral-800 p-2 overflow-hidden flex flex-col justify-between font-mono text-[9.5px] ${className}`}>
          <div className="flex items-center gap-1 overflow-x-hidden">
            <span className="px-1 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[8px] font-bold">HEADER</span>
            <span className="text-neutral-600">.</span>
            <span className="px-1 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40 text-[8px] font-bold">PAYLOAD</span>
            <span className="text-neutral-600">.</span>
            <span className="px-1 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/40 text-[8px] font-bold">SIGNATURE</span>
          </div>
          <div className="bg-neutral-900/80 rounded-lg p-1.5 text-[8.5px] text-neutral-400 flex items-center justify-between border border-neutral-800">
            <span className="text-purple-300">"sub": "sample_user"</span>
            <span className="text-emerald-400 font-bold text-[7.5px] flex items-center gap-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              HS256 SPEC
            </span>
          </div>
          <div className="flex items-center justify-between text-[7.5px] text-neutral-500">
            <span>Illustrative Token</span>
            <span className="text-sky-400">Web Crypto API</span>
          </div>
        </div>
      );

    // 5. Color Contrast Checker: Contrast ratio dial & WCAG pass badges
    case 'color-contrast-checker':
      return (
        <div className={`relative h-20 w-full rounded-xl bg-neutral-950/90 border border-neutral-800 p-2.5 overflow-hidden flex items-center justify-between font-mono ${className}`}>
          <div className="flex items-center gap-2">
            <div className="w-11 h-11 rounded-lg bg-[#111111] border border-[#D6B46A]/60 flex items-center justify-center text-[#D6B46A] font-bold text-xs shadow-inner">
              Aa
            </div>
            <div className="space-y-0.5">
              <span className="text-[7.5px] text-neutral-500 uppercase block">Sample Pair</span>
              <span className="text-sm font-bold text-[#D6B46A]">12.4 : 1</span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1 text-[8.5px]">
            <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-700/60 font-bold">
              WCAG AAA PASS
            </span>
            <span className="text-[7px] text-neutral-400">Illustrative Ratio</span>
          </div>
        </div>
      );

    // 6. Markdown to HTML: Dual-pane markdown syntax to formatted preview
    case 'markdown-to-html':
      return (
        <div className={`relative h-20 w-full rounded-xl bg-neutral-950/90 border border-neutral-800 p-2 overflow-hidden grid grid-cols-2 gap-2 font-mono text-[9px] ${className}`}>
          <div className="bg-neutral-900/90 rounded-lg p-1.5 border border-neutral-800/80 text-neutral-400 flex flex-col justify-between">
            <span className="text-[8px] text-neutral-500 uppercase">Markdown</span>
            <div className="space-y-0.5">
              <div className="text-amber-300"># Title</div>
              <div className="text-neutral-400">**Bold** & `code`</div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-1.5 border border-neutral-200 text-neutral-900 flex flex-col justify-between">
            <span className="text-[8px] text-neutral-400 uppercase">Clean HTML</span>
            <div className="space-y-0.5">
              <div className="font-bold text-xs leading-none">Title</div>
              <div className="text-[8.5px]"><strong className="font-bold">Bold</strong> & <span className="bg-neutral-100 px-0.5 rounded text-[8px]">code</span></div>
            </div>
          </div>
        </div>
      );

    // 7. Favicon Generator: Master icon -> 16/32/180 device icons
    case 'favicon-generator':
      return (
        <div className={`relative h-20 w-full rounded-xl bg-neutral-950/90 border border-neutral-800 p-2.5 overflow-hidden flex items-center justify-between font-mono text-[9px] ${className}`}>
          <div className="flex flex-col items-center gap-1">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#D6B46A] to-[#85641C] flex items-center justify-center text-white font-bold text-xs shadow-md">
              S
            </div>
            <span className="text-[7.5px] text-neutral-500">Master</span>
          </div>
          <span className="text-neutral-500 text-xs">→</span>
          <div className="flex items-end gap-1.5">
            <div className="flex flex-col items-center gap-0.5">
              <div className="w-3.5 h-3.5 rounded-xs bg-[#D6B46A] text-[6px] text-black font-bold flex items-center justify-center">S</div>
              <span className="text-[7px] text-neutral-400">16px</span>
            </div>
            <div className="flex flex-col items-center gap-0.5">
              <div className="w-5 h-5 rounded-xs bg-[#D6B46A] text-[8px] text-black font-bold flex items-center justify-center">S</div>
              <span className="text-[7px] text-neutral-400">32px</span>
            </div>
            <div className="flex flex-col items-center gap-0.5">
              <div className="w-7 h-7 rounded-sm bg-[#D6B46A] text-[10px] text-black font-bold flex items-center justify-center">S</div>
              <span className="text-[7px] text-neutral-400">180px</span>
            </div>
          </div>
          <div className="text-right text-[8px] text-emerald-400 font-bold">
            <div>.ICO + ZIP</div>
            <div className="text-neutral-500 text-[7px]">PWA Ready</div>
          </div>
        </div>
      );

    // 8. WhatsApp Link Generator: Message -> wa.me link -> QR code
    case 'whatsapp-link-generator':
      return (
        <div className={`relative h-20 w-full rounded-xl bg-neutral-950/90 border border-neutral-800 p-2.5 overflow-hidden flex items-center justify-between font-mono text-[9px] ${className}`}>
          <div className="space-y-1 max-w-[130px]">
            <span className="px-1 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[7.5px] font-bold">
              wa.me/447...
            </span>
            <div className="text-[8.5px] text-neutral-300 bg-neutral-900 rounded p-1 border border-neutral-800 truncate">
              "Hi, I'd like a quote..."
            </div>
          </div>
          <div className="w-11 h-11 bg-white p-1 rounded-lg flex items-center justify-center shadow-xs">
            <svg viewBox="0 0 24 24" className="w-full h-full text-black" fill="currentColor">
              <path d="M2 2h7v7H2zm2 2v3h3V4zm11-2h7v7h-7zm2 2v3h3V4zM2 15h7v7H2zm2 2v3h3v-3zm9-2h2v2h-2zm3 0h2v2h-2zm2 2h2v2h-2zm-4 2h2v2h-2zm4 2h2v2h-2z" />
            </svg>
          </div>
        </div>
      );

    // 9. CSS Animation Builder: Keyframe timeline & bezier curve
    case 'css-animation-builder':
      return (
        <div className={`relative h-20 w-full rounded-xl bg-neutral-950/90 border border-neutral-800 p-2.5 overflow-hidden flex flex-col justify-between font-mono text-[9px] ${className}`}>
          <div className="flex items-center justify-between text-[8px] text-neutral-400">
            <span className="text-[#D6B46A] font-bold">@keyframes pulse-wave</span>
            <span>cubic-bezier(0.16, 1, 0.3, 1)</span>
          </div>
          {/* Keyframe step marks */}
          <div className="flex items-center justify-between relative py-1">
            <div className="h-0.5 w-full bg-neutral-800 absolute top-1/2 -translate-y-1/2" />
            {['0%', '25%', '50%', '75%', '100%'].map((pct, idx) => (
              <div key={idx} className="flex flex-col items-center z-10">
                <div className={`w-2 h-2 rounded-xs ${idx % 2 === 0 ? 'bg-[#D6B46A]' : 'bg-neutral-600'}`} />
                <span className="text-[7px] text-neutral-500 mt-1">{pct}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between text-[8px] text-neutral-400">
            <span>scale(1) → scale(1.15)</span>
            <span className="text-emerald-400 font-bold">60 FPS Hardware</span>
          </div>
        </div>
      );

    // 10. Glassmorphism Generator: Frosted glass material with refraction
    case 'glassmorphism-neumorphism-generator':
      return (
        <div className={`relative h-20 w-full rounded-xl bg-gradient-to-br from-neutral-900 via-[#221c13] to-neutral-950 border border-neutral-800 p-2.5 overflow-hidden flex items-center justify-center font-mono ${className}`}>
          {/* Background ambient orbs */}
          <div className="absolute top-1 left-2 w-10 h-10 rounded-full bg-[#D6B46A]/30 blur-md pointer-events-none" />
          <div className="absolute bottom-1 right-2 w-10 h-10 rounded-full bg-sky-500/20 blur-md pointer-events-none" />
          
          {/* Frosted glass slab */}
          <div className="relative z-10 w-4/5 py-1.5 px-3 rounded-lg bg-white/10 backdrop-blur-md border border-white/25 shadow-lg flex items-center justify-between text-[8.5px]">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#D6B46A]" />
              <span className="text-white font-bold tracking-wider">backdrop-blur: 16px</span>
            </div>
            <span className="text-[#D6B46A] text-[7.5px] font-bold">ALPHA: 0.15</span>
          </div>
        </div>
      );

    // 11. JSON Formatter & Validator
    case 'json-formatter-validator':
      return (
        <div className={`relative h-20 w-full rounded-xl bg-neutral-950/90 border border-neutral-800 p-2 overflow-hidden font-mono text-[9px] leading-tight text-neutral-400 flex flex-col justify-between ${className}`}>
          <div className="flex items-center justify-between text-[8px] border-b border-neutral-800 pb-0.5">
            <span className="text-emerald-400 font-bold">✓ RFC 8259 VALID</span>
            <span className="text-neutral-500">Tree View</span>
          </div>
          <div className="text-[8.5px] space-y-0.5 pl-1">
            <div><span className="text-purple-300">"status"</span>: <span className="text-emerald-400">"active"</span>,</div>
            <div><span className="text-purple-300">"nodes"</span>: [<span className="text-sky-300">1</span>, <span className="text-sky-300">2</span>, <span className="text-sky-300">3</span>]</div>
          </div>
          <div className="text-[7.5px] text-neutral-500 flex justify-between">
            <span>Depth: 2 levels</span>
            <span className="text-[#D6B46A]">Formatted & Minified</span>
          </div>
        </div>
      );

    // 12. Password Generator
    case 'password-generator':
      return (
        <div className={`relative h-20 w-full rounded-xl bg-neutral-950/90 border border-neutral-800 p-2.5 overflow-hidden flex flex-col justify-between font-mono text-[9px] ${className}`}>
          <div className="flex items-center justify-between text-[8px] text-neutral-400">
            <span className="text-neutral-500">Sample Spec</span>
            <span className="text-emerald-400 font-bold">128-BIT ENTROPY</span>
          </div>
          <div className="bg-neutral-900 border border-neutral-800 rounded p-1.5 text-center text-xs tracking-wider text-[#D6B46A] font-bold">
            kX9#vM2$pQ8!wL4@
          </div>
          <div className="w-full bg-neutral-800 h-1 rounded-full overflow-hidden">
            <div className="bg-emerald-400 h-full w-[95%]" />
          </div>
        </div>
      );

    // 13. Website Speed Checker
    case 'website-speed-checker':
      return (
        <div className={`relative h-20 w-full rounded-xl bg-neutral-950/90 border border-neutral-800 p-2.5 overflow-hidden flex items-center justify-between font-mono text-[9px] ${className}`}>
          <div className="space-y-0.5">
            <span className="text-[7.5px] text-neutral-500 uppercase block">Sample Benchmark</span>
            <span className="text-base font-bold text-emerald-400">42 ms</span>
            <span className="text-[7.5px] text-neutral-400 block">Illustrative Target</span>
          </div>
          <div className="text-right space-y-1 text-[8px]">
            <div className="text-emerald-400">Target LCP: &lt;1.2s</div>
            <div className="text-emerald-400">Target CLS: 0.00</div>
            <div className="text-[#D6B46A]">Target INP: &lt;50ms</div>
          </div>
        </div>
      );

    // 14. Universal Calculator
    case 'calculator':
      return (
        <div className={`relative h-20 w-full rounded-xl bg-neutral-950/90 border border-neutral-800 p-2 overflow-hidden flex items-center justify-between font-mono text-[9px] ${className}`}>
          <div className="space-y-1">
            <span className="text-[7.5px] text-neutral-500 block">Sample Calculation</span>
            <span className="text-sm font-bold text-[#D6B46A]">1,429.50</span>
            <span className="text-[7.5px] text-neutral-400 block">Illustrative Formula</span>
          </div>
          <div className="grid grid-cols-3 gap-1 w-16">
            {['7', '8', '9', '4', '5', '6'].map((k) => (
              <div key={k} className="h-4 bg-neutral-900 border border-neutral-800 rounded text-center leading-4 text-[8px] text-neutral-300">
                {k}
              </div>
            ))}
          </div>
        </div>
      );

    // Fallback: Crisp technical telemetry card preview
    default:
      return (
        <div className={`relative h-20 w-full rounded-xl bg-neutral-950/90 border border-neutral-800 p-2.5 overflow-hidden flex flex-col justify-between font-mono text-[9px] ${className}`}>
          <div className="flex items-center justify-between text-[8px] text-neutral-500">
            <span className="uppercase tracking-widest text-[#D6B46A]">SAMAXON INSTRUMENT</span>
            <span className="text-emerald-400">ONLINE</span>
          </div>
          <div className="flex items-center justify-between text-[10px] text-neutral-300">
            <span className="font-bold">100% In-Browser Execution</span>
            <span className="w-2 h-2 rounded-full bg-[#D6B46A] animate-pulse" />
          </div>
          <div className="text-[8px] text-neutral-500 flex justify-between">
            <span>Zero Server Latency</span>
            <span className="text-neutral-400 font-mono">Web API Native</span>
          </div>
        </div>
      );
  }
};
