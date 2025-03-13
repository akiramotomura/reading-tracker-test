'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { loading } = useAuth();

  // ローディング中の表示
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-sm">読み込み中...</p>
        </div>
      </div>
    );
  }

  // モバイル版では認証不要なので、常に子コンポーネントを表示
  return <>{children}</>;
};

export default AuthGuard;