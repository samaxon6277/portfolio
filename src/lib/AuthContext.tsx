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

    async function getSession() {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error getting session:', error.message);
      }
      
      if (mounted) {
        setUser(session?.user ?? null);
        await updateRole(session?.user);
        setLoading(false);
      }
    }

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setUser(session?.user ?? null);
        await updateRole(session?.user);
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const updateRole = async (currentUser?: User | null) => {
     if (currentUser && currentUser.email) {
       try {
         const { data, error } = await supabase
           .from('profiles')
           .select('role')
           .eq('id', currentUser.id)
           .single();

         let currentRole: UserRole = 'none';

         if (data && !error) {
           currentRole = data.role as UserRole || 'none';
         } else {
            // Fallback for primary admins
            const superAdmins = ['samkhan4562@gmail.com'];
            if (currentUser.email === 'samkhan4562@gmail.com') {
              currentRole = 'super_admin';
            }
         }

         setRole(currentRole);
         // Only true admins (super_admin or editor) should be treated as isAdmin for protected routes
         setIsAdmin(['super_admin', 'editor'].includes(currentRole));
       } catch (error) {
         console.error("Error fetching user role:", error);
         setIsAdmin(false);
         setRole('none');
       }
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
      {!loading && children}
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

