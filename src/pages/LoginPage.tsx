import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../lib/AuthContext";
import { motion } from "motion/react";

export default function LoginPage() {
  const { user, signInWithGoogle, signInWithPassword, signInWithOtp, logOut, isAdmin, role, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [authInProgress, setAuthInProgress] = useState(false);
  const [mode, setMode] = useState<'password' | 'otp' | 'google'>('password');

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

  const handleGoogleLogin = async () => {
    try {
      setAuthInProgress(true);
      setError(null);
      await signInWithGoogle();
    } catch (err: any) {
      console.error("Login failed", err);
      setError(err.message || "Failed to log in with Google.");
      setAuthInProgress(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    try {
      setAuthInProgress(true);
      setError(null);
      setSuccess(null);

      if (mode === 'password') {
        await signInWithPassword(email, password);
      } else if (mode === 'otp') {
        await signInWithOtp(email);
        setSuccess("Check your email for the magic link!");
      }
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

        <div className="flex gap-2 mb-6 bg-neo-surface/50 p-1 rounded-xl">
          <button 
            onClick={() => setMode('password')}
            className={`flex-1 py-2 text-sm rounded-lg transition-colors ${mode === 'password' ? 'bg-neo-surface text-white' : 'text-gray-400 hover:text-white'}`}
          >
            Password
          </button>
          <button 
            onClick={() => setMode('otp')}
            className={`flex-1 py-2 text-sm rounded-lg transition-colors ${mode === 'otp' ? 'bg-neo-surface text-white' : 'text-gray-400 hover:text-white'}`}
          >
            Magic Link
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          <div>
            <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-neo-bg border border-neo-surface rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neo-accent transition-colors"
              placeholder="admin@example.com"
              required
            />
          </div>
          
          {mode === 'password' && (
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
          )}

          <button
            type="submit"
            className="w-full bg-neo-accent hover:bg-neo-accent/80 text-white font-medium py-3 rounded-xl transition-colors"
          >
            {mode === 'password' ? 'Sign In' : 'Send Magic Link'}
          </button>
        </form>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-neo-surface"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-neo-fg text-gray-500">Or</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full relative group overflow-hidden bg-neo-surface text-white hover:text-white font-medium py-3 px-6 rounded-xl transition-all duration-300 border border-neo-surface hover:border-gray-500 flex items-center justify-center gap-3"
        >
          <svg className="w-5 h-5 relative z-10" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          <span className="relative z-10 text-sm">Continue with Google</span>
        </button>

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
