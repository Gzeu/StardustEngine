# Vercel Frontend Deployment & Configuration
## StardustEngine dApp (Next.js) on Vercel

Complete guide for deploying the Next.js frontend to Vercel and configuring it to communicate with the Cloud Run backend.

### Prerequisites
- Node.js 18+ installed locally
- npm or yarn package manager
- Vercel account (sign up at https://vercel.com)
- GitHub account with push access to StardustEngine repo
- Cloud Run backend URL (from GCP-SETUP.md)

### Step 1: Connect GitHub to Vercel

1. Go to https://vercel.com/dashboard
2. Click "Add New" → "Project"
3. Select "Import Git Repository"
4. Search for "StardustEngine" and click "Import"
5. Choose your GitHub account and click "Continue"
6. Grant Vercel access to your GitHub repositories

### Step 2: Configure Build & Deployment Settings

In the Vercel import dialog:

**Framework Preset:** Next.js  
**Root Directory:** `./frontend`  
**Build Command:** `npm run build`  
**Output Directory:** `.next`  
**Install Command:** `npm install`  

Click "Deploy"

### Step 3: Set Environment Variables

After initial deploy, go to **Project Settings** → **Environment Variables** and add:

```
NEXT_PUBLIC_API_URL=https://stardust-api-xxxxx.a.run.app
```

**Important:** Replace `stardust-api-xxxxx.a.run.app` with your actual Cloud Run service URL.

#### All Required Env Vars:

```
# Backend API (Public - used by browser)
NEXT_PUBLIC_API_URL=https://stardust-api-xxxxx.a.run.app

# MultiversX Network Configuration
NEXT_PUBLIC_MULTIVERSX_ENV=mainnet  # or 'devnet' / 'testnet'
NEXT_PUBLIC_MULTIVERSX_API_URL=https://api.multiversx.com
NEXT_PUBLIC_MULTIVERSX_EXPLORER_URL=https://explorer.multiversx.com

# Contracts (if using)
NEXT_PUBLIC_GAME_CONTRACT=erd1xxxxx...  # Your game contract address

# Analytics (Optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX  # Google Analytics ID
```

### Step 4: Redeploy with Environment Variables

Option A: **Automatic (Recommended)**
- Commit and push any change to `main` branch
- Vercel automatically rebuilds with new env vars

Option B: **Manual Redeploy**
- Go to Vercel project dashboard
- Click "Deployments"
- Find the latest deployment
- Click "•••" → "Redeploy"

### Step 5: Configure Custom Domain (Optional)

In **Settings** → **Domains**:

1. Click "Add Domain"
2. Enter your domain (e.g., `game.example.com`)
3. Add the DNS records shown by Vercel to your domain registrar
4. Wait for DNS propagation (usually 5-30 minutes)

### Step 6: Enable Production Deployments

To automatically deploy when pushing to main:

1. Go to **Settings** → **Git**
2. Ensure "Production Branch" is set to `main`
3. Enable "Automatic Git Integration"

### Step 7: Local Development with Environment Variables

Create `.env.local` in the `frontend` folder:

```bash
cd frontend
echo 'NEXT_PUBLIC_API_URL=http://localhost:8000' > .env.local
echo 'NEXT_PUBLIC_MULTIVERSX_ENV=devnet' >> .env.local
```

Start dev server:
```bash
npm run dev
# Visit http://localhost:3000
```

### Step 8: Test Backend Connectivity

In your Next.js component, test the API connection:

```typescript
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

fetch(`${apiUrl}/health`)
  .then(res => res.json())
  .then(data => console.log('Backend connected:', data))
  .catch(err => console.error('Backend error:', err));
```

### Frontend Build Output

After deployment, verify:
- **Project URL:** `https://stardust-engine-prod.vercel.app` (auto-generated)
- **Custom Domain:** `https://yourdomain.com` (if configured)
- **Status:** Check deployment page for any build errors

### Monitoring & Logs

**Vercel Analytics:**
- Dashboard shows deploy history
- Real-time deployment status
- Performance metrics
- Edge Function logs

**Check Live Logs:**
```bash
# From local terminal with Vercel CLI
vercel logs
vercel logs --follow  # Live streaming
```

### Common Issues

**Next.js Build Fails:**
- Check build logs in Vercel dashboard
- Ensure all dependencies in `package.json` are correct
- Run locally: `cd frontend && npm run build`

**API URL Not Working:**
- Verify Cloud Run URL is correct and deployed
- Check CORS configuration on backend
- Test manually: `curl https://stardust-api-xxxxx.a.run.app/health`

**Environment Variables Not Loading:**
- Redeploy after adding env vars
- Ensure vars use `NEXT_PUBLIC_` prefix for browser access
- Clear Vercel cache: **Settings** → **Advanced** → "Clear Build Cache"

**401/403 API Errors:**
- Cloud Run might need `--allow-unauthenticated` flag
- Or configure proper authentication headers in Next.js

### Production Checklist

- [ ] Backend deployed to Cloud Run and running
- [ ] Frontend deployed to Vercel
- [ ] Environment variables set correctly
- [ ] API connectivity tested
- [ ] Custom domain configured (if needed)
- [ ] CORS enabled on backend
- [ ] SSL certificate auto-enabled on Vercel
- [ ] Analytics monitoring configured
- [ ] Error tracking setup (Sentry, etc.)
- [ ] Database backups configured

### Cost Estimates

**Vercel Free Tier Includes:**
- Unlimited deployments from Git
- Unlimited bandwidth
- Up to 100 serverless functions
- Basic analytics

**Cloud Run + Vercel Estimated Monthly Cost:**
- Vercel: ~$0 (free tier)
- Cloud Run: ~$0-10 (depends on traffic)
- **Total:** Very cost-effective for MVP

### Rollback to Previous Deployment

If something breaks:

1. Go to **Deployments** on Vercel
2. Find the previous stable deployment
3. Click **•••** → **Set as Production**
4. Or use Vercel CLI: `vercel rollback`

### Next Steps

1. ✅ Deploy backend to Cloud Run
2. ✅ Deploy frontend to Vercel
3. Configure WebSocket for real-time features (optional)
4. Set up error tracking (Sentry)
5. Configure CDN for static assets
6. Add authentication (if needed)
7. Monitor performance with Web Vitals
