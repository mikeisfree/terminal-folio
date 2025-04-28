import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import getConfig from 'next/config'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const { publicRuntimeConfig } = getConfig() || { publicRuntimeConfig: {} }

export function getAssetPath(path: string) {
  if (path.startsWith('http')) return path
  return `${publicRuntimeConfig.basePath || ''}${path}`
}

export function getImagePath(name: string) {
  if (name.startsWith('http')) return name
  return `${publicRuntimeConfig.imagesPath || '/images/'}${name}`
}

export function getSoundPath(name: string) {
  if (name.startsWith('http')) return name
  return `${publicRuntimeConfig.soundsPath || '/sounds/'}${name}`
}

export function getVideoPath(name: string) {
  if (name.startsWith('http')) return name
  return `${publicRuntimeConfig.videosPath || '/'}${name}`
}
