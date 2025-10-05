import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from '@/components/ui/toast';

const inter = Inter({ subsets: ['latin'] });

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

export const metadata: Metadata = {
  title: 'StardustEngine - Gaming Infrastructure on MultiversX',
  description: 'Blockchain-powered gaming platform with smart contracts, NFT integration, and cross-game asset management',
  keywords: [
    'multiversx',
    'blockchain',
    'gaming',
    'nft',
    'web3',
    'smart-contracts',
    'defi',
    'gaming-infrastructure'
  ],
  authors: [{ name: 'George Pricop', url: 'https://github.com/Gzeu' }],
  creator: 'George Pricop',
  openGraph: {
    title: 'StardustEngine - Gaming Infrastructure on MultiversX',
    description: 'Blockchain-powered gaming platform with smart contracts, NFT integration, and cross-game asset management',
    url: 'https://github.com/Gzeu/StardustEngine',
    siteName: 'StardustEngine',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'StardustEngine - Gaming Infrastructure on MultiversX',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'StardustEngine - Gaming Infrastructure on MultiversX',
    description: 'Blockchain-powered gaming platform with smart contracts, NFT integration, and cross-game asset management',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
};

function RootLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster />
    </QueryClientProvider>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#1e1b4b" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <RootLayoutClient>
          {children}
        </RootLayoutClient>
      </body>
    </html>
  );
}