/** @type {import('next').NextConfig} */
const nextConfig = {
    outputFileTracingRoot: __dirname,
    turbopack: { root: __dirname },
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'i.pravatar.cc',
        },
      ],
    },
  };

  module.exports = nextConfig;


