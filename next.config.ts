/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['books.google.com', 'via.placeholder.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.google.com',
      },
    ],
  },
}

module.exports = nextConfig