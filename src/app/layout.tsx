import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { ReadingProvider } from '@/contexts/ReadingContext';
import Layout from '@/components/layout/Layout';
import ClientErrorBoundary from '@/components/common/ClientErrorBoundary';
import AuthGuard from '@/components/auth/AuthGuard';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '読書記録アプリ',
  description: '幼児の親が子供の読書記録を簡単に管理できるWEBアプリ',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <ClientErrorBoundary>
          <AuthProvider>
            <ReadingProvider>
              <AuthGuard>
                <Layout>{children}</Layout>
              </AuthGuard>
            </ReadingProvider>
          </AuthProvider>
        </ClientErrorBoundary>
      </body>
    </html>
  );
}
