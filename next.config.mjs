/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/terminal-folio',
  assetPrefix: '/terminal-folio/',
  // Asset configurations
  images: {
    unoptimized: true,
    path: '/terminal-folio/images/',
    domains: ['mikeisfree.github.io']
  },
  // Custom asset paths for public directory
  publicRuntimeConfig: {
    basePath: '/terminal-folio',
    mediaPath: '/terminal-folio/',
    imagesPath: '/terminal-folio/images/',
    soundsPath: '/terminal-folio/sounds/',
    videosPath: '/terminal-folio/'
  },
  // Development configurations
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
  }
}

export default nextConfig
