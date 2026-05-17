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
         <h1 className="text-4xl font-display text-neo-red mb-4">403 Forbidden</h1>
         <p className="text-neo-text opacity-70 mb-8 max-w-md">You do not have administrative privileges to access this area.</p>
         <Navigate to="/" replace />
       </div>
    );
  }

  return <>{children}</>;
}
