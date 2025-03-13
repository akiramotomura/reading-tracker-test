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
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-4 sm:py-6 max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-4xl pb-20 sm:pb-6 animate-fadeIn">
        {children}
      </main>
      <footer className="bg-surface-container border-t border-outline-variant mt-8 hidden sm:block">
        <div className="container mx-auto px-4 py-4 sm:py-6 text-center text-on-surface-variant text-sm">
          <p>© {year} YOMITAI</p>
        </div>
      </footer>
    </div>
  );
}