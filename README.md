# 🌟 StardustEngine

> **Gaming Infrastructure on MultiversX** - Blockchain-powered gaming platform with smart contracts, NFT integration, and cross-game asset management

[![MultiversX](https://img.shields.io/badge/MultiversX-Blockchain-blue)](https://multiversx.com/)
[![Rust](https://img.shields.io/badge/Rust-Smart_Contracts-orange)](https://rust-lang.org/)
[![Gaming](https://img.shields.io/badge/Gaming-Infrastructure-purple)](https://github.com/Gzeu/StardustEngine)

## 🎮 Overview

StardustEngine is a comprehensive gaming infrastructure built on MultiversX blockchain, designed to power the next generation of Web3 games. It provides developers with tools, smart contracts, and APIs to create immersive gaming experiences with true asset ownership.

## ✨ Key Features

### 🏗️ Infrastructure Components
- **Smart Contract Suite** - Pre-built gaming contracts (NFTs, tokens, marketplace)
- **Cross-Game Assets** - Interoperable items and characters across multiple games
- **Economic Engine** - In-game economies with real value exchange

### 🎯 Gaming Features
- **NFT Gaming Assets** - weapons, characters, skins as tradeable NFTs
- **Achievement System** - Blockchain-verified accomplishments and badges
- **Frontend Dashboard (Port 3000)**
- **Status**: ✅ Running on `http://localhost:3000/dashboard.html`
- **Technology**: Modern HTML + JavaScript + CSS (React-like architecture)
- **Features**:
  - **State Management**: React-like state handling with real-time updates
  - **Component Architecture**: Modular design with reusable UI components
  - **Interactive Dashboard**: Professional gaming infrastructure interface
  - **Real-time Testing**: Live contract interaction with visual feedback
  - **Keyboard Shortcuts**: H (hello), V (version), I (info)
  - **Responsive Grid Layout**: Modern CSS Grid with mobile support
  - **Statistics Display**: Contract metrics and performance indicators
  - **Error Handling**: Comprehensive error states and loading indicators
### 🎯 Gaming Features
- **NFT Gaming Assets** - Weapons, characters, skins as tradeable NFTs
- **Achievement System** - Blockchain-verified accomplishments and badges
- **Tournament Platform** - Competitive gaming with crypto rewards
- **Guild Management** - Decentralized gaming communities

### 🔧 Developer Tools
- **SDK & APIs** - Easy integration for game developers
- **Asset Creator** - Tools for designing and minting game assets
- **Analytics Dashboard** - Real-time game metrics and player insights

## 🛠️ Tech Stack

| Component | Technology |
|-----------|------------|
| Blockchain | MultiversX (eGLD) |
| Smart Contracts | Rust |
| Backend API | FastAPI (Python) |
| Frontend | Modern HTML + JavaScript + CSS (React-like) |
| Database | MongoDB |
| Storage | IPFS |
| Testing | Rust + Jest |

## 🚀 Quick Start
### Prerequisites
- Docker Desktop installed and running
- Git installed
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

#### Test Deployed Contract
```bash
# Test hello endpoint
mxpy contract call <contract-address> --function=hello --pem=stardust-wallet.pem --gas-limit=5000000 --proxy=https://devnet-gateway.multiversx.com --send

# Test version endpoint
mxpy contract call <contract-address> --function=get_version --pem=stardust-wallet.pem --gas-limit=5000000 --proxy=https://devnet-gateway.multiversx.com --send

# Query contract (read-only)
mxpy contract query <contract-address> --function=hello --proxy=https://devnet-api.multiversx.com
```

### 4. Development Workflow

#### Add New Endpoints
1. Edit `stardust-contracts/src/stardust_contracts.rs`
2. Add your endpoint functions
3. Build and test locally:
```bash
cargo build
sc-meta all build
cargo test
```

#### Deploy Updates
```bash
# Build new WASM
sc-meta all build

# Deploy upgrade
mxpy contract upgrade <contract-address> --bytecode=output/stardust-contracts.wasm --pem=stardust-wallet.pem --gas-limit=60000000 --send
```

## 📁 Project Structure

```
{{ ... }}
├── contracts/                 # Smart contracts (Rust)
│   ├── game-assets/          # NFT and token contracts
│   ├── marketplace/          # Trading and auction contracts
│   ├── tournaments/          # Competition and rewards
│   └── guilds/              # Guild management
├── sdk/                      # JavaScript/TypeScript SDK
├── api/                      # Backend API (FastAPI)
├── frontend/                 # React dashboard
├── docs/                     # Documentation
├── scripts/                  # Deployment and utility scripts
└── tests/                    # Test suites

## 🎯 roadmap

### Phase 1: Foundation (Q4 2025) ✅ **COMPLETED**
- [x] **Core smart contracts** - Basic contract with hello/get_version endpoints deployed
- [x] **Local development environment** - Docker setup with MultiversX tools
- [x] **Docker setup with MultiversX tools**
- [x] **Documentation and tutorials** - Complete setup and deployment guide
- [x] **Testnet deployment** - Contract successfully deployed on MultiversX devnet

### Phase 2: Gaming Features (Q1 2026)
- [ ] Cross-game asset system
{{ ... }}
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
- **MultiversX Docs**: [docs.multiversx.com](https://docs.multiversx.com)
- **Discord**: [Join our community](#)
- **Twitter**: [@StardustEngine](#)

---

**Built with ❤️ on MultiversX blockchain by [George Pricop](https://github.com/Gzeu)**