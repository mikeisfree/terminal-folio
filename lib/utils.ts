import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import getConfig from 'next/config'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Get runtime config and environment variables
const { publicRuntimeConfig } = getConfig() || { publicRuntimeConfig: {} }
const isDev = process.env.NODE_ENV === 'development'
const basePath = isDev ? '' : (process.env.NEXT_PUBLIC_BASE_PATH || publicRuntimeConfig?.basePath || '/terminal-folio')

// Helper function to clean and construct asset paths
function createAssetPath(path: string, prefix?: string) {
  // Return external URLs as-is
  if (path.startsWith('http')) return path
  
  // Clean the path by removing leading slash and encode special characters
  const cleanPath = path.replace(/^\//, '').split('/').map(part => 
    // Don't encode slashes in the path
    encodeURIComponent(part)
  ).join('/')
  
  // Construct the full path
  const parts = [basePath]
  if (prefix) parts.push(prefix)
  parts.push(cleanPath)
  
  // Join all parts and ensure proper slashes
  return parts.filter(Boolean).join('/').replace(/\/+/g, '/')
}

// Export utility functions for different asset types
export const getAssetPath = (path: string) => createAssetPath(path)
export const getImagePath = (path: string) => createAssetPath(path, 'images')
export const getSoundPath = (path: string) => createAssetPath(path, 'sounds')
export const getVideoPath = (path: string) => createAssetPath(path)
