import React, { useState, useEffect, useMemo } from 'react';
import { 
  Send, Plus, Trash2, Copy, Download, Code, Sparkles, RefreshCw, 
  ShieldCheck, AlertTriangle, CheckCircle2, Lock, Eye, EyeOff, 
  HelpCircle, Clock, Database, ChevronRight, Layers, FileJson, 
  Terminal, Globe, Check, Sliders
} from 'lucide-react';
import { 
  HttpMethod, 
  KeyValuePair, 
  AuthConfig, 
  RequestConfig, 
  ApiResponseData, 
  RequestHistoryItem,
  COMMON_HEADER_SUGGESTIONS,
  COMMON_CONTENT_TYPES,
  buildComputedUrl,
  validateAndFormatJson,
  computeFinalRequestBody,
  executeApiRequest,
  generateCurlCommand,
  generateFetchSnippet,
  generateAxiosSnippet,
  generatePythonSnippet,
  generateRawHttpSnippet,
  sanitizeRequestConfigForStorage
} from '../../utils/apiRequestEngine';
import { useCustomUi } from '../../context/CustomUiContext';
import CustomInput from '../ui/CustomInput';
import CustomTextarea from '../ui/CustomTextarea';
import CustomSwitch from '../ui/CustomSwitch';
import CustomSelect from '../CustomSelect';
import FormField from '../ui/FormField';

const METHOD_COLORS: Record<HttpMethod, { bg: string; text: string; border: string }> = {
  GET: { bg: 'bg-emerald-500/10', text: 'text-emerald-700', border: 'border-emerald-500/30' },
  POST: { bg: 'bg-amber-500/10', text: 'text-amber-700', border: 'border-amber-500/30' },
  PUT: { bg: 'bg-blue-500/10', text: 'text-blue-700', border: 'border-blue-500/30' },
  PATCH: { bg: 'bg-purple-500/10', text: 'text-purple-700', border: 'border-purple-500/30' },
  DELETE: { bg: 'bg-rose-500/10', text: 'text-rose-700', border: 'border-rose-500/30' },
  HEAD: { bg: 'bg-teal-500/10', text: 'text-teal-700', border: 'border-teal-500/30' },
  OPTIONS: { bg: 'bg-neutral-500/10', text: 'text-neutral-700', border: 'border-neutral-500/30' }
};

const HISTORY_STORAGE_KEY = 'samaxon_api_builder_history';

export default function ApiRequestBuilder() {
  const { showToast, showConfirm } = useCustomUi();

  // Active Request Configuration State
  const [method, setMethod] = useState<HttpMethod>('GET');
  const [url, setUrl] = useState('https://jsonplaceholder.typicode.com/posts/1');
  const [queryParams, setQueryParams] = useState<KeyValuePair[]>([
    { id: '1', key: '', value: '', enabled: true }
  ]);
  const [headers, setHeaders] = useState<KeyValuePair[]>([
    { id: 'h1', key: 'Accept', value: 'application/json', enabled: true }
  ]);
  const [auth, setAuth] = useState<AuthConfig>({
    type: 'none',
    bearerToken: '',
    basicUsername: '',
    basicPassword: '',
    apiKeyName: 'X-API-Key',
    apiKeyValue: '',
    apiKeyPlacement: 'header'
  });
  const [showSecret, setShowSecret] = useState(false);

  // Body State
  const [bodyType, setBodyType] = useState<RequestConfig['bodyType']>('none');
  const [bodyContent, setBodyContent] = useState('{\n  "title": "foo",\n  "body": "bar",\n  "userId": 1\n}');
  const [urlEncodedParams, setUrlEncodedParams] = useState<KeyValuePair[]>([
    { id: 'f1', key: '', value: '', enabled: true }
  ]);

  // Request Execution Settings
  const [useProxy, setUseProxy] = useState(false);
  const [timeoutMs, setTimeoutMs] = useState(15000);
  const [isLoading, setIsLoading] = useState(false);

  // Active Tab for Configuration: 'params' | 'headers' | 'auth' | 'body' | 'code'
  const [configTab, setConfigTab] = useState<'params' | 'headers' | 'auth' | 'body' | 'code'>('params');

  // Active Tab for Code Export
  const [codeExportTab, setCodeExportTab] = useState<'curl' | 'fetch' | 'axios' | 'python' | 'raw'>('curl');

  // Response State
  const [response, setResponse] = useState<ApiResponseData | null>(null);
  const [responseTab, setResponseTab] = useState<'body' | 'headers' | 'summary'>('body');
  const [bodySearchQuery, setBodySearchQuery] = useState('');

  // History State
  const [history, setHistory] = useState<RequestHistoryItem[]>([]);
  const [showHistoryDrawer, setShowHistoryDrawer] = useState(false);

  // Load history from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (raw) {
        setHistory(JSON.parse(raw));
      }
    } catch {}
  }, []);

  const saveHistory = (item: RequestHistoryItem) => {
    const updated = [item, ...history.filter(h => h.id !== item.id)].slice(0, 20);
    setHistory(updated);
    try {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
    } catch {}
  };

  const clearHistory = () => {
    showConfirm({
      title: 'Clear Request History',
      message: 'Are you sure you want to remove all saved request history records?',
      confirmText: 'Clear All',
      cancelText: 'Cancel',
      onConfirm: () => {
        setHistory([]);
        localStorage.removeItem(HISTORY_STORAGE_KEY);
        showToast('Request history cleared.', 'info');
      }
    });
  };

  // Build current RequestConfig object
  const currentConfig: RequestConfig = useMemo(() => ({
    id: `req-${Date.now()}`,
    name: `${method} ${url}`,
    url,
    method,
    queryParams,
    headers,
    auth,
    bodyType,
    bodyContent,
    urlEncodedParams,
    timeoutMs,
    useProxy
  }), [method, url, queryParams, headers, auth, bodyType, bodyContent, urlEncodedParams, timeoutMs, useProxy]);

  // Computed live full URL for preview
  const computedUrl = useMemo(() => {
    return buildComputedUrl(url, queryParams, auth);
  }, [url, queryParams, auth]);

  // JSON Validation Status
  const jsonValidation = useMemo(() => {
    if (bodyType !== 'json') return null;
    return validateAndFormatJson(bodyContent);
  }, [bodyType, bodyContent]);

  // Execute Request
  const handleSend = async () => {
    if (!url.trim()) {
      showToast('Please enter an API request URL before sending.', 'warning');
      return;
    }

    setIsLoading(true);
    try {
      const result = await executeApiRequest(currentConfig);
      setResponse(result);

      if (result.ok) {
        showToast(`Request complete: ${result.status} ${result.statusText} in ${result.timeMs}ms`, 'success');
      } else if (result.errorType === 'cors') {
        showToast('Browser blocked request due to CORS. Consider enabling SamaXon Proxy.', 'warning');
      } else {
        showToast(`HTTP ${result.status}: ${result.statusText || 'Error'}`, 'error');
      }

      // Save to history (sanitizing credentials)
      saveHistory({
        id: `${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        method,
        url: computedUrl,
        status: result.status,
        timeMs: result.timeMs,
        success: result.ok,
        sanitizedConfig: sanitizeRequestConfigForStorage(currentConfig)
      });
    } catch (err: any) {
      showToast(err.message || 'Failed executing request.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Copy helper
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const handleCopy = (text: string, key: string, label: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    showToast(`Copied ${label} to clipboard!`, 'success');
    setTimeout(() => setCopiedKey(null), 2500);
  };

  // Download Response
  const handleDownloadResponse = () => {
    if (!response) return;
    const blob = new Blob([response.bodyText], { type: response.contentType || 'text/plain' });
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = `response-${method}-${Date.now()}.${response.isJson ? 'json' : 'txt'}`;
    a.click();
    URL.revokeObjectURL(blobUrl);
    showToast('Downloaded response body file.', 'success');
  };

  // Restore history item
  const handleRestoreHistory = (item: RequestHistoryItem) => {
    const c = item.sanitizedConfig;
    setMethod(c.method);
    setUrl(c.url);
    setQueryParams(c.queryParams.length > 0 ? c.queryParams : [{ id: '1', key: '', value: '', enabled: true }]);
    setHeaders(c.headers.length > 0 ? c.headers : [{ id: '1', key: '', value: '', enabled: true }]);
    setBodyType(c.bodyType);
    setBodyContent(c.bodyContent);
    setUrlEncodedParams(c.urlEncodedParams);
    setShowHistoryDrawer(false);
    showToast(`Restored request: ${item.method} ${item.url}`, 'info');
  };

  // Param helpers
  const addParam = () => setQueryParams([...queryParams, { id: `${Date.now()}`, key: '', value: '', enabled: true }]);
  const removeParam = (id: string) => setQueryParams(queryParams.filter(p => p.id !== id));
  const updateParam = (id: string, field: 'key' | 'value' | 'enabled', val: any) => {
    setQueryParams(queryParams.map(p => p.id === id ? { ...p, [field]: val } : p));
  };

  // Header helpers
  const addHeader = (suggestedKey = '', suggestedVal = '') => {
    setHeaders([...headers, { id: `${Date.now()}`, key: suggestedKey, value: suggestedVal, enabled: true }]);
  };
  const removeHeader = (id: string) => setHeaders(headers.filter(h => h.id !== id));
  const updateHeader = (id: string, field: 'key' | 'value' | 'enabled', val: any) => {
    setHeaders(headers.map(h => h.id === id ? { ...h, [field]: val } : h));
  };

  // Form body helpers
  const addFormParam = () => setUrlEncodedParams([...urlEncodedParams, { id: `${Date.now()}`, key: '', value: '', enabled: true }]);
  const removeFormParam = (id: string) => setUrlEncodedParams(urlEncodedParams.filter(p => p.id !== id));
  const updateFormParam = (id: string, field: 'key' | 'value' | 'enabled', val: any) => {
    setUrlEncodedParams(urlEncodedParams.map(p => p.id === id ? { ...p, [field]: val } : p));
  };

  return (
    <div className="space-y-8 text-left" id="api-request-builder-root">
      {/* Top Banner */}
      <div className="bg-[#111111] text-[#FFFDF8] rounded-[28px] p-6 sm:p-8 border border-[#D6B46A]/30 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#D6B46A]/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D6B46A]/15 border border-[#D6B46A]/30 text-[#D6B46A] text-[11px] font-mono uppercase tracking-wider font-bold">
              <Terminal className="w-3.5 h-3.5" />
              <span>Full-Spectrum HTTP Client · Zero Secret Logging</span>
            </div>

            <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white">
              API Request Builder & Tester
            </h2>

            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
              Construct RESTful HTTP requests with custom headers, query parameters, multipart bodies, and secure authentication tokens. Inspect response status, timings, headers, and formatted payloads with zero data leakage.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start lg:self-center">
            <button
              type="button"
              onClick={() => setShowHistoryDrawer(!showHistoryDrawer)}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/15 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 cursor-pointer"
            >
              <Clock className="w-3.5 h-3.5 text-[#D6B46A]" />
              <span>History ({history.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Primary Request URL Command Bar */}
      <div className="bg-white rounded-[24px] border border-[#D6B46A]/25 p-4 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Method Selector */}
          <div className="w-full md:w-36 shrink-0">
            <CustomSelect
              value={method}
              onChange={(m) => setMethod(m as HttpMethod)}
              options={['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS']}
            />
          </div>

          {/* URL Input */}
          <div className="flex-1">
            <CustomInput
              id="api-request-url-input"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://api.example.com/v1/resource"
              className="font-mono"
            />
          </div>

          {/* Send Action Button */}
          <button
            type="button"
            onClick={handleSend}
            disabled={isLoading || !url.trim()}
            className={`px-7 py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md shrink-0 ${
              isLoading || !url.trim()
                ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                : 'bg-[#111111] hover:bg-[#222222] text-[#D6B46A] cursor-pointer'
            }`}
          >
            {isLoading ? (
              <RefreshCw className="w-4 h-4 animate-spin text-[#D6B46A]" />
            ) : (
              <Send className="w-4 h-4 text-[#D6B46A]" />
            )}
            <span>{isLoading ? 'Executing...' : 'Send Request'}</span>
          </button>
        </div>

        {/* Live Computed URL Preview & Mode Switch */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2 border-t border-neutral-100 text-xs">
          <div className="flex items-center gap-2 overflow-hidden text-neutral-500 font-mono text-[11px] truncate max-w-xl">
            <span className="font-bold text-[#85641C]">Target:</span>
            <span className="truncate text-neutral-700">{computedUrl}</span>
          </div>

          <div className="flex items-center gap-4">
            <CustomSwitch
              id="api-builder-proxy-toggle"
              checked={useProxy}
              onChange={setUseProxy}
              label="SamaXon Proxy Mode"
              description="Bypasses browser CORS restrictions"
            />
          </div>
        </div>
      </div>

      {/* History Drawer Modal */}
      {showHistoryDrawer && (
        <div className="bg-[#FAF8F5] border border-[#D6B46A]/30 rounded-[24px] p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-[#D6B46A]/20 pb-3">
            <h4 className="font-display font-bold text-sm text-[#111111] flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#85641C]" />
              <span>Recent Request History (Local Sandbox)</span>
            </h4>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={clearHistory}
                className="text-xs text-rose-600 hover:text-rose-800 font-semibold cursor-pointer"
              >
                Clear History
              </button>
              <button
                type="button"
                onClick={() => setShowHistoryDrawer(false)}
                className="text-xs text-neutral-600 hover:text-black font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>

          {history.length === 0 ? (
            <p className="text-xs text-[#8A8178] py-4 text-center">
              No recent requests recorded yet. Execute a request to populate history.
            </p>
          ) : (
            <div className="divide-y divide-neutral-200/60 max-h-60 overflow-y-auto">
              {history.map((item) => (
                <div 
                  key={item.id} 
                  className="py-2.5 flex items-center justify-between gap-3 hover:bg-white/60 px-2 rounded-lg cursor-pointer transition-all"
                  onClick={() => handleRestoreHistory(item)}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                      METHOD_COLORS[item.method]?.bg || 'bg-neutral-100'
                    } ${METHOD_COLORS[item.method]?.text || 'text-neutral-700'}`}>
                      {item.method}
                    </span>
                    <span className="font-mono text-xs text-neutral-800 truncate">{item.url}</span>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 text-xs font-mono">
                    <span className={item.success ? 'text-emerald-700 font-bold' : 'text-rose-600 font-bold'}>
                      {item.status || 'ERR'}
                    </span>
                    <span className="text-neutral-400 text-[10px]">{item.timeMs}ms</span>
                    <span className="text-neutral-400 text-[10px]">{item.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Main Configuration Tabs */}
      <div className="bg-white rounded-[24px] border border-[#D6B46A]/25 overflow-hidden shadow-sm">
        {/* Navigation Tabs Header */}
        <div className="flex items-center border-b border-neutral-100 bg-[#FFFDF8] px-4 sm:px-6 overflow-x-auto">
          {[
            { id: 'params', label: `Query Parameters (${queryParams.filter(p => p.key.trim()).length})` },
            { id: 'headers', label: `Headers (${headers.filter(h => h.key.trim()).length})` },
            { id: 'auth', label: `Authentication (${auth.type !== 'none' ? auth.type : 'None'})` },
            { id: 'body', label: `Body (${bodyType !== 'none' ? bodyType : 'None'})` },
            { id: 'code', label: 'Code Snippets' }
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setConfigTab(tab.id as any)}
              className={`px-5 py-4 text-xs font-bold uppercase tracking-wider transition-all border-b-2 cursor-pointer whitespace-nowrap ${
                configTab === tab.id
                  ? 'border-[#D6B46A] text-[#111111] bg-white'
                  : 'border-transparent text-[#8A8178] hover:text-[#111111]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Body Contents */}
        <div className="p-6 sm:p-8">
          {/* TAB 1: Query Parameters */}
          {configTab === 'params' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
                <span className="text-xs font-bold text-[#111111] uppercase tracking-wider">
                  URL Query String Parameters
                </span>
                <button
                  type="button"
                  onClick={addParam}
                  className="px-3 py-1.5 bg-[#111111] text-[#D6B46A] hover:text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Parameter</span>
                </button>
              </div>

              <div className="space-y-2.5">
                {queryParams.map((param) => (
                  <div key={param.id} className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={param.enabled}
                      onChange={(e) => updateParam(param.id, 'enabled', e.target.checked)}
                      className="w-4 h-4 rounded text-[#D6B46A] focus:ring-0 cursor-pointer"
                    />
                    <div className="flex-1">
                      <CustomInput
                        placeholder="Parameter Name (key)"
                        value={param.key}
                        onChange={(e) => updateParam(param.id, 'key', e.target.value)}
                        className="font-mono text-xs"
                      />
                    </div>
                    <div className="flex-1">
                      <CustomInput
                        placeholder="Parameter Value"
                        value={param.value}
                        onChange={(e) => updateParam(param.id, 'value', e.target.value)}
                        className="font-mono text-xs"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeParam(param.id)}
                      disabled={queryParams.length <= 1}
                      className="p-2 text-neutral-400 hover:text-rose-600 disabled:opacity-30 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: Request Headers */}
          {configTab === 'headers' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
                <span className="text-xs font-bold text-[#111111] uppercase tracking-wider">
                  HTTP Request Headers
                </span>
                <button
                  type="button"
                  onClick={() => addHeader()}
                  className="px-3 py-1.5 bg-[#111111] text-[#D6B46A] hover:text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Header</span>
                </button>
              </div>

              {/* Header Suggestions */}
              <div className="space-y-1.5">
                <span className="text-[11px] text-[#8A8178] block font-medium">Quick Preset Headers:</span>
                <div className="flex flex-wrap items-center gap-1.5">
                  {COMMON_HEADER_SUGGESTIONS.map((h) => (
                    <button
                      key={h}
                      type="button"
                      onClick={() => addHeader(h, h === 'Accept' ? 'application/json' : '')}
                      className="px-2.5 py-1 rounded-md bg-neutral-100 hover:bg-[#D6B46A]/20 text-neutral-700 text-[11px] font-mono transition-all cursor-pointer"
                    >
                      + {h}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2.5 pt-2">
                {headers.map((header) => (
                  <div key={header.id} className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={header.enabled}
                      onChange={(e) => updateHeader(header.id, 'enabled', e.target.checked)}
                      className="w-4 h-4 rounded text-[#D6B46A] focus:ring-0 cursor-pointer"
                    />
                    <div className="flex-1">
                      <CustomInput
                        placeholder="Header (e.g. Authorization, Accept)"
                        value={header.key}
                        onChange={(e) => updateHeader(header.id, 'key', e.target.value)}
                        className="font-mono text-xs"
                      />
                    </div>
                    <div className="flex-1">
                      <CustomInput
                        placeholder="Value"
                        value={header.value}
                        onChange={(e) => updateHeader(header.id, 'value', e.target.value)}
                        className="font-mono text-xs"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeHeader(header.id)}
                      disabled={headers.length <= 1}
                      className="p-2 text-neutral-400 hover:text-rose-600 disabled:opacity-30 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: Authentication */}
          {configTab === 'auth' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                <span className="text-xs font-bold text-[#111111] uppercase tracking-wider">
                  Authentication Method
                </span>
                <span className="text-xs text-neutral-400">Tokens never transmitted to SamaXon databases</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {(['none', 'bearer', 'basic', 'apikey-header', 'apikey-query'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setAuth({ ...auth, type: t })}
                    className={`px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border cursor-pointer ${
                      auth.type === t
                        ? 'bg-[#111111] text-[#D6B46A] border-[#D6B46A] shadow-xs'
                        : 'bg-neutral-50 text-neutral-600 border-neutral-200 hover:bg-neutral-100'
                    }`}
                  >
                    {t === 'none' ? 'No Auth' : t === 'bearer' ? 'Bearer Token' : t === 'basic' ? 'Basic Auth' : t === 'apikey-header' ? 'API Key (Header)' : 'API Key (Query)'}
                  </button>
                ))}
              </div>

              {/* Bearer Token Form */}
              {auth.type === 'bearer' && (
                <div className="p-5 rounded-2xl bg-[#FFFDF8] border border-[#D6B46A]/25 space-y-4">
                  <FormField
                    id="bearer-token"
                    label="Bearer Token"
                    description="Included automatically as Authorization: Bearer <token>"
                  >
                    <div className="relative">
                      <CustomInput
                        id="bearer-token-input"
                        type={showSecret ? 'text' : 'password'}
                        placeholder="eyJhbGciOiJIUzI1NiIsInR..."
                        value={auth.bearerToken}
                        onChange={(e) => setAuth({ ...auth, bearerToken: e.target.value })}
                        className="font-mono"
                        endIcon={
                          <button
                            type="button"
                            onClick={() => setShowSecret(!showSecret)}
                            className="cursor-pointer text-neutral-400 hover:text-black"
                          >
                            {showSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        }
                      />
                    </div>
                  </FormField>
                </div>
              )}

              {/* Basic Auth Form */}
              {auth.type === 'basic' && (
                <div className="p-5 rounded-2xl bg-[#FFFDF8] border border-[#D6B46A]/25 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField id="basic-username" label="Username">
                      <CustomInput
                        placeholder="admin"
                        value={auth.basicUsername}
                        onChange={(e) => setAuth({ ...auth, basicUsername: e.target.value })}
                      />
                    </FormField>

                    <FormField id="basic-password" label="Password">
                      <CustomInput
                        type={showSecret ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={auth.basicPassword}
                        onChange={(e) => setAuth({ ...auth, basicPassword: e.target.value })}
                        endIcon={
                          <button
                            type="button"
                            onClick={() => setShowSecret(!showSecret)}
                            className="cursor-pointer text-neutral-400 hover:text-black"
                          >
                            {showSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        }
                      />
                    </FormField>
                  </div>
                </div>
              )}

              {/* API Key Form */}
              {(auth.type === 'apikey-header' || auth.type === 'apikey-query') && (
                <div className="p-5 rounded-2xl bg-[#FFFDF8] border border-[#D6B46A]/25 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField id="api-key-name" label="Key Name">
                      <CustomInput
                        placeholder="X-API-Key or api_key"
                        value={auth.apiKeyName}
                        onChange={(e) => setAuth({ ...auth, apiKeyName: e.target.value })}
                        className="font-mono"
                      />
                    </FormField>

                    <FormField id="api-key-value" label="Key Value">
                      <CustomInput
                        type={showSecret ? 'text' : 'password'}
                        placeholder="key_live_..."
                        value={auth.apiKeyValue}
                        onChange={(e) => setAuth({ ...auth, apiKeyValue: e.target.value })}
                        className="font-mono"
                        endIcon={
                          <button
                            type="button"
                            onClick={() => setShowSecret(!showSecret)}
                            className="cursor-pointer text-neutral-400 hover:text-black"
                          >
                            {showSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        }
                      />
                    </FormField>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: Request Body */}
          {configTab === 'body' && (
            <div className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-100 pb-3">
                <div className="flex flex-wrap items-center gap-2">
                  {(['none', 'json', 'form-urlencoded', 'text', 'xml', 'raw'] as const).map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setBodyType(b)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                        bodyType === b
                          ? 'bg-[#111111] text-[#D6B46A]'
                          : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                      }`}
                    >
                      {b === 'none' ? 'None' : b === 'json' ? 'JSON' : b === 'form-urlencoded' ? 'x-www-form-urlencoded' : b}
                    </button>
                  ))}
                </div>

                {bodyType === 'json' && jsonValidation && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => jsonValidation.formatted && setBodyContent(jsonValidation.formatted)}
                      className="px-2.5 py-1 text-xs font-bold text-[#85641C] bg-[#FAF8F5] border border-[#D6B46A]/30 rounded-lg hover:bg-[#FAF6F0] cursor-pointer"
                    >
                      Beautify JSON
                    </button>
                    <button
                      type="button"
                      onClick={() => jsonValidation.minified && setBodyContent(jsonValidation.minified)}
                      className="px-2.5 py-1 text-xs font-bold text-neutral-600 bg-neutral-100 rounded-lg hover:bg-neutral-200 cursor-pointer"
                    >
                      Minify
                    </button>
                  </div>
                )}
              </div>

              {bodyType === 'json' && (
                <div className="space-y-2">
                  <CustomTextarea
                    rows={10}
                    value={bodyContent}
                    onChange={(e) => setBodyContent(e.target.value)}
                    className="font-mono text-xs"
                    hasError={Boolean(jsonValidation && !jsonValidation.valid)}
                  />

                  {jsonValidation && !jsonValidation.valid && (
                    <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-mono">
                      Invalid JSON syntax at Line {jsonValidation.errorLine || 1}, Column {jsonValidation.errorColumn || 1}: {jsonValidation.errorMessage}
                    </div>
                  )}
                </div>
              )}

              {bodyType === 'form-urlencoded' && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-[#8A8178]">Form key-value URL-encoded pairs</span>
                    <button
                      type="button"
                      onClick={addFormParam}
                      className="px-2.5 py-1 bg-[#111111] text-[#D6B46A] rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add Row</span>
                    </button>
                  </div>

                  <div className="space-y-2">
                    {urlEncodedParams.map((p) => (
                      <div key={p.id} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={p.enabled}
                          onChange={(e) => updateFormParam(p.id, 'enabled', e.target.checked)}
                          className="w-4 h-4 rounded text-[#D6B46A] cursor-pointer"
                        />
                        <div className="flex-1">
                          <CustomInput
                            placeholder="Key"
                            value={p.key}
                            onChange={(e) => updateFormParam(p.id, 'key', e.target.value)}
                            className="font-mono text-xs"
                          />
                        </div>
                        <div className="flex-1">
                          <CustomInput
                            placeholder="Value"
                            value={p.value}
                            onChange={(e) => updateFormParam(p.id, 'value', e.target.value)}
                            className="font-mono text-xs"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFormParam(p.id)}
                          className="p-2 text-neutral-400 hover:text-rose-600 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {(bodyType === 'text' || bodyType === 'xml' || bodyType === 'raw') && (
                <CustomTextarea
                  rows={8}
                  value={bodyContent}
                  onChange={(e) => setBodyContent(e.target.value)}
                  className="font-mono text-xs"
                />
              )}

              {bodyType === 'none' && (
                <div className="p-8 text-center text-xs text-[#8A8178]">
                  This request has no body payload. (Standard for GET, HEAD, and parameter-based calls)
                </div>
              )}
            </div>
          )}

          {/* TAB 5: Code Snippets Export */}
          {configTab === 'code' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-100 pb-3">
                <div className="flex items-center gap-2">
                  {(['curl', 'fetch', 'axios', 'python', 'raw'] as const).map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setCodeExportTab(c)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                        codeExportTab === c
                          ? 'bg-[#111111] text-[#D6B46A]'
                          : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                      }`}
                    >
                      {c === 'curl' ? 'cURL' : c === 'fetch' ? 'JS Fetch' : c === 'axios' ? 'Axios' : c === 'python' ? 'Python' : 'Raw HTTP'}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    let code = '';
                    if (codeExportTab === 'curl') code = generateCurlCommand(currentConfig, false);
                    else if (codeExportTab === 'fetch') code = generateFetchSnippet(currentConfig, false);
                    else if (codeExportTab === 'axios') code = generateAxiosSnippet(currentConfig, false);
                    else if (codeExportTab === 'python') code = generatePythonSnippet(currentConfig, false);
                    else if (codeExportTab === 'raw') code = generateRawHttpSnippet(currentConfig, false);
                    handleCopy(code, 'code-snippet', `${codeExportTab.toUpperCase()} Snippet`);
                  }}
                  className="px-3.5 py-1.5 bg-[#111111] hover:bg-[#222222] text-[#D6B46A] text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  {copiedKey === 'code-snippet' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'code-snippet' ? 'Copied!' : 'Copy Code'}</span>
                </button>
              </div>

              <pre className="font-mono text-xs bg-[#111111] text-[#FFFDF8] p-5 rounded-2xl overflow-x-auto border border-white/10 select-all leading-relaxed">
                {codeExportTab === 'curl' && generateCurlCommand(currentConfig, false)}
                {codeExportTab === 'fetch' && generateFetchSnippet(currentConfig, false)}
                {codeExportTab === 'axios' && generateAxiosSnippet(currentConfig, false)}
                {codeExportTab === 'python' && generatePythonSnippet(currentConfig, false)}
                {codeExportTab === 'raw' && generateRawHttpSnippet(currentConfig, false)}
              </pre>
            </div>
          )}
        </div>
      </div>

      {/* Response Panel */}
      {response ? (
        <div className="bg-white rounded-[24px] border border-[#D6B46A]/25 p-6 sm:p-8 shadow-sm space-y-6">
          {/* Status Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 pb-5">
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider ${
                response.ok
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : response.status === 0
                  ? 'bg-rose-100 text-rose-800 border border-rose-300'
                  : 'bg-amber-100 text-amber-800 border border-amber-300'
              }`}>
                {response.status === 0 ? 'FAILED' : `${response.status} ${response.statusText}`}
              </span>

              <div className="flex items-center gap-4 text-xs font-mono text-neutral-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <strong>{response.timeMs}</strong> ms
                </span>

                <span className="flex items-center gap-1">
                  <Database className="w-3.5 h-3.5" />
                  <strong>{(response.sizeBytes / 1024).toFixed(2)}</strong> KB
                </span>

                {response.viaProxy && (
                  <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px] font-bold">
                    Via Proxy
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleCopy(response.bodyText, 'resp-body', 'Response Body')}
                className="px-3 py-1.5 text-xs font-bold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
              >
                {copiedKey === 'resp-body' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-[#85641C]" />}
                <span>{copiedKey === 'resp-body' ? 'Copied!' : 'Copy Body'}</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadResponse}
                className="px-3 py-1.5 text-xs font-bold text-[#111111] bg-[#FFFDF8] border border-[#D6B46A]/40 hover:bg-[#FAF6F0] rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Download className="w-3.5 h-3.5 text-[#85641C]" />
                <span>Download</span>
              </button>
            </div>
          </div>

          {/* CORS failure banner with 1-click proxy retry */}
          {response.errorType === 'cors' && (
            <div className="p-5 rounded-2xl bg-amber-50 border border-amber-300 text-xs text-amber-900 space-y-3">
              <div className="flex items-center gap-2 font-bold text-sm">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Browser Cross-Origin (CORS) Restriction Enforced</span>
              </div>
              <p className="leading-relaxed text-amber-800">
                Browsers prohibit direct client-side fetch requests to endpoints that do not supply an <code className="font-mono bg-white px-1 py-0.5 rounded border border-amber-300">Access-Control-Allow-Origin</code> header.
              </p>
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setUseProxy(true);
                    setTimeout(() => handleSend(), 50);
                  }}
                  className="px-4 py-2 bg-[#111111] text-[#D6B46A] hover:text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer flex items-center gap-2"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Enable SamaXon Proxy & Retry</span>
                </button>
              </div>
            </div>
          )}

          {/* Response Subtabs */}
          <div className="flex items-center gap-2 border-b border-neutral-100 pb-2">
            <button
              type="button"
              onClick={() => setResponseTab('body')}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                responseTab === 'body'
                  ? 'bg-[#111111] text-[#D6B46A]'
                  : 'text-neutral-500 hover:text-black'
              }`}
            >
              Response Body
            </button>
            <button
              type="button"
              onClick={() => setResponseTab('headers')}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                responseTab === 'headers'
                  ? 'bg-[#111111] text-[#D6B46A]'
                  : 'text-neutral-500 hover:text-black'
              }`}
            >
              Headers ({Object.keys(response.headers).length})
            </button>
            <button
              type="button"
              onClick={() => setResponseTab('summary')}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                responseTab === 'summary'
                  ? 'bg-[#111111] text-[#D6B46A]'
                  : 'text-neutral-500 hover:text-black'
              }`}
            >
              Request Sent Summary
            </button>
          </div>

          {/* Body Viewer */}
          {responseTab === 'body' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-neutral-400">
                <span>Content-Type: {response.contentType || 'unknown'}</span>
                <span>Format: {response.isJson ? 'Parsed JSON' : 'Raw Text'}</span>
              </div>

              <div className="relative">
                <pre className="font-mono text-xs bg-[#111111] text-[#FFFDF8] p-5 rounded-2xl overflow-x-auto max-h-[500px] border border-white/10 select-all leading-relaxed">
                  {response.isJson && response.parsedJson
                    ? JSON.stringify(response.parsedJson, null, 2)
                    : response.bodyText || '(empty response body)'}
                </pre>
              </div>
            </div>
          )}

          {/* Headers Viewer */}
          {responseTab === 'headers' && (
            <div className="divide-y divide-neutral-100 border border-neutral-100 rounded-2xl overflow-hidden font-mono text-xs">
              {Object.keys(response.headers).length === 0 ? (
                <div className="p-6 text-center text-neutral-400">No response headers exposed by server</div>
              ) : (
                Object.entries(response.headers).map(([k, v]) => (
                  <div key={k} className="p-3 flex items-start gap-4 hover:bg-neutral-50">
                    <span className="w-1/3 text-[#85641C] font-bold truncate">{k}</span>
                    <span className="w-2/3 text-neutral-800 break-all select-all">{v}</span>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Summary Viewer */}
          {responseTab === 'summary' && (
            <div className="space-y-4 font-mono text-xs bg-[#FAF8F5] p-5 rounded-2xl border border-[#D6B46A]/20">
              <div className="space-y-1">
                <span className="text-[10px] text-neutral-400 uppercase font-bold">Request URL</span>
                <p className="text-neutral-800 font-bold break-all">{computedUrl}</p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-neutral-400 uppercase font-bold">Execution Engine</span>
                <p className="text-neutral-800">{response.viaProxy ? 'SamaXon Proxy Gateway' : 'In-Browser Client Fetch'}</p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-neutral-400 uppercase font-bold">Equivalent cURL Command</span>
                <pre className="p-3 bg-white rounded-lg border border-neutral-200 text-[11px] overflow-x-auto">
                  {response.curlCommand}
                </pre>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-[#FFFDF8] rounded-[24px] border border-[#D6B46A]/20 p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#111111] text-[#D6B46A] flex items-center justify-center mx-auto shadow-md">
            <Send className="w-5 h-5" />
          </div>
          <h4 className="font-display font-bold text-base text-[#111111]">
            Ready to Dispatch Request
          </h4>
          <p className="text-xs text-[#8A8178] max-w-md mx-auto">
            Configure your method, destination URL, headers, and payload above, then click <strong>Send Request</strong> to inspect real-time response data.
          </p>
        </div>
      )}
    </div>
  );
}
