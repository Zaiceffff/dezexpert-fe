import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toast-provider';

import Providers from './providers';
import Header from '@/components/Header';

import FaviconHead from '@/components/FaviconHead';
import FloatingChat from '@/components/FloatingChat';

const inter = Inter({ subsets: ['latin'] });

export const viewport = {
  themeColor: '#16a34a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: 'Dezexpert — CRM и калькулятор заявок для дезинфекторов: +25–40% конверсии',
  description: 'Умный калькулятор, заявки, SMS‑напоминания и мини‑CRM. Запуск за 15 минут. Бесплатный план.',
  keywords: 'дезинфекция, дезинсекция, CRM, калькулятор, заявки, SMS, автоматизация',
  authors: [{ name: 'Dezexpert' }],
  creator: 'Dezexpert',
  publisher: 'Dezexpert',
  robots: 'index, follow',
  metadataBase: new URL('https://dezexpert.pro'),
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: 'https://dezexpert.pro',
    siteName: 'Dezexpert',
    title: 'Dezexpert — CRM и калькулятор заявок для дезинфекторов: +25–40% конверсии',
    description: 'Умный калькулятор, заявки, SMS‑напоминания и мини‑CRM. Запуск за 15 минут. Бесплатный план.',
    images: [
      {
        url: '/logo.jpeg',
        width: 1200,
        height: 630,
        alt: 'Dezexpert CRM для дезинфекторов'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dezexpert — CRM и калькулятор заявок для дезинфекторов: +25–40% конверсии',
    description: 'Умный калькулятор, заявки, SMS‑напоминания и мини‑CRM. Запуск за 15 минут. Бесплатный план.',
    images: ['/logo.jpeg']
  },
  icons: {
    icon: [
      { url: '/api/favicon', type: 'image/x-icon' },
      { url: '/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon/favicon-48x48.png', sizes: '48x48', type: 'image/png' }
    ],
    shortcut: '/api/favicon',
    apple: [
      { url: '/favicon/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
    ],
    other: [
      { url: '/favicon/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/favicon/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' }
    ]
  },
  manifest: '/site.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Dezexpert CRM'
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <head>
        <FaviconHead />
        <link rel="icon" href="/api/favicon" sizes="any" />
        <link rel="icon" href="/favicon/favicon-16x16.png" type="image/png" sizes="16x16" />
        <link rel="icon" href="/favicon/favicon-32x32.png" type="image/png" sizes="32x32" />
        <link rel="icon" href="/favicon/favicon-48x48.png" type="image/png" sizes="48x48" />
        <link rel="apple-touch-icon" href="/favicon/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "Dezexpert CRM",
              "description": "CRM система и калькулятор заявок для компаний по дезинсекции и дератизации",
              "applicationCategory": "BusinessApplication",
              "operatingSystem": "Web",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "RUB",
                "description": "Бесплатный пробный план"
              },
              "provider": {
                "@type": "Organization",
                "name": "Dezexpert",
                "url": "https://dezexpert.pro"
              },
              "featureList": [
                "Умный калькулятор стоимости",
                "Автоматические заявки",
                "SMS-напоминания",
                "Мини-CRM система",
                "Персональная ссылка партнера"
              ]
            })
          }}
        />
      </head>
      <body className={`${inter.className} bg-gray-50 text-gray-900`}>
        <Providers>
          <Header />
          <main>
            {children}
          </main>

          <Toaster />
          <FloatingChat />
        </Providers>
      </body>
    </html>
  );
}

