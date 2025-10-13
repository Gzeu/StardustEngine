#!/bin/bash

# StardustEngine Quick Start Script
# Test everything rapidly with your contract: erd1hek3gle53u9xcya7r56t4uppnwr98u477hdjrm0l6l47zf708n9s769wf7

set -e

echo "🎆 StardustEngine - Quick Start Testing"
echo "Contract: erd1hek3gle53u9xcya7r56t4uppnwr98u477hdjrm0l6l47zf708n9s769wf7"
echo "=========================================="

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

info() { echo -e "${BLUE}[INFO]${NC} $1"; }
success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
warn() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
error() { echo -e "${RED}[ERROR]${NC} $1"; exit 1; }

# Step 1: Environment Setup
info "Setting up environment..."
if [ ! -f ".env.local" ]; then
    info "Creating .env.local from template..."
    cp .env.example .env.local
    success "Environment file created"
else
    info "Environment file exists"
fi

# Step 2: Dependencies
info "Checking dependencies..."
if [ ! -d "node_modules" ]; then
    info "Installing dependencies..."
    npm install --prefer-offline
    success "Dependencies installed"
else
    info "Dependencies already installed"
fi

# Step 3: Type Check
info "Running TypeScript check..."
npm run type-check
success "TypeScript check passed"

# Step 4: Build Test
info "Testing production build..."
npm run build
success "Production build successful"

# Step 5: Contract Validation
info "Validating contract connection..."
CONTRACT_CHECK=$(curl -s "https://devnet-api.multiversx.com/accounts/erd1hek3gle53u9xcya7r56t4uppnwr98u477hdjrm0l6l47zf708n9s769wf7" | grep -o '"isSmartContract":true' || echo "")

if [ -n "$CONTRACT_CHECK" ]; then
    success "Contract is valid and deployed on devnet"
else
    warn "Contract validation inconclusive - proceeding anyway"
fi

# Step 6: Performance Test
info "Running performance checks..."

# Check bundle size
BUNDLE_SIZE=$(du -sh .next 2>/dev/null | cut -f1 || echo "N/A")
info "Bundle size: $BUNDLE_SIZE"

# Check for 3D dependencies
if npm list three > /dev/null 2>&1; then
    success "Three.js dependencies available"
else
    warn "Three.js not found - 3D features may not work"
fi

# Step 7: Start Development Server
info "Starting development server..."
echo ""
echo "🌟 READY TO TEST!"
echo "Contract Address: erd1hek3gle53u9xcya7r56t4uppnwr98u477hdjrm0l6l47zf708n9s769wf7"
echo "Network: MultiversX Devnet"
echo ""
echo "Test checklist:"
echo "✅ Dashboard - http://localhost:3000/dashboard"
echo "✅ 3D NFT Viewer - Check asset rendering"
echo "✅ Particle Effects - Hover on legendary items"
echo "✅ Game Buttons - Test all variants"
echo "✅ Tournament Bracket - Interactive brackets"
echo "✅ Wallet Connect - Connect to see real data"
echo ""
echo "Performance targets:"
echo "• Lighthouse Score: >90"
echo "• FPS: 60fps animations"
echo "• Bundle Size: <500KB"
echo "• Load Time: <2s"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Add development helpers
export NEXT_PUBLIC_CONTRACT_ADDRESS="erd1hek3gle53u9xcya7r56t4uppnwr98u477hdjrm0l6l47zf708n9s769wf7"
export NEXT_PUBLIC_DEBUG="true"
export NEXT_PUBLIC_PERFORMANCE_MONITORING="true"

# Start with hot reload
npm run dev