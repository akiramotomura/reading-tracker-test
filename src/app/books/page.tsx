'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useReading } from '@/contexts/ReadingContext';
import BookList from '@/components/books/BookList';
import { Dialog } from '@headlessui/react';
import { XMarkIcon, PlusIcon } from '@heroicons/react/24/outline';

export default function BooksPage() {
  const router = useRouter();
  const { loading } = useAuth();
  const { addBook } = useReading();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    publisher: '',
    publishedYear: '',
    coverImage: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ローディング中の表示
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-16rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  // 入力フィールドの変更を処理
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewBook(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 新しい本を追加
  const handleAddBook = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newBook.title || !newBook.author) {
      alert('タイトルと著者は必須です');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // 年を数値に変換
      const publishedYear = newBook.publishedYear ? parseInt(newBook.publishedYear) : undefined;
      
      await addBook({
        title: newBook.title,
        author: newBook.author,
        publisher: newBook.publisher || undefined,
        publishedYear: publishedYear,
        coverImage: newBook.coverImage || undefined
      });
      
      // モーダルを閉じて入力をリセット
      setIsModalOpen(false);
      setNewBook({
        title: '',
        author: '',
        publisher: '',
        publishedYear: '',
        coverImage: ''
      });
      
    } catch (error) {
      console.error('Failed to add book:', error);
      alert('本の追加に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-xl sm:text-2xl font-bold">えほん</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
        >
          <PlusIcon className="h-5 w-5 mr-1" />
          <span>新しい本を追加</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-8">
        <BookList />
      </div>

      {/* 新しい本を追加するモーダル */}
      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <Dialog.Title className="text-lg font-medium">
                新しい本を追加
              </Dialog.Title>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleAddBook}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    タイトル <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={newBook.title}
                    onChange={handleInputChange}
                    required
                    className="block w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
                    著者 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="author"
                    name="author"
                    value={newBook.author}
                    onChange={handleInputChange}
                    required
                    className="block w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="publisher" className="block text-sm font-medium text-gray-700 mb-1">
                    出版社
                  </label>
                  <input
                    type="text"
                    id="publisher"
                    name="publisher"
                    value={newBook.publisher}
                    onChange={handleInputChange}
                    className="block w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="publishedYear" className="block text-sm font-medium text-gray-700 mb-1">
                    出版年
                  </label>
                  <input
                    type="number"
                    id="publishedYear"
                    name="publishedYear"
                    value={newBook.publishedYear}
                    onChange={handleInputChange}
                    min="1900"
                    max={new Date().getFullYear()}
                    className="block w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="coverImage" className="block text-sm font-medium text-gray-700 mb-1">
                    表紙画像URL
                  </label>
                  <input
                    type="url"
                    id="coverImage"
                    name="coverImage"
                    value={newBook.coverImage}
                    onChange={handleInputChange}
                    className="block w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50"
                >
                  {isSubmitting ? '追加中...' : '追加する'}
                </button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}