'use client';

import { useState, useEffect } from 'react';
import { useReading } from '@/contexts/ReadingContext';
import { Book } from '@/types';

interface BookFormProps {
  bookId?: string;
  onComplete?: () => void;
}

export default function BookForm({ bookId, onComplete }: BookFormProps) {
  const { books, addBook, updateBook } = useReading();
  
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [publisher, setPublisher] = useState('');
  const [publishedYear, setPublishedYear] = useState<number | undefined>();
  const [isbn, setIsbn] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // 編集モードの場合、既存のデータを読み込む
  useEffect(() => {
    if (bookId) {
      const book = books.find(b => b.id === bookId);
      if (book) {
        setTitle(book.title);
        setAuthor(book.author);
        setPublisher(book.publisher || '');
        setPublishedYear(book.publishedYear);
        setIsbn(book.isbn || '');
        setCoverImage(book.coverImage || '');
      }
    }
  }, [bookId, books]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!title.trim()) {
      setError('タイトルを入力してください');
      return;
    }

    if (!author.trim()) {
      setError('著者を入力してください');
      return;
    }

    try {
      setIsLoading(true);
      
      const bookData = {
        title,
        author,
        publisher: publisher || undefined,
        publishedYear,
        isbn: isbn || undefined,
        coverImage: coverImage || undefined
      };

      if (bookId) {
        await updateBook(bookId, bookData);
      } else {
        await addBook(bookData);
      }

      // フォームをリセット
      setTitle('');
      setAuthor('');
      setPublisher('');
      setPublishedYear(undefined);
      setIsbn('');
      setCoverImage('');
      
      if (onComplete) {
        onComplete();
      }
    } catch (err) {
      console.error('Failed to save book:', err);
      setError('本の保存に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">
        {bookId ? '本を編集' : '新しい本を追加'}
      </h2>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-md mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* タイトル */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            タイトル <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isLoading}
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* 著者 */}
        <div>
          <label htmlFor="author" className="block text-sm font-medium text-gray-700">
            著者 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            disabled={isLoading}
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* 出版社 */}
        <div>
          <label htmlFor="publisher" className="block text-sm font-medium text-gray-700">
            出版社
          </label>
          <input
            type="text"
            id="publisher"
            value={publisher}
            onChange={(e) => setPublisher(e.target.value)}
            disabled={isLoading}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* 出版年 */}
        <div>
          <label htmlFor="publishedYear" className="block text-sm font-medium text-gray-700">
            出版年
          </label>
          <input
            type="number"
            id="publishedYear"
            value={publishedYear || ''}
            onChange={(e) => setPublishedYear(e.target.value ? parseInt(e.target.value) : undefined)}
            disabled={isLoading}
            min="1900"
            max={new Date().getFullYear()}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* ISBN */}
        <div>
          <label htmlFor="isbn" className="block text-sm font-medium text-gray-700">
            ISBN
          </label>
          <input
            type="text"
            id="isbn"
            value={isbn}
            onChange={(e) => setIsbn(e.target.value)}
            disabled={isLoading}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* 表紙画像URL */}
        <div>
          <label htmlFor="coverImage" className="block text-sm font-medium text-gray-700">
            表紙画像URL
          </label>
          <input
            type="url"
            id="coverImage"
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
            disabled={isLoading}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          {coverImage && (
            <div className="mt-2">
              <img
                src={coverImage}
                alt={`${title}の表紙`}
                className="h-32 w-auto object-cover rounded border border-gray-300"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/150x200?text=No+Image';
                }}
              />
            </div>
          )}
        </div>

        {/* 送信ボタン */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isLoading ? '保存中...' : bookId ? '更新する' : '追加する'}
          </button>
        </div>
      </form>
    </div>
  );
}