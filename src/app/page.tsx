'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import ReadingRecordList from '@/components/reading-records/ReadingRecordList';
import BookList from '@/components/books/BookList';

export default function Home() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'recent' | 'books'>('recent');
  // 初期値として2025を設定し、クライアントサイドでのみ現在の年に更新
  const [year, setYear] = useState(2025);
  
  useEffect(() => {
    // クライアントサイドでのみ実行
    setYear(new Date().getFullYear());
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <section className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-3 sm:mb-4">
          お子様の読書記録を楽しく管理
        </h1>
        <p className="text-center text-base sm:text-lg text-gray-600 mb-4 sm:mb-6">
          読んだ本の記録、お気に入り度、感想を簡単に記録。読書の習慣づけをサポートします。
        </p>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="card flex flex-col items-center">
          <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center mb-3 text-primary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </div>
          <h2 className="text-lg font-semibold mb-2">読書を記録</h2>
          <p className="text-gray-600 text-center mb-4 text-sm sm:text-base">
            今日読んだ本を記録しましょう
          </p>
          <Link
            href="/reading-records/new"
            className="mt-auto btn btn-primary text-sm sm:text-base"
          >
            記録する
          </Link>
        </div>

        <div className="card flex flex-col items-center">
          <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center mb-3 text-primary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <h2 className="text-lg font-semibold mb-2">本を管理</h2>
          <p className="text-gray-600 text-center mb-4 text-sm sm:text-base">
            お気に入りの本を整理しましょう
          </p>
          <Link
            href="/books/new"
            className="mt-auto btn btn-primary text-sm sm:text-base"
          >
            本を追加
          </Link>
        </div>

        <div className="card flex flex-col items-center">
          <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center mb-3 text-primary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
          <h2 className="text-lg font-semibold mb-2">読書分析</h2>
          <p className="text-gray-600 text-center mb-4 text-sm sm:text-base">
            読書の傾向を確認できます
          </p>
          <Link
            href="/analytics"
            className="mt-auto btn btn-primary text-sm sm:text-base"
          >
            分析を見る
          </Link>
        </div>
      </section>

      <section className="mb-6 sm:mb-8">
        <div className="flex justify-between items-center mb-4">
          <div className="flex space-x-2 sm:space-x-4 border-b border-gray-200 w-full overflow-x-auto pb-1 scrollbar-hide">
            <button
              className={`py-2 px-3 sm:px-4 whitespace-nowrap ${
                activeTab === 'recent'
                  ? 'tab-active'
                  : 'tab'
              }`}
              onClick={() => setActiveTab('recent')}
            >
              最近の記録
            </button>
            <button
              className={`py-2 px-3 sm:px-4 whitespace-nowrap ${
                activeTab === 'books'
                  ? 'tab-active'
                  : 'tab'
              }`}
              onClick={() => setActiveTab('books')}
            >
              本の一覧
            </button>
          </div>
        </div>

        {activeTab === 'recent' ? (
          <>
            <h2 className="text-xl font-semibold mb-3 sm:mb-4">最近の読書記録</h2>
            <ReadingRecordList limit={5} />
          </>
        ) : (
          <>
            <h2 className="text-xl font-semibold mb-3 sm:mb-4">登録されている本</h2>
            <BookList limit={6} />
          </>
        )}
      </section>

      <section className="text-center mb-6 sm:mb-8">
        <p className="text-gray-600 text-sm">
          © {year} 読書記録アプリ - モバイル版
        </p>
      </section>
    </div>
  );
}
