import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../lib/AuthContext";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex bg-neo-bg items-center justify-center min-h-screen text-neo-text">
        <div className="animate-pulse flex flex-col items-center">
           <svg className="w-12 h-12 text-neo-accent animate-spin mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
           </svg>
           <p className="text-xl font-display uppercase tracking-wider text-neo-accent">Verifying Access...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    // Redirect to login, but save the current location they were trying to go to
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isAdmin) {
    return (
       <div className="flex flex-col items-center justify-center min-h-screen bg-neo-bg text-neo-text px-4 text-center">
         <div className="w-20 h-20 bg-neo-red/10 rounded-full flex items-center justify-center mb-6 border border-neo-red/20 text-neo-red">
           <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
         </div>
         <h1 className="text-4xl font-display text-neo-red mb-4">ADMIN ACCESS DENIED</h1>
         <p className="text-neo-text/70 mb-8 max-w-md">
           Your account ({user.email}) does not have administrative privileges. 
           Please contact the site owner if you believe this is an error.
         </p>
         <div className="flex gap-4">
           <button 
             onClick={() => window.location.href = '/'}
             className="px-6 py-3 bg-neo-cyan/10 border border-neo-cyan/30 text-neo-cyan font-bold tracking-widest hover:bg-neo-cyan/20 transition-all uppercase"
           >
             Return Home
           </button>
           <button 
             onClick={() => window.location.href = '/login'}
             className="px-6 py-3 bg-neo-accent text-neo-bg font-bold tracking-widest hover:brightness-110 transition-all uppercase"
           >
             Try Different Account
           </button>
         </div>
       </div>
    );
  }

  return <>{children}</>;
}
