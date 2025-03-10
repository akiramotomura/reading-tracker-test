'use client';

import React from 'react';
import ErrorBoundary from './ErrorBoundary';

interface ClientErrorBoundaryProps {
  children: React.ReactNode;
}

// クライアントサイドでのみ実行されるエラーバウンダリラッパー
const ClientErrorBoundary: React.FC<ClientErrorBoundaryProps> = ({ children }) => {
  return <ErrorBoundary>{children}</ErrorBoundary>;
};

export default ClientErrorBoundary;