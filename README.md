# 🌟 StardustEngine

**Gaming Infrastructure on MultiversX** - Blockchain-powered gaming platform with smart contracts, NFT integration, and cross-game asset management

## 🎮 Overview

StardustEngine is a comprehensive gaming infrastructure built on MultiversX blockchain, designed to power the next generation of Web3 games. It provides developers with tools, smart contracts, and APIs to create immersive gaming experiences with true asset ownership.

## ✨ Key Features

### 🏗️ Infrastructure Components

- **Smart Contract Suite** - Pre-built gaming contracts (NFTs, tokens, marketplace)
- **Cross-Game Assets** - Interoperable items and characters across multiple games
- **Economic Engine** - In-game economies with real value exchange
- **Modern React Frontend** - Professional Web3 gaming dashboard with animations

### 🎯 Gaming Features

- **NFT Gaming Assets** - Weapons, characters, skins as tradeable NFTs
- **Achievement System** - Blockchain-verified accomplishments and badges
- **Tournament Platform** - Competitive gaming with crypto rewards
- **Guild Management** - Decentralized gaming communities

### 🔧 Developer Tools

- **SDK & APIs** - Easy integration for game developers
- **Asset Creator** - Tools for designing and minting game assets
- **Analytics Dashboard** - Real-time game metrics and player insights

### 🌐 Frontend Features

- **React + Next.js 14** - Modern App Router with server-side rendering
- **TypeScript** - Full type safety and developer experience
- **Tailwind CSS** - Custom gaming theme with animations
- **Framer Motion** - Smooth animations and interactions
- **MultiversX Integration** - Seamless wallet connection and contract interaction
- **Responsive Design** - Mobile-first approach with desktop optimization
- **Real-time Dashboard** - Live contract monitoring and interaction

## 🛠️ Tech Stack

|Component|Technology|
|--|--|
|Blockchain|MultiversX (eGLD)|
|Smart Contracts|Rust|
|Backend API|FastAPI (Python)|
|Frontend|React + Next.js 14 + TypeScript|
|Styling|Tailwind CSS + Framer Motion|
|Database|MongoDB|
|Storage|IPFS|
|Testing|Rust + Jest|

## 🚀 Quick Start

### Prerequisites

- Docker Desktop installed and running
- Git installed
- Node.js 18+ and npm 9+ (for frontend)
- MultiversX CLI tools (mxpy)

### 1. Clone Repository

```bash
git clone https://github.com/Gzeu/StardustEngine.git
cd StardustEngine
```

### 2. Start Development Environment

```bash
# Option A: Use Docker development environment
docker run --rm -it -v "$(pwd):/workspace" -p 8080:8080 -p 3000:3000 -p 8000:8000 multiversx/devcontainer-smart-contracts-rust:latest bash

# Option B: Use local development setup
# Install Rust and MultiversX tools locally
```

### 3. Deploy to MultiversX Devnet

#### Automatic Deployment (Recommended)

```bash
# Inside Docker container
cd /workspace

# Create wallet for deployment
mxpy wallet new --format pem --outfile stardust-wallet.pem

# Get testnet funds
mxpy faucet request --pem=stardust-wallet.pem --wallet-url=https://devnet-wallet.multiversx.com --api=https://devnet-api.multiversx.com

# Deploy contract
mxpy contract deploy --bytecode=stardust-contracts/output/stardust-contracts.wasm --pem=stardust-wallet.pem --gas-limit=60000000 --proxy=https://devnet-gateway.multiversx.com --send
```

### 4. Start Modern Frontend

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:3000` with:
- 🎨 Modern React dashboard with animations
- 🔗 MultiversX wallet integration
- 📊 Real-time contract interaction
- 🎮 Gaming features showcase
- 📱 Responsive mobile design

### 5. Start Backend API (Optional)

```bash
# Start FastAPI backend
cd api
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

## 📁 Project Structure

```
StardustEngine/
├── frontend/                 # Modern React Frontend
│   ├── src/
│   │   ├── app/             # Next.js App Router
│   │   │   ├── page.tsx     # Main homepage
│   │   │   ├── layout.tsx   # Root layout
│   │   │   └── globals.css  # Global styles
│   │   ├── components/      # React components
│   │   │   ├── ContractDashboard.tsx
│   │   │   ├── GameShowcase.tsx
│   │   │   ├── WalletConnect.tsx
│   │   │   ├── StatsGrid.tsx
│   │   │   └── ui/          # UI components
│   │   └── types/           # TypeScript types
│   ├── tailwind.config.ts   # Tailwind configuration
│   ├── next.config.js       # Next.js configuration
│   └── package.json         # Dependencies
├── stardust-contracts/       # Smart contracts (Rust)
│   ├── src/
│   │   └── stardust_contracts.rs
│   └── output/              # Compiled WASM
├── api/                     # Backend API (FastAPI)
├── docs/                    # Documentation
├── scripts/                 # Deployment scripts
└── tests/                   # Test suites
```

## 🎯 Frontend Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server (localhost:3000)
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run typecheck    # TypeScript type checking
npm run format       # Format with Prettier

# Testing
npm run test         # Run tests
npm run test:watch   # Run tests in watch mode
```

### Key Frontend Features

#### 🎨 Modern UI Components
- **ContractDashboard** - Interactive smart contract testing
- **WalletConnect** - MultiversX wallet integration with dropdown
- **GameShowcase** - Animated game cards with hover effects
- **StatsGrid** - Real-time platform statistics
- **NetworkStatus** - Connection status indicators

#### ⚡ Animations & Effects
- **Framer Motion** - Smooth page transitions and micro-interactions
- **Glass Morphism** - Modern backdrop blur effects
- **Gradient Animations** - Dynamic color transitions
- **Hover Effects** - Interactive card animations
- **Loading States** - Engaging loading indicators

#### 📱 Responsive Design
- **Mobile-First** - Optimized for mobile devices
- **Tablet Support** - Adaptive layouts for tablets
- **Desktop Enhanced** - Rich desktop experience
- **Touch Interactions** - Mobile-friendly touch targets

## 🎯 Roadmap

### Phase 1: Foundation (Q4 2025) ✅ **COMPLETED**
- [x] **Core smart contracts** - Basic contract with hello/get_version endpoints deployed
- [x] **Modern React Frontend** - Professional dashboard with animations
- [x] **MultiversX Integration** - Wallet connection and contract interaction
- [x] **Docker setup with MultiversX tools**
- [x] **Documentation and tutorials** - Complete setup and deployment guide
- [x] **Testnet deployment** - Contract successfully deployed on MultiversX devnet

### Phase 2: Gaming Features (Q1 2026)
- [ ] NFT asset system with minting and trading
- [ ] Cross-game asset system
- [ ] Achievement and reward mechanisms
- [ ] Tournament platform
- [ ] Guild management system

### Phase 3: Ecosystem (Q2 2026)
- [ ] Developer portal and tools
- [ ] Asset creator interface
- [ ] Analytics and insights dashboard
- [ ] Multi-chain bridges

### Phase 4: Scale (Q3 2026)
- [ ] Mobile SDK
- [ ] AI-powered game balancing
- [ ] Advanced DeFi gaming mechanics
- [ ] Community governance

## 🚀 Deployment

### Frontend Deployment (Vercel)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from frontend directory
cd frontend
vercel
```

### Environment Variables

```env
# Frontend (.env.local)
NEXT_PUBLIC_MULTIVERSX_NETWORK=devnet
NEXT_PUBLIC_CONTRACT_ADDRESS=erd1qqqqqqqqqqqqqpgqfm0kd3wse7ddgtf4haplm3p5mdl90msp634qxrfmt3
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Repository**: [github.com/Gzeu/StardustEngine](https://github.com/Gzeu/StardustEngine)
- **Live Frontend**: Access via `npm run dev` in the frontend directory
- **MultiversX Docs**: [docs.multiversx.com](https://docs.multiversx.com)
- **Next.js Docs**: [nextjs.org/docs](https://nextjs.org/docs)
- **Discord**: [Join our community](#)
- **Twitter**: [@StardustEngine](#)

---

**Built with ❤️ on MultiversX blockchain by [George Pricop](https://github.com/Gzeu)**