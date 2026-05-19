import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../lib/AuthContext";
import { motion } from "motion/react";

export default function LoginPage() {
  const { user, signInWithPassword, logOut, isAdmin, role, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [authInProgress, setAuthInProgress] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const from = location.state?.from?.pathname || "/dashboard";

  useEffect(() => {
    // If the user lands here and is already fully logged in and is admin, redirect immediately
    if (user && !loading) {
      // Check if role is still being determined
      if (role === 'none') return;

      if (isAdmin) {
        navigate(from, { replace: true });
      } else {
        // Enforce admin-only access. If logged in but not admin, sign them out.
        // We add a small delay or check to ensure updateRole in AuthContext has actually finished
        logOut().then(() => {
          setError("Access Denied: Only authorized administrators can log in.");
        });
      }
    }
  }, [user, isAdmin, role, loading, navigate, from, logOut]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter both ID (Email) and Password.");
      return;
    }

    try {
      setAuthInProgress(true);
      setError(null);
      setSuccess(null);
      await signInWithPassword(email, password);
    } catch (err: any) {
      console.error("Login failed", err);
      setError(err.message || "Authentication failed.");
    } finally {
      setAuthInProgress(false);
    }
  };

  if (loading || authInProgress || (user && !isAdmin)) {
    return (
       <div className="min-h-screen bg-neo-bg flex items-center justify-center text-neo-text">
         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-neo-accent"></div>
       </div>
    );
  }

  // If user is logged in but NOT admin, we show loader because useEffect will sign them out
  // The 'Access Denied' screen is replaced by form error message

  return (
    <div className="min-h-screen bg-neo-bg flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-neo-purple/20 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-neo-accent/20 rounded-full blur-3xl" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="max-w-md w-full bg-neo-fg/80 backdrop-blur-xl p-8 rounded-2xl border border-neo-surface shadow-2xl relative z-10"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-neo-accent to-neo-cyan font-bold uppercase mb-2">Samaxon</h1>
          <p className="text-gray-400 text-sm tracking-wide">Administrator Portal</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 text-sm text-center">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          <div>
            <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">Admin ID (Email)</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-neo-bg border border-neo-surface rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neo-accent transition-colors"
              placeholder="admin@samaxon.com"
              required
            />
          </div>
          
          <div>
            <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-neo-bg border border-neo-surface rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neo-accent transition-colors"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-neo-accent hover:bg-neo-accent/80 text-white font-medium py-3 rounded-xl transition-colors mt-4"
          >
            Authenticate
          </button>
        </form>

        <div className="mt-8 text-center">
          <button 
             onClick={() => navigate("/")}
             className="text-sm text-gray-500 hover:text-neo-accent transition-colors"
          >
            &larr; Back to Main Site
          </button>
        </div>
      </motion.div>
    </div>
  );
}
