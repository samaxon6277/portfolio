import React, { useState, useMemo } from 'react';
import DOMPurify from 'dompurify';
import { 
  FileText, CheckCircle2, Copy, Download, RotateCcw, 
  Eye, Code2, Sparkles, HelpCircle, Columns, ShieldCheck
} from 'lucide-react';
import ToolHeader from './common/ToolHeader';
import { CopyButton, DownloadButton, ResetButton, ClearButton } from './common/ToolActions';

const SAMPLE_MARKDOWN = `# SamaXon Digital Solutions
Empowering modern enterprises with high-performance web applications and algorithmic engineering.

## Key Capabilities
- **Advanced Full-Stack Engineering**: React 19, TypeScript, and microservices.
- **Precision Auditing**: Real-time Core Web Vitals, SSRF protections, and Lighthouse scoring.
- *Autonomous Optimization*: Fast browser-side tool execution without server leaks.

### Interactive Task Checklist
- [x] Implement Phase 3.1 Audit Engine verification
- [x] Construct Phase 3.2 Production Tools Suite
- [ ] Deploy client-side standalone report export

---

### Performance Benchmarks
| Metric | Target | Actual Lab Result |
| :--- | :---: | :--- |
| **TTFB** | < 200ms | 48ms (Cached Ingress) |
| **FCP** | < 1.0s | 0.6s |
| **LCP** | < 2.5s | 1.1s |
| **CLS** | < 0.05 | 0.001 |

> "Excellence is not an accident; it is the mathematical result of relentless craftsmanship."
> — *Engineering Manifesto*

Here is an inline code example: \`const engine = new WebAuditWorker();\`

\`\`\`typescript
// Production Worker Hook
async function executeAudit(url: string): Promise<AuditReport> {
  const sanitized = sanitizeTargetUrl(url);
  return await analyzeWebsiteCore(sanitized);
}
\`\`\`

Visit the official platform at [SamaXon Tools](https://samaxon.com/tools).
`;

// Deterministic Markdown Parser & XSS Sanitizer
function parseMarkdownToHtml(md: string): string {
  let html = md;

  // Escape raw HTML entities to prevent initial XSS injection
  html = html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Fenced Code Blocks: ```lang \n code \n ```
  html = html.replace(/```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g, (_, lang, code) => {
    return `<pre class="code-block" data-lang="${lang}"><code>${code.trim()}</code></pre>`;
  });

  // Inline Code: `code`
  html = html.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');

  // Headings: # to ######
  html = html.replace(/^###### (.*$)/gim, '<h6>$1</h6>');
  html = html.replace(/^##### (.*$)/gim, '<h5>$1</h5>');
  html = html.replace(/^#### (.*$)/gim, '<h4>$1</h4>');
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

  // Blockquotes: > quote
  html = html.replace(/^\> (.*$)/gim, '<blockquote><p>$1</p></blockquote>');

  // Horizontal rules: ---
  html = html.replace(/^---$/gim, '<hr />');

  // Bold & Italic: ***text***
  html = html.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>');
  // Bold: **text**
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  // Italic: *text*
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  // Strikethrough: ~~text~~
  html = html.replace(/~~(.*?)~~/g, '<del>$1</del>');

  // Task lists: - [x] or - [ ]
  html = html.replace(/^- \[x\] (.*$)/gim, '<li class="task-list-item"><input type="checkbox" checked disabled /> $1</li>');
  html = html.replace(/^- \[ \] (.*$)/gim, '<li class="task-list-item"><input type="checkbox" disabled /> $1</li>');

  // Unordered list items: - item or * item
  html = html.replace(/^[-*] (?!\[[ x]\])(.*$)/gim, '<li>$1</li>');

  // Links: [text](url) with safe URL check (block javascript: or vbscript:)
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, text, url) => {
    const cleanUrl = url.trim();
    if (/^(javascript:|data:|vbscript:)/i.test(cleanUrl)) {
      return text;
    }
    return `<a href="${cleanUrl}" target="_blank" rel="noopener noreferrer">${text}</a>`;
  });

  // Tables
  const tableRegex = /((?:\|[^\n]+\|\r?\n)+)/g;
  html = html.replace(tableRegex, (match) => {
    const lines = match.trim().split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    if (lines.length < 2) return match;

    const headers = lines[0].split('|').slice(1, -1).map(h => h.trim());
    const isDivider = lines[1].includes('---');
    if (!isDivider) return match;

    let tableHtml = '<div class="table-container"><table><thead><tr>';
    headers.forEach(h => {
      tableHtml += `<th>${h}</th>`;
    });
    tableHtml += '</tr></thead><tbody>';

    for (let i = 2; i < lines.length; i++) {
      const cells = lines[i].split('|').slice(1, -1).map(c => c.trim());
      tableHtml += '<tr>';
      cells.forEach(c => {
        tableHtml += `<td>${c}</td>`;
      });
      tableHtml += '</tr>';
    }
    tableHtml += '</tbody></table></div>';
    return tableHtml;
  });

  // Paragraphs: Wrap non-tagged lines
  const rawParagraphs = html.split(/\n\n+/);
  html = rawParagraphs.map(block => {
    const trimmed = block.trim();
    if (!trimmed) return '';
    if (
      trimmed.startsWith('<h') ||
      trimmed.startsWith('<pre') ||
      trimmed.startsWith('<blockquote') ||
      trimmed.startsWith('<hr') ||
      trimmed.startsWith('<div class="table') ||
      trimmed.startsWith('<li')
    ) {
      return trimmed;
    }
    return `<p>${trimmed.replace(/\n/g, '<br />')}</p>`;
  }).join('\n\n');

  // Group <li> into <ul>
  html = html.replace(/((?:<li[^>]*>[\s\S]*?<\/li>\s*)+)/gi, '<ul class="markdown-list">$1</ul>');

  // Strict DOMPurify Sanitization pass to eliminate any residual vectors (XSS, event handlers, javascript: protocols)
  return DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
    ADD_ATTR: ['target', 'disabled', 'checked', 'data-lang', 'rel'],
    FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'form', 'style'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'onfocus', 'onblur']
  });
}

export default function MarkdownToHtml() {
  const [markdown, setMarkdown] = useState(SAMPLE_MARKDOWN);
  const [viewMode, setViewMode] = useState<'split' | 'preview' | 'html'>('split');

  const generatedHtml = useMemo(() => {
    return parseMarkdownToHtml(markdown);
  }, [markdown]);

  const handleDownloadHtml = (standalone: boolean) => {
    let content = generatedHtml;
    let filename = 'document.html';

    if (standalone) {
      filename = 'document-styled.html';
      content = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Rendered Document · SamaXon</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      line-height: 1.6;
      color: #1a1a1a;
      max-width: 800px;
      margin: 40px auto;
      padding: 0 20px;
      background: #ffffff;
    }
    h1, h2, h3, h4, h5, h6 { color: #111111; margin-top: 1.5em; margin-bottom: 0.5em; }
    code { font-family: monospace; background: #f4f4f4; padding: 2px 6px; border-radius: 4px; }
    pre { background: #1a1a1a; color: #f8f8f2; padding: 16px; border-radius: 8px; overflow-x: auto; }
    blockquote { border-left: 4px solid #D6B46A; padding-left: 16px; color: #555; margin: 16px 0; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th, td { border: 1px solid #ddd; padding: 8px 12px; text-align: left; }
    th { background: #f8f8f8; font-weight: bold; }
    a { color: #A68936; text-decoration: none; }
    a:hover { text-decoration: underline; }
  </style>
</head>
<body>
${generatedHtml}
</body>
</html>`;
    }

    const blob = new Blob([content], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 text-left" id="markdown-to-html">
      <ToolHeader
        title="Markdown to HTML Converter & Live Previewer"
        description="Convert CommonMark and GitHub Flavored Markdown into secure, sanitized HTML code with real-time typography preview."
        icon={FileText}
        categoryName="Text, Productivity & Utilities"
        categorySlug="text-productivity"
        badgeText="100% IN-BROWSER · SANITIZED OUTPUT"
      />

      {/* Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white border border-neutral-200/80 rounded-2xl p-3 shadow-xs">
        <div className="flex items-center gap-1.5 bg-neutral-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setViewMode('split')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
              viewMode === 'split' ? 'bg-white text-neutral-900 shadow-2xs' : 'text-neutral-600'
            }`}
          >
            <Columns className="w-3.5 h-3.5 inline mr-1" />
            Split View
          </button>
          <button
            type="button"
            onClick={() => setViewMode('preview')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
              viewMode === 'preview' ? 'bg-white text-neutral-900 shadow-2xs' : 'text-neutral-600'
            }`}
          >
            <Eye className="w-3.5 h-3.5 inline mr-1" />
            Preview Only
          </button>
          <button
            type="button"
            onClick={() => setViewMode('html')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
              viewMode === 'html' ? 'bg-white text-neutral-900 shadow-2xs' : 'text-neutral-600'
            }`}
          >
            <Code2 className="w-3.5 h-3.5 inline mr-1" />
            HTML Source
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <CopyButton textToCopy={generatedHtml} label="Copy HTML" />
          <DownloadButton onDownload={() => handleDownloadHtml(false)} label="Download .html" />
          <DownloadButton onDownload={() => handleDownloadHtml(true)} label="Download Styled HTML" />
          <ResetButton onReset={() => setMarkdown(SAMPLE_MARKDOWN)} label="Reset Sample" />
        </div>
      </div>

      {/* Editor & Preview Grid */}
      <div className={`grid gap-6 items-start ${viewMode === 'split' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
        {/* Markdown Source Editor */}
        {(viewMode === 'split' || viewMode === 'preview') && (
          <div className={`bg-white border border-neutral-200/80 rounded-3xl p-6 space-y-3 shadow-xs ${viewMode === 'preview' ? 'hidden lg:block' : ''}`}>
            <div className="flex justify-between items-center border-b border-neutral-100 pb-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-900">
                Markdown Source (GFM)
              </span>
              <span className="text-[11px] font-mono text-neutral-400">{markdown.length} chars</span>
            </div>
            <textarea
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              rows={22}
              spellCheck={false}
              className="w-full p-4 bg-neutral-900 text-neutral-100 font-mono text-xs sm:text-sm rounded-2xl resize-y focus:outline-none selection:bg-[#D6B46A]/30 leading-relaxed border border-neutral-800"
            />
          </div>
        )}

        {/* Formatted HTML Preview */}
        {(viewMode === 'split' || viewMode === 'preview') && (
          <div className="bg-white border border-neutral-200/80 rounded-3xl p-6 sm:p-8 space-y-3 shadow-xs">
            <div className="flex justify-between items-center border-b border-neutral-100 pb-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#A68936] flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5" />
                Live Typography Rendering
              </span>
              <span className="text-[10px] font-mono uppercase bg-neutral-100 px-2 py-0.5 rounded text-neutral-600">
                WCAG Compliant
              </span>
            </div>
            <div 
              className="prose prose-neutral max-w-none text-neutral-800 text-sm leading-relaxed p-2 space-y-4 [&_h1]:text-2xl [&_h1]:font-black [&_h1]:text-neutral-900 [&_h1]:border-b [&_h1]:border-neutral-200 [&_h1]:pb-2 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-neutral-900 [&_h2]:mt-6 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-neutral-900 [&_blockquote]:border-l-4 [&_blockquote]:border-[#D6B46A] [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-neutral-600 [&_table]:w-full [&_table]:border-collapse [&_th]:border [&_th]:border-neutral-300 [&_th]:p-2 [&_th]:bg-neutral-50 [&_th]:font-bold [&_td]:border [&_td]:border-neutral-300 [&_td]:p-2 [&_code.inline-code]:bg-neutral-100 [&_code.inline-code]:px-1.5 [&_code.inline-code]:py-0.5 [&_code.inline-code]:rounded [&_code.inline-code]:font-mono [&_code.inline-code]:text-xs [&_pre.code-block]:bg-neutral-900 [&_pre.code-block]:text-neutral-100 [&_pre.code-block]:p-4 [&_pre.code-block]:rounded-xl [&_pre.code-block]:font-mono [&_pre.code-block]:text-xs [&_pre.code-block]:overflow-x-auto [&_a]:text-[#A68936] [&_a]:underline"
              dangerouslySetInnerHTML={{ __html: generatedHtml }}
            />
          </div>
        )}

        {/* HTML Source Code Mode */}
        {viewMode === 'html' && (
          <div className="bg-white border border-neutral-200/80 rounded-3xl p-6 space-y-3 shadow-xs">
            <div className="flex justify-between items-center border-b border-neutral-100 pb-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-900">
                Generated HTML Markup
              </span>
              <CopyButton textToCopy={generatedHtml} label="Copy Markup" />
            </div>
            <textarea
              readOnly
              value={generatedHtml}
              rows={22}
              className="w-full p-4 bg-neutral-900 text-emerald-400 font-mono text-xs sm:text-sm rounded-2xl resize-y focus:outline-none selection:bg-[#D6B46A]/30 leading-relaxed border border-neutral-800"
            />
          </div>
        )}
      </div>
    </div>
  );
}
