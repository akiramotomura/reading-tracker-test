'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import ErrorBoundary from '@/components/common/ErrorBoundary';

// デバッグモードかどうか
const DEBUG = process.env.DEBUG === 'true';

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

// モバイル版では認証不要のため、デフォルトユーザーを作成
const createDefaultUser = (): User => {
  return {
    uid: 'default-user',
    email: 'guest@example.com',
    emailVerified: true,
    displayName: 'ゲストユーザー',
    isAnonymous: false,
    providerData: [],
    providerId: 'password',
    metadata: {
      creationTime: new Date().toISOString(),
      lastSignInTime: new Date().toISOString()
    },
    phoneNumber: null,
    photoURL: null,
    refreshToken: '',
    tenantId: null,
    delete: async () => {},
    getIdToken: async () => 'mock-token',
    getIdTokenResult: async () => ({ 
      token: 'mock-token', 
      claims: {}, 
      issuedAtTime: '', 
      expirationTime: '', 
      authTime: '', 
      signInProvider: null, 
      signInSecondFactor: null 
    }),
    reload: async () => {},
    toJSON: () => ({ uid: 'default-user', email: 'guest@example.com' })
  } as User;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  // クライアントサイドかどうかを確認
  useEffect(() => {
    setIsClient(true);
  }, []);

  // 認証状態の初期化
  useEffect(() => {
    if (!isClient) return;

    // モバイル版では常にデフォルトユーザーを使用
    const defaultUser = createDefaultUser();
    setUser(defaultUser);
    setLoading(false);
    
    if (DEBUG) {
      console.log('AuthProvider: Using default user for mobile version');
    }
  }, [isClient]);

  // 認証関連の関数（モバイル版では実際には何もしない）
  const signIn = async (email: string, password: string) => {
    if (!isClient) {
      throw new Error('Cannot sign in on server side');
    }
    
    // モバイル版では常にデフォルトユーザーを使用
    setUser(createDefaultUser());
    setLoading(false);
    setError(null);
  };

  const signUp = async (email: string, password: string) => {
    if (!isClient) {
      throw new Error('Cannot sign up on server side');
    }
    
    // モバイル版では常にデフォルトユーザーを使用
    setUser(createDefaultUser());
    setLoading(false);
    setError(null);
  };

  const logout = async () => {
    if (!isClient) {
      throw new Error('Cannot logout on server side');
    }
    
    // モバイル版ではログアウトしても同じユーザーを使用
    setUser(createDefaultUser());
    setLoading(false);
    setError(null);
  };

  const value = {
    user,
    loading,
    error,
    signIn,
    signUp,
    logout
  };

  // ローディング中のフォールバックUI
  if (isClient && loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <AuthContext.Provider value={value}>
        {children}
      </AuthContext.Provider>
    </ErrorBoundary>
  );
};