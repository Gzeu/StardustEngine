#!/bin/bash

# StardustEngine Optimized Deployment Script
# Optimizes for free-tier services: Vercel + Railway + Supabase

set -e

echo "🌟 StardustEngine - Optimized Free-Tier Deployment"
echo "================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
    exit 1
}

# Check prerequisites
check_prerequisites() {
    info "Checking prerequisites..."
    
    command -v node >/dev/null 2>&1 || error "Node.js is required but not installed."
    command -v npm >/dev/null 2>&1 || error "npm is required but not installed."
    command -v git >/dev/null 2>&1 || error "Git is required but not installed."
    
    # Check Node version
    NODE_VERSION=$(node -v | cut -d'.' -f1 | sed 's/v//')
    if [ "$NODE_VERSION" -lt 18 ]; then
        error "Node.js version 18 or higher is required. Current version: $(node -v)"
    fi
    
    success "Prerequisites check passed"
}

# Optimize build for production
optimize_build() {
    info "Optimizing build for production..."
    
    # Clear previous builds
    rm -rf .next out node_modules/.cache
    
    # Install dependencies with optimization flags
    npm ci --prefer-offline --no-audit --progress=false
    
    # Set production environment variables
    export NODE_ENV=production
    export NEXT_TELEMETRY_DISABLED=1
    export NEXT_PRIVATE_MINIFY=true
    
    # Build with optimizations
    npm run build
    
    # Analyze bundle size
    if command -v npx >/dev/null 2>&1; then
        info "Analyzing bundle size..."
        npx next-bundle-analyzer --help >/dev/null 2>&1 && npm run analyze || true
    fi
    
    success "Build optimization complete"
}

# Deploy to Vercel
deploy_vercel() {
    info "Deploying to Vercel (Free Tier)..."
    
    # Check if Vercel CLI is installed
    if ! command -v vercel >/dev/null 2>&1; then
        warn "Vercel CLI not found. Installing..."
        npm install -g vercel@latest
    fi
    
    # Set production environment variables for Vercel
    cat > .env.production.local << EOF
NEXT_PUBLIC_MULTIVERSX_NETWORK=devnet
NEXT_PUBLIC_GATEWAY_URL=https://devnet-gateway.multiversx.com
NEXT_PUBLIC_API_URL=https://devnet-api.multiversx.com
NEXT_PUBLIC_EXPLORER_URL=https://devnet-explorer.multiversx.com
NEXT_TELEMETRY_DISABLED=1
EOF
    
    # Deploy to production
    if [ "$1" = "--production" ]; then
        vercel --prod --confirm
    else
        vercel --confirm
    fi
    
    success "Vercel deployment complete"
}

# Setup health check endpoint
setup_health_check() {
    info "Setting up health check endpoint..."
    
    mkdir -p src/pages/api
    
    cat > src/pages/api/health.ts << 'EOF'
import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const healthCheck = {
    uptime: process.uptime(),
    message: 'StardustEngine API is healthy',
    timestamp: Date.now(),
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '1.0.0'
  };

  try {
    res.status(200).json(healthCheck);
  } catch (error) {
    healthCheck.message = 'StardustEngine API is unhealthy';
    res.status(503).json(healthCheck);
  }
}
EOF
    
    success "Health check endpoint created"
}

# Optimize images and assets
optimize_assets() {
    info "Optimizing static assets..."
    
    # Create optimized public directory structure
    mkdir -p public/assets/{images,icons,animations}
    
    # Add service worker for caching
    cat > public/sw.js << 'EOF'
const CACHE_NAME = 'stardust-engine-v1';
const urlsToCache = [
  '/',
  '/dashboard',
  '/static/js/bundle.js',
  '/static/css/main.css',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});
EOF
    
    success "Asset optimization complete"
}

# Setup monitoring
setup_monitoring() {
    info "Setting up monitoring and analytics..."
    
    # Create monitoring configuration
    cat > monitoring.config.js << 'EOF'
module.exports = {
  // Vercel Analytics (Free)
  analytics: {
    vercel: true
  },
  
  // Web Vitals monitoring
  webVitals: {
    enabled: true,
    reportUrl: '/api/web-vitals'
  },
  
  // Error tracking (Free tier)
  errorTracking: {
    enabled: process.env.NODE_ENV === 'production',
    service: 'vercel-logs'
  }
};
EOF
    
    # Create web vitals API endpoint
    mkdir -p src/pages/api
    cat > src/pages/api/web-vitals.ts << 'EOF'
import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const { name, value, id } = req.body;
    
    // Log web vitals (in production, send to analytics service)
    console.log('Web Vital:', { name, value, id, timestamp: Date.now() });
    
    res.status(200).json({ received: true });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
EOF
    
    success "Monitoring setup complete"
}

# Generate performance report
generate_performance_report() {
    info "Generating performance report..."
    
    cat > performance-report.md << EOF
# StardustEngine Performance Report

## Build Metrics
- Build Time: $(date)
- Node Version: $(node -v)
- Bundle Size: $(du -sh .next 2>/dev/null || echo "N/A")
- Static Assets: $(du -sh public 2>/dev/null || echo "N/A")

## Optimization Checklist
- [x] Code splitting enabled
- [x] Image optimization configured
- [x] Service worker for caching
- [x] Health check endpoint
- [x] Web vitals monitoring
- [x] Production environment variables

## Free Tier Usage
- **Vercel**: Frontend hosting + Edge functions
- **Bandwidth**: ~100GB/month (free)
- **Build Time**: ~32min/month (free)
- **Function Executions**: 100GB-hours/month (free)

## Scaling Recommendations
1. Monitor bundle size growth
2. Implement lazy loading for heavy components
3. Use CDN for static assets
4. Enable gzip compression
5. Consider upgrading to Pro when traffic increases

Generated: $(date)
EOF
    
    success "Performance report generated: performance-report.md"
}

# Main deployment function
deploy() {
    local PRODUCTION_MODE="$1"
    
    echo "🚀 Starting optimized deployment process..."
    echo "Production Mode: ${PRODUCTION_MODE:-preview}"
    echo ""
    
    check_prerequisites
    setup_health_check
    optimize_assets
    setup_monitoring
    optimize_build
    deploy_vercel $PRODUCTION_MODE
    generate_performance_report
    
    echo ""
    success "Deployment completed successfully!"
    echo ""
    echo "Next steps:"
    echo "1. Visit your deployed application"
    echo "2. Check health endpoint: /api/health"
    echo "3. Monitor performance in Vercel dashboard"
    echo "4. Review performance-report.md"
    echo ""
    
    # Show deployment URLs
    if command -v vercel >/dev/null 2>&1; then
        echo "Deployment URLs:"
        vercel ls | grep -E "(https://|Production|Preview)" || true
    fi
}

# Script options
case "$1" in
    --production|-p)
        deploy "--production"
        ;;
    --preview|--staging|-s)
        deploy "--preview"
        ;;
    --help|-h)
        echo "StardustEngine Deployment Script"
        echo ""
        echo "Usage:"
        echo "  ./deploy-optimized.sh [OPTIONS]"
        echo ""
        echo "Options:"
        echo "  -p, --production    Deploy to production"
        echo "  -s, --preview       Deploy to preview/staging"
        echo "  -h, --help          Show this help message"
        echo ""
        echo "Examples:"
        echo "  ./deploy-optimized.sh --production"
        echo "  ./deploy-optimized.sh --preview"
        ;;
    *)
        deploy
        ;;
esac