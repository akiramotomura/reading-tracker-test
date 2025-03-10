'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { Book, ReadingRecord } from '@/types';
import { useAuth } from './AuthContext';
import { mockDb } from '@/lib/mockDb';
import ErrorBoundary from '@/components/common/ErrorBoundary';

// デバッグモードかどうか
const DEBUG = process.env.DEBUG === 'true';

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

export const ReadingProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, loading: authLoading } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [readingRecords, setReadingRecords] = useState<ReadingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [dataInitialized, setDataInitialized] = useState(false);

  // クライアントサイドかどうかを確認
  useEffect(() => {
    setIsClient(true);
  }, []);

  // 初期データの読み込み
  useEffect(() => {
    if (!isClient || authLoading) return;
    
    let isMounted = true;
    let unsubscribeBooks: (() => void) | undefined;
    let unsubscribeRecords: (() => void) | undefined;
    
    const loadData = async () => {
      if (!isMounted) return;
      
      setLoading(true);
      setError(null);
      
      try {
        if (user) {
          if (DEBUG) {
            console.log('ReadingProvider: Loading data for user:', user.uid);
          }
          
          // モックデータベースからデータを取得
          const userBooks = await mockDb.getBooks(user.uid);
          if (!isMounted) return;
          
          const userRecords = await mockDb.getReadingRecords(user.uid);
          if (!isMounted) return;
          
          setBooks(userBooks);
          setReadingRecords(userRecords);
          
          if (DEBUG) {
            console.log('Loaded data from mock database:', { 
              books: userBooks.length, 
              readingRecords: userRecords.length 
            });
          }
          
          setDataInitialized(true);
        } else {
          // ユーザーがログアウトした場合はデータをクリア
          setBooks([]);
          setReadingRecords([]);
          setDataInitialized(true);
        }
      } catch (error) {
        console.error('Failed to load reading data:', error);
        if (isMounted) {
          setError('データの読み込みに失敗しました。再読み込みしてください。');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    const setupListeners = async () => {
      if (!user || !isMounted) return;
      
      try {
        // データの変更を監視
        unsubscribeBooks = mockDb.addListener('books', (updatedBooks: Book[]) => {
          if (!isMounted) return;
          
          const userBooks = updatedBooks.filter(book => book.userId === user.uid);
          setBooks(userBooks);
          
          if (DEBUG) {
            console.log('Books updated:', userBooks.length);
          }
        });
        
        unsubscribeRecords = mockDb.addListener('readingRecords', (updatedRecords: ReadingRecord[]) => {
          if (!isMounted) return;
          
          const userRecords = updatedRecords.filter(record => record.userId === user.uid);
          setReadingRecords(userRecords);
          
          if (DEBUG) {
            console.log('Reading records updated:', userRecords.length);
          }
        });
      } catch (error) {
        console.error('Failed to set up data listeners:', error);
        if (isMounted) {
          setError('データの監視に失敗しました。再読み込みしてください。');
        }
      }
    };

    // ユーザーの状態に応じてデータを読み込む
    if (user) {
      loadData().then(() => {
        if (isMounted) {
          setupListeners();
        }
      });
    } else if (!authLoading) {
      // ユーザーがログアウトした場合はデータをクリア
      setBooks([]);
      setReadingRecords([]);
      setLoading(false);
      setError(null);
      setDataInitialized(true);
    }
    
    return () => {
      isMounted = false;
      if (unsubscribeBooks) unsubscribeBooks();
      if (unsubscribeRecords) unsubscribeRecords();
    };
  }, [user, authLoading, isClient]);

  // 本を追加
  const addBook = async (bookData: Omit<Book, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<Book> => {
    if (!isClient) {
      throw new Error('Cannot add book on server side');
    }
    
    setError(null);
    try {
      return await mockDb.addBook(bookData);
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
      return await mockDb.updateBook(id, bookData);
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
      return await mockDb.deleteBook(id);
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
      return await mockDb.addReadingRecord(recordData);
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
      return await mockDb.updateReadingRecord(id, recordData);
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
      return await mockDb.deleteReadingRecord(id);
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
    loading: loading || authLoading || !dataInitialized,
    error
  };

  // ローディング中のフォールバックUI
  if (isClient && (loading || authLoading) && !dataInitialized) {
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