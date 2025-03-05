'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useReading } from '@/contexts/ReadingContext';
import ReadingRecordList from '@/components/reading-records/ReadingRecordList';
import { Book } from '@/types';

interface BookDetailPageProps {
  params: {
    id: string;
  };
}

export default function BookDetailPage({ params }: BookDetailPageProps) {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { getBookById, getReadingRecordsByBookId, loading: readingLoading } = useReading();
  const [book, setBook] = useState<Book | null>(null);

  const bookId = params.id;

  useEffect(() => {
    if (!readingLoading) {
      const foundBook = getBookById(bookId);
      if (foundBook) {
        setBook(foundBook);
      } else {
        // 本が見つからない場合は本の一覧ページにリダイレクト
        router.push('/books');
      }
    }
  }, [bookId, getBookById, readingLoading, router]);

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

  if (!book) {
    return (
      <div className="text-center py-8 text-gray-500">
        本が見つかりませんでした
      </div>
    );
  }

  const readingRecords = getReadingRecordsByBookId(bookId);
  const totalReadCount = readingRecords.reduce((sum, record) => sum + record.readCount, 0);
  const averageRating = readingRecords.length > 0
    ? readingRecords.reduce((sum, record) => sum + record.favoriteRating, 0) / readingRecords.length
    : 0;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link href="/books" className="text-indigo-600 hover:text-indigo-800">
          ← 本の一覧に戻る
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/3 mb-4 md:mb-0 md:mr-6">
            {book.coverImage ? (
              <img
                src={book.coverImage}
                alt={`${book.title}の表紙`}
                className="w-full h-auto object-cover rounded"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/300x400?text=No+Image';
                }}
              />
            ) : (
              <div className="w-full h-64 bg-gray-200 rounded flex items-center justify-center text-gray-400">
                No Image
              </div>
            )}
          </div>
          <div className="md:w-2/3">
            <h1 className="text-2xl font-bold mb-2">{book.title}</h1>
            <p className="text-gray-600 mb-4">{book.author}</p>
            
            {book.publisher && (
              <p className="text-sm text-gray-500 mb-2">
                出版社: {book.publisher}
                {book.publishedYear && ` (${book.publishedYear})`}
              </p>
            )}
            
            {book.isbn && (
              <p className="text-sm text-gray-500 mb-4">
                ISBN: {book.isbn}
              </p>
            )}

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-indigo-50 p-4 rounded">
                <p className="text-sm text-gray-600">読んだ回数</p>
                <p className="text-2xl font-bold text-indigo-600">{totalReadCount}回</p>
              </div>
              <div className="bg-indigo-50 p-4 rounded">
                <p className="text-sm text-gray-600">平均評価</p>
                <div className="flex items-center">
                  <p className="text-2xl font-bold text-indigo-600 mr-2">
                    {averageRating.toFixed(1)}
                  </p>
                  <div className="flex">
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
                </div>
              </div>
            </div>

            <div className="flex space-x-4">
              <Link
                href={`/books/${bookId}/records/new`}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                読書記録を追加
              </Link>
              <Link
                href={`/books/${bookId}/edit`}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                編集
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">読書記録</h2>
        <ReadingRecordList bookId={bookId} />
      </div>
    </div>
  );
}