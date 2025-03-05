'use client';

import { initializeApp, getApps, FirebaseError, FirebaseApp } from 'firebase/app';
import { getAuth, connectAuthEmulator, Auth, User } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// 開発環境用のモック認証
class MockAuth {
  private currentUserState: User | null = null;
  private listeners: ((user: User | null) => void)[] = [];

  get currentUser() {
    return this.currentUserState;
  }

  onAuthStateChanged(callback: (user: User | null) => void) {
    // リスナーを登録
    this.listeners.push(callback);
    // 初期状態を通知
    callback(this.currentUserState);
    
    // クリーンアップ関数を返す
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  async signInWithEmailAndPassword(email: string, password: string) {
    console.log('Mock sign in:', { email });
    
    // モックユーザーを作成
    const mockUser = {
      uid: '1',
      email,
      emailVerified: true,
      displayName: email.split('@')[0],
      isAnonymous: false,
      providerData: [],
      metadata: {
        creationTime: new Date().toISOString(),
        lastSignInTime: new Date().toISOString()
      },
      phoneNumber: null,
      photoURL: null,
      refreshToken: '',
      tenantId: null,
      delete: async () => {},
      getIdToken: async () => 'mock-token',
      getIdTokenResult: async () => ({ token: 'mock-token', claims: {}, issuedAtTime: '', expirationTime: '', authTime: '', signInProvider: null, signInSecondFactor: null }),
      reload: async () => {},
      toJSON: () => ({ uid: '1', email })
    } as unknown as User;
    
    // 現在のユーザーを更新
    this.currentUserState = mockUser;
    
    // リスナーに通知
    this.listeners.forEach(listener => listener(mockUser));
    
    return { user: mockUser };
  }

  async createUserWithEmailAndPassword(email: string, password: string) {
    console.log('Mock create user:', { email });
    
    // モックユーザーを作成
    const mockUser = {
      uid: '1',
      email,
      emailVerified: false,
      displayName: email.split('@')[0],
      isAnonymous: false,
      providerData: [],
      metadata: {
        creationTime: new Date().toISOString(),
        lastSignInTime: new Date().toISOString()
      },
      phoneNumber: null,
      photoURL: null,
      refreshToken: '',
      tenantId: null,
      delete: async () => {},
      getIdToken: async () => 'mock-token',
      getIdTokenResult: async () => ({ token: 'mock-token', claims: {}, issuedAtTime: '', expirationTime: '', authTime: '', signInProvider: null, signInSecondFactor: null }),
      reload: async () => {},
      toJSON: () => ({ uid: '1', email })
    } as unknown as User;
    
    // 現在のユーザーを更新
    this.currentUserState = mockUser;
    
    // リスナーに通知
    this.listeners.forEach(listener => listener(mockUser));
    
    return { user: mockUser };
  }

  async signOut() {
    console.log('Mock sign out');
    
    // 現在のユーザーをクリア
    this.currentUserState = null;
    
    // リスナーに通知
    this.listeners.forEach(listener => listener(null));
  }
}

let app: FirebaseApp;
let auth: Auth;

try {
  if (process.env.NODE_ENV === 'development') {
    console.log('Using mock authentication');
    auth = new MockAuth() as unknown as Auth;
  } else {
    if (getApps().length === 0) {
      app = initializeApp(firebaseConfig);
      console.log('Firebase initialized successfully');
    } else {
      app = getApps()[0];
      console.log('Using existing Firebase instance');
    }
    auth = getAuth(app);
  }
} catch (error) {
  if (error instanceof FirebaseError) {
    console.error('Firebase initialization error:', {
      code: error.code,
      message: error.message,
      stack: error.stack
    });
  } else {
    console.error('Unknown error during Firebase initialization:', error);
  }
  console.log('Falling back to mock authentication');
  auth = new MockAuth() as unknown as Auth;
}

export { app, auth };