import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/lib/auth/AuthContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'KashPages - Business Landing Pages for Kashmir',
  description: 'Create beautiful landing pages for your business in minutes. Built for Kashmir businesses.',
  keywords: ['landing pages', 'kashmir', 'business', 'website builder', 'no code'],
  authors: [{ name: 'KashPages Team' }],
  openGraph: {
    title: 'KashPages - Business Landing Pages for Kashmir',
    description: 'Create beautiful landing pages for your business in minutes',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
