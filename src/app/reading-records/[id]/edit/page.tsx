'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useReading } from '@/contexts/ReadingContext';
import ReadingRecordForm from '@/components/reading-records/ReadingRecordForm';

interface EditReadingRecordPageProps {
  params: {
    id: string;
  };
}

export default function EditReadingRecordPage({ params }: EditReadingRecordPageProps) {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { readingRecords, loading: readingLoading } = useReading();
  const [recordExists, setRecordExists] = useState(false);
  const [bookId, setBookId] = useState<string | null>(null);

  const recordId = params.id;

  useEffect(() => {
    if (!readingLoading) {
      const record = readingRecords.find(r => r.id === recordId);
      if (record) {
        setRecordExists(true);
        setBookId(record.bookId);
      } else {
        // 記録が見つからない場合は読書記録一覧ページにリダイレクト
        router.push('/reading-records');
      }
    }
  }, [recordId, readingRecords, readingLoading, router]);

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

  if (!recordExists) {
    return (
      <div className="text-center py-8 text-gray-500">
        読書記録が見つかりませんでした
      </div>
    );
  }

  const handleComplete = () => {
    if (bookId) {
      router.push(`/books/${bookId}`);
    } else {
      router.push('/reading-records');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link href="/reading-records" className="text-indigo-600 hover:text-indigo-800">
          ← 読書記録一覧に戻る
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-6">読書記録を編集</h1>
      <ReadingRecordForm recordId={recordId} onComplete={handleComplete} />
    </div>
  );
}