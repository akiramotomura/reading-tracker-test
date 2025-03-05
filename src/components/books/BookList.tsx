'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useReading } from '@/contexts/ReadingContext';
import { Book } from '@/types';

interface BookListProps {
  limit?: number;
}

export default function BookList({ limit }: BookListProps) {
  const { books, deleteBook, getReadingRecordsByBookId } = useReading();
  const [isDeleting, setIsDeleting] = useState(false);

  // 本をタイトルでソート
  const sortedBooks = [...books].sort((a, b) => a.title.localeCompare(b.title));

  // 表示件数を制限
  const displayBooks = limit ? sortedBooks.slice(0, limit) : sortedBooks;

  // 本を削除する関数
  const handleDelete = async (id: string) => {
    // 関連する読書記録があるか確認
    const relatedRecords = getReadingRecordsByBookId(id);
    
    if (relatedRecords.length > 0) {
      const confirmDelete = window.confirm(
        `この本には${relatedRecords.length}件の読書記録があります。本を削除すると、関連する読書記録もすべて削除されます。削除してもよろしいですか？`
      );
      if (!confirmDelete) return;
    } else {
      const confirmDelete = window.confirm('この本を削除してもよろしいですか？');
      if (!confirmDelete) return;
    }

    try {
      setIsDeleting(true);
      await deleteBook(id);
    } catch (error) {
      console.error('Failed to delete book:', error);
      alert('本の削除に失敗しました');
    } finally {
      setIsDeleting(false);
    }
  };

  if (displayBooks.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        本はまだ登録されていません
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {displayBooks.map((book) => (
        <div
          key={book.id}
          className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
        >
          <div className="flex">
            <div className="flex-shrink-0 w-24 h-32 mr-4">
              {book.coverImage ? (
                <img
                  src={book.coverImage}
                  alt={`${book.title}の表紙`}
                  className="w-full h-full object-cover rounded"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/150x200?text=No+Image';
                  }}
                />
              ) : (
                <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center text-gray-400">
                  No Image
                </div>
              )}
            </div>
            <div className="flex-grow">
              <h3 className="font-medium text-lg">
                <Link href={`/books/${book.id}`} className="hover:text-indigo-600">
                  {book.title}
                </Link>
              </h3>
              <p className="text-sm text-gray-600">{book.author}</p>
              {book.publisher && (
                <p className="text-xs text-gray-500">
                  {book.publisher}
                  {book.publishedYear && ` (${book.publishedYear})`}
                </p>
              )}
              
              <div className="mt-2 flex items-center text-sm text-gray-500">
                <span>
                  読書記録: {getReadingRecordsByBookId(book.id).length}件
                </span>
              </div>
              
              <div className="mt-3 flex space-x-2">
                <Link
                  href={`/books/${book.id}/records/new`}
                  className="text-xs text-indigo-600 hover:text-indigo-800"
                >
                  記録を追加
                </Link>
                <Link
                  href={`/books/${book.id}/edit`}
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  編集
                </Link>
                <button
                  onClick={() => handleDelete(book.id)}
                  disabled={isDeleting}
                  className="text-xs text-red-500 hover:text-red-700 disabled:opacity-50"
                >
                  削除
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {limit && sortedBooks.length > limit && (
        <div className="col-span-full text-center mt-4">
          <Link
            href="/books"
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            すべての本を見る
          </Link>
        </div>
      )}
    </div>
  );
}