'use client';

import { mockDb, convertToFirebaseUser } from './mockDb';
import { User } from 'firebase/auth';

// デバッグモードかどうか
const DEBUG = process.env.DEBUG === 'true';

// モック認証クラス
export class MockAuth {
  private listeners: ((user: User | null) => void)[] = [];
  private isClient: boolean;
  private _currentUser: User | null = null;
  private _currentUserInitialized = false;

  constructor() {
    this.isClient = typeof window !== 'undefined';
    if (DEBUG && this.isClient) {
      console.log('MockAuth: constructor called, isClient:', this.isClient);
    }
    
    // クライアントサイドの場合、初期化時にユーザー情報を取得
    if (this.isClient) {
      this.initCurrentUser();
    }
  }
  
  // 現在のユーザーを初期化
  private async initCurrentUser() {
    try {
      const mockUser = await mockDb.getCurrentUser();
      this._currentUser = convertToFirebaseUser(mockUser);
      this._currentUserInitialized = true;
      
      if (DEBUG) {
        console.log('MockAuth: current user initialized:', this._currentUser?.uid);
      }
    } catch (error) {
      console.error('Error initializing current user:', error);
      this._currentUser = null;
      this._currentUserInitialized = true;
    }
  }

  // 同期的なゲッター（初期化されていない場合はnullを返す）
  get currentUser() {
    if (!this.isClient) {
      return null;
    }
    return this._currentUser;
  }
  
  // 非同期メソッド（初期化を待機）
  async getCurrentUser(): Promise<User | null> {
    if (!this.isClient) {
      return null;
    }
    
    if (!this._currentUserInitialized) {
      const mockUser = await mockDb.getCurrentUser();
      this._currentUser = convertToFirebaseUser(mockUser);
      this._currentUserInitialized = true;
    }
    
    return this._currentUser;
  }

  onAuthStateChanged(callback: (user: User | null) => void, onError?: (error: Error) => void) {
    if (!this.isClient) {
      // サーバーサイドでは空の関数を返す
      if (DEBUG) {
        console.log('MockAuth: onAuthStateChanged called on server side, returning dummy unsubscribe');
      }
      return () => {};
    }
    
    try {
      // リスナーを登録
      this.listeners.push(callback);
      
      // 初期状態を通知（非同期で）
      setTimeout(async () => {
        try {
          const currentUser = await this.getCurrentUser();
          callback(currentUser);
        } catch (error) {
          console.error('Error in initial auth state notification:', error);
          if (onError) {
            onError(error instanceof Error ? error : new Error(String(error)));
          }
        }
      }, 0);
      
      // mockDbのauthリスナーを登録
      const unsubscribe = mockDb.addListener('auth', async () => {
        try {
          const mockUser = await mockDb.getCurrentUser();
          const user = convertToFirebaseUser(mockUser);
          this._currentUser = user;
          callback(user);
        } catch (error) {
          console.error('Error in auth state listener:', error);
          if (onError) {
            onError(error instanceof Error ? error : new Error(String(error)));
          }
        }
      });
      
      // クリーンアップ関数を返す
      return () => {
        this.listeners = this.listeners.filter(listener => listener !== callback);
        unsubscribe();
      };
    } catch (error) {
      console.error('Error setting up auth state listener:', error);
      if (onError) {
        onError(error instanceof Error ? error : new Error(String(error)));
      }
      return () => {};
    }
  }

  async signInWithEmailAndPassword(email: string, password: string) {
    if (!this.isClient) {
      throw new Error('Cannot sign in on server side');
    }
    
    if (DEBUG) {
      console.log('Mock sign in:', { email });
    }
    
    try {
      const mockUser = await mockDb.signIn(email, password);
      const user = convertToFirebaseUser(mockUser) as User;
      
      if (!user) {
        throw new Error('Failed to sign in');
      }
      
      this._currentUser = user;
      this._currentUserInitialized = true;
      
      return { user };
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  }

  async createUserWithEmailAndPassword(email: string, password: string) {
    if (!this.isClient) {
      throw new Error('Cannot sign up on server side');
    }
    
    if (DEBUG) {
      console.log('Mock create user:', { email });
    }
    
    try {
      const mockUser = await mockDb.signUp(email, password);
      const user = convertToFirebaseUser(mockUser) as User;
      
      if (!user) {
        throw new Error('Failed to create user');
      }
      
      this._currentUser = user;
      this._currentUserInitialized = true;
      
      return { user };
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  }

  async signOut() {
    if (!this.isClient) {
      throw new Error('Cannot sign out on server side');
    }
    
    if (DEBUG) {
      console.log('Mock sign out');
    }
    
    try {
      await mockDb.signOut();
      this._currentUser = null;
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  }
}

// シングルトンインスタンスを作成
export const mockAuth = new MockAuth();