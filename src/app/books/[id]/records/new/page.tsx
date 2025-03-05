'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useReading } from '@/contexts/ReadingContext';
import ReadingRecordForm from '@/components/reading-records/ReadingRecordForm';

interface NewBookRecordPageProps {
  params: {
    id: string;
  };
}

export default function NewBookRecordPage({ params }: NewBookRecordPageProps) {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { getBookById, loading: readingLoading } = useReading();
  const [bookExists, setBookExists] = useState(false);

  const bookId = params.id;

  useEffect(() => {
    if (!readingLoading) {
      const book = getBookById(bookId);
      if (book) {
        setBookExists(true);
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

  if (!bookExists) {
    return (
      <div className="text-center py-8 text-gray-500">
        本が見つかりませんでした
      </div>
    );
  }

  const handleComplete = () => {
    router.push(`/books/${bookId}`);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link href={`/books/${bookId}`} className="text-indigo-600 hover:text-indigo-800">
          ← 本の詳細に戻る
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-6">読書記録を追加</h1>
      <ReadingRecordForm bookId={bookId} onComplete={handleComplete} />
    </div>
  );
}