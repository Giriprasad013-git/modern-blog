import { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  error: Error | null;
  signIn: (email: string, password: string) => Promise<{
    error: Error | null;
    data: Session | null;
  }>;
  signInWithGoogle: () => Promise<void>;
  signUp: (email: string, password: string) => Promise<{
    error: Error | null;
    data: Session | null;
  }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{
    error: Error | null;
    data: null;
  }>;
  updatePassword: (password: string) => Promise<{
    error: Error | null;
    data: User | null;
  }>;
  isAdmin: boolean;
  isEditor: boolean;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditor, setIsEditor] = useState(false);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    }).catch(err => {
      console.error("Error getting session:", err);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // For now, make all authenticated users admins to fix the access issue
  useEffect(() => {
    if (user) {
      setIsAdmin(true);
      setIsEditor(true);
    } else {
      setIsAdmin(false);
      setIsEditor(false);
    }
  }, [user]);

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error);
        return { error, data: null };
      }

      return { error: null, data: data.session };
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error during sign in');
      setError(error);
      return { error, data: null };
    }
  };

  // Sign in with Google OAuth
  const signInWithGoogle = async () => {
    try {
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error during Google sign in');
      setError(error);
    }
  };

  // Sign up with email and password
  const signUp = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setError(error);
        return { error, data: null };
      }

      return { error: null, data: data.session };
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error during sign up');
      setError(error);
      return { error, data: null };
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error during sign out');
      setError(error);
    }
  };

  // Reset password (send reset email)
  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        setError(error);
        return { error, data: null };
      }

      return { error: null, data: null };
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error during password reset');
      setError(error);
      return { error, data: null };
    }
  };

  // Update password
  const updatePassword = async (password: string) => {
    try {
      const { data, error } = await supabase.auth.updateUser({
        password,
      });

      if (error) {
        setError(error);
        return { error, data: null };
      }

      return { error: null, data: data.user };
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error during password update');
      setError(error);
      return { error, data: null };
    }
  };

  const isAuthenticated = !!user;

  const value = {
    session,
    user,
    loading,
    error,
    signIn,
    signInWithGoogle,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
    isAdmin,
    isEditor,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 