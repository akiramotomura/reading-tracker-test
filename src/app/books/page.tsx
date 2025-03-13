'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import BookList from '@/components/books/BookList';

export default function BooksPage() {
  const router = useRouter();
  const { loading } = useAuth();

  // ローディング中の表示
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-16rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-xl sm:text-2xl font-bold">えほん</h1>
        <Link
          href="/books/new"
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          新しい本を追加
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-8">
        <BookList />
      </div>
    </div>
  );
}