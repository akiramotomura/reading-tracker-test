'use client';

import { mockDb, convertToFirebaseUser } from './mockDb';
import { User } from 'firebase/auth';

// モック認証クラス
export class MockAuth {
  private listeners: ((user: User | null) => void)[] = [];

  get currentUser() {
    const mockUser = mockDb.getCurrentUser();
    return convertToFirebaseUser(mockUser) as User | null;
  }

  onAuthStateChanged(callback: (user: User | null) => void) {
    // リスナーを登録
    this.listeners.push(callback);
    
    // 初期状態を通知
    const currentUser = this.currentUser;
    callback(currentUser);
    
    // mockDbのauthリスナーを登録
    const unsubscribe = mockDb.addListener('auth', () => {
      const user = convertToFirebaseUser(mockDb.getCurrentUser()) as User | null;
      callback(user);
    });
    
    // クリーンアップ関数を返す
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
      unsubscribe();
    };
  }

  async signInWithEmailAndPassword(email: string, password: string) {
    console.log('Mock sign in:', { email });
    
    try {
      const mockUser = await mockDb.signIn(email, password);
      const user = convertToFirebaseUser(mockUser) as User;
      
      if (!user) {
        throw new Error('Failed to sign in');
      }
      
      return { user };
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  }

  async createUserWithEmailAndPassword(email: string, password: string) {
    console.log('Mock create user:', { email });
    
    try {
      const mockUser = await mockDb.signUp(email, password);
      const user = convertToFirebaseUser(mockUser) as User;
      
      if (!user) {
        throw new Error('Failed to create user');
      }
      
      return { user };
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  }

  async signOut() {
    console.log('Mock sign out');
    
    try {
      await mockDb.signOut();
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  }
}

// シングルトンインスタンスを作成
export const mockAuth = new MockAuth();