'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useReading } from '@/contexts/ReadingContext';
import { Book } from '@/types';
import { EllipsisVerticalIcon, BookOpenIcon } from '@heroicons/react/24/outline';
import { Menu } from '@headlessui/react';

interface BookListProps {
  limit?: number;
}

export default function BookList({ limit }: BookListProps) {
  const { books, deleteBook, getReadingRecordsByBookId } = useReading();
  const [isDeleting, setIsDeleting] = useState(false);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [authorFilter, setAuthorFilter] = useState<string>('');
  const [authors, setAuthors] = useState<string[]>([]);

  // 本をタイトルでソート
  const sortedBooks = [...books].sort((a, b) => a.title.localeCompare(b.title));

  // 著者リストを取得
  useEffect(() => {
    const uniqueAuthors = Array.from(new Set(books.map(book => book.author)))
      .filter(author => author.trim() !== '')
      .sort();
    setAuthors(uniqueAuthors);
  }, [books]);

  // 著者フィルターを適用
  useEffect(() => {
    if (!authorFilter) {
      setFilteredBooks(sortedBooks);
    } else {
      setFilteredBooks(sortedBooks.filter(book => book.author === authorFilter));
    }
  }, [sortedBooks, authorFilter]);

  // 表示件数を制限
  const displayBooks = limit ? filteredBooks.slice(0, limit) : filteredBooks;

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

  if (books.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500 text-sm sm:text-base">
        本はまだ登録されていません
      </div>
    );
  }

  return (
    <div>
      {/* 著者フィルター */}
      {authors.length > 0 && (
        <div className="mb-4">
          <label htmlFor="author-filter" className="block text-sm font-medium text-gray-700 mb-1">
            著者でフィルター
          </label>
          <select
            id="author-filter"
            value={authorFilter}
            onChange={(e) => setAuthorFilter(e.target.value)}
            className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          >
            <option value="">すべての著者</option>
            {authors.map(author => (
              <option key={author} value={author}>{author}</option>
            ))}
          </select>
        </div>
      )}

      {/* 本のグリッド表示 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
        {displayBooks.map((book) => (
          <div
            key={book.id}
            className="bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative"
          >
            <Link href={`/books/${book.id}`} className="block">
              <div className="aspect-[3/4] relative">
                {book.coverImage ? (
                  <img
                    src={book.coverImage}
                    alt={`${book.title}の表紙`}
                    className="w-full h-full object-cover rounded-t-lg"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/150x200?text=No+Image';
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 rounded-t-lg flex flex-col items-center justify-center text-gray-400 p-2">
                    <BookOpenIcon className="h-12 w-12 mb-2" />
                    <div className="text-xs text-center line-clamp-2 px-2">{book.title}</div>
                  </div>
                )}
              </div>
            </Link>

            {/* 3点ドットメニュー */}
            <div className="absolute top-2 right-2">
              <Menu as="div" className="relative inline-block text-left">
                <Menu.Button className="bg-white rounded-full p-1 shadow-sm hover:bg-gray-100">
                  <EllipsisVerticalIcon className="h-5 w-5 text-gray-500" />
                </Menu.Button>
                <Menu.Items className="absolute right-0 mt-1 w-36 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                  <div className="py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          href={`/books/${book.id}/records/new`}
                          className={`${
                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                          } block px-4 py-2 text-xs`}
                        >
                          読書記録を追加
                        </Link>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          href={`/books/${book.id}/edit`}
                          className={`${
                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                          } block px-4 py-2 text-xs`}
                        >
                          編集
                        </Link>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() => handleDelete(book.id)}
                          disabled={isDeleting}
                          className={`${
                            active ? 'bg-red-50 text-red-700' : 'text-red-600'
                          } block w-full text-left px-4 py-2 text-xs disabled:opacity-50`}
                        >
                          削除
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Menu>
            </div>

            {/* 本のタイトル（モバイルでは非表示） */}
            <div className="p-2 hidden sm:block">
              <h3 className="font-medium text-sm line-clamp-1">
                {book.title}
              </h3>
              <p className="text-xs text-gray-600 line-clamp-1">{book.author}</p>
            </div>
          </div>
        ))}
      </div>

      {limit && filteredBooks.length > limit && (
        <div className="text-center mt-4">
          <Link
            href="/books"
            className="text-indigo-600 hover:text-indigo-800 font-medium text-sm sm:text-base px-4 py-2 inline-block"
          >
            すべての本を見る
          </Link>
        </div>
      )}
    </div>
  );
}