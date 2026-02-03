/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compress: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  optimizeFonts: true,
  
  // Configuration for Vercel deployment
  serverRuntimeConfig: {
    // Only available on the server side
    PROJECT_ROOT: __dirname,
  },
  publicRuntimeConfig: {
    // Will be available on both server and client
  },

  // Webpack config for handling binary files if needed
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push('pdfjs-dist');
    }
    return config;
  },

  // Environment variables
  env: {
    API_ROUTE: '/api/upload',
  },
};

module.exports = nextConfig;
