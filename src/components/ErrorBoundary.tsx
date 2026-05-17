import React from 'react';
import { useRouteError, isRouteErrorResponse, Link } from 'react-router-dom';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';

export default function ErrorBoundary() {
  const error = useRouteError();
  console.error(error);

  let title = "Oops! Something went wrong";
  let message = "An unexpected error occurred. Please try again later.";
  let details = "";

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      title = "Page Not Found";
      message = "We couldn't find the page you were looking for.";
    } else if (error.status === 401) {
      title = "Unauthorized";
      message = "You don't have permission to access this page.";
    } else if (error.status === 503) {
      title = "Service Unavailable";
      message = "Our servers are currently down. Please check back later.";
    } else {
      title = `Error ${error.status}`;
      message = error.statusText;
    }
  } else if (error instanceof Error) {
    message = error.message;
    details = error.stack || "";
  }

  return (
    <div className="min-h-screen bg-[#090A0E] text-white flex items-center justify-center p-6">
      <div className="max-w-xl w-full bg-[#101010] border border-white/10 p-8 rounded-2xl flex flex-col items-center text-center">
        <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mb-6">
          <AlertTriangle className="w-8 h-8" />
        </div>
        
        <h1 className="text-3xl font-bold font-display mb-4">{title}</h1>
        <p className="text-[#A8AFBD] mb-8 max-w-sm">{message}</p>
        
        {details && (
           <div className="w-full text-left bg-black/50 p-4 rounded-xl border border-white/5 mb-8 max-h-40 overflow-y-auto hidden">
             <pre className="text-[10px] text-red-400 font-mono whitespace-pre-wrap">{details}</pre>
           </div>
        )}

        <div className="flex gap-4">
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl font-medium transition-colors flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
          <Link 
            to="/" 
            className="px-6 py-3 bg-[#2984FF] hover:bg-[#2984FF]/90 rounded-xl font-medium transition-colors flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
