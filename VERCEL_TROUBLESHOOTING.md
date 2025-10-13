# 🔧 StardustEngine - Vercel Deployment Troubleshooting Guide

## 🚨 Quick Diagnosis Steps

### 1. Access Build Logs
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select **StardustEngine** project
3. Click on **Deployments** tab
4. Select the **failed deployment** (red error status)
5. Expand the **"Building"** accordion
6. Look for red sections with **"Error"** keyword

### 2. Common Error Patterns

#### **"Module not found" Error**
```bash
Error: Cannot find module '@multiversx/sdk-dapp'
```
**Solution:** Dependencies not installed in correct directory

#### **"No Build Script Found" Error**
```bash
Error: Missing "build" script
```
**Solution:** Build command pointing to wrong directory

#### **"Build Exceeded Memory Limit"**
```bash
Error: Process terminated due to memory usage
```
**Solution:** Build requires more resources

#### **"Invalid vercel.json Configuration"**
```bash
Error: Invalid configuration in vercel.json
```
**Solution:** Configuration syntax error

## 🔍 Step-by-Step Troubleshooting

### Step 1: Verify Current Configuration

Check that your **vercel.json** matches this exact configuration:

```json
{
  "version": 2,
  "name": "stardustengine",
  "framework": null,
  "buildCommand": "cd frontend && npm install && npm run build:vercel",
  "outputDirectory": "frontend/.next",
  "installCommand": "npm install --workspaces=false && cd frontend && npm install",
  "devCommand": "cd frontend && npm run dev",
  "build": {
    "env": {
      "NODE_VERSION": "20",
      "VERCEL_BUILD_SYSTEM_REPORT": "1"
    }
  }
}
```

### Step 2: Test Build Locally

```bash
# Test exact Vercel build process locally
cd StardustEngine

# Step 1: Install (simulate Vercel install command)
npm install --workspaces=false
cd frontend
npm install

# Step 2: Build (simulate Vercel build command)
npm run build:vercel

# Step 3: Test if build succeeded
ls -la .next/  # Should show build output
```

### Step 3: Check Build System Report

With `VERCEL_BUILD_SYSTEM_REPORT=1`, Vercel will show resource usage:

**Look for these in build logs:**
- **Memory Usage:** Should be < 8192 MB
- **Disk Usage:** Should be < 23 GB
- **Build Duration:** Should be < 45 minutes

### Step 4: Dependency Resolution

**Frontend package.json should have:**
```json
{
  "dependencies": {
    "@multiversx/sdk-dapp": "^5.0.11",
    "@multiversx/sdk-dapp-ui": "^0.0.30",
    "next": "14.2.8",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  }
}
```

## 🚑 Emergency Fixes

### Fix 1: Force Clean Deploy

```bash
# Using Vercel CLI
vercel --prod --force

# Or set environment variable
VERCEL_FORCE_NO_BUILD_CACHE=1
```

### Fix 2: Simplify Build Process

Update **vercel.json** to minimal configuration:

```json
{
  "version": 2,
  "buildCommand": "cd frontend && npm run build:vercel",
  "outputDirectory": "frontend/.next",
  "installCommand": "cd frontend && npm install"
}
```

### Fix 3: Node.js Version Lock

Add to **frontend/package.json**:

```json
{
  "engines": {
    "node": ">=20.13.1",
    "npm": ">=10.5.2"
  }
}
```

### Fix 4: Environment Variables Check

Ensure these are set in Vercel Dashboard:

```bash
NEXT_PUBLIC_MULTIVERSX_NETWORK=devnet
NEXT_PUBLIC_GATEWAY_URL=https://devnet-gateway.multiversx.com
NEXT_PUBLIC_API_URL=https://devnet-api.multiversx.com
NODE_VERSION=20
```

## 📊 Build Resource Limits

### Current Limits (Hobby Plan)
- **Memory:** 8192 MB (8 GB)
- **Disk Space:** 23 GB
- **CPUs:** 2
- **Build Duration:** 45 minutes
- **Cache Size:** 1 GB

### Optimization Tips

1. **Reduce Bundle Size**
   ```bash
   # Analyze bundle size
   npm run analyze --workspace=frontend
   ```

2. **Exclude Dev Dependencies**
   ```bash
   # In vercel.json installCommand
   "installCommand": "cd frontend && npm install --only=production"
   ```

3. **Optimize Images**
   - Use Next.js Image optimization
   - Compress images before commit
   - Use WebP format

## 🔄 Cache Management

### Clear Build Cache

**Method 1: Vercel Dashboard**
1. Go to Deployments → Select deployment
2. Click **"Redeploy"**
3. **Uncheck** "Use existing Build Cache"

**Method 2: Environment Variable**
```bash
VERCEL_FORCE_NO_BUILD_CACHE=1
```

**Method 3: CLI**
```bash
vercel --force
```

### Cache Key Factors
Cache is invalidated when any of these change:
- Team/Account
- Project name
- Framework preset
- Root directory
- Node.js version
- Package manager
- Git branch

## 🚆 Specific Error Solutions

### Error: "Cannot find module '@multiversx/sdk-dapp'"

**Solution:**
```bash
# Update frontend/package.json
npm install @multiversx/sdk-dapp@latest --workspace=frontend
```

### Error: "Build exceeded memory limit"

**Solution:**
1. Upgrade to Vercel Pro for more memory
2. Optimize bundle size
3. Remove unused dependencies

### Error: "Invalid Next.js version detected"

**Solution:**
```json
// In frontend/package.json
{
  "dependencies": {
    "next": "14.2.8"
  }
}
```

### Error: "Build timeout after 45 minutes"

**Solutions:**
1. Optimize build process
2. Remove heavy dependencies
3. Use Vercel Pro for extended build time
4. Split into smaller components

## 📈 Monitoring & Debugging

### Real-time Debugging

1. **Enable Build System Report**
   ```bash
   VERCEL_BUILD_SYSTEM_REPORT=1
   ```

2. **Monitor Build Logs**
   - Watch for memory spikes
   - Check disk usage
   - Monitor build duration

3. **Function Logs**
   - Check API routes performance
   - Monitor serverless function cold starts

### Performance Metrics

- **First Build:** Usually 2-5 minutes (no cache)
- **Cached Build:** Usually 30-90 seconds
- **Memory Usage:** Target < 4 GB for safety
- **Bundle Size:** Target < 50 MB for optimal performance

## 🎯 Action Plan for Current Issues

### Immediate Steps

1. **Check Latest Deployment Logs**
   - Access Vercel Dashboard
   - Find exact error message
   - Note resource usage

2. **Apply Emergency Fix**
   ```bash
   # Force redeploy without cache
   vercel --prod --force
   ```

3. **Test Local Build**
   ```bash
   cd frontend
   npm run build:vercel
   ```

4. **Monitor Results**
   - Check deployment status
   - Verify application loads
   - Test functionality

### Long-term Optimizations

1. **Bundle Analysis**
   ```bash
   npm run analyze --workspace=frontend
   ```

2. **Performance Optimization**
   - Code splitting
   - Lazy loading
   - Image optimization

3. **Dependency Cleanup**
   - Remove unused packages
   - Update to latest versions
   - Use lighter alternatives

## 📞 Emergency Contacts

- **Vercel Status:** https://vercel-status.com/
- **Vercel Community:** https://community.vercel.com/
- **GitHub Issues:** https://github.com/Gzeu/StardustEngine/issues

---

🚨 **Need immediate help?** Check the **Building** logs in your Vercel deployment page for the exact error message, then follow the corresponding solution above.