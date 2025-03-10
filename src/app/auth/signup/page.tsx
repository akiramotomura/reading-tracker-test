'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { FirebaseError } from 'firebase/app';
import Link from 'next/link';

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [familyName, setFamilyName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // バリデーション
    if (!familyName.trim()) {
      setError('家族名を入力してください。');
      return;
    }

    if (!email.trim()) {
      setError('メールアドレスを入力してください。');
      return;
    }

    if (password.length < 6) {
      setError('パスワードは6文字以上で入力してください。');
      return;
    }

    if (password !== confirmPassword) {
      setError('パスワードが一致しません。');
      return;
    }

    setIsLoading(true);

    try {
      console.log('Creating account with:', {
        email,
        familyName,
        passwordLength: password.length
      });

      await signUp(email, password);
      console.log('Account created successfully');
      
      // TODO: 家族情報をデータベースに保存する処理を追加
      router.push('/');
    } catch (err) {
      console.error('Signup error:', err);
      
      if (err instanceof FirebaseError) {
        console.error('Firebase error details:', {
          code: err.code,
          message: err.message,
          stack: err.stack
        });

        switch (err.code) {
          case 'auth/email-already-in-use':
            setError('このメールアドレスは既に使用されています。');
            break;
          case 'auth/invalid-email':
            setError('無効なメールアドレスです。');
            break;
          case 'auth/operation-not-allowed':
            setError('この操作は許可されていません。');
            break;
          case 'auth/weak-password':
            setError('パスワードが弱すぎます。より強力なパスワードを設定してください。');
            break;
          default:
            setError(`アカウントの作成に失敗しました: ${err.message}`);
        }
      } else {
        console.error('Unknown error:', err);
        setError('予期せぬエラーが発生しました。もう一度お試しください。');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-16rem)] flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-2xl shadow-card w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">
          新規登録
        </h1>

        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="familyName"
              className="block text-sm font-medium text-gray-700"
            >
              家族名
            </label>
            <input
              id="familyName"
              type="text"
              required
              value={familyName}
              onChange={(e) => setFamilyName(e.target.value)}
              className="input"
              placeholder="例：山田家"
              autoComplete="family-name"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              メールアドレス
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              placeholder="example@mail.com"
              autoComplete="email"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              パスワード
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              minLength={6}
              placeholder="••••••••"
              autoComplete="new-password"
            />
            <p className="mt-1 text-sm text-gray-500">
              6文字以上で入力してください
            </p>
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700"
            >
              パスワード（確認）
            </label>
            <input
              id="confirmPassword"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="input"
              minLength={6}
              placeholder="••••••••"
              autoComplete="new-password"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary w-full py-2.5"
          >
            {isLoading ? '作成中...' : 'アカウントを作成'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            すでにアカウントをお持ちの方は{' '}
            <Link
              href="/auth/login"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              ログイン
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}