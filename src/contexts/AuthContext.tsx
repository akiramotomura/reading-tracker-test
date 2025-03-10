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
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

// デフォルト値を設定
const defaultAuthContext: AuthContextType = {
  user: null,
  loading: true,
  error: null,
  signIn: async () => { throw new Error('Not implemented'); },
  signUp: async () => { throw new Error('Not implemented'); },
  logout: async () => { throw new Error('Not implemented'); }
};

const AuthContext = createContext<AuthContextType>(defaultAuthContext);

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const extendedAuth = auth as ExtendedAuth;

  // クライアントサイドかどうかを確認
  useEffect(() => {
    setIsClient(true);
  }, []);

  // 認証状態の監視
  useEffect(() => {
    if (!isClient) return;

    console.log('AuthProvider: initializing');
    let unsubscribe: (() => void) | undefined;
    
    try {
      unsubscribe = auth.onAuthStateChanged((user) => {
        console.log('Auth state changed:', user?.uid);
        setUser(user);
        setLoading(false);
      }, (error) => {
        console.error('Auth state error:', error);
        setError('認証状態の監視中にエラーが発生しました');
        setLoading(false);
      });
    } catch (error) {
      console.error('Error in auth state listener:', error);
      setError('認証状態の監視の設定中にエラーが発生しました');
      setLoading(false);
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [isClient]);

  const signIn = async (email: string, password: string) => {
    if (!isClient) {
      throw new Error('Cannot sign in on server side');
    }
    
    try {
      setLoading(true);
      setError(null);
      
      if (extendedAuth.signInWithEmailAndPassword) {
        const result = await extendedAuth.signInWithEmailAndPassword(email, password);
        console.log('Sign in successful:', result.user?.uid);
        setUser(result.user);
      } else {
        throw new Error('Authentication method not available');
      }
    } catch (error) {
      console.error('Sign in error:', error);
      setError('ログインに失敗しました。メールアドレスとパスワードを確認してください。');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    if (!isClient) {
      throw new Error('Cannot sign up on server side');
    }
    
    try {
      setLoading(true);
      setError(null);
      
      if (extendedAuth.createUserWithEmailAndPassword) {
        const result = await extendedAuth.createUserWithEmailAndPassword(email, password);
        console.log('Sign up successful:', result.user?.uid);
        setUser(result.user);
      } else {
        throw new Error('Authentication method not available');
      }
    } catch (error) {
      console.error('Sign up error:', error);
      setError('アカウント作成に失敗しました。別のメールアドレスを試してください。');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    if (!isClient) {
      throw new Error('Cannot logout on server side');
    }
    
    try {
      setLoading(true);
      setError(null);
      
      await auth.signOut();
      console.log('Sign out successful');
      setUser(null);
    } catch (error) {
      console.error('Sign out error:', error);
      setError('ログアウトに失敗しました。');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
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