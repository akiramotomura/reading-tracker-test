'use client';

import { ReactNode, useState, useEffect } from 'react';
import Navbar from './Navbar';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  // 初期値として2025を設定し、クライアントサイドでのみ現在の年に更新
  const [year, setYear] = useState(2025);
  
  useEffect(() => {
    // クライアントサイドでのみ実行
    setYear(new Date().getFullYear());
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-4 sm:py-6 max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-4xl">
        {children}
      </main>
      <footer className="bg-white border-t border-gray-100 mt-8">
        <div className="container mx-auto px-4 py-4 sm:py-6 text-center text-gray-500 text-sm">
          <p>© {year} 読書記録アプリ - モバイル版</p>
        </div>
      </footer>
    </div>
  );
}