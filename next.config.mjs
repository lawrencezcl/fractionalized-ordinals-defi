/** @type {import('next').NextConfig} */
const nextConfig = {
  // Server configuration for IPv4 accessibility
  serverExternalPackages: [],

  
  // Configure for production builds
  output: 'standalone',

  // Environment variables that should be available on client side
  env: {
    NEXT_PUBLIC_NETWORK_ENV: process.env.NEXT_PUBLIC_NETWORK_ENV || 'development',
    BITCOIN_NETWORK: process.env.BITCOIN_NETWORK || 'testnet',
    STARKNET_NETWORK: process.env.STARKNET_NETWORK || 'goerli-alpha',
  },

  // Configure headers for security and CORS
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },

  // Configure image optimization
  images: {
    domains: [
      'localhost',
      // Add testnet explorer domains
      'testnet.starkscan.co',
      'blockstream.info',
      // Add mainnet domains when ready
      'starkscan.co',
      'magiceden.io',
      'ordinalswallet.com',
      'gamma.io',
      'ordinals.com',
    ],
    formats: ['image/webp', 'image/avif'],
  },

  // Webpack configuration for production
  webpack: (config, { isServer }) => {
    // Handle Bitcoin library modules
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        crypto: false,
        stream: false,
        buffer: false,
      };
    }

    // Optimize for production
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
            },
            common: {
              name: 'common',
              minChunks: 2,
              chunks: 'all',
            },
          },
        },
      };
    }

    return config;
  },

  // Configure TypeScript (keep existing settings for development)
  typescript: {
    ignoreBuildErrors: true,
  },

  // Configure ESLint (keep existing settings for development)
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Configure compression
  compress: true,
}

export default nextConfig
