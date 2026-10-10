/** @type {import('next').NextConfig} */
const nextConfig = {
    // Allow phone testing through this Mac’s local network address.
    allowedDevOrigins: ["10.233.130.114"],
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


