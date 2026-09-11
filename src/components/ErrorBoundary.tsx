import React, { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export default class ErrorBoundary extends React.Component<Props, State> {
  public override state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  constructor(props: Props) {
    super(props);
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an unhandled error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FFFDF8] flex items-center justify-center p-6 text-center text-[#111111]" id="app-error-boundary-boundary">
          <div className="max-w-md w-full bg-white border border-[#D6B46A]/30 rounded-3xl p-8 shadow-2xl space-y-6 text-left">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-600 shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#BFA15A] font-bold block">
                  Studio System Notice
                </span>
                <h2 className="font-display text-lg font-black text-[#111111] uppercase tracking-tight">
                  {this.props.fallbackTitle || 'Runtime Handled Gracefully'}
                </h2>
              </div>
            </div>

            <p className="text-xs text-[#8A8178] leading-relaxed">
              An unexpected view condition occurred. The interface caught this state safely without affecting your data.
            </p>

            {this.state.error && (
              <div className="p-3 bg-neutral-900 text-neutral-200 rounded-xl font-mono text-[11px] overflow-x-auto max-h-36">
                {this.state.error.message || String(this.state.error)}
              </div>
            )}

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={this.handleReset}
                className="flex-1 py-3 bg-[#111111] text-[#D6B46A] hover:text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <RefreshCw className="w-4 h-4" />
                Reload Interface
              </button>
              <a
                href="/"
                className="py-3 px-4 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Home className="w-4 h-4" />
                Home
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
