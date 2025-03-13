'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useReading } from '@/contexts/ReadingContext';
import ReadingRecordList from '@/components/reading-records/ReadingRecordList';
import { BookOpenIcon, ClockIcon, StarIcon, BookmarkIcon } from '@heroicons/react/24/outline';

export default function SummaryPage() {
  const { books, readingRecords } = useReading();
  const [year, setYear] = useState(2025);
  
  useEffect(() => {
    // クライアントサイドでのみ実行
    setYear(new Date().getFullYear());
  }, []);

  // 読書記録の統計情報を計算
  const totalBooks = books.length;
  const totalReadingRecords = readingRecords.length;
  
  // 最近30日間の読書記録数
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const recentReadingRecords = readingRecords.filter(
    record => new Date(record.readDate) >= thirtyDaysAgo
  );
  const recentReadingCount = recentReadingRecords.length;

  // 読書頻度（週別）
  const weeklyReadingData: Record<string, number> = {};
  const now = new Date();
  
  // 過去4週間の週ごとの読書記録数を計算
  for (let i = 0; i < 4; i++) {
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - (7 * i + now.getDay()));
    weekStart.setHours(0, 0, 0, 0);
    
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);
    
    const weekLabel = `${weekStart.getMonth() + 1}/${weekStart.getDate()}〜${weekEnd.getMonth() + 1}/${weekEnd.getDate()}`;
    
    const weekRecords = readingRecords.filter(record => {
      const recordDate = new Date(record.readDate);
      return recordDate >= weekStart && recordDate <= weekEnd;
    });
    
    weeklyReadingData[weekLabel] = weekRecords.length;
  }

  // お気に入りの本（評価の平均が高い順）
  const bookRatings: Record<string, { sum: number; count: number }> = {};
  
  readingRecords.forEach(record => {
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
    .slice(0, 3);

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-xl sm:text-2xl font-bold mb-4 text-center">YOMITAI まとめ</h1>
      
      {/* 統計カード */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 flex flex-col items-center">
          <BookOpenIcon className="h-6 w-6 text-primary-500 mb-1" />
          <span className="text-xs sm:text-sm text-gray-500">登録本数</span>
          <span className="text-lg sm:text-xl font-bold">{totalBooks}</span>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 flex flex-col items-center">
          <ClockIcon className="h-6 w-6 text-primary-500 mb-1" />
          <span className="text-xs sm:text-sm text-gray-500">読書記録</span>
          <span className="text-lg sm:text-xl font-bold">{totalReadingRecords}</span>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 flex flex-col items-center">
          <StarIcon className="h-6 w-6 text-primary-500 mb-1" />
          <span className="text-xs sm:text-sm text-gray-500">30日間</span>
          <span className="text-lg sm:text-xl font-bold">{recentReadingCount}</span>
        </div>
      </div>
      
      {/* 週別読書頻度 */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <h2 className="text-base sm:text-lg font-semibold mb-3">週別読書頻度</h2>
        
        <div className="h-40 sm:h-48">
          <div className="flex h-full items-end space-x-2">
            {Object.entries(weeklyReadingData).reverse().map(([week, count]) => {
              const maxCount = Math.max(...Object.values(weeklyReadingData), 1);
              const height = count > 0 ? (count / maxCount) * 100 : 5;
              
              return (
                <div key={week} className="flex flex-col items-center flex-1">
                  <div
                    className="w-full bg-primary-500 rounded-t"
                    style={{ height: `${height}%` }}
                  ></div>
                  <div className="text-xs text-gray-500 mt-1 transform -rotate-45 origin-top-left whitespace-nowrap">
                    {week}
                  </div>
                  <div className="text-xs font-medium mt-3">{count}件</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* お気に入りの本 */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <h2 className="text-base sm:text-lg font-semibold mb-3">お気に入りの本</h2>
        
        {favoriteBooks.length > 0 ? (
          <ul className="space-y-3">
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
                <Link href={`/books/${book?.id}`} className="text-sm sm:text-base text-gray-800 hover:text-primary-600 truncate">
                  {book?.title}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-sm">まだお気に入りの本はありません</p>
        )}
      </div>
      
      {/* 最近の読書記録 */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-base sm:text-lg font-semibold">最近の読書記録</h2>
          <Link href="/reading-records" className="text-xs sm:text-sm text-primary-600 hover:text-primary-800">
            すべて見る
          </Link>
        </div>
        
        <ReadingRecordList limit={3} />
      </div>
      
      {/* クイックアクション */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6">
        <Link
          href="/reading-records/new"
          className="bg-primary-500 text-white rounded-lg p-3 sm:p-4 text-center flex flex-col items-center"
        >
          <BookOpenIcon className="h-6 w-6 mb-1" />
          <span className="text-sm sm:text-base font-medium">読書を記録</span>
        </Link>
        
        <Link
          href="/books/new"
          className="bg-primary-100 text-primary-800 rounded-lg p-3 sm:p-4 text-center flex flex-col items-center"
        >
          <BookmarkIcon className="h-6 w-6 mb-1" />
          <span className="text-sm sm:text-base font-medium">本を追加</span>
        </Link>
      </div>
    </div>
  );
}
