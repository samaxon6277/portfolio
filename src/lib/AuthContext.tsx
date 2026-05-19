import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from './supabase';

export type UserRole = 'super_admin' | 'editor' | 'viewer' | 'none';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithPassword: (email: string, password: string) => Promise<void>;
  signInWithOtp: (email: string) => Promise<void>;
  logOut: () => Promise<void>;
  isAdmin: boolean;
  role: UserRole;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [role, setRole] = useState<UserRole>('none');

  useEffect(() => {
    let mounted = true;

    const getSession = async () => {
      try {
        // Use a 4-second timeout for the initial session fetch
        const { data, error } = await Promise.race([
          supabase.auth.getSession(),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Session timeout')), 4000))
        ]) as any;
        
        const session = data?.session;
        
        if (error) {
          console.error('Error getting session:', error.message);
        }
        
        if (mounted) {
          setUser(session?.user ?? null);
          updateRole(session?.user);
          setLoading(false);
        }
      } catch (err) {
        console.error('Session fetch failed or timed out:', err);
        if (mounted) {
          // If it timed out, we still want to show the app (likely unauthenticated)
          setLoading(false);
        }
      }
    };

    getSession();

    // Fallback: Ensure loading falls off after 5 seconds no matter what
    const fallbackTimer = setTimeout(() => {
      if (mounted && loading) {
        console.warn('Auth loading timeout fallback triggered');
        setLoading(false);
      }
    }, 5000);

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setUser(session?.user ?? null);
        updateRole(session?.user);
      }
    );

    return () => {
      mounted = false;
      clearTimeout(fallbackTimer);
      subscription.unsubscribe();
    };
  }, []);

  const updateRole = (currentUser?: User | null) => {
     if (currentUser && currentUser.email) {
       let currentRole: UserRole = 'none';
       
       // Priority 1: Hardcoded fallback for the owner (immediate)
       if (currentUser.email === 'samkhan4562@gmail.com') {
         currentRole = 'super_admin';
       }

       setRole(currentRole);
       setIsAdmin(['super_admin', 'editor'].includes(currentRole));

       // Priority 2: Check database in background (don't block)
       supabase
         .from('profiles')
         .select('role')
         .eq('id', currentUser.id)
         .maybeSingle()
         .then(({ data, error }) => {
           if (data && !error && data.role) {
             const newRole = data.role as UserRole;
             setRole(newRole);
             setIsAdmin(['super_admin', 'editor'].includes(newRole));
           }
         })
         .catch(err => console.error("Error fetching user role:", err));
     } else {
       setIsAdmin(false);
       setRole('none');
     }
  };

  const signInWithPassword = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  };

  const signInWithOtp = async (email: string) => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin + '/admin',
        shouldCreateUser: false,
      }
    });
    if (error) throw error;
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/admin',
      }
    });
    if (error) throw error;
  };

  const logOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signInWithPassword, signInWithOtp, logOut, isAdmin, role }}>
      {loading ? (
        <div className="min-h-screen bg-[#1E2029] flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-neo-cyan border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

