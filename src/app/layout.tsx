import '@/app/global.css';
import { Provider } from '@/components/layout/provider';
import { Inter } from 'next/font/google';
import type { Metadata } from 'next';
import {Toaster} from "@/components/ui/toaster";

const inter = Inter({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'EurekaCodes',
    template: '%s | EurekaCodes',
  },
  description: 'From Infrastructure to Scalable Microservices. Transform your ideas into intelligent, production-ready applications with EurekaCodes platform.',
  keywords: [
    'microservices', 'AI agents', 'cloud-native', 'infrastructure', 
    'scalable applications', 'DevOps automation', 'real-time chat', 
    'WebSocket', 'serverless', 'eureka codes'
  ],
  authors: [{ name: 'EurekaCodes Team' }],
  creator: 'EurekaCodes',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://docs.eureka.codes',
    title: 'EurekaCodes - From Infrastructure to Scalable Microservices',
    description: 'Transform your ideas into intelligent, production-ready applications. Build AI agents, microservices, and real-time applications with enterprise-grade infrastructure.',
    siteName: 'EurekaCodes',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EurekaCodes - From Infrastructure to Scalable Microservices',
    description: 'Transform your ideas into intelligent, production-ready applications with EurekaCodes platform.',
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
};

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen bg-white dark:bg-fd-background">
        <Provider>{children}</Provider>
        <Toaster />
      </body>
    </html>
  );
}
