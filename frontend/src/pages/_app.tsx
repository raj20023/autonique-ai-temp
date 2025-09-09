import type { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';
import { useState } from 'react';
import Head from 'next/head';
import ErrorBoundary from '@/components/ErrorBoundary';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AutoProvider } from '@/contexts/AutoContext';

import '@/styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  }));



  return (
    <ErrorBoundary>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Inter+Display:wght@100..900&family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&family=Space+Grotesk:wght@300..700&family=Manrope:wght@200..800&display=swap"
          rel="stylesheet"
        />
        <link rel="preload" href="/fonts/SF-Pro-Display-Medium.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/SF-Pro-Display-Semibold.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </Head>
      <ThemeProvider>
        <AutoProvider>
          <QueryClientProvider client={queryClient}>
            <Component {...pageProps} />
            <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1f2937',
                color: '#fff',
                borderRadius: '16px',
                border: '1px solid #374151',
                fontSize: '14px',
                fontWeight: '500',
                fontFamily: 'Inter, sans-serif',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#10B981',
                  secondary: '#fff',
                },
                style: {
                  background: 'linear-gradient(135deg, #065f46, #047857)',
                  color: '#fff',
                  border: '1px solid #10B981',
                },
              },
              error: {
                duration: 4000,
                iconTheme: {
                  primary: '#EF4444',
                  secondary: '#fff',
                },
                style: {
                  background: 'linear-gradient(135deg, #7f1d1d, #991b1b)',
                  color: '#fff',
                  border: '1px solid #EF4444',
                },
              },
            }}
          />
          </QueryClientProvider>
        </AutoProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
