/** @type {import('next').NextConfig} */
const nextConfig = {
  //comment out for developmnet
  // output: 'export',
  // basePath: '/terminal-neon-v2',
  // assetPrefix: '/terminal-neon-v2/',
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
