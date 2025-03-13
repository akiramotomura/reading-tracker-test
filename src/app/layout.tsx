import type { Metadata } from 'next';
import { Noto_Sans_JP } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { ReadingProvider } from '@/contexts/ReadingContext';
import Layout from '@/components/layout/Layout';
import ClientErrorBoundary from '@/components/common/ClientErrorBoundary';

const notoSansJP = Noto_Sans_JP({ 
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'YOMITAI - 子供の読書記録アプリ',
  description: '幼児の親が子供の読書記録を簡単に管理できるモバイル対応WEBアプリ',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <meta name="theme-color" content="#00af91" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className={notoSansJP.className}>
        <ClientErrorBoundary>
          <AuthProvider>
            <ReadingProvider>
              <Layout>{children}</Layout>
            </ReadingProvider>
          </AuthProvider>
        </ClientErrorBoundary>
      </body>
    </html>
  );
}
