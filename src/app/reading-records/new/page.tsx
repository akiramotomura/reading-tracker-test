'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import ReadingRecordForm from '@/components/reading-records/ReadingRecordForm';

export default function NewReadingRecordPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  // 認証状態の確認
  if (loading) {
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

  const handleComplete = () => {
    router.push('/reading-records');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">新しい読書記録</h1>
      <ReadingRecordForm onComplete={handleComplete} />
    </div>
  );
}