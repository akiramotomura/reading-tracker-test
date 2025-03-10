'use client';

import { Book, ReadingRecord, UserProfile, Child, ReadingGoal, generateMockData } from '@/types';
import { User } from 'firebase/auth';

// ローカルストレージのキー
const STORAGE_KEYS = {
  USERS: 'reading-tracker-users',
  BOOKS: 'reading-tracker-books',
  READING_RECORDS: 'reading-tracker-records',
  PROFILES: 'reading-tracker-profiles',
  CHILDREN: 'reading-tracker-children',
  GOALS: 'reading-tracker-goals',
  CURRENT_USER: 'reading-tracker-current-user'
};

// モックユーザーの型定義
export interface MockUser {
  uid: string;
  email: string;
  password: string; // 実際のアプリでは平文でパスワードを保存しないでください
  emailVerified: boolean;
  displayName: string | null;
  createdAt: string;
  lastLoginAt: string;
}

// コールバック関数の型定義
type DataCallback<T> = (data: T) => void;

// モックデータベースクラス
class MockDatabase {
  private users: MockUser[] = [];
  private books: Book[] = [];
  private readingRecords: ReadingRecord[] = [];
  private profiles: UserProfile[] = [];
  private children: Child[] = [];
  private goals: ReadingGoal[] = [];
  private currentUser: MockUser | null = null;
  private listeners: Map<string, DataCallback<unknown>[]> = new Map();
  private initialized = false;

  constructor() {
    // クライアントサイドでのみ初期化
    if (typeof window !== 'undefined') {
      this.initialize();
    }
  }

  // 初期化処理
  private initialize() {
    if (this.initialized) return;
    
    console.log('MockDatabase: initializing');
    this.loadFromLocalStorage();
    
    // 初期データがない場合は生成
    if (this.books.length === 0 || this.readingRecords.length === 0) {
      const { books, readingRecords } = generateMockData();
      this.books = books;
      this.readingRecords = readingRecords;
      this.saveToLocalStorage();
    }
    
    // デフォルトユーザーがない場合は作成
    if (this.users.length === 0) {
      this.createDefaultUser();
    }
    
    this.initialized = true;
    console.log('MockDatabase: initialization complete');
  }

  // ローカルストレージからデータを読み込む
  private loadFromLocalStorage() {
    if (typeof window === 'undefined') return;

    try {
      console.log('Loading data from localStorage');
      const usersJson = localStorage.getItem(STORAGE_KEYS.USERS);
      const booksJson = localStorage.getItem(STORAGE_KEYS.BOOKS);
      const recordsJson = localStorage.getItem(STORAGE_KEYS.READING_RECORDS);
      const profilesJson = localStorage.getItem(STORAGE_KEYS.PROFILES);
      const childrenJson = localStorage.getItem(STORAGE_KEYS.CHILDREN);
      const goalsJson = localStorage.getItem(STORAGE_KEYS.GOALS);
      const currentUserJson = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);

      if (usersJson) this.users = JSON.parse(usersJson);
      if (booksJson) this.books = JSON.parse(booksJson);
      if (recordsJson) this.readingRecords = JSON.parse(recordsJson);
      if (profilesJson) this.profiles = JSON.parse(profilesJson);
      if (childrenJson) this.children = JSON.parse(childrenJson);
      if (goalsJson) this.goals = JSON.parse(goalsJson);
      if (currentUserJson) this.currentUser = JSON.parse(currentUserJson);
      
      console.log('Data loaded from localStorage:', {
        users: this.users.length,
        books: this.books.length,
        records: this.readingRecords.length
      });
    } catch (error) {
      console.error('Failed to load data from localStorage:', error);
      // エラーが発生した場合は空の配列を使用
      this.users = [];
      this.books = [];
      this.readingRecords = [];
      this.profiles = [];
      this.children = [];
      this.goals = [];
      this.currentUser = null;
    }
  }

  // ローカルストレージにデータを保存
  private saveToLocalStorage() {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(this.users));
      localStorage.setItem(STORAGE_KEYS.BOOKS, JSON.stringify(this.books));
      localStorage.setItem(STORAGE_KEYS.READING_RECORDS, JSON.stringify(this.readingRecords));
      localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(this.profiles));
      localStorage.setItem(STORAGE_KEYS.CHILDREN, JSON.stringify(this.children));
      localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(this.goals));
      
      if (this.currentUser) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(this.currentUser));
      } else {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      }
      
      console.log('Data saved to localStorage');
    } catch (error) {
      console.error('Failed to save data to localStorage:', error);
      // エラーを無視して処理を続行
    }
  }

  // デフォルトユーザーを作成
  private createDefaultUser() {
    const now = new Date().toISOString();
    const defaultUser: MockUser = {
      uid: '1',
      email: 'test@example.com',
      password: 'password123',
      emailVerified: true,
      displayName: 'テストユーザー',
      createdAt: now,
      lastLoginAt: now
    };

    this.users.push(defaultUser);
    
    // デフォルトプロファイルも作成
    const defaultProfile: UserProfile = {
      id: '1',
      email: 'test@example.com',
      familyName: 'テスト家族',
      createdAt: now,
      updatedAt: now
    };
    
    this.profiles.push(defaultProfile);
    this.saveToLocalStorage();
    console.log('Default user created:', defaultUser.email);
  }

  // リスナーを追加
  addListener<T>(collection: string, callback: DataCallback<T>): () => void {
    // クライアントサイドでのみ初期化
    if (typeof window !== 'undefined' && !this.initialized) {
      this.initialize();
    }
    
    if (!this.listeners.has(collection)) {
      this.listeners.set(collection, []);
    }
    
    // TypeScriptの型システムの制限により、ここでキャストが必要
    const typedCallback = callback as DataCallback<unknown>;
    this.listeners.get(collection)?.push(typedCallback);
    
    // 初期データを通知
    this.notifyListeners(collection);
    
    // クリーンアップ関数を返す
    return () => {
      const listeners = this.listeners.get(collection) || [];
      const index = listeners.indexOf(typedCallback);
      if (index !== -1) {
        listeners.splice(index, 1);
      }
    };
  }

  // リスナーに通知
  private notifyListeners(collection: string) {
    const listeners = this.listeners.get(collection) || [];
    
    try {
      switch (collection) {
        case 'users':
          listeners.forEach(callback => callback(this.users));
          break;
        case 'books':
          listeners.forEach(callback => callback(this.books));
          break;
        case 'readingRecords':
          listeners.forEach(callback => callback(this.readingRecords));
          break;
        case 'profiles':
          listeners.forEach(callback => callback(this.profiles));
          break;
        case 'children':
          listeners.forEach(callback => callback(this.children));
          break;
        case 'goals':
          listeners.forEach(callback => callback(this.goals));
          break;
        case 'auth':
          listeners.forEach(callback => callback(this.currentUser));
          break;
      }
    } catch (error) {
      console.error(`Error notifying ${collection} listeners:`, error);
    }
  }

  // ユーザー認証関連のメソッド
  async signUp(email: string, password: string): Promise<MockUser> {
    // クライアントサイドでのみ初期化
    if (typeof window !== 'undefined' && !this.initialized) {
      this.initialize();
    }
    
    console.log('Sign up attempt:', email);
    
    // メールアドレスが既に使用されているか確認
    const existingUser = this.users.find(user => user.email === email);
    if (existingUser) {
      throw new Error('このメールアドレスは既に使用されています');
    }

    const now = new Date().toISOString();
    const newUser: MockUser = {
      uid: `user-${Date.now()}`,
      email,
      password,
      emailVerified: false,
      displayName: email.split('@')[0],
      createdAt: now,
      lastLoginAt: now
    };

    this.users.push(newUser);
    this.currentUser = newUser;
    
    // 新しいユーザーのプロファイルも作成
    const newProfile: UserProfile = {
      id: newUser.uid,
      email,
      familyName: `${email.split('@')[0]}の家族`,
      createdAt: now,
      updatedAt: now
    };
    
    this.profiles.push(newProfile);
    
    this.saveToLocalStorage();
    this.notifyListeners('users');
    this.notifyListeners('profiles');
    this.notifyListeners('auth');
    
    console.log('Sign up successful:', newUser.uid);
    return newUser;
  }

  async signIn(email: string, password: string): Promise<MockUser> {
    // クライアントサイドでのみ初期化
    if (typeof window !== 'undefined' && !this.initialized) {
      this.initialize();
    }
    
    console.log('Sign in attempt:', email);
    
    const user = this.users.find(user => user.email === email && user.password === password);
    if (!user) {
      throw new Error('メールアドレスまたはパスワードが正しくありません');
    }

    user.lastLoginAt = new Date().toISOString();
    this.currentUser = user;
    
    this.saveToLocalStorage();
    this.notifyListeners('auth');
    
    console.log('Sign in successful:', user.uid);
    return user;
  }

  async signOut(): Promise<void> {
    console.log('Sign out attempt');
    this.currentUser = null;
    this.saveToLocalStorage();
    this.notifyListeners('auth');
    console.log('Sign out successful');
  }

  getCurrentUser(): MockUser | null {
    // クライアントサイドでのみ初期化
    if (typeof window !== 'undefined' && !this.initialized) {
      this.initialize();
    }
    
    return this.currentUser;
  }

  // 本の管理
  async getBooks(userId?: string): Promise<Book[]> {
    // クライアントサイドでのみ初期化
    if (typeof window !== 'undefined' && !this.initialized) {
      this.initialize();
    }
    
    if (userId) {
      return this.books.filter(book => book.userId === userId);
    }
    return this.books;
  }

  async getBookById(id: string): Promise<Book | undefined> {
    // クライアントサイドでのみ初期化
    if (typeof window !== 'undefined' && !this.initialized) {
      this.initialize();
    }
    
    return this.books.find(book => book.id === id);
  }

  async addBook(bookData: Omit<Book, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<Book> {
    // クライアントサイドでのみ初期化
    if (typeof window !== 'undefined' && !this.initialized) {
      this.initialize();
    }
    
    if (!this.currentUser) {
      throw new Error('ログインが必要です');
    }

    const now = new Date().toISOString();
    const newBook: Book = {
      ...bookData,
      id: `book-${Date.now()}`,
      userId: this.currentUser.uid,
      createdAt: now,
      updatedAt: now
    };

    this.books.push(newBook);
    this.saveToLocalStorage();
    this.notifyListeners('books');
    
    return newBook;
  }

  async updateBook(id: string, bookData: Partial<Book>): Promise<Book> {
    // クライアントサイドでのみ初期化
    if (typeof window !== 'undefined' && !this.initialized) {
      this.initialize();
    }
    
    const bookIndex = this.books.findIndex(book => book.id === id);
    if (bookIndex === -1) {
      throw new Error(`Book with id ${id} not found`);
    }

    const updatedBook = {
      ...this.books[bookIndex],
      ...bookData,
      updatedAt: new Date().toISOString()
    };

    this.books[bookIndex] = updatedBook;
    this.saveToLocalStorage();
    this.notifyListeners('books');
    
    return updatedBook;
  }

  async deleteBook(id: string): Promise<void> {
    // クライアントサイドでのみ初期化
    if (typeof window !== 'undefined' && !this.initialized) {
      this.initialize();
    }
    
    this.books = this.books.filter(book => book.id !== id);
    // 関連する読書記録も削除
    this.readingRecords = this.readingRecords.filter(record => record.bookId !== id);
    
    this.saveToLocalStorage();
    this.notifyListeners('books');
    this.notifyListeners('readingRecords');
  }

  // 読書記録の管理
  async getReadingRecords(userId?: string): Promise<ReadingRecord[]> {
    // クライアントサイドでのみ初期化
    if (typeof window !== 'undefined' && !this.initialized) {
      this.initialize();
    }
    
    if (userId) {
      return this.readingRecords.filter(record => record.userId === userId);
    }
    return this.readingRecords;
  }

  async getReadingRecordById(id: string): Promise<ReadingRecord | undefined> {
    // クライアントサイドでのみ初期化
    if (typeof window !== 'undefined' && !this.initialized) {
      this.initialize();
    }
    
    return this.readingRecords.find(record => record.id === id);
  }

  async getReadingRecordsByBookId(bookId: string): Promise<ReadingRecord[]> {
    // クライアントサイドでのみ初期化
    if (typeof window !== 'undefined' && !this.initialized) {
      this.initialize();
    }
    
    return this.readingRecords.filter(record => record.bookId === bookId);
  }

  async addReadingRecord(recordData: Omit<ReadingRecord, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<ReadingRecord> {
    // クライアントサイドでのみ初期化
    if (typeof window !== 'undefined' && !this.initialized) {
      this.initialize();
    }
    
    if (!this.currentUser) {
      throw new Error('ログインが必要です');
    }

    const now = new Date().toISOString();
    const newRecord: ReadingRecord = {
      ...recordData,
      id: `record-${Date.now()}`,
      userId: this.currentUser.uid,
      createdAt: now,
      updatedAt: now
    };

    this.readingRecords.push(newRecord);
    this.saveToLocalStorage();
    this.notifyListeners('readingRecords');
    
    return newRecord;
  }

  async updateReadingRecord(id: string, recordData: Partial<ReadingRecord>): Promise<ReadingRecord> {
    // クライアントサイドでのみ初期化
    if (typeof window !== 'undefined' && !this.initialized) {
      this.initialize();
    }
    
    const recordIndex = this.readingRecords.findIndex(record => record.id === id);
    if (recordIndex === -1) {
      throw new Error(`Reading record with id ${id} not found`);
    }

    const updatedRecord = {
      ...this.readingRecords[recordIndex],
      ...recordData,
      updatedAt: new Date().toISOString()
    };

    this.readingRecords[recordIndex] = updatedRecord;
    this.saveToLocalStorage();
    this.notifyListeners('readingRecords');
    
    return updatedRecord;
  }

  async deleteReadingRecord(id: string): Promise<void> {
    // クライアントサイドでのみ初期化
    if (typeof window !== 'undefined' && !this.initialized) {
      this.initialize();
    }
    
    this.readingRecords = this.readingRecords.filter(record => record.id !== id);
    this.saveToLocalStorage();
    this.notifyListeners('readingRecords');
  }

  // プロファイル管理
  async getProfile(userId: string): Promise<UserProfile | undefined> {
    // クライアントサイドでのみ初期化
    if (typeof window !== 'undefined' && !this.initialized) {
      this.initialize();
    }
    
    return this.profiles.find(profile => profile.id === userId);
  }

  async updateProfile(userId: string, profileData: Partial<UserProfile>): Promise<UserProfile> {
    // クライアントサイドでのみ初期化
    if (typeof window !== 'undefined' && !this.initialized) {
      this.initialize();
    }
    
    const profileIndex = this.profiles.findIndex(profile => profile.id === userId);
    
    if (profileIndex === -1) {
      throw new Error(`Profile for user ${userId} not found`);
    }

    const updatedProfile = {
      ...this.profiles[profileIndex],
      ...profileData,
      updatedAt: new Date().toISOString()
    };

    this.profiles[profileIndex] = updatedProfile;
    this.saveToLocalStorage();
    this.notifyListeners('profiles');
    
    return updatedProfile;
  }

  // 子供の管理
  async getChildren(userId: string): Promise<Child[]> {
    // クライアントサイドでのみ初期化
    if (typeof window !== 'undefined' && !this.initialized) {
      this.initialize();
    }
    
    return this.children.filter(child => child.userId === userId);
  }

  async addChild(childData: Omit<Child, 'id' | 'createdAt' | 'updatedAt'>): Promise<Child> {
    // クライアントサイドでのみ初期化
    if (typeof window !== 'undefined' && !this.initialized) {
      this.initialize();
    }
    
    const now = new Date().toISOString();
    const newChild: Child = {
      ...childData,
      id: `child-${Date.now()}`,
      createdAt: now,
      updatedAt: now
    };

    this.children.push(newChild);
    this.saveToLocalStorage();
    this.notifyListeners('children');
    
    return newChild;
  }

  async updateChild(id: string, childData: Partial<Child>): Promise<Child> {
    // クライアントサイドでのみ初期化
    if (typeof window !== 'undefined' && !this.initialized) {
      this.initialize();
    }
    
    const childIndex = this.children.findIndex(child => child.id === id);
    if (childIndex === -1) {
      throw new Error(`Child with id ${id} not found`);
    }

    const updatedChild = {
      ...this.children[childIndex],
      ...childData,
      updatedAt: new Date().toISOString()
    };

    this.children[childIndex] = updatedChild;
    this.saveToLocalStorage();
    this.notifyListeners('children');
    
    return updatedChild;
  }

  async deleteChild(id: string): Promise<void> {
    // クライアントサイドでのみ初期化
    if (typeof window !== 'undefined' && !this.initialized) {
      this.initialize();
    }
    
    this.children = this.children.filter(child => child.id !== id);
    this.saveToLocalStorage();
    this.notifyListeners('children');
  }

  // 読書目標の管理
  async getGoals(userId: string): Promise<ReadingGoal[]> {
    // クライアントサイドでのみ初期化
    if (typeof window !== 'undefined' && !this.initialized) {
      this.initialize();
    }
    
    return this.goals.filter(goal => goal.userId === userId);
  }

  async addGoal(goalData: Omit<ReadingGoal, 'id' | 'createdAt' | 'updatedAt'>): Promise<ReadingGoal> {
    // クライアントサイドでのみ初期化
    if (typeof window !== 'undefined' && !this.initialized) {
      this.initialize();
    }
    
    const now = new Date().toISOString();
    const newGoal: ReadingGoal = {
      ...goalData,
      id: `goal-${Date.now()}`,
      createdAt: now,
      updatedAt: now
    };

    this.goals.push(newGoal);
    this.saveToLocalStorage();
    this.notifyListeners('goals');
    
    return newGoal;
  }

  async updateGoal(id: string, goalData: Partial<ReadingGoal>): Promise<ReadingGoal> {
    // クライアントサイドでのみ初期化
    if (typeof window !== 'undefined' && !this.initialized) {
      this.initialize();
    }
    
    const goalIndex = this.goals.findIndex(goal => goal.id === id);
    if (goalIndex === -1) {
      throw new Error(`Goal with id ${id} not found`);
    }

    const updatedGoal = {
      ...this.goals[goalIndex],
      ...goalData,
      updatedAt: new Date().toISOString()
    };

    this.goals[goalIndex] = updatedGoal;
    this.saveToLocalStorage();
    this.notifyListeners('goals');
    
    return updatedGoal;
  }

  async deleteGoal(id: string): Promise<void> {
    // クライアントサイドでのみ初期化
    if (typeof window !== 'undefined' && !this.initialized) {
      this.initialize();
    }
    
    this.goals = this.goals.filter(goal => goal.id !== id);
    this.saveToLocalStorage();
    this.notifyListeners('goals');
  }
}

// シングルトンインスタンスを作成
export const mockDb = new MockDatabase();

// モックユーザーの型をFirebaseのUser型に変換する関数
export const convertToFirebaseUser = (mockUser: MockUser | null): User | null => {
  if (!mockUser) return null;
  
  // Userインターフェースに合わせた型を返す
  return {
    uid: mockUser.uid,
    email: mockUser.email,
    emailVerified: mockUser.emailVerified,
    displayName: mockUser.displayName,
    isAnonymous: false,
    providerData: [],
    providerId: 'password',
    metadata: {
      creationTime: mockUser.createdAt,
      lastSignInTime: mockUser.lastLoginAt
    },
    phoneNumber: null,
    photoURL: null,
    refreshToken: '',
    tenantId: null,
    delete: async () => {},
    getIdToken: async () => 'mock-token',
    getIdTokenResult: async () => ({ 
      token: 'mock-token', 
      claims: {}, 
      issuedAtTime: '', 
      expirationTime: '', 
      authTime: '', 
      signInProvider: null, 
      signInSecondFactor: null 
    }),
    reload: async () => {},
    toJSON: () => ({ uid: mockUser.uid, email: mockUser.email })
  } as User;
};