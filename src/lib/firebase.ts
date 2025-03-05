'use client';

import { Auth } from 'firebase/auth';
import { mockAuth } from './mockAuth';

// モック認証を使用
console.log('Using mock authentication');
const auth = mockAuth as unknown as Auth;

export { auth };