/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: process.env.NODE_ENV === 'production' ? '/terminal-folio' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/terminal-folio/' : '',

  // Image optimization and paths
  images: {
    unoptimized: true,
    domains: ['mikeisfree.github.io'],
    // This ensures images work in both dev and prod
    path: process.env.NODE_ENV === 'production' ? '/terminal-folio/_next/image' : '/_next/image',
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

  // This helps Next.js handle static assets correctly in both environments
  publicRuntimeConfig: {
    basePath: process.env.NODE_ENV === 'production' ? '/terminal-folio' : '',
  },

  // Add support for proper asset path resolution in static export
  env: {
    NEXT_PUBLIC_BASE_PATH: process.env.NODE_ENV === 'production' ? '/terminal-folio' : '',
  }
}

export default nextConfig
