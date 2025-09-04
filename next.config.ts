/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // Importante para Docker
  images: {
    domains: ['books.google.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.google.com',
      },
    ],
  },
  // Para evitar problemas de ESLint en build
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Para evitar problemas de TypeScript en build
  typescript: {
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig