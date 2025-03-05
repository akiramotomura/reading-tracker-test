'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useReading } from '@/contexts/ReadingContext';

export default function AnalyticsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { books, readingRecords, loading: readingLoading } = useReading();
  
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year' | 'all'>('month');

  // 認証状態の確認
  if (authLoading || readingLoading) {
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

  // 期間に基づいて読書記録をフィルタリング
  const filterRecordsByTimeRange = () => {
    const now = new Date();
    let startDate: Date;

    switch (timeRange) {
      case 'week':
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        startDate = new Date(now);
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        // 'all'の場合は全期間
        return readingRecords;
    }

    return readingRecords.filter(record => new Date(record.readDate) >= startDate);
  };

  const filteredRecords = filterRecordsByTimeRange();

  // 読書記録の総数
  const totalReadingCount = filteredRecords.reduce((sum, record) => sum + record.readCount, 0);

  // 読んだ本の数（ユニーク）
  const uniqueBookIds = new Set(filteredRecords.map(record => record.bookId));
  const uniqueBookCount = uniqueBookIds.size;

  // お気に入りの本（評価の平均が高い順）
  const bookRatings: Record<string, { sum: number; count: number }> = {};
  
  filteredRecords.forEach(record => {
    if (!bookRatings[record.bookId]) {
      bookRatings[record.bookId] = { sum: 0, count: 0 };
    }
    bookRatings[record.bookId].sum += record.favoriteRating;
    bookRatings[record.bookId].count += 1;
  });

  const favoriteBooks = Object.entries(bookRatings)
    .map(([bookId, { sum, count }]) => ({
      book: books.find(b => b.id === bookId),
      averageRating: sum / count
    }))
    .filter(item => item.book) // 本が見つからない場合は除外
    .sort((a, b) => b.averageRating - a.averageRating)
    .slice(0, 5);

  // 読書の頻度（日別）
  const readingFrequency: Record<string, number> = {};
  
  filteredRecords.forEach(record => {
    const date = record.readDate.split('T')[0];
    if (!readingFrequency[date]) {
      readingFrequency[date] = 0;
    }
    readingFrequency[date] += record.readCount;
  });

  // 日付でソート
  const sortedFrequency = Object.entries(readingFrequency)
    .sort(([dateA], [dateB]) => new Date(dateA).getTime() - new Date(dateB).getTime())
    .slice(-10); // 直近10日間のみ表示

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">読書分析</h1>

      <div className="mb-6">
        <div className="flex space-x-2 mb-4">
          <button
            className={`px-4 py-2 rounded-md ${
              timeRange === 'week'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setTimeRange('week')}
          >
            1週間
          </button>
          <button
            className={`px-4 py-2 rounded-md ${
              timeRange === 'month'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setTimeRange('month')}
          >
            1ヶ月
          </button>
          <button
            className={`px-4 py-2 rounded-md ${
              timeRange === 'year'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setTimeRange('year')}
          >
            1年
          </button>
          <button
            className={`px-4 py-2 rounded-md ${
              timeRange === 'all'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setTimeRange('all')}
          >
            全期間
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">読書の概要</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">読書記録数</p>
              <p className="text-2xl font-bold">{filteredRecords.length}件</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">読んだ回数</p>
              <p className="text-2xl font-bold">{totalReadingCount}回</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">読んだ本の数</p>
              <p className="text-2xl font-bold">{uniqueBookCount}冊</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">お気に入りの本</h2>
          {favoriteBooks.length > 0 ? (
            <ul className="space-y-3">
              {favoriteBooks.map(({ book, averageRating }) => (
                <li key={book?.id} className="flex items-center">
                  <div className="flex mr-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span
                        key={i}
                        className={`text-lg ${
                          i < Math.round(averageRating) ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-gray-800">{book?.title}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">データがありません</p>
          )}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
        <h2 className="text-lg font-semibold mb-4">読書の頻度</h2>
        {sortedFrequency.length > 0 ? (
          <div className="h-64">
            <div className="flex h-full items-end space-x-2">
              {sortedFrequency.map(([date, count]) => {
                const maxCount = Math.max(...Object.values(readingFrequency));
                const height = (count / maxCount) * 100;
                
                return (
                  <div key={date} className="flex flex-col items-center flex-1">
                    <div
                      className="w-full bg-indigo-500 rounded-t"
                      style={{ height: `${height}%` }}
                    ></div>
                    <div className="text-xs text-gray-500 mt-1 transform -rotate-45 origin-top-left">
                      {new Date(date).toLocaleDateString('ja-JP', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <p className="text-gray-500">データがありません</p>
        )}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
        <h2 className="text-lg font-semibold mb-4">読書目標</h2>
        <p className="text-gray-500 mb-4">
          読書目標を設定して、読書習慣を身につけましょう。
        </p>
        <button
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          onClick={() => router.push('/goals/new')}
        >
          読書目標を設定する
        </button>
      </div>
    </div>
  );
}