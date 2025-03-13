'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { Book, ReadingRecord, generateMockData } from '@/types';
import { useAuth } from './AuthContext';
import ErrorBoundary from '@/components/common/ErrorBoundary';

// デバッグモードかどうか
const DEBUG = process.env.DEBUG === 'true';

// ローカルストレージのキー
const STORAGE_KEYS = {
  BOOKS: 'mobile-reading-tracker-books',
  READING_RECORDS: 'mobile-reading-tracker-records',
};

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
  error: string | null;
}

// デフォルト値を設定
const defaultReadingContext: ReadingContextType = {
  books: [],
  readingRecords: [],
  addBook: async () => { throw new Error('Not implemented'); },
  updateBook: async () => { throw new Error('Not implemented'); },
  deleteBook: async () => { throw new Error('Not implemented'); },
  addReadingRecord: async () => { throw new Error('Not implemented'); },
  updateReadingRecord: async () => { throw new Error('Not implemented'); },
  deleteReadingRecord: async () => { throw new Error('Not implemented'); },
  getBookById: () => undefined,
  getReadingRecordsByBookId: () => [],
  loading: true,
  error: null
};

const ReadingContext = createContext<ReadingContextType>(defaultReadingContext);

export const useReading = () => {
  return useContext(ReadingContext);
};

// ローカルストレージのラッパー
const safeLocalStorage = {
  getItem: (key: string): string | null => {
    try {
      if (typeof window === 'undefined') return null;
      return window.localStorage.getItem(key);
    } catch (error) {
      console.error(`Error getting item from localStorage: ${key}`, error);
      return null;
    }
  },
  setItem: (key: string, value: string): boolean => {
    try {
      if (typeof window === 'undefined') return false;
      window.localStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.error(`Error setting item in localStorage: ${key}`, error);
      return false;
    }
  }
};

export const ReadingProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, loading: authLoading } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [readingRecords, setReadingRecords] = useState<ReadingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  // クライアントサイドかどうかを確認
  useEffect(() => {
    setIsClient(true);
  }, []);

  // 初期データの読み込み
  useEffect(() => {
    if (!isClient) return;
    
    const loadData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // ローカルストレージからデータを読み込む
        const booksJson = safeLocalStorage.getItem(STORAGE_KEYS.BOOKS);
        const recordsJson = safeLocalStorage.getItem(STORAGE_KEYS.READING_RECORDS);
        
        let loadedBooks: Book[] = [];
        let loadedRecords: ReadingRecord[] = [];
        
        if (booksJson) {
          loadedBooks = JSON.parse(booksJson);
        }
        
        if (recordsJson) {
          loadedRecords = JSON.parse(recordsJson);
        }
        
        // データがない場合はモックデータを使用
        if (loadedBooks.length === 0 || loadedRecords.length === 0) {
          const { books: mockBooks, readingRecords: mockRecords } = generateMockData();
          
          // モックデータのユーザーIDを現在のユーザーIDに変更
          loadedBooks = mockBooks.map(book => ({
            ...book,
            userId: user?.uid || 'default-user'
          }));
          
          loadedRecords = mockRecords.map(record => ({
            ...record,
            userId: user?.uid || 'default-user'
          }));
          
          // ローカルストレージに保存
          safeLocalStorage.setItem(STORAGE_KEYS.BOOKS, JSON.stringify(loadedBooks));
          safeLocalStorage.setItem(STORAGE_KEYS.READING_RECORDS, JSON.stringify(loadedRecords));
        }
        
        setBooks(loadedBooks);
        setReadingRecords(loadedRecords);
        
        if (DEBUG) {
          console.log('Loaded data from localStorage:', { 
            books: loadedBooks.length, 
            readingRecords: loadedRecords.length 
          });
        }
      } catch (error) {
        console.error('Failed to load reading data:', error);
        setError('データの読み込みに失敗しました。再読み込みしてください。');
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [isClient, user]);

  // データをローカルストレージに保存する関数
  const saveToLocalStorage = () => {
    if (!isClient) return;
    
    try {
      safeLocalStorage.setItem(STORAGE_KEYS.BOOKS, JSON.stringify(books));
      safeLocalStorage.setItem(STORAGE_KEYS.READING_RECORDS, JSON.stringify(readingRecords));
      
      if (DEBUG) {
        console.log('Data saved to localStorage');
      }
    } catch (error) {
      console.error('Failed to save data to localStorage:', error);
    }
  };

  // 本を追加
  const addBook = async (bookData: Omit<Book, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<Book> => {
    if (!isClient) {
      throw new Error('Cannot add book on server side');
    }
    
    setError(null);
    try {
      const now = new Date().toISOString();
      const newBook: Book = {
        ...bookData,
        id: `book-${Date.now()}`,
        userId: user?.uid || 'default-user',
        createdAt: now,
        updatedAt: now
      };
      
      const updatedBooks = [...books, newBook];
      setBooks(updatedBooks);
      
      // ローカルストレージに保存
      safeLocalStorage.setItem(STORAGE_KEYS.BOOKS, JSON.stringify(updatedBooks));
      
      return newBook;
    } catch (error) {
      console.error('Failed to add book:', error);
      setError('本の追加に失敗しました。');
      throw error;
    }
  };

  // 本を更新
  const updateBook = async (id: string, bookData: Partial<Book>): Promise<Book> => {
    if (!isClient) {
      throw new Error('Cannot update book on server side');
    }
    
    setError(null);
    try {
      const bookIndex = books.findIndex(book => book.id === id);
      if (bookIndex === -1) {
        throw new Error(`Book with id ${id} not found`);
      }
      
      const updatedBook = {
        ...books[bookIndex],
        ...bookData,
        updatedAt: new Date().toISOString()
      };
      
      const updatedBooks = [...books];
      updatedBooks[bookIndex] = updatedBook;
      setBooks(updatedBooks);
      
      // ローカルストレージに保存
      safeLocalStorage.setItem(STORAGE_KEYS.BOOKS, JSON.stringify(updatedBooks));
      
      return updatedBook;
    } catch (error) {
      console.error('Failed to update book:', error);
      setError('本の更新に失敗しました。');
      throw error;
    }
  };

  // 本を削除
  const deleteBook = async (id: string): Promise<void> => {
    if (!isClient) {
      throw new Error('Cannot delete book on server side');
    }
    
    setError(null);
    try {
      const updatedBooks = books.filter(book => book.id !== id);
      setBooks(updatedBooks);
      
      // 関連する読書記録も削除
      const updatedRecords = readingRecords.filter(record => record.bookId !== id);
      setReadingRecords(updatedRecords);
      
      // ローカルストレージに保存
      safeLocalStorage.setItem(STORAGE_KEYS.BOOKS, JSON.stringify(updatedBooks));
      safeLocalStorage.setItem(STORAGE_KEYS.READING_RECORDS, JSON.stringify(updatedRecords));
    } catch (error) {
      console.error('Failed to delete book:', error);
      setError('本の削除に失敗しました。');
      throw error;
    }
  };

  // 読書記録を追加
  const addReadingRecord = async (recordData: Omit<ReadingRecord, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<ReadingRecord> => {
    if (!isClient) {
      throw new Error('Cannot add reading record on server side');
    }
    
    setError(null);
    try {
      const now = new Date().toISOString();
      const newRecord: ReadingRecord = {
        ...recordData,
        id: `record-${Date.now()}`,
        userId: user?.uid || 'default-user',
        createdAt: now,
        updatedAt: now
      };
      
      const updatedRecords = [...readingRecords, newRecord];
      setReadingRecords(updatedRecords);
      
      // ローカルストレージに保存
      safeLocalStorage.setItem(STORAGE_KEYS.READING_RECORDS, JSON.stringify(updatedRecords));
      
      return newRecord;
    } catch (error) {
      console.error('Failed to add reading record:', error);
      setError('読書記録の追加に失敗しました。');
      throw error;
    }
  };

  // 読書記録を更新
  const updateReadingRecord = async (id: string, recordData: Partial<ReadingRecord>): Promise<ReadingRecord> => {
    if (!isClient) {
      throw new Error('Cannot update reading record on server side');
    }
    
    setError(null);
    try {
      const recordIndex = readingRecords.findIndex(record => record.id === id);
      if (recordIndex === -1) {
        throw new Error(`Reading record with id ${id} not found`);
      }
      
      const updatedRecord = {
        ...readingRecords[recordIndex],
        ...recordData,
        updatedAt: new Date().toISOString()
      };
      
      const updatedRecords = [...readingRecords];
      updatedRecords[recordIndex] = updatedRecord;
      setReadingRecords(updatedRecords);
      
      // ローカルストレージに保存
      safeLocalStorage.setItem(STORAGE_KEYS.READING_RECORDS, JSON.stringify(updatedRecords));
      
      return updatedRecord;
    } catch (error) {
      console.error('Failed to update reading record:', error);
      setError('読書記録の更新に失敗しました。');
      throw error;
    }
  };

  // 読書記録を削除
  const deleteReadingRecord = async (id: string): Promise<void> => {
    if (!isClient) {
      throw new Error('Cannot delete reading record on server side');
    }
    
    setError(null);
    try {
      const updatedRecords = readingRecords.filter(record => record.id !== id);
      setReadingRecords(updatedRecords);
      
      // ローカルストレージに保存
      safeLocalStorage.setItem(STORAGE_KEYS.READING_RECORDS, JSON.stringify(updatedRecords));
    } catch (error) {
      console.error('Failed to delete reading record:', error);
      setError('読書記録の削除に失敗しました。');
      throw error;
    }
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
    loading: loading || authLoading,
    error
  };

  // ローディング中のフォールバックUI
  if (isClient && (loading || authLoading)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">データを読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <ReadingContext.Provider value={value}>
        {children}
      </ReadingContext.Provider>
    </ErrorBoundary>
  );
};