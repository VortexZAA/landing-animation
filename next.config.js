/** @type {import('next').NextConfig} */
const { env } = require('process');
const nextConfig = {
  compiler: {
    removeConsole: env.NODE_ENV === 'production' ? true : false,
},
  reactStrictMode: false,
}

module.exports = nextConfig
