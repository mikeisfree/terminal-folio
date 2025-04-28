/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/terminal-folio',
  assetPrefix: '/terminal-folio/',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
  }
}

export default nextConfig
