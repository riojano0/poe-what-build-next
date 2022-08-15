/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  images: {
    domains: ['icongr.am', 'www.icongr.am', 'https://icongr.am']
  }
}

module.exports = nextConfig
