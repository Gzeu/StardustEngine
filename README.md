# 🌟 StardustEngine

**Next-Generation NFT Gaming Platform on MultiversX** - Complete blockchain gaming infrastructure with smart contracts, NFT integration, holographic UI, and cross-game asset management.

![Version](https://img.shields.io/badge/version-2.0.0-blue)
![MultiversX](https://img.shields.io/badge/MultiversX-Smart%20Contracts-green)
![React](https://img.shields.io/badge/React-18.2.0-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## 🎮 Overview

StardustEngine is a revolutionary NFT gaming platform that combines cutting-edge blockchain technology with spectacular user experiences. Built on MultiversX blockchain, it provides developers and players with a complete ecosystem for creating, trading, and experiencing Web3 games with true asset ownership.

### ✨ Key Features

#### 🎲 NFT Gaming Infrastructure
- **Smart Contract Suite** - Complete Rust-based gaming contracts with 13,000+ lines of code
- **NFT Asset System** - Weapons, characters, skins with rarity tiers (Common to Legendary)
- **Cross-Game Assets** - Use items across multiple games in the ecosystem
- **Player Progression** - Level up, gain experience, unlock achievements
- **Tournament Platform** - Competitive gaming with EGLD prize pools

#### 💻 Modern Frontend Experience
- **React + Next.js 14** - Modern App Router with server-side rendering
- **Holographic UI** - Spectacular 3D effects and particle systems
- **Framer Motion** - Smooth animations and interactions
- **MultiversX Integration** - Seamless wallet connection and contract interaction
- **Mobile-First Design** - Responsive across all devices

#### 🔗 Blockchain Integration
- **Player Registration** - On-chain player profiles and statistics
- **Asset Minting** - Create NFT gaming assets with custom properties
- **Asset Trading** - Transfer ownership between players
- **Tournament System** - Create and join competitive events
- **Achievement Tracking** - Blockchain-verified accomplishments

## 📊 Latest Updates (v2.0.0)

✅ **Phase 2 Complete** - Full gaming platform implementation
- ✓ Comprehensive smart contract with NFT gaming functionality
- ✓ Complete React frontend with gaming dashboard
- ✓ Player registration and statistics system
- ✓ NFT asset minting with 4 rarity tiers (1-10 EGLD)
- ✓ Asset collection gallery with animations
- ✓ Tournament creation and participation
- ✓ Holographic UI effects integration
- ✓ Mobile-responsive design

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and npm 9+
- **Docker Desktop** (for smart contract development)
- **Git** for version control
- **MultiversX CLI** tools (mxpy)

### 1️⃣ Clone Repository

```bash
git clone https://github.com/Gzeu/StardustEngine.git
cd StardustEngine
```

### 2️⃣ Smart Contract Deployment

```bash
# Start MultiversX development environment
./docker-dev.sh

# Inside Docker container, deploy to devnet
./deploy.sh
```

### 3️⃣ Frontend Setup

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Copy environment configuration
cp .env.example .env.local

# Update contract address in .env.local
# NEXT_PUBLIC_CONTRACT_ADDRESS=your_deployed_contract_address
```

### 4️⃣ Start Development

```bash
# Start frontend development server
npm run dev

# Open browser at http://localhost:3000
```

## 📱 Project Structure

```
StardustEngine/
├── frontend/                    # React Frontend Application
│   ├── src/
│   │   ├── app/                # Next.js App Router
│   │   │   ├── page.tsx         # Main homepage with navigation
│   │   │   ├── layout.tsx       # Root layout
│   │   │   └── globals.css      # Global styles + hologram effects
│   │   └── components/         # React Components
│   │       ├── GameContract.tsx # Gaming platform interface
│   │       ├── HologramDemo.tsx # 3D holographic effects
│   │       ├── ContractDashboard.tsx
│   │       └── WalletConnect.tsx
│   ├── package.json           # Dependencies & scripts
│   ├── tailwind.config.ts     # Tailwind configuration
│   ├── next.config.js         # Next.js configuration
│   └── .env.example           # Environment variables template
├── stardust-contracts/        # Smart Contracts (Rust)
│   ├── src/
│   │   └── stardust_contracts.rs  # Main gaming contract (13k+ lines)
│   └── output/                # Compiled WASM
├── deploy.sh                  # Automated deployment script
├── docker-dev.sh              # Development environment setup
└── README.md                  # This file
```

## 🎮 Gaming Platform Features

### 👤 Player Management

```typescript
// Register new player
register_player()

// Get player statistics
get_player_stats(player_address)

// Update experience
update_player_experience(player, exp_gained)
```

### ⚔️ NFT Asset System

#### Asset Types
- **Weapon** - Swords, guns, magical staffs
- **Character** - Heroes, avatars, companions
- **Skin** - Visual customizations and appearances
- **Consumable** - Potions, power-ups, resources
- **Vehicle** - Mounts, ships, transportation
- **Structure** - Buildings, bases, defensive items

#### Rarity Tiers & Pricing
- **Common** - 1 EGLD (Gray)
- **Rare** - 2 EGLD (Blue)
- **Epic** - 5 EGLD (Purple)
- **Legendary** - 10 EGLD (Gold)

```bash
# Mint Epic Weapon example
mxpy contract call $CONTRACT_ADDRESS \
  --function="mint_game_asset" \
  --arguments str:Weapon str:Epic str:"Dragon Slayer" str:"Legendary sword forged in dragon fire" \
  --value=5000000000000000000 \
  --pem=wallet.pem \
  --gas-limit=15000000 \
  --proxy=https://devnet-gateway.multiversx.com \
  --chain=D
```

### 🏆 Tournament System

```bash
# Create tournament with 5 EGLD prize pool
mxpy contract call $CONTRACT_ADDRESS \
  --function="create_tournament" \
  --arguments str:"Epic Battle Royale" 1000000000000000000 64 $(($(date +%s) + 3600)) \
  --value=5000000000000000000 \
  --pem=wallet.pem \
  --gas-limit=12000000

# Join tournament with entry fee
mxpy contract call $CONTRACT_ADDRESS \
  --function="join_tournament" \
  --arguments 1 \
  --value=1000000000000000000 \
  --pem=wallet.pem \
  --gas-limit=8000000
```

## 💻 Frontend Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server (localhost:3000)
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run type-check   # TypeScript type checking

# Testing
npm run test         # Run Jest tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Generate coverage report
```

### Key Components

#### 🎮 GameContract Component
- Player registration interface
- NFT asset minting with rarity selection
- Asset collection gallery
- Player statistics dashboard
- Transaction handling with feedback

#### ✨ Holographic Effects
- 3D pyramid projections
- Particle animation systems
- Glitch text effects
- Interactive game previews
- Mobile-optimized animations

### Environment Configuration

```bash
# Copy and configure environment variables
cp .env.example .env.local

# Key variables to update:
NEXT_PUBLIC_CONTRACT_ADDRESS=your_deployed_contract_address
NEXT_PUBLIC_MULTIVERSX_NETWORK=devnet  # or testnet, mainnet
NEXT_PUBLIC_GATEWAY_URL=https://devnet-gateway.multiversx.com
```

## 🔧 Smart Contract Development

### Contract Functions

| Function | Description | Gas Limit |
|----------|-------------|----------|
| `register_player()` | Register new player profile | 5M |
| `mint_game_asset()` | Create NFT gaming asset | 15M |
| `transfer_asset()` | Transfer asset ownership | 10M |
| `create_tournament()` | Create competitive event | 12M |
| `join_tournament()` | Enter tournament | 8M |
| `get_player_stats()` | Query player data | Read-only |
| `get_asset()` | Get asset details | Read-only |

### Data Structures

```rust
// Main asset structure
pub struct GameAsset<M: ManagedTypeApi> {
    pub id: u64,
    pub owner: ManagedAddress<M>,
    pub asset_type: AssetType,  // Weapon, Character, Skin, etc.
    pub rarity: Rarity,         // Common, Rare, Epic, Legendary
    pub name: ManagedBuffer<M>,
    pub description: ManagedBuffer<M>,
    pub created_at: u64,
    pub level: u32,
    pub experience: u64,
}

// Player statistics
pub struct PlayerStats<M: ManagedTypeApi> {
    pub level: u32,
    pub experience: u64,
    pub games_played: u32,
    pub games_won: u32,
    pub assets_owned: u32,
    pub achievements: ManagedVec<M, ManagedBuffer<M>>,
}
```

## 📊 Technology Stack

### Blockchain Layer
- **MultiversX** - High-performance blockchain platform
- **Rust** - Smart contract development language
- **WASM** - WebAssembly compilation target
- **ESDT** - Enhanced Standard Digital Tokens (NFTs)

### Frontend Layer
- **React 18.2** - Modern UI library with hooks
- **Next.js 14** - App Router with SSR capabilities
- **TypeScript 5.2** - Type-safe JavaScript development
- **Framer Motion 10** - Production-ready motion library
- **Tailwind CSS 3.3** - Utility-first CSS framework

### Integration Layer
- **MultiversX SDK** - Blockchain interaction libraries
- **Wallet Integration** - Web Wallet, Extension, Hardware
- **Transaction Management** - Signing and broadcasting
- **Real-time Updates** - Event listening and state sync

## 🎆 Deployment Guide

### Smart Contract Deployment

```bash
# 1. Start development environment
./docker-dev.sh

# 2. Inside container, build contract
cd /workspace/stardust-contracts
mxpy contract build

# 3. Deploy to devnet
mxpy contract deploy \
  --bytecode=output/stardust-contracts.wasm \
  --pem=../wallet.pem \
  --gas-limit=60000000 \
  --proxy=https://devnet-gateway.multiversx.com \
  --chain=D \
  --send
```

### Frontend Deployment (Vercel)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from frontend directory
cd frontend
vercel --prod

# Set environment variables in Vercel dashboard
# NEXT_PUBLIC_CONTRACT_ADDRESS
# NEXT_PUBLIC_MULTIVERSX_NETWORK
# etc.
```

## 🧪 Testing

### Smart Contract Tests

```bash
# Test basic functions
mxpy contract call $CONTRACT_ADDRESS --function="hello" --proxy=$PROXY
mxpy contract call $CONTRACT_ADDRESS --function="get_version" --proxy=$PROXY

# Test gaming functions
mxpy contract call $CONTRACT_ADDRESS --function="register_player" --pem=wallet.pem
mxpy contract call $CONTRACT_ADDRESS --function="mint_game_asset" --value=1000000000000000000
```

### Frontend Tests

```bash
# Run test suite
npm run test

# Component testing
npm run test GameContract.test.tsx

# Coverage report
npm run test:coverage
```

## 🛣️ Roadmap

### ✅ Phase 1: Foundation (Q4 2024) - COMPLETED
- ✓ Basic smart contract infrastructure
- ✓ Modern React frontend with holographic effects
- ✓ MultiversX integration and wallet connectivity
- ✓ Docker development environment
- ✓ Comprehensive documentation

### ✅ Phase 2: Gaming Platform (Q1 2025) - COMPLETED
- ✓ NFT asset system with rarity tiers
- ✓ Player registration and progression
- ✓ Asset minting and trading functionality
- ✓ Tournament creation and management
- ✓ Achievement tracking system
- ✓ Complete gaming dashboard interface

### 🔄 Phase 3: Ecosystem Expansion (Q2 2025)
- 🔴 Multi-game asset compatibility
- 🔄 Advanced tournament mechanics
- 🔄 Guild system and team management
- 🔄 Marketplace for asset trading
- 🔄 Mobile application development

### 🔴 Phase 4: Scale & Innovation (Q3 2025)
- 🔴 Cross-chain bridge integration
- 🔴 AI-powered game balancing
- 🔴 VR/AR gaming experiences
- 🔴 Community governance features
- 🔴 Advanced DeFi gaming mechanics

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Write comprehensive tests for new features
- Update documentation for API changes
- Use conventional commit messages
- Ensure responsive design compatibility

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **💻 Repository**: [github.com/Gzeu/StardustEngine](https://github.com/Gzeu/StardustEngine)
- **🌐 Live Demo**: Deploy with `npm run dev` in frontend directory
- **📚 MultiversX Docs**: [docs.multiversx.com](https://docs.multiversx.com)
- **⚚️ React Docs**: [react.dev](https://react.dev)
- **👤 Creator**: [@Gzeu](https://github.com/Gzeu)

---

<div align="center">

**Built with ❤️ by [George Pricop](https://github.com/Gzeu)**

🌟 **StardustEngine** - *Where Gaming Meets Blockchain Innovation* 🌟

*Powered by MultiversX • React • TypeScript • Framer Motion*

</div>