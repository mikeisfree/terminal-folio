import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'

export const metadata: Metadata = {
  title: 'TwistedTransistor',
  description: 'TT Terminal',
  generator: 'dev',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
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