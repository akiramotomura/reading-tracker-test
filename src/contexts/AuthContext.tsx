'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User, Auth } from 'firebase/auth';
import { auth } from '../lib/firebase';

// モック認証用の拡張インターフェース
interface ExtendedAuth extends Auth {
  signInWithEmailAndPassword?: (email: string, password: string) => Promise<{ user: User }>;
  createUserWithEmailAndPassword?: (email: string, password: string) => Promise<{ user: User }>;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const extendedAuth = auth as ExtendedAuth;

  useEffect(() => {
    console.log('AuthProvider: initializing');
    try {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        console.log('Auth state changed:', user);
        setUser(user);
        setLoading(false);
      });

      return unsubscribe;
    } catch (error) {
      console.error('Error in auth state listener:', error);
      setLoading(false);
      return () => {};
    }
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      if (extendedAuth.signInWithEmailAndPassword) {
        const result = await extendedAuth.signInWithEmailAndPassword(email, password);
        console.log('Sign in successful:', result.user);
        setUser(result.user);
      } else {
        throw new Error('Authentication method not available');
      }
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      setLoading(true);
      if (extendedAuth.createUserWithEmailAndPassword) {
        const result = await extendedAuth.createUserWithEmailAndPassword(email, password);
        console.log('Sign up successful:', result.user);
        setUser(result.user);
      } else {
        throw new Error('Authentication method not available');
      }
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await auth.signOut();
      console.log('Sign out successful');
      setUser(null);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};