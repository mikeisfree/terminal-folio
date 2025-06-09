import type { Metadata } from 'next'
import './globals.css'
import { VT323 } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider'

export const metadata: Metadata = {
  title: 'TwistedTransistor',
  description: 'TT Terminal',
  generator: 'dev',
}

const vt323 = VT323({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-vt323',
});


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={vt323.variable}>
      <body>

          <ThemeProvider className="pt-4">
            <div className="glAnim gl3" />
            <div className="glAnim gl4" />
            <div className="glAnim gl5" />
            {children}

          </ThemeProvider>
  
      </body>
    </html>
  )
}