# 🚀 StardustEngine - Local Development Setup

## 📋 Prerequisites

### Required Software
- **Node.js** >= 20.0.0 (recommend 20.13.1+)
- **npm** >= 10.0.0
- **Python** >= 3.11.0 (for API backend)
- **Git**
- **Docker** (optional, for containerized development)

### Optional Tools
- **mxpy** (MultiversX Python SDK for smart contracts)
- **Cargo/Rust** (for smart contract development)

## 🛠️ Quick Setup (Automated)

```bash
# Clone repository
git clone https://github.com/Gzeu/StardustEngine.git
cd StardustEngine

# Install all dependencies (monorepo)
npm run setup

# Start development servers
npm run dev  # Frontend only
# OR
npm run dev:all  # Frontend + API
```

## 📦 Manual Setup

### 1. Root Dependencies
```bash
# Install root workspace dependencies
npm install
```

### 2. Frontend Setup
```bash
# Install frontend dependencies
npm run install --workspace=frontend
# OR
cd frontend && npm install

# Create environment file
cp frontend/.env.example frontend/.env.local

# Start frontend development server
npm run dev:frontend
# OR
cd frontend && npm run dev
```

### 3. API Setup (Python)
```bash
# Navigate to API directory
cd api

# Create virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Start API development server
npm run dev:api
# OR
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 4. Smart Contracts (Optional)
```bash
# Navigate to contracts directory
cd stardust-contracts

# Build contracts (requires Rust/Cargo)
cargo build --release

# Run contract tests
cargo test
```

## 🌐 Development URLs

| Service | URL | Port |
|---------|-----|------|
| **Frontend** | http://localhost:3000 | 3000 |
| **API** | http://localhost:8000 | 8000 |
| **API Docs** | http://localhost:8000/docs | 8000 |
| **Health Check** | http://localhost:8000/health | 8000 |

## 📝 NPM Scripts (Root Level)

### Development
```bash
npm run dev                    # Start frontend development
npm run dev:frontend           # Start only frontend
npm run dev:api               # Start only API
npm run setup                 # Full setup (install + build)
```

### Building
```bash
npm run build                 # Build frontend
npm run build:frontend        # Build only frontend
npm run build:api            # Build only API
```

### Testing
```bash
npm run test                  # Run tests in all workspaces
npm run test:watch           # Run tests in watch mode
npm run test:coverage        # Run tests with coverage
```

### Linting & Formatting
```bash
npm run lint                  # Lint all workspaces
npm run lint:fix             # Fix linting issues
npm run format               # Format code with Prettier
npm run typecheck            # TypeScript type checking
```

### Smart Contracts
```bash
npm run contracts:build       # Build Rust contracts
npm run contracts:test        # Test contracts
npm run contracts:deploy:devnet  # Deploy to devnet
npm run contracts:deploy:testnet # Deploy to testnet
```

### MultiversX LocalNet
```bash
npm run localnet:setup        # Setup local network
npm run localnet:start        # Start local network
npm run localnet:stop         # Stop local network
```

### Docker Development
```bash
npm run docker:dev            # Start with Docker Compose
npm run docker:build          # Build Docker images
npm run docker:stop           # Stop Docker containers
npm run docker:logs           # View container logs
```

### Maintenance
```bash
npm run clean                 # Clean all node_modules
npm run clean:frontend        # Clean only frontend
npm run clean:api            # Clean only API
npm run install:all          # Install all workspace dependencies
```

## 🔧 Environment Variables

### Frontend (.env.local)
```env
NEXT_PUBLIC_MULTIVERSX_NETWORK=devnet
NEXT_PUBLIC_GATEWAY_URL=https://devnet-gateway.multiversx.com
NEXT_PUBLIC_API_URL=https://devnet-api.multiversx.com
NEXT_PUBLIC_EXPLORER_URL=https://devnet-explorer.multiversx.com
NEXT_PUBLIC_BASE_PATH=
NEXT_PUBLIC_API_BACKEND_URL=http://localhost:8000
```

### API (.env)
```env
ENVIRONMENT=development
API_PORT=8000
CORS_ORIGINS=http://localhost:3000,https://stardustengine.vercel.app
MULTIVERSX_NETWORK=devnet
```

## 🐳 Docker Development

### Option 1: Docker Compose (Recommended)
```bash
# Start all services with Docker
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Option 2: Individual Containers
```bash
# Build and run frontend
docker build -t stardustengine-frontend ./frontend
docker run -p 3000:3000 stardustengine-frontend

# Build and run API
docker build -t stardustengine-api ./api
docker run -p 8000:8000 stardustengine-api
```

## 🚨 Troubleshooting

### Common Issues

**1. Node Version Mismatch**
```bash
# Check Node.js version
node --version  # Should be >= 20.0.0

# Update Node.js using nvm (recommended)
nvm install 20.13.1
nvm use 20.13.1
```

**2. Port Already in Use**
```bash
# Kill process using port 3000
npx kill-port 3000

# Kill process using port 8000
npx kill-port 8000
```

**3. Python Virtual Environment Issues**
```bash
# Recreate virtual environment
rm -rf api/venv
cd api
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
```

**4. NPM Workspace Issues**
```bash
# Clean and reinstall
npm run clean
npm run install:all
```

**5. MultiversX SDK Issues**
```bash
# Clear npm cache
npm cache clean --force

# Reinstall MultiversX packages
cd frontend
npm uninstall @multiversx/sdk-dapp @multiversx/sdk-dapp-ui
npm install @multiversx/sdk-dapp@latest @multiversx/sdk-dapp-ui@latest
```

## 📚 Development Workflow

### 1. Daily Development
```bash
# Pull latest changes
git pull origin main

# Install any new dependencies
npm run install:all

# Start development
npm run dev
```

### 2. Before Committing
```bash
# Run linting and tests
npm run lint
npm run test
npm run typecheck

# Format code
npm run format

# Build to ensure no errors
npm run build
```

### 3. Deployment Testing
```bash
# Test Vercel build locally
cd frontend
npm run build:vercel
npm run start

# Test GitHub Pages build
cd frontend
npm run build:github
npm run export
```

## 🎯 Next Steps

1. **Start Development**: `npm run dev`
2. **Open Browser**: http://localhost:3000
3. **API Documentation**: http://localhost:8000/docs
4. **Check Health**: http://localhost:8000/health
5. **Happy Coding!** 🚀

---

**Need Help?** Check the main [README.md](./README.md) or open an [issue](https://github.com/Gzeu/StardustEngine/issues).