'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { Book, ReadingRecord, generateMockData } from '@/types';
import { useAuth } from './AuthContext';

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
        // 開発環境ではモックデータを使用
        if (process.env.NODE_ENV === 'development') {
          const { books, readingRecords } = generateMockData();
          setBooks(books);
          setReadingRecords(readingRecords);
          console.log('Loaded mock data:', { books, readingRecords });
        } else {
          // 本番環境では実際のデータを取得する処理を実装
          // TODO: Firestore等からデータを取得する
        }
      } catch (error) {
        console.error('Failed to load reading data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadData();
    } else {
      // ユーザーがログアウトした場合はデータをクリア
      setBooks([]);
      setReadingRecords([]);
      setLoading(false);
    }
  }, [user]);

  // 本を追加
  const addBook = async (bookData: Omit<Book, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<Book> => {
    const now = new Date().toISOString();
    const newBook: Book = {
      ...bookData,
      id: `book-${Date.now()}`,
      userId: user?.uid || '1',
      createdAt: now,
      updatedAt: now
    };

    setBooks(prevBooks => [...prevBooks, newBook]);
    return newBook;
  };

  // 本を更新
  const updateBook = async (id: string, bookData: Partial<Book>): Promise<Book> => {
    const bookIndex = books.findIndex(book => book.id === id);
    if (bookIndex === -1) {
      throw new Error(`Book with id ${id} not found`);
    }

    const updatedBook = {
      ...books[bookIndex],
      ...bookData,
      updatedAt: new Date().toISOString()
    };

    const newBooks = [...books];
    newBooks[bookIndex] = updatedBook;
    setBooks(newBooks);

    return updatedBook;
  };

  // 本を削除
  const deleteBook = async (id: string): Promise<void> => {
    setBooks(prevBooks => prevBooks.filter(book => book.id !== id));
    // 関連する読書記録も削除
    setReadingRecords(prevRecords => prevRecords.filter(record => record.bookId !== id));
  };

  // 読書記録を追加
  const addReadingRecord = async (recordData: Omit<ReadingRecord, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<ReadingRecord> => {
    const now = new Date().toISOString();
    const newRecord: ReadingRecord = {
      ...recordData,
      id: `record-${Date.now()}`,
      userId: user?.uid || '1',
      createdAt: now,
      updatedAt: now
    };

    setReadingRecords(prevRecords => [...prevRecords, newRecord]);
    return newRecord;
  };

  // 読書記録を更新
  const updateReadingRecord = async (id: string, recordData: Partial<ReadingRecord>): Promise<ReadingRecord> => {
    const recordIndex = readingRecords.findIndex(record => record.id === id);
    if (recordIndex === -1) {
      throw new Error(`Reading record with id ${id} not found`);
    }

    const updatedRecord = {
      ...readingRecords[recordIndex],
      ...recordData,
      updatedAt: new Date().toISOString()
    };

    const newRecords = [...readingRecords];
    newRecords[recordIndex] = updatedRecord;
    setReadingRecords(newRecords);

    return updatedRecord;
  };

  // 読書記録を削除
  const deleteReadingRecord = async (id: string): Promise<void> => {
    setReadingRecords(prevRecords => prevRecords.filter(record => record.id !== id));
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