/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'images.unsplash.com',
      'res.cloudinary.com',
      'firebasestorage.googleapis.com',
    ],
  },
  experimental: {
    serverActions: true,
  },
}

module.exports = nextConfig
