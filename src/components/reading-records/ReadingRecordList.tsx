'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useReading } from '@/contexts/ReadingContext';
import { ReadingRecord } from '@/types';

interface ReadingRecordListProps {
  bookId?: string;
  limit?: number;
}

export default function ReadingRecordList({ bookId, limit }: ReadingRecordListProps) {
  const { readingRecords, books, deleteReadingRecord } = useReading();
  const [isDeleting, setIsDeleting] = useState(false);

  // 表示する読書記録をフィルタリング
  const filteredRecords = bookId
    ? readingRecords.filter(record => record.bookId === bookId)
    : readingRecords;

  // 日付の降順でソート
  const sortedRecords = [...filteredRecords].sort(
    (a, b) => new Date(b.readDate).getTime() - new Date(a.readDate).getTime()
  );

  // 表示件数を制限
  const displayRecords = limit ? sortedRecords.slice(0, limit) : sortedRecords;

  // 本のタイトルを取得する関数
  const getBookTitle = (bookId: string) => {
    const book = books.find(b => b.id === bookId);
    return book ? book.title : '不明な本';
  };

  // 日付をフォーマットする関数
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // 読書記録を削除する関数
  const handleDelete = async (id: string) => {
    if (window.confirm('この読書記録を削除してもよろしいですか？')) {
      try {
        setIsDeleting(true);
        await deleteReadingRecord(id);
      } catch (error) {
        console.error('Failed to delete reading record:', error);
        alert('読書記録の削除に失敗しました');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  if (displayRecords.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        {bookId ? 'この本の読書記録はまだありません' : '読書記録はまだありません'}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {displayRecords.map((record) => (
        <div
          key={record.id}
          className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start">
            <div>
              {!bookId && (
                <h3 className="font-medium text-indigo-600">
                  <Link href={`/books/${record.bookId}`} className="hover:underline">
                    {getBookTitle(record.bookId)}
                  </Link>
                </h3>
              )}
              <p className="text-sm text-gray-500">{formatDate(record.readDate)}</p>
            </div>
            <div className="flex space-x-2">
              <Link
                href={`/reading-records/${record.id}/edit`}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                編集
              </Link>
              <button
                onClick={() => handleDelete(record.id)}
                disabled={isDeleting}
                className="text-sm text-red-500 hover:text-red-700 disabled:opacity-50"
              >
                削除
              </button>
            </div>
          </div>

          <div className="mt-2 flex items-center">
            <div className="flex mr-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <span
                  key={i}
                  className={`text-lg ${
                    i < record.favoriteRating ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                >
                  ★
                </span>
              ))}
            </div>
            <span className="text-sm text-gray-600">{record.readCount}回読みました</span>
          </div>

          {record.childReaction && (
            <div className="mt-2">
              <h4 className="text-sm font-medium text-gray-700">子供の反応:</h4>
              <p className="text-sm text-gray-600">{record.childReaction}</p>
            </div>
          )}

          {record.notes && (
            <div className="mt-2">
              <h4 className="text-sm font-medium text-gray-700">メモ:</h4>
              <p className="text-sm text-gray-600">{record.notes}</p>
            </div>
          )}
        </div>
      ))}

      {limit && sortedRecords.length > limit && (
        <div className="text-center mt-4">
          <Link
            href={bookId ? `/books/${bookId}/records` : '/reading-records'}
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            すべての記録を見る
          </Link>
        </div>
      )}
    </div>
  );
}