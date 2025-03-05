'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import ReadingRecordList from '@/components/reading-records/ReadingRecordList';

export default function ReadingRecordsPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [view, setView] = useState<'list' | 'calendar'>('list');

  // 認証状態の確認
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-16rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!user) {
    router.push('/auth/login');
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">読書記録</h1>
        <Link
          href="/reading-records/new"
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          新しい記録を追加
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex space-x-4">
            <button
              className={`py-2 px-4 ${
                view === 'list'
                  ? 'border-b-2 border-indigo-600 text-indigo-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setView('list')}
            >
              リスト表示
            </button>
            <button
              className={`py-2 px-4 ${
                view === 'calendar'
                  ? 'border-b-2 border-indigo-600 text-indigo-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setView('calendar')}
            >
              カレンダー表示
            </button>
          </div>
        </div>

        {view === 'list' ? (
          <ReadingRecordList />
        ) : (
          <div className="text-center py-8 text-gray-500">
            カレンダー表示は現在開発中です。
          </div>
        )}
      </div>
    </div>
  );
}