import type { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { Toaster } from 'react-hot-toast';
import { useState, useEffect } from 'react';
import Head from 'next/head';
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

  // Force HTTPS redirect on client side (excluding health checks)
  useEffect(() => {
    if (typeof window !== 'undefined' &&
        window.location.protocol === 'http:' &&
        process.env.NODE_ENV === 'production' &&
        !window.location.pathname.includes('/health') &&
        !window.location.hostname.includes('localhost')) {
      window.location.replace(window.location.href.replace('http:', 'https:'));
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Head>
        {/* Force HTTPS */}
        <script dangerouslySetInnerHTML={{
          __html: `
            if (location.protocol === 'http:' &&
                location.hostname !== 'localhost' &&
                !location.pathname.includes('/health')) {
              location.replace('https:' + window.location.href.substring(window.location.protocol.length));
            }
          `
        }} />
      </Head>
      <Component {...pageProps} />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10B981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#EF4444',
              secondary: '#fff',
            },
          },
        }}
      />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
