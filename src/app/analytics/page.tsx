'use client';

import { useState } from 'react';
import { useReading } from '@/contexts/ReadingContext';

export default function AnalyticsPage() {
  const { books, readingRecords, loading: readingLoading } = useReading();
  
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year' | 'all'>('month');

  // ローディング中の表示
  if (readingLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-16rem)]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
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
    .slice(-7); // モバイル向けに直近7日間のみ表示

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">読書分析</h1>

      <div className="mb-4 sm:mb-6">
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            className={`px-3 py-1.5 text-sm rounded-md ${
              timeRange === 'week'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setTimeRange('week')}
          >
            1週間
          </button>
          <button
            className={`px-3 py-1.5 text-sm rounded-md ${
              timeRange === 'month'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setTimeRange('month')}
          >
            1ヶ月
          </button>
          <button
            className={`px-3 py-1.5 text-sm rounded-md ${
              timeRange === 'year'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setTimeRange('year')}
          >
            1年
          </button>
          <button
            className={`px-3 py-1.5 text-sm rounded-md ${
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-3 sm:mb-4">読書の概要</h2>
          <div className="space-y-3 sm:space-y-4">
            <div>
              <p className="text-sm text-gray-500">読書記録数</p>
              <p className="text-xl sm:text-2xl font-bold">{filteredRecords.length}件</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">読んだ回数</p>
              <p className="text-xl sm:text-2xl font-bold">{totalReadingCount}回</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">読んだ本の数</p>
              <p className="text-xl sm:text-2xl font-bold">{uniqueBookCount}冊</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-3 sm:mb-4">お気に入りの本</h2>
          {favoriteBooks.length > 0 ? (
            <ul className="space-y-2 sm:space-y-3">
              {favoriteBooks.map(({ book, averageRating }) => (
                <li key={book?.id} className="flex items-center">
                  <div className="flex mr-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span
                        key={i}
                        className={`text-base sm:text-lg ${
                          i < Math.round(averageRating) ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-sm sm:text-base text-gray-800 truncate">{book?.title}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm sm:text-base">データがありません</p>
          )}
        </div>
      </div>

      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm mb-6">
        <h2 className="text-lg font-semibold mb-3 sm:mb-4">読書の頻度</h2>
        {sortedFrequency.length > 0 ? (
          <div className="h-48 sm:h-64">
            <div className="flex h-full items-end space-x-1 sm:space-x-2">
              {sortedFrequency.map(([date, count]) => {
                const maxCount = Math.max(...Object.values(readingFrequency));
                const height = (count / maxCount) * 100;
                
                return (
                  <div key={date} className="flex flex-col items-center flex-1">
                    <div
                      className="w-full bg-indigo-500 rounded-t"
                      style={{ height: `${height}%` }}
                    ></div>
                    <div className="text-xs text-gray-500 mt-1 transform -rotate-45 origin-top-left whitespace-nowrap">
                      {new Date(date).toLocaleDateString('ja-JP', {
                        month: 'numeric',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <p className="text-gray-500 text-sm sm:text-base">データがありません</p>
        )}
      </div>

      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm mb-6">
        <h2 className="text-lg font-semibold mb-3 sm:mb-4">読書のヒント</h2>
        <div className="space-y-3">
          <p className="text-sm sm:text-base text-gray-600">
            毎日少しずつ読書する習慣をつけると、子供の言語能力や想像力が育ちます。
          </p>
          <p className="text-sm sm:text-base text-gray-600">
            同じ本を繰り返し読むことで、子供は安心感を得て、言葉や物語をより深く理解できるようになります。
          </p>
          <p className="text-sm sm:text-base text-gray-600">
            読み聞かせの後に「どんなところが面白かった？」と質問すると、子供の理解度や感想を知ることができます。
          </p>
        </div>
      </div>
    </div>
  );
}