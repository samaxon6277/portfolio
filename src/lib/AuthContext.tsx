import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, signInWithGoogle, logOut, db } from './firebase';

export type UserRole = 'super_admin' | 'editor' | 'viewer' | 'none';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<User>;
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
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser && currentUser.email) {
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          let currentRole: UserRole = 'none';

          if (userDoc.exists()) {
            currentRole = userDoc.data().role as UserRole || 'none';
          } else {
             // Fallback for hardcoded admins if no doc exists yet
             const hardcodedAdmins = ['samkhan4562@gmail.com', 'rohanbhai757530@gmail.com'];
             if (hardcodedAdmins.includes(currentUser.email)) {
               currentRole = 'super_admin';
             }
          }

          setRole(currentRole);
          setIsAdmin(['super_admin', 'editor', 'viewer'].includes(currentRole));
        } catch (error) {
          console.error("Error fetching user role:", error);
          setIsAdmin(false);
          setRole('none');
        }
      } else {
        setIsAdmin(false);
        setRole('none');
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, logOut, isAdmin, role }}>
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
