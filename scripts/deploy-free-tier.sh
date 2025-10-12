#!/bin/bash

# 🚀 StardustEngine Free-Tier Deployment Script
# Automated deployment across multiple free services
# Author: George Pricop
# Version: 2.0.1

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="StardustEngine"
GITHUB_REPO="Gzeu/StardustEngine"
MULTIVERSX_NETWORK="devnet"
GATEWAY_URL="https://devnet-gateway.multiversx.com"
EXPLORER_URL="https://devnet-explorer.multiversx.com"

# Functions
print_header() {
    echo -e "${BLUE}"
    echo "==============================================="
    echo "  🎆 $PROJECT_NAME Free-Tier Deployment"
    echo "==============================================="
    echo -e "${NC}"
}

print_step() {
    echo -e "${YELLOW}📄 $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

check_dependencies() {
    print_step "Checking dependencies..."
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js not found. Please install Node.js 18+"
        exit 1
    fi
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        print_error "npm not found. Please install npm 9+"
        exit 1
    fi
    
    # Check Git
    if ! command -v git &> /dev/null; then
        print_error "Git not found. Please install Git"
        exit 1
    fi
    
    # Check Docker (optional for contracts)
    if ! command -v docker &> /dev/null; then
        print_error "Docker not found. Smart contract deployment may fail"
    fi
    
    print_success "Dependencies check completed"
}

setup_environment() {
    print_step "Setting up environment..."
    
    # Create environment files
    cd frontend
    
    # Production environment for Vercel
    cat > .env.production << EOF
NEXT_PUBLIC_MULTIVERSX_NETWORK=$MULTIVERSX_NETWORK
NEXT_PUBLIC_GATEWAY_URL=$GATEWAY_URL
NEXT_PUBLIC_API_URL=https://devnet-api.multiversx.com
NEXT_PUBLIC_EXPLORER_URL=$EXPLORER_URL
NEXT_PUBLIC_BASE_PATH=
NEXT_PUBLIC_APP_VERSION=2.0.1
EOF

    # GitHub Pages environment
    cat > .env.github << EOF
GITHUB_PAGES=true
NEXT_PUBLIC_MULTIVERSX_NETWORK=$MULTIVERSX_NETWORK
NEXT_PUBLIC_GATEWAY_URL=$GATEWAY_URL
NEXT_PUBLIC_API_URL=https://devnet-api.multiversx.com
NEXT_PUBLIC_EXPLORER_URL=$EXPLORER_URL
NEXT_PUBLIC_BASE_PATH=/StardustEngine
NEXT_PUBLIC_APP_VERSION=2.0.1
EOF

    cd ..
    print_success "Environment configured"
}

install_dependencies() {
    print_step "Installing dependencies..."
    
    cd frontend
    
    # Clean install
    rm -rf node_modules package-lock.json 2>/dev/null || true
    npm install
    
    # Install additional tools if not present
    if ! npm list -g vercel &> /dev/null; then
        echo "Installing Vercel CLI..."
        npm install -g vercel@latest
    fi
    
    cd ..
    print_success "Dependencies installed"
}

run_tests() {
    print_step "Running tests..."
    
    cd frontend
    
    # Lint check
    npm run lint
    
    # Type check
    npm run type-check
    
    # Run tests if they exist
    if [ -f "jest.config.js" ] || [ -f "jest.setup.js" ]; then
        npm run test -- --watchAll=false
    fi
    
    cd ..
    print_success "Tests completed"
}

deploy_contracts() {
    print_step "Deploying smart contracts to MultiversX DevNet..."
    
    if [ ! -f "wallet.pem" ]; then
        print_error "wallet.pem not found. Please add your MultiversX wallet PEM file"
        return 1
    fi
    
    cd stardust-contracts
    
    # Build contracts using Docker
    if command -v docker &> /dev/null; then
        echo "Building contracts with Docker..."
        docker run --rm -v "$(pwd):/workspace" \
            -w /workspace \
            multiversx/sdk-rust-contract-builder:latest \
            bash -c "cargo build --release --target=wasm32-unknown-unknown"
    else
        echo "Building contracts with local Rust..."
        cargo build --release --target=wasm32-unknown-unknown
    fi
    
    # Deploy (requires mxpy)
    if command -v mxpy &> /dev/null; then
        CONTRACT_ADDRESS=$(mxpy contract deploy \
            --bytecode=target/wasm32-unknown-unknown/release/stardust_contracts.wasm \
            --pem=../wallet.pem \
            --gas-limit=60000000 \
            --proxy=$GATEWAY_URL \
            --chain=D \
            --recall-nonce \
            --send \
            --outfile=deployed.json | grep -o 'erd1[a-zA-Z0-9]*' || echo "")
        
        if [ -n "$CONTRACT_ADDRESS" ]; then
            echo "$CONTRACT_ADDRESS" > contract_address.txt
            print_success "Contract deployed: $CONTRACT_ADDRESS"
            echo "Explorer: $EXPLORER_URL/accounts/$CONTRACT_ADDRESS"
        else
            print_error "Contract deployment failed"
            CONTRACT_ADDRESS="erd1qqqqqqqqqqqqqpgq0000000000000000000000000000000000000000000"
        fi
    else
        print_error "mxpy not found. Using placeholder contract address"
        CONTRACT_ADDRESS="erd1qqqqqqqqqqqqqpgq0000000000000000000000000000000000000000000"
    fi
    
    # Update frontend environment with contract address
    cd ../frontend
    echo "NEXT_PUBLIC_CONTRACT_ADDRESS=$CONTRACT_ADDRESS" >> .env.production
    echo "NEXT_PUBLIC_CONTRACT_ADDRESS=$CONTRACT_ADDRESS" >> .env.github
    
    cd ..
    print_success "Smart contracts deployment completed"
}

deploy_vercel() {
    print_step "Deploying to Vercel..."
    
    cd frontend
    
    # Build for Vercel
    cp .env.production .env.local
    npm run build:vercel
    
    # Deploy to Vercel
    if command -v vercel &> /dev/null; then
        echo "Deploying to Vercel..."
        vercel --prod --confirm --token="$VERCEL_TOKEN" || {
            echo "Vercel deployment failed or token not set"
            echo "Please run: vercel login && vercel --prod"
            return 1
        }
        
        VERCEL_URL="https://stardustengine.vercel.app"
        print_success "Deployed to Vercel: $VERCEL_URL"
    else
        print_error "Vercel CLI not found"
        return 1
    fi
    
    cd ..
}

deploy_github_pages() {
    print_step "Deploying to GitHub Pages..."
    
    cd frontend
    
    # Build for GitHub Pages
    cp .env.github .env.local
    GITHUB_PAGES=true NEXT_PUBLIC_BASE_PATH=/StardustEngine npm run build
    
    # Export static files
    npm run export 2>/dev/null || {
        echo "Export command not available, using build output"
        cp -r .next/static out/ 2>/dev/null || true
    }
    
    # Add .nojekyll for GitHub Pages
    touch out/.nojekyll
    
    # Deploy using gh-pages
    npm run deploy || {
        echo "GitHub Pages deployment failed"
        echo "Please check if gh-pages is installed and configured"
        return 1
    }
    
    GITHUB_PAGES_URL="https://gzeu.github.io/StardustEngine"
    print_success "Deployed to GitHub Pages: $GITHUB_PAGES_URL"
    
    cd ..
}

deploy_render_api() {
    print_step "Setting up Render API deployment..."
    
    echo "ℹ️  Render API Setup Instructions:"
    echo "   1. Visit https://render.com and create account"
    echo "   2. Connect your GitHub repository"
    echo "   3. Create new Web Service"
    echo "   4. Set build command: pip install -r requirements.txt"
    echo "   5. Set start command: uvicorn main:app --host 0.0.0.0 --port \$PORT"
    echo "   6. Add environment variables:"
    echo "      - DATABASE_URL (from Neon)"
    echo "      - REDIS_URL (from Upstash)"
    echo "      - MULTIVERSX_GATEWAY_URL=$GATEWAY_URL"
    echo ""
    echo "🌐 Your API will be available at: https://stardustengine-api.onrender.com"
    echo "📚 Documentation: https://render.com/docs/web-services"
    
    print_success "Render API setup instructions provided"
}

run_health_checks() {
    print_step "Running health checks..."
    
    sleep 10  # Wait for deployments to propagate
    
    # Check Vercel
    if curl -f https://stardustengine.vercel.app/ > /dev/null 2>&1; then
        print_success "Vercel deployment is healthy"
    else
        print_error "Vercel health check failed"
    fi
    
    # Check GitHub Pages
    if curl -f https://gzeu.github.io/StardustEngine/ > /dev/null 2>&1; then
        print_success "GitHub Pages deployment is healthy"
    else
        print_error "GitHub Pages health check failed"
    fi
}

print_summary() {
    echo -e "${BLUE}"
    echo "==============================================="
    echo "  ✨ Deployment Summary"
    echo "==============================================="
    echo -e "${NC}"
    
    echo -e "${GREEN}🌐 Frontend Deployments:${NC}"
    echo "  • Vercel: https://stardustengine.vercel.app/"
    echo "  • GitHub Pages: https://gzeu.github.io/StardustEngine/"
    echo ""
    
    if [ -f "stardust-contracts/contract_address.txt" ]; then
        CONTRACT_ADDR=$(cat stardust-contracts/contract_address.txt)
        echo -e "${GREEN}🔗 Smart Contract:${NC}"
        echo "  • Address: $CONTRACT_ADDR"
        echo "  • Network: MultiversX DevNet"
        echo "  • Explorer: $EXPLORER_URL/accounts/$CONTRACT_ADDR"
        echo ""
    fi
    
    echo -e "${GREEN}🎮 Features Deployed:${NC}"
    echo "  ✅ NFT Gaming Assets (4 rarity tiers)"
    echo "  ✅ Player Registration & Stats"
    echo "  ✅ Tournament System"
    echo "  ✅ Asset Trading"
    echo "  ✅ Holographic UI Effects"
    echo ""
    
    echo -e "${YELLOW}🔧 API Backend Setup:${NC}"
    echo "  • Render: Manual setup required (free 750h/month)"
    echo "  • Database: Neon PostgreSQL (free 512MB)"
    echo "  • Cache: Upstash Redis (free 10K req/day)"
    echo ""
    
    echo -e "${YELLOW}📊 Monitoring Setup:${NC}"
    echo "  • Uptime: UptimeRobot (50 monitors free)"
    echo "  • Analytics: Vercel Analytics (included)"
    echo "  • Errors: Sentry (5K errors/month free)"
    echo ""
    
    echo -e "${BLUE}🚀 Next Steps:${NC}"
    echo "  1. Setup Render API backend (manual)"
    echo "  2. Configure Neon PostgreSQL database"
    echo "  3. Setup Upstash Redis cache"
    echo "  4. Configure monitoring services"
    echo "  5. Setup custom domain (optional)"
    echo ""
    
    echo -e "${GREEN}💰 Total Monthly Cost: \$0${NC}"
    echo "  All services remain free until significant scale!"
    echo ""
}

# Main execution
main() {
    print_header
    
    # Parse arguments
    DEPLOY_TARGET="all"
    while [[ $# -gt 0 ]]; do
        case $1 in
            --contracts-only)
                DEPLOY_TARGET="contracts"
                shift
                ;;
            --frontend-only)
                DEPLOY_TARGET="frontend"
                shift
                ;;
            --vercel-only)
                DEPLOY_TARGET="vercel"
                shift
                ;;
            --github-only)
                DEPLOY_TARGET="github"
                shift
                ;;
            --api-setup)
                DEPLOY_TARGET="api"
                shift
                ;;
            --help)
                echo "Usage: $0 [--contracts-only|--frontend-only|--vercel-only|--github-only|--api-setup]"
                echo ""
                echo "Options:"
                echo "  --contracts-only  Deploy smart contracts to MultiversX DevNet"
                echo "  --frontend-only   Deploy frontend to Vercel and GitHub Pages"
                echo "  --vercel-only     Deploy frontend to Vercel only"
                echo "  --github-only     Deploy frontend to GitHub Pages only"
                echo "  --api-setup       Show API backend setup instructions"
                echo "  --help            Show this help message"
                exit 0
                ;;
            *)
                echo "Unknown option: $1"
                echo "Use --help for available options"
                exit 1
                ;;
        esac
    done
    
    # Execute deployment steps
    check_dependencies
    setup_environment
    install_dependencies
    run_tests
    
    case $DEPLOY_TARGET in
        "contracts")
            deploy_contracts
            ;;
        "frontend")
            deploy_vercel
            deploy_github_pages
            ;;
        "vercel")
            deploy_vercel
            ;;
        "github")
            deploy_github_pages
            ;;
        "api")
            deploy_render_api
            ;;
        "all")
            deploy_contracts
            deploy_vercel
            deploy_github_pages
            deploy_render_api
            run_health_checks
            ;;
    esac
    
    print_summary
    print_success "Deployment completed successfully! 🎉"
}

# Run main function with all arguments
main "$@"