# 🚀 StardustEngine Free-Tier Deployment Guide

**Complete deployment guide for hosting StardustEngine on free-tier services with zero costs until monetization.**

## 🎯 Quick Deploy Summary

| Service | Purpose | Free Tier Limit | Deploy Command |
|---------|---------|-----------------|----------------|
| **Vercel** | Frontend Hosting | 100GB bandwidth/month | `npm run deploy:vercel` |
| **GitHub Pages** | Static Hosting | 1GB storage | `npm run deploy:github` |
| **MultiversX DevNet** | Smart Contracts | Unlimited (testnet) | `./deploy-contracts.sh` |
| **Railway** | API Backend | 500h/month | `railway deploy` |
| **Neon** | PostgreSQL | 512MB database | Auto-provision |
| **Upstash** | Redis Cache | 10K requests/day | Auto-provision |

---

## 🚀 One-Click Deployment

### Prerequisites
```bash
# Required tools
npm install -g vercel@latest
npm install -g @railway/cli
pip install multiversx-sdk-cli

# Clone and setup
git clone https://github.com/Gzeu/StardustEngine.git
cd StardustEngine
chmod +x scripts/deploy-free-tier.sh
```

### Deploy Everything
```bash
# Full deployment (contracts + frontend + API)
./scripts/deploy-free-tier.sh

# Frontend only
./scripts/deploy-free-tier.sh --frontend-only

# Contracts only  
./scripts/deploy-free-tier.sh --contracts-only
```

---

## 🌐 Frontend Deployment

### Option 1: Vercel (Recommended)

**Why Vercel:**
- ✅ Automatic CI/CD from GitHub
- ✅ Global CDN with edge functions
- ✅ 100GB bandwidth/month free
- ✅ Perfect Next.js optimization

**Deploy Steps:**
```bash
cd frontend

# 1. Install Vercel CLI
npm i -g vercel

# 2. Login and link project
vercel login
vercel link

# 3. Set environment variables
vercel env add NEXT_PUBLIC_CONTRACT_ADDRESS
vercel env add NEXT_PUBLIC_MULTIVERSX_NETWORK
vercel env add NEXT_PUBLIC_GATEWAY_URL

# 4. Deploy
npm run build:vercel
vercel --prod
```

**Automatic Deployment:**
1. Connect GitHub repo to Vercel
2. Set environment variables in Vercel dashboard
3. Enable automatic deployments on push to `main`

### Option 2: GitHub Pages

**Why GitHub Pages:**
- ✅ Completely free static hosting
- ✅ Custom domain support
- ✅ Integrated with GitHub workflow
- ✅ 1GB storage limit

**Deploy Steps:**
```bash
cd frontend

# 1. Install gh-pages
npm install --save-dev gh-pages

# 2. Build for GitHub Pages
GITHUB_PAGES=true NEXT_PUBLIC_BASE_PATH=/StardustEngine npm run build

# 3. Export static files
npm run export

# 4. Deploy
npm run deploy:github
```

**GitHub Actions Deployment:**
The included `.github/workflows/deploy-free-tier.yml` automatically deploys to both Vercel and GitHub Pages on every push to `main`.

---

## 🔗 Smart Contracts Deployment

### MultiversX DevNet (Free)

**Setup:**
```bash
# 1. Install MultiversX CLI
pip install multiversx-sdk-cli

# 2. Create wallet (save the PEM file)
mxpy wallet new --format=pem --outfile=wallet.pem

# 3. Get test EGLD from faucet
# Visit: https://devnet-wallet.multiversx.com/
```

**Deploy Contract:**
```bash
cd stardust-contracts

# Build with Docker (recommended)
docker run --rm -v "$(pwd):/workspace" \
  -w /workspace \
  multiversx/sdk-rust-contract-builder:latest \
  bash -c "cargo build --release --target=wasm32-unknown-unknown"

# Deploy to DevNet
mxpy contract deploy \
  --bytecode=target/wasm32-unknown-unknown/release/stardust_contracts.wasm \
  --pem=../wallet.pem \
  --gas-limit=60000000 \
  --proxy=https://devnet-gateway.multiversx.com \
  --chain=D \
  --send
```

**Contract Functions:**
```bash
# Register player
mxpy contract call $CONTRACT_ADDRESS \
  --function="register_player" \
  --pem=wallet.pem \
  --gas-limit=5000000 \
  --send

# Mint NFT asset (1 EGLD for Common)
mxpy contract call $CONTRACT_ADDRESS \
  --function="mint_game_asset" \
  --arguments str:Weapon str:Common str:"Iron Sword" str:"Basic weapon" \
  --value=1000000000000000000 \
  --pem=wallet.pem \
  --gas-limit=15000000 \
  --send
```

---

## 🖥️ API Backend Deployment

### Option 1: Railway (Recommended)

**Why Railway:**
- ✅ 500 hours/month free
- ✅ Automatic deployments
- ✅ Built-in PostgreSQL
- ✅ Docker support

**Deploy Steps:**
```bash
# 1. Install Railway CLI
npm install -g @railway/cli

# 2. Login and initialize
railway login
railway init

# 3. Add PostgreSQL service
railway add postgresql

# 4. Deploy
railway up
```

**Dockerfile for API:**
```dockerfile
# api/Dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Option 2: Render (Alternative)

**Free Tier:** 750 hours/month

```bash
# Connect GitHub repo to Render
# Set environment variables
# Auto-deploy on git push
```

---

## 📊 Database & Cache

### Neon PostgreSQL (Free)

**Features:**
- ✅ 512MB database free
- ✅ Serverless PostgreSQL
- ✅ Branching for development

**Setup:**
```bash
# 1. Create account at neon.tech
# 2. Create database
# 3. Get connection string
# 4. Add to environment variables

DATABASE_URL=postgresql://user:pass@host/dbname?sslmode=require
```

### Upstash Redis (Free)

**Features:**
- ✅ 10,000 requests/day
- ✅ 256MB storage
- ✅ Global edge locations

**Setup:**
```bash
# 1. Create account at upstash.com
# 2. Create Redis database
# 3. Get connection details

REDIS_URL=rediss://username:password@host:port
```

---

## 📏 Environment Configuration

### Production Environment (.env.production)
```bash
# MultiversX Configuration
NEXT_PUBLIC_MULTIVERSX_NETWORK=devnet
NEXT_PUBLIC_GATEWAY_URL=https://devnet-gateway.multiversx.com
NEXT_PUBLIC_API_URL=https://devnet-api.multiversx.com
NEXT_PUBLIC_EXPLORER_URL=https://devnet-explorer.multiversx.com

# Contract Address (update after deployment)
NEXT_PUBLIC_CONTRACT_ADDRESS=erd1qqqqqqqqqqqqqpgq...

# API Configuration
API_URL=https://your-api.railway.app
DATABASE_URL=postgresql://...
REDIS_URL=redis://...

# Monitoring
SENTRY_DSN=https://...
UPTIME_ROBOT_API_KEY=...
```

### GitHub Secrets (for CI/CD)
```bash
# Required secrets in GitHub repository settings:
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_org_id
VERCEL_PROJECT_ID=your_project_id
MULTIVERSX_WALLET_PEM=your_wallet_pem_content
RAILWAY_TOKEN=your_railway_token
```

---

## 📋 Monitoring & Analytics

### Free Monitoring Stack

**Uptime Monitoring:**
```bash
# UptimeRobot (Free: 50 monitors)
# Monitor URLs:
# - https://stardustengine.vercel.app
# - https://gzeu.github.io/StardustEngine
# - https://your-api.railway.app/health
```

**Error Tracking:**
```javascript
// Sentry (Free: 5K errors/month)
import * as Sentry from "@sentry/nextjs"

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
})
```

**Analytics:**
```javascript
// Vercel Analytics (included free)
import { Analytics } from '@vercel/analytics/react'

export default function App({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <Analytics />
    </>
  )
}
```

---

## ⚙️ Performance Optimization

### Frontend Optimizations

**Bundle Size Reduction:**
```javascript
// next.config.js optimizations
const nextConfig = {
  experimental: {
    optimizePackageImports: [
      '@heroicons/react',
      '@multiversx/sdk-dapp',
      'framer-motion'
    ]
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production'
  }
}
```

**Image Optimization:**
```javascript
// Automatic optimization for free hosting
images: {
  unoptimized: true, // For static export
  formats: ['image/avif', 'image/webp'],
  minimumCacheTTL: 31536000
}
```

### API Optimizations

**Connection Pooling:**
```python
# Optimize for free PostgreSQL limits
from sqlalchemy import create_engine

engine = create_engine(
    DATABASE_URL,
    pool_size=5,
    max_overflow=0,
    pool_pre_ping=True,
    pool_recycle=300
)
```

**Caching Strategy:**
```python
# Redis caching for API responses
import redis
from functools import wraps

def cache_response(expiration=3600):
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            cache_key = f"{func.__name__}:{hash(str(args)+str(kwargs))}"
            cached = redis_client.get(cache_key)
            
            if cached:
                return json.loads(cached)
            
            result = await func(*args, **kwargs)
            redis_client.setex(cache_key, expiration, json.dumps(result))
            return result
        return wrapper
    return decorator
```

---

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow

The included workflow (`.github/workflows/deploy-free-tier.yml`) provides:

- ✅ **Automated Testing:** Contract tests + Frontend tests
- ✅ **Multi-Target Deployment:** Vercel + GitHub Pages + DevNet
- ✅ **Environment Management:** Separate configs per target
- ✅ **Health Checks:** Post-deployment verification
- ✅ **Deployment Summary:** Detailed deployment report

**Trigger Deployment:**
```bash
# Automatic on push to main
git push origin main

# Manual trigger via GitHub UI
# Actions > Deploy StardustEngine Free-Tier > Run workflow
```

---

## 🔍 Troubleshooting

### Common Issues

**Build Failures:**
```bash
# Clear caches
npm run clean
rm -rf node_modules package-lock.json
npm install

# Check Node.js version
node --version # Should be 18+
npm --version  # Should be 9+
```

**Contract Deployment Errors:**
```bash
# Check wallet balance
mxpy account get --address=$YOUR_ADDRESS --proxy=https://devnet-gateway.multiversx.com

# Request test EGLD
# Visit: https://devnet-wallet.multiversx.com/

# Check gas limits
# Increase if deployment fails
```

**Vercel Deployment Issues:**
```bash
# Check build output
npm run build

# Verify environment variables
vercel env ls

# Check function timeouts
# Ensure API calls complete within 10s (free tier)
```

### Performance Issues

**Slow Load Times:**
- ✅ Enable Vercel Analytics to identify bottlenecks
- ✅ Optimize images with `next/image`
- ✅ Implement code splitting for large components
- ✅ Use React.lazy() for non-critical components

**Database Connection Limits:**
```python
# Implement connection pooling
from sqlalchemy.pool import QueuePool

engine = create_engine(
    DATABASE_URL,
    poolclass=QueuePool,
    pool_size=3,        # Reduced for free tier
    max_overflow=2,
    pool_timeout=30,
    pool_recycle=1800
)
```

---

## 📈 Scaling Strategy

### When to Upgrade (Revenue Thresholds)

| Metric | Free Tier Limit | Upgrade Trigger | Recommended Service |
|--------|----------------|-----------------|--------------------|
| **Bandwidth** | 100GB/month | >80GB usage | Vercel Pro ($20/month) |
| **API Requests** | 10K/day | >8K daily | Railway Pro ($5/month) |
| **Database** | 512MB | >400MB usage | Neon Pro ($19/month) |
| **Build Minutes** | 6K/month | >5K usage | GitHub Pro ($4/month) |

### Migration Path

**Phase 1: Optimize Free Resources (0-$100 MRR)**
- ✅ Implement aggressive caching
- ✅ Optimize bundle sizes
- ✅ Use CDN for static assets
- ✅ Database query optimization

**Phase 2: Selective Upgrades ($100-$500 MRR)**
- 🔄 Upgrade database to paid tier
- 🔄 Add Redis Pro for better caching
- 🔄 Custom domain with Vercel Pro

**Phase 3: Full Production ($500+ MRR)**
- 🔄 Move to dedicated infrastructure
- 🔄 Implement microservices
- 🔄 Add monitoring and alerting
- 🔄 Multi-region deployment

---

## 🔗 Useful Links

### **Live Deployments**
- **Vercel**: https://stardustengine.vercel.app/
- **GitHub Pages**: https://gzeu.github.io/StardustEngine/
- **Repository**: https://github.com/Gzeu/StardustEngine

### **Documentation**
- **MultiversX Docs**: https://docs.multiversx.com/
- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Railway Docs**: https://docs.railway.app/

### **Free Services**
- **Vercel**: https://vercel.com/
- **GitHub Pages**: https://pages.github.com/
- **Railway**: https://railway.app/
- **Neon**: https://neon.tech/
- **Upstash**: https://upstash.com/

---

**Built with ❤️ by George Pricop | [GitHub](https://github.com/Gzeu) | [StardustEngine](https://github.com/Gzeu/StardustEngine)**

*🌟 StardustEngine - Where Gaming Meets Blockchain Innovation on Zero Budget! 🌟*