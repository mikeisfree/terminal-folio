/** @type {import('next').NextConfig} */
const basePath = process.env.NODE_ENV === 'production' ? '/terminal-folio' : ''

const nextConfig = {
  output: 'export',
  basePath,
  assetPrefix: `${basePath}/`,

  // Image optimization and paths
  images: {
    unoptimized: true,
    domains: ['mikeisfree.github.io'],
    path: `${basePath}/images`,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'mikeisfree.github.io',
        pathname: '/terminal-folio/**',
      },
    ],
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
    basePath,
    imagesPath: `${basePath}/images`,
    videosPath: basePath,
    soundsPath: `${basePath}/sounds`,
  }
}

export default nextConfig
