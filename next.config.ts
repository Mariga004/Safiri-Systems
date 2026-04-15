/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow external access
  experimental: {
    serverActions: true,
  },
}

module.exports = nextConfig