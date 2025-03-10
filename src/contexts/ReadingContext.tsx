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
  const { user } = useAuth();
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
    
    console.log('ReadingProvider: initializing with user', user?.uid);
    let isMounted = true;
    let unsubscribeBooks: (() => void) | undefined;
    let unsubscribeRecords: (() => void) | undefined;
    
    const loadData = async () => {
      if (!isMounted) return;
      
      setLoading(true);
      setError(null);
      
      try {
        if (user) {
          console.log('Loading data for user:', user.uid);
          
          // モックデータベースからデータを取得
          const userBooks = await mockDb.getBooks(user.uid);
          if (!isMounted) return;
          
          const userRecords = await mockDb.getReadingRecords(user.uid);
          if (!isMounted) return;
          
          setBooks(userBooks);
          setReadingRecords(userRecords);
          console.log('Loaded data from mock database:', { 
            books: userBooks.length, 
            readingRecords: userRecords.length 
          });
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

    const setupListeners = () => {
      if (!user || !isMounted) return;
      
      try {
        // データの変更を監視
        unsubscribeBooks = mockDb.addListener('books', (updatedBooks: Book[]) => {
          if (!isMounted) return;
          
          const userBooks = updatedBooks.filter(book => book.userId === user.uid);
          setBooks(userBooks);
          console.log('Books updated:', userBooks.length);
        });
        
        unsubscribeRecords = mockDb.addListener('readingRecords', (updatedRecords: ReadingRecord[]) => {
          if (!isMounted) return;
          
          const userRecords = updatedRecords.filter(record => record.userId === user.uid);
          setReadingRecords(userRecords);
          console.log('Reading records updated:', userRecords.length);
        });
      } catch (error) {
        console.error('Failed to set up data listeners:', error);
        if (isMounted) {
          setError('データの監視に失敗しました。再読み込みしてください。');
        }
      }
    };

    if (user) {
      loadData().then(() => {
        if (isMounted) {
          setupListeners();
        }
      });
    } else {
      // ユーザーがログアウトした場合はデータをクリア
      setBooks([]);
      setReadingRecords([]);
      setLoading(false);
      setError(null);
    }
    
    return () => {
      isMounted = false;
      if (unsubscribeBooks) unsubscribeBooks();
      if (unsubscribeRecords) unsubscribeRecords();
    };
  }, [user, isClient]);

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
    loading,
    error
  };

  return (
    <ReadingContext.Provider value={value}>
      {children}
    </ReadingContext.Provider>
  );
};