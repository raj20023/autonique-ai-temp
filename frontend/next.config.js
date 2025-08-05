/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['graph.facebook.com', 'scontent.cdninstagram.com'],
  },
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/:path*`,
      },
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/:path*`,
      },
    ];
  },
  // Ensure proper host binding
  experimental: {
    serverComponentsExternalPackages: [],
  },
}

module.exports = nextConfig
