'use client';

import { Auth } from 'firebase/auth';
import { mockAuth } from './mockAuth';

// デバッグモードかどうか
const DEBUG = process.env.DEBUG === 'true';

// モック認証を使用
if (DEBUG && typeof window !== 'undefined') {
  console.log('Using mock authentication');
}

// サーバーサイドレンダリング時には、空のオブジェクトを返す
const auth = typeof window !== 'undefined' 
  ? mockAuth as unknown as Auth 
  : {} as Auth;

export { auth };