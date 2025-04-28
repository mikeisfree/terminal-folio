"use client"

import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext({ theme: 'dark' })

interface ThemeProviderProps {
  children: React.ReactNode
  className?: string
}

export function ThemeProvider({ children, className }: ThemeProviderProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    document.documentElement.setAttribute('data-theme', 'dark')
    document.documentElement.style.colorScheme = 'dark'
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <ThemeContext.Provider value={{ theme: 'dark' }}>
      <div className={className}>
        {children}
      </div>
    </ThemeContext.Provider>
  )
}

