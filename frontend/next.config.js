/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['graph.facebook.com', 'scontent.cdninstagram.com', 'autonique-ai.s3.ap-northeast-3.amazonaws.com'],
  },
}

module.exports = nextConfig
