'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { Book, ReadingRecord } from '@/types';
import { useAuth } from './AuthContext';
import { mockDb } from '@/lib/mockDb';

interface ReadingContextType {
  books: Book[];
  readingRecords: ReadingRecord[];
  addBook: (book: Omit<Book, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<Book>;
  updateBook: (id: string, book: Partial<Book>) => Promise<Book>;
  deleteBook: (id: string) => Promise<void>;
  addReadingRecord: (record: Omit<ReadingRecord, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<ReadingRecord>;
  updateReadingRecord: (id: string, record: Partial<ReadingRecord>) => Promise<ReadingRecord>;
  deleteReadingRecord: (id: string) => Promise<void>;
  getBookById: (id: string) => Book | undefined;
  getReadingRecordsByBookId: (bookId: string) => ReadingRecord[];
  loading: boolean;
}

const ReadingContext = createContext<ReadingContextType>({} as ReadingContextType);

export const useReading = () => {
  return useContext(ReadingContext);
};

export const ReadingProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [readingRecords, setReadingRecords] = useState<ReadingRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // 初期データの読み込み
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        if (user) {
          // モックデータベースからデータを取得
          const userBooks = await mockDb.getBooks(user.uid);
          const userRecords = await mockDb.getReadingRecords(user.uid);
          
          setBooks(userBooks);
          setReadingRecords(userRecords);
          console.log('Loaded data from mock database:', { books: userBooks, readingRecords: userRecords });
        }
      } catch (error) {
        console.error('Failed to load reading data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadData();
      
      // データの変更を監視
      const unsubscribeBooks = mockDb.addListener('books', (updatedBooks: Book[]) => {
        const userBooks = updatedBooks.filter(book => book.userId === user.uid);
        setBooks(userBooks);
      });
      
      const unsubscribeRecords = mockDb.addListener('readingRecords', (updatedRecords: ReadingRecord[]) => {
        const userRecords = updatedRecords.filter(record => record.userId === user.uid);
        setReadingRecords(userRecords);
      });
      
      return () => {
        unsubscribeBooks();
        unsubscribeRecords();
      };
    } else {
      // ユーザーがログアウトした場合はデータをクリア
      setBooks([]);
      setReadingRecords([]);
      setLoading(false);
    }
  }, [user]);

  // 本を追加
  const addBook = async (bookData: Omit<Book, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<Book> => {
    return mockDb.addBook(bookData);
  };

  // 本を更新
  const updateBook = async (id: string, bookData: Partial<Book>): Promise<Book> => {
    return mockDb.updateBook(id, bookData);
  };

  // 本を削除
  const deleteBook = async (id: string): Promise<void> => {
    return mockDb.deleteBook(id);
  };

  // 読書記録を追加
  const addReadingRecord = async (recordData: Omit<ReadingRecord, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<ReadingRecord> => {
    return mockDb.addReadingRecord(recordData);
  };

  // 読書記録を更新
  const updateReadingRecord = async (id: string, recordData: Partial<ReadingRecord>): Promise<ReadingRecord> => {
    return mockDb.updateReadingRecord(id, recordData);
  };

  // 読書記録を削除
  const deleteReadingRecord = async (id: string): Promise<void> => {
    return mockDb.deleteReadingRecord(id);
  };

  // IDで本を取得
  const getBookById = (id: string): Book | undefined => {
    return books.find(book => book.id === id);
  };

  // 本IDで読書記録を取得
  const getReadingRecordsByBookId = (bookId: string): ReadingRecord[] => {
    return readingRecords.filter(record => record.bookId === bookId);
  };

  const value = {
    books,
    readingRecords,
    addBook,
    updateBook,
    deleteBook,
    addReadingRecord,
    updateReadingRecord,
    deleteReadingRecord,
    getBookById,
    getReadingRecordsByBookId,
    loading
  };

  return (
    <ReadingContext.Provider value={value}>
      {children}
    </ReadingContext.Provider>
  );
};