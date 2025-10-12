# 🚀 StardustEngine Free-Tier Deployment Guide

**Complete deployment guide for hosting StardustEngine on free-tier services with zero costs until monetization.**

## 🎯 Quick Deploy Summary

| Service | Purpose | Free Tier Limit | Deploy Command |
|---------|---------|-----------------|----------------|
| **Vercel** | Frontend Hosting | 100GB bandwidth/month | `npm run deploy:vercel` |
| **GitHub Pages** | Static Hosting | 1GB storage | `npm run deploy:github` |
| **MultiversX DevNet** | Smart Contracts | Unlimited (testnet) | `./deploy-contracts.sh` |
| **Render** | API Backend | 750h/month | `render deploy` |
| **Neon** | PostgreSQL | 512MB database | Auto-provision |
| **Upstash** | Redis Cache | 10K requests/day | Auto-provision |

---

## 🚀 One-Click Deployment

### Prerequisites
```bash
# Required tools
npm install -g vercel@latest
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

### Option 1: Render (Recommended)

**Why Render:**
- ✅ 750 hours/month free (50% more than alternatives)
- ✅ Automatic deployments from GitHub
- ✅ Built-in PostgreSQL and Redis
- ✅ Docker and static site support
- ✅ Free SSL certificates
- ✅ Global CDN included

**Deploy Steps:**
```bash
# 1. Create account at render.com
# 2. Connect GitHub repository
# 3. Create new Web Service
# 4. Configure build and start commands
```

**Render Configuration:**
```yaml
# render.yaml (optional)
services:
  - type: web
    name: stardustengine-api
    env: python
    buildCommand: pip install -r requirements.txt
    startCommand: uvicorn main:app --host 0.0.0.0 --port $PORT
    envVars:
      - key: DATABASE_URL
        fromDatabase:
          name: stardustengine-db
          property: connectionString
      - key: REDIS_URL
        fromService:
          name: stardustengine-redis
          type: redis
          property: connectionString

  - type: postgres
    name: stardustengine-db
    databaseName: stardustengine
    user: stardustengine

  - type: redis
    name: stardustengine-redis
    maxmemoryPolicy: allkeys-lru
```

**Dockerfile for Render:**
```dockerfile
# api/Dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose port (Render provides $PORT)
EXPOSE $PORT

# Start command
CMD uvicorn main:app --host 0.0.0.0 --port $PORT
```

**Manual Deploy:**
```bash
# Connect GitHub repo to Render dashboard
# Set environment variables in Render dashboard
# Enable auto-deploy on git push
```

### Option 2: Vercel Serverless Functions

**For simple API endpoints:**
```python
# api/index.py (Vercel Functions)
from fastapi import FastAPI
from vercel_asgi import VercelASGI

app = FastAPI()

@app.get("/api/health")
async def health():
    return {"status": "healthy"}

@app.get("/api/player/{address}")
async def get_player(address: str):
    # MultiversX contract interaction
    return {"player": address}

app = VercelASGI(app)
```

---

## 📊 Database & Cache

### Neon PostgreSQL (Free)

**Features:**
- ✅ 512MB database free
- ✅ Serverless PostgreSQL
- ✅ Branching for development
- ✅ Automatic scaling
- ✅ Point-in-time recovery

**Setup:**
```bash
# 1. Create account at neon.tech
# 2. Create database
# 3. Get connection string
# 4. Add to environment variables

DATABASE_URL=postgresql://user:pass@host/dbname?sslmode=require
```

**Database Schema:**
```sql
-- Player stats table
CREATE TABLE player_stats (
    wallet_address VARCHAR(62) PRIMARY KEY,
    level INTEGER DEFAULT 1,
    experience BIGINT DEFAULT 0,
    games_played INTEGER DEFAULT 0,
    games_won INTEGER DEFAULT 0,
    assets_owned INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Game assets cache
CREATE TABLE game_assets (
    asset_id BIGINT PRIMARY KEY,
    owner_address VARCHAR(62) NOT NULL,
    asset_type VARCHAR(50) NOT NULL,
    rarity VARCHAR(20) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_assets_owner ON game_assets(owner_address);
CREATE INDEX idx_assets_type ON game_assets(asset_type);
```

### Upstash Redis (Free)

**Features:**
- ✅ 10,000 requests/day
- ✅ 256MB storage
- ✅ Global edge locations
- ✅ REST API support

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
API_URL=https://stardustengine-api.onrender.com
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
RENDER_API_KEY=your_render_api_key
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
# - https://stardustengine-api.onrender.com/health
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

**Render Monitoring:**
```python
# Health check endpoint for monitoring
from fastapi import FastAPI
import time

app = FastAPI()

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": time.time(),
        "service": "stardustengine-api",
        "version": "2.0.0"
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
from sqlalchemy.pool import QueuePool

engine = create_engine(
    DATABASE_URL,
    poolclass=QueuePool,
    pool_size=3,        # Optimized for Render free tier
    max_overflow=2,
    pool_timeout=30,
    pool_recycle=300,   # 5 minutes
    pool_pre_ping=True
)
```

**Caching Strategy:**
```python
# Redis caching for API responses
import redis
from functools import wraps
import json

redis_client = redis.from_url(os.getenv("REDIS_URL"))

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

**Render-Specific Optimizations:**
```python
# Optimize for Render's free tier limitations
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware

app = FastAPI()

# Enable compression
app.add_middleware(GZipMiddleware, minimum_size=1000)

# CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_methods=["*"],
    allow_headers=["*"],
)

# Keep-alive endpoint to prevent cold starts
@app.get("/ping")
async def ping():
    return {"pong": True}
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

**Updated for Render:**
```yaml
# Deploy to Render (via webhook)
- name: 🚀 Deploy to Render
  run: |
    curl -X POST "${{ secrets.RENDER_DEPLOY_HOOK_URL }}" \
      -H "Content-Type: application/json" \
      -d '{"ref": "main"}'
```

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

**Render Deployment Issues:**
```bash
# Check build logs in Render dashboard
# Verify environment variables are set
# Ensure requirements.txt is up to date
# Check if port is configured correctly ($PORT)
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

**Render Cold Start Issues:**
```python
# Keep service warm with cron job or external pinger
# Use UptimeRobot to ping every 5 minutes
# Implement background tasks to maintain connection

import asyncio
from apscheduler.schedulers.asyncio import AsyncIOScheduler

scheduler = AsyncIOScheduler()

@scheduler.scheduled_job('interval', minutes=5)
async def keep_warm():
    # Simple database query to prevent connection timeout
    pass

scheduler.start()
```

**Database Connection Limits:**
```python
# Implement connection pooling optimized for Render
from sqlalchemy.pool import QueuePool

engine = create_engine(
    DATABASE_URL,
    poolclass=QueuePool,
    pool_size=2,        # Reduced for free tier
    max_overflow=1,
    pool_timeout=30,
    pool_recycle=1800   # 30 minutes
)
```

---

## 📈 Scaling Strategy

### When to Upgrade (Revenue Thresholds)

| Metric | Free Tier Limit | Upgrade Trigger | Recommended Service |
|--------|----------------|-----------------|--------------------||
| **Bandwidth** | 100GB/month | >80GB usage | Vercel Pro ($20/month) |
| **API Hours** | 750h/month | >600h usage | Render Pro ($7/month) |
| **Database** | 512MB | >400MB usage | Neon Pro ($19/month) |
| **Build Minutes** | 6K/month | >5K usage | GitHub Pro ($4/month) |

### Migration Path

**Phase 1: Optimize Free Resources (0-$100 MRR)**
- ✅ Implement aggressive caching
- ✅ Optimize bundle sizes
- ✅ Use CDN for static assets
- ✅ Database query optimization
- ✅ Keep Render services warm

**Phase 2: Selective Upgrades ($100-$500 MRR)**
- 🔄 Upgrade to Render Pro ($7/month for better performance)
- 🔄 Add Redis Pro for better caching
- 🔄 Custom domain with Vercel Pro
- 🔄 Upgrade database to Neon Pro

**Phase 3: Full Production ($500+ MRR)**
- 🔄 Move to dedicated infrastructure (AWS/GCP)
- 🔄 Implement microservices architecture
- 🔄 Add comprehensive monitoring and alerting
- 🔄 Multi-region deployment
- 🔄 Load balancing and auto-scaling

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
- **Render Docs**: https://render.com/docs
- **Neon Docs**: https://neon.tech/docs

### **Free Services**
- **Vercel**: https://vercel.com/
- **GitHub Pages**: https://pages.github.com/
- **Render**: https://render.com/
- **Neon**: https://neon.tech/
- **Upstash**: https://upstash.com/
- **UptimeRobot**: https://uptimerobot.com/

---

**Built with ❤️ by George Pricop | [GitHub](https://github.com/Gzeu) | [StardustEngine](https://github.com/Gzeu/StardustEngine)**

*🌟 StardustEngine - Where Gaming Meets Blockchain Innovation on Zero Budget! 🌟*