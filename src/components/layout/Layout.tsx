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
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
      <footer className="bg-white border-t">
        <div className="container mx-auto px-4 py-6 text-center text-gray-600">
          <p>© {year} 読書記録アプリ</p>
        </div>
      </footer>
    </div>
  );
}