/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: process.env.NODE_ENV === 'production' ? '/terminal-folio' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/terminal-folio/' : '',

  // Image optimization and paths
  images: {
    unoptimized: true,
    domains: ['mikeisfree.github.io'],
    loader: 'default',
    path: process.env.NODE_ENV === 'production' ? '/terminal-folio' : '',
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
  },

  // Runtime configuration for asset paths
  publicRuntimeConfig: {
    basePath: process.env.NODE_ENV === 'production' ? '/terminal-folio' : '',
  }
}

export default nextConfig
