/** @type {import('next').NextConfig} */
const nextConfig = {
  // Output configuration
  output: 'standalone',
  
  // Image optimization for IPFS and external sources
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ipfs.io',
        pathname: '/ipfs/**'
      },
      {
        protocol: 'https', 
        hostname: 'cloudflare-ipfs.com',
        pathname: '/ipfs/**'
      },
      {
        protocol: 'https',
        hostname: 'gateway.pinata.cloud',
        pathname: '/ipfs/**'
      },
      {
        protocol: 'https',
        hostname: '**.arweave.net'
      }
    ],
    // Optimize for gaming assets
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 86400, // 24 hours
  },

  // Webpack optimizations
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Optimize bundle splitting for gaming components
    config.optimization.splitChunks.cacheGroups = {
      ...config.optimization.splitChunks.cacheGroups,
      threejs: {
        name: 'threejs',
        test: /[\\/]node_modules[\\/](three|@react-three)[\\/]/,
        chunks: 'all',
        priority: 10,
      },
      gaming: {
        name: 'gaming',
        test: /[\\/]src[\\/]components[\\/](ui|tournaments|gaming)[\\/]/,
        chunks: 'all',
        priority: 8,
      }
    };

    // Add alias for cleaner imports
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': require('path').resolve(__dirname, 'src'),
    };

    // Optimize for production
    if (!dev) {
      config.optimization.usedExports = true;
      config.optimization.sideEffects = false;
    }

    return config;
  },

  // Experimental features for performance
  experimental: {
    // App directory (already using)
    appDir: true,
    
    // Optimize CSS
    optimizeCss: true,
    
    // Server components optimization
    serverComponentsExternalPackages: ['three', '@react-three/fiber', '@react-three/drei'],
    
    // Memory optimization
    memoryBasedWorkersCount: true,
  },

  // Compiler optimizations
  compiler: {
    // Remove console.log in production
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn']
    } : false,
  },

  // Performance optimizations
  swcMinify: true,
  compress: true,
  
  // Headers for security and performance
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options', 
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          }
        ]
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=60, stale-while-revalidate=300'
          }
        ]
      },
      {
        source: '/(.*\\.(js|css|png|jpg|jpeg|gif|webp|svg|ico))(.*)$',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      }
    ];
  },

  // Redirects for better UX
  async redirects() {
    return [
      {
        source: '/game',
        destination: '/dashboard',
        permanent: false
      },
      {
        source: '/profile',
        destination: '/dashboard',
        permanent: false
      }
    ];
  },

  // Environment variables validation
  env: {
    NEXT_PUBLIC_BUILD_TIME: new Date().toISOString(),
    NEXT_PUBLIC_BUILD_ID: process.env.VERCEL_GIT_COMMIT_SHA || 'local'
  },

  // TypeScript configuration
  typescript: {
    // Ignore build errors in production (for faster deploys)
    ignoreBuildErrors: process.env.NODE_ENV === 'production'
  },

  // ESLint configuration  
  eslint: {
    // Ignore during builds (handle in CI)
    ignoreDuringBuilds: process.env.NODE_ENV === 'production'
  },

  // Development configuration
  ...(process.env.NODE_ENV === 'development' && {
    // Faster refresh in development
    reactStrictMode: true,
    
    // Better error handling
    onDemandEntries: {
      maxInactiveAge: 25 * 1000,
      pagesBufferLength: 2
    }
  }),

  // Production optimizations
  ...(process.env.NODE_ENV === 'production' && {
    // Generate static sitemap
    trailingSlash: false,
    
    // Optimize builds
    poweredByHeader: false,
    generateEtags: true,
    
    // Bundle analysis
    ...(process.env.ANALYZE === 'true' && {
      webpack: (config, options) => {
        const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
        config.plugins.push(
          new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            openAnalyzer: false,
            reportFilename: options.isServer
              ? '../analyze/server.html'
              : './analyze/client.html'
          })
        );
        return config;
      }
    })
  })
};

// Bundle analyzer
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
});

module.exports = withBundleAnalyzer(nextConfig);