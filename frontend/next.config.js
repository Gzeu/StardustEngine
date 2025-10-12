/** @type {import('next').NextConfig} */
const isGitHubPages = process.env.GITHUB_PAGES === 'true'
const isProduction = process.env.NODE_ENV === 'production'
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''

const nextConfig = {
  // Enable static export for GitHub Pages
  output: isGitHubPages ? 'export' : undefined,
  
  // Dynamic base path configuration
  basePath: basePath,
  assetPrefix: isGitHubPages ? '/StardustEngine/' : '',
  
  // Trailing slash for better static hosting
  trailingSlash: true,
  
  // Image optimization
  images: {
    unoptimized: isGitHubPages, // Required for static export
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31536000, // 1 year cache
    domains: [
      'localhost',
      'devnet-explorer.multiversx.com',
      'api.multiversx.com',
      'devnet-api.multiversx.com',
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  
  // Performance optimizations
  experimental: {
    appDir: true,
    optimizeCss: true,
    optimizePackageImports: [
      '@heroicons/react',
      '@multiversx/sdk-dapp',
      'framer-motion'
    ],
    webpackBuildWorker: true
  },
  
  // Compiler optimizations
  compiler: {
    removeConsole: isProduction,
    reactRemoveProperties: isProduction,
  },
  
  // API rewrites (disabled for static export)
  async rewrites() {
    if (isGitHubPages) return []
    return [
      {
        source: '/api/:path*',
        destination: process.env.NODE_ENV === 'production' 
          ? '/api/:path*' 
          : 'http://localhost:8000/:path*',
      },
    ]
  },
  
  // Headers for security and performance
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          }
        ]
      }
    ]
  },
  
  // Redirects for better UX (disabled for static export)
  async redirects() {
    if (isGitHubPages) return []
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true
      }
    ]
  },
  
  // Webpack configuration for MultiversX and WASM
  webpack: (config, { dev, isServer }) => {
    // Handle WebAssembly files
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
      layers: true,
    }

    // Handle .wasm files
    config.module.rules.push({
      test: /\.wasm$/,
      type: 'webassembly/async',
    })

    // Resolve fallbacks for Node.js modules in browser
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      os: false,
      crypto: false,
      stream: false,
      http: false,
      https: false,
      zlib: false,
      url: false,
    }
    
    // Bundle analysis
    if (process.env.ANALYZE === 'true') {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'server',
          openAnalyzer: true,
        })
      )
    }

    return config
  },
  
  // Environment variables
  env: {
    CUSTOM_KEY: 'my-value',
    MULTIVERSX_NETWORK: process.env.MULTIVERSX_NETWORK || 'devnet',
    CONTRACT_ADDRESS: process.env.CONTRACT_ADDRESS || process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || 'erd1qqqqqqqqqqqqqpgqfm0kd3wse7ddgtf4haplm3p5mdl90msp634qxrfmt3',
    NEXT_PUBLIC_APP_VERSION: process.env.npm_package_version || '2.0.0'
  },
  
  // TypeScript and ESLint configuration
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  
  // Additional optimizations
  poweredByHeader: false,
  reactStrictMode: true,
  swcMinify: true,
  compress: true,
  generateEtags: true,
  httpAgentOptions: {
    keepAlive: true,
  },
}

module.exports = nextConfig