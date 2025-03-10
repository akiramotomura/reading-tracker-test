'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

// 認証が不要なパス
const publicPaths = [
  '/',
  '/auth/login',
  '/auth/signup',
];

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // ローディング中は何もしない
    if (loading) return;

    // 現在のパスが公開パスかどうかをチェック
    const isPublicPath = publicPaths.some(path => 
      pathname === path || pathname.startsWith(`${path}/`)
    );

    // ユーザーがログインしていない場合、かつ公開パスでない場合
    if (!user && !isPublicPath) {
      console.log('Unauthorized access attempt. Redirecting to login page.');
      router.push('/auth/login');
    }
  }, [user, loading, pathname, router]);

  // ローディング中の表示
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  // 認証が必要なページで未ログインの場合は何も表示しない（リダイレクト中）
  if (!user && !publicPaths.some(path => pathname === path || pathname.startsWith(`${path}/`))) {
    return null;
  }

  // それ以外の場合は子コンポーネントを表示
  return <>{children}</>;
};

export default AuthGuard;