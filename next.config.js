/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'lh3.googleusercontent.com',  // For Google profile pictures
      'avatars.githubusercontent.com', // For GitHub avatars (if you add GitHub auth)
      'localhost'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      },
    ],
  },
  transpilePackages: ['@supabase/supabase-js'],
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      'fs': false,
      'net': false,
      'tls': false,
    };
    return config;
  },
}

module.exports = nextConfig
