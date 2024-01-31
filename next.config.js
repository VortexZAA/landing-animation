/** @type {import('next').NextConfig} */
const { env } = require("process");
const nextConfig = {
  compiler: {
    removeConsole: env.NODE_ENV === "production" ? true : false, //false //,
  },
  images: {
    unoptimized: true,
  },

  reactStrictMode: false,
};
module.exports = nextConfig;
