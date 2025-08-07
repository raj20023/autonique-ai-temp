/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['graph.facebook.com', 'scontent.cdninstagram.com'],
  },
  async redirects() {
    return [
      // Force HTTPS redirect for any HTTP request
      {
        source: '/:path*',
        has: [
          {
            type: 'header',
            key: 'x-forwarded-proto',
            value: 'http',
          },
        ],
        destination: 'https://autonique.in/:path*',
        permanent: true,
      },
      // Redirect www to non-www
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.autonique.in',
          },
        ],
        destination: 'https://autonique.in/:path*',
        permanent: true,
      },
      // Catch-all HTTP redirect (additional safety)
      {
        source: '/:path*',
        has: [
          {
            type: 'header',
            key: 'x-forwarded-proto',
            value: '(?!https).*',
          },
        ],
        destination: 'https://autonique.in/:path*',
        permanent: true,
      },
    ];
  },
  async rewrites() {
    // Only add rewrites if API URL is available
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!apiUrl) {
      console.warn('NEXT_PUBLIC_API_URL not set, skipping API rewrites');
      return [];
    }

    return [
      {
        source: '/api/v1/:path*',
        destination: `${apiUrl}/api/v1/:path*`,
      },
      {
        source: '/api/:path*',
        destination: `${apiUrl}/:path*`,
      },
    ];
  },
  // Ensure proper host binding
  experimental: {
    serverComponentsExternalPackages: [],
  },
}

module.exports = nextConfig
