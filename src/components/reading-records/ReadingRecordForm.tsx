'use client';

import { useState, useEffect } from 'react';
import { useReading } from '@/contexts/ReadingContext';
// 未使用の型インポートを削除

interface ReadingRecordFormProps {
  bookId?: string;
  recordId?: string;
  onComplete?: () => void;
}

export default function ReadingRecordForm({ bookId, recordId, onComplete }: ReadingRecordFormProps) {
  const { books, readingRecords, addReadingRecord, updateReadingRecord, getBookById } = useReading();
  
  const [selectedBookId, setSelectedBookId] = useState(bookId || '');
  // 初期値として固定の日付文字列を使用
  const [readDate, setReadDate] = useState('2025-01-01');
  const [readCount, setReadCount] = useState(1);
  const [favoriteRating, setFavoriteRating] = useState(3);
  const [childReaction, setChildReaction] = useState('');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // クライアントサイドでのみ日付を設定
  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    setReadDate(`${year}-${month}-${day}`);
  }, []);

  // 編集モードの場合、既存のデータを読み込む
  useEffect(() => {
    if (recordId) {
      const record = readingRecords.find(r => r.id === recordId);
      if (record) {
        setSelectedBookId(record.bookId);
        setReadDate(record.readDate.split('T')[0]);
        setReadCount(record.readCount);
        setFavoriteRating(record.favoriteRating);
        setChildReaction(record.childReaction);
        setNotes(record.notes);
      }
    }
  }, [recordId, readingRecords]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!selectedBookId) {
      setError('本を選択してください');
      return;
    }

    try {
      setIsLoading(true);
      
      const recordData = {
        bookId: selectedBookId,
        readDate: new Date(readDate).toISOString(),
        readCount,
        favoriteRating,
        childReaction,
        notes
      };

      if (recordId) {
        await updateReadingRecord(recordId, recordData);
      } else {
        await addReadingRecord(recordData);
      }

      // フォームをリセット
      if (!bookId) {
        setSelectedBookId('');
      }
      
      // クライアントサイドで現在の日付を取得して設定
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      setReadDate(`${year}-${month}-${day}`);
      
      setReadCount(1);
      setFavoriteRating(3);
      setChildReaction('');
      setNotes('');
      
      if (onComplete) {
        onComplete();
      }
    } catch (err) {
      console.error('Failed to save reading record:', err);
      setError('読書記録の保存に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  // 未使用の変数を削除

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">
        {recordId ? '読書記録を編集' : '新しい読書記録'}
      </h2>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-md mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 本の選択 */}
        <div>
          <label htmlFor="book" className="block text-sm font-medium text-gray-700">
            本
          </label>
          <select
            id="book"
            value={selectedBookId}
            onChange={(e) => setSelectedBookId(e.target.value)}
            disabled={!!bookId || isLoading}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="">本を選択してください</option>
            {books.map((book) => (
              <option key={book.id} value={book.id}>
                {book.title} ({book.author})
              </option>
            ))}
          </select>
        </div>

        {/* 読んだ日付 */}
        <div>
          <label htmlFor="readDate" className="block text-sm font-medium text-gray-700">
            読んだ日
          </label>
          <input
            type="date"
            id="readDate"
            value={readDate}
            onChange={(e) => setReadDate(e.target.value)}
            disabled={isLoading}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* 読んだ回数 */}
        <div>
          <label htmlFor="readCount" className="block text-sm font-medium text-gray-700">
            読んだ回数
          </label>
          <input
            type="number"
            id="readCount"
            min="1"
            value={readCount}
            onChange={(e) => setReadCount(parseInt(e.target.value))}
            disabled={isLoading}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* お気に入り度 */}
        <div>
          <label htmlFor="favoriteRating" className="block text-sm font-medium text-gray-700">
            お気に入り度
          </label>
          <div className="flex items-center space-x-2 mt-1">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                type="button"
                onClick={() => setFavoriteRating(rating)}
                disabled={isLoading}
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  favoriteRating >= rating
                    ? 'bg-yellow-400 text-yellow-800'
                    : 'bg-gray-200 text-gray-400'
                }`}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        {/* 子供の反応 */}
        <div>
          <label htmlFor="childReaction" className="block text-sm font-medium text-gray-700">
            子供の反応
          </label>
          <textarea
            id="childReaction"
            value={childReaction}
            onChange={(e) => setChildReaction(e.target.value)}
            disabled={isLoading}
            rows={3}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            placeholder="子供の反応や様子を記録しましょう"
          />
        </div>

        {/* メモ */}
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
            メモ
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            disabled={isLoading}
            rows={3}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            placeholder="その他のメモや感想を記録しましょう"
          />
        </div>

        {/* 送信ボタン */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isLoading ? '保存中...' : recordId ? '更新する' : '記録する'}
          </button>
        </div>
      </form>
    </div>
  );
}