/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '',
  assetPrefix: '',

  // Image optimization and paths
  images: {
    unoptimized: true,
    domains: ['twistedtransistor.is-a.dev'],
    loader: 'default',
    path: '',
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
    basePath: '',
  }
}

export default nextConfig
