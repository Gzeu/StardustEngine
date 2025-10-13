# 🌟 StardustEngine Development Guide

**Complete setup guide for developing and deploying StardustEngine on free-tier services**

## 🚀 Quick Start (5 minutes)

### Prerequisites
- **Node.js** 18+ and npm 9+
- **Git** for version control
- **Docker** (optional, for smart contracts)
- **Vercel CLI** for deployment

### 1. Clone & Setup
```bash
# Clone repository
git clone https://github.com/Gzeu/StardustEngine.git
cd StardustEngine/frontend

# Install dependencies
npm install

# Setup environment
cp .env.example .env.local
```

### 2. Development Server
```bash
# Start development server
npm run dev

# Open browser at http://localhost:3000
```

### 3. Deploy to Production
```bash
# Make deploy script executable
chmod +x deploy-optimized.sh

# Deploy to preview
./deploy-optimized.sh --preview

# Deploy to production
./deploy-optimized.sh --production
```

---

## 🛠️ Development Environment

### Recommended Setup

#### **VS Code Extensions**
```bash
# Install recommended extensions
code --install-extension bradlc.vscode-tailwindcss
code --install-extension ms-vscode.vscode-typescript-next
code --install-extension esbenp.prettier-vscode
code --install-extension ms-vscode.vscode-eslint
code --install-extension unifiedjs.vscode-mdx
```

#### **Package Manager Configuration**
```bash
# Configure npm for optimal performance
npm config set prefer-offline true
npm config set progress false
npm config set audit false
```

### Project Structure
```
frontend/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── dashboard/         # Player dashboard page
│   │   ├── marketplace/       # NFT marketplace (to be added)
│   │   ├── tournaments/       # Tournament system (to be added)
│   │   └── globals.css        # Global styles + gaming effects
│   ├── components/            # React Components
│   │   ├── ui/               # Reusable UI components
│   │   │   ├── NFTViewer3D.tsx      # 3D NFT viewer
│   │   │   ├── NFTGallery.tsx       # NFT collection gallery
│   │   │   └── toast.tsx            # Toast notifications
│   │   ├── tournaments/       # Tournament components
│   │   │   └── TournamentBracket.tsx # Interactive brackets
│   │   └── [existing components]     # GameContract, WalletConnect, etc.
│   ├── store/                 # State management
│   │   └── gameStore.ts       # Zustand game store
│   ├── types/                 # TypeScript definitions
│   ├── utils/                 # Utility functions
│   └── config/               # Configuration files
├── public/                   # Static assets
├── package.json             # Dependencies & scripts
├── tailwind.config.ts       # Tailwind configuration
├── Dockerfile              # Production container
├── deploy-optimized.sh     # Deployment automation
└── .env.example           # Environment template
```

---

## 🎮 New Components Overview

### **🎯 NFTViewer3D**
**Location**: `src/components/ui/NFTViewer3D.tsx`

3D NFT asset viewer with Three.js integration:
- **Interactive 3D models** based on asset type (Weapon, Character, etc.)
- **Rarity-based effects** (particles, glows, animations)
- **Mobile-optimized** with touch controls
- **Customizable sizes** (sm, md, lg, xl)

```typescript
// Usage example
<NFTViewer3D 
  asset={gameAsset}
  size="md"
  interactive={true}
/>
```

### **🖼️ NFTGallery**
**Location**: `src/components/ui/NFTGallery.tsx`

Advanced NFT collection browser:
- **Virtualized scrolling** for performance
- **Advanced filtering** (type, rarity, level)
- **Grid/List view modes**
- **Real-time search**
- **Mobile responsive**

```typescript
// Usage example
<NFTGallery
  assets={playerAssets}
  onAssetSelect={handleAssetSelect}
  showPrices={true}
  allowFiltering={true}
/>
```

### **🎮 Player Dashboard**
**Location**: `src/app/dashboard/page.tsx`

Comprehensive gaming dashboard:
- **Player progression** with XP bars
- **Gaming statistics** (win rate, games played)
- **Recent assets** showcase
- **Match history** with results
- **Quick actions** (find match, join tournament)

### **🏆 Tournament Bracket**
**Location**: `src/components/tournaments/TournamentBracket.tsx`

Interactive tournament visualization:
- **Dynamic bracket generation** based on participants
- **Live match status** with real-time updates
- **Player cards** with stats and avatars
- **Match details** modal
- **Mobile-friendly** horizontal scroll

### **🗃️ Game Store (Zustand)**
**Location**: `src/store/gameStore.ts`

Centralized state management:
- **Player data** (stats, assets, address)
- **UI state** (theme, settings, modals)
- **Notifications** system
- **Tournament data**
- **Persistent storage** with localStorage

```typescript
// Usage example
const { playerStats, updatePlayerStats } = useGameStore();
const { notifications, addNotification } = useNotifications();
```

---

## 🔧 Development Workflow

### **Hot Development**
```bash
# Start with hot reload
npm run dev

# Run tests in watch mode
npm run test:watch

# Type checking
npm run type-check
```

### **Code Quality**
```bash
# Lint and fix
npm run lint:fix

# Test coverage
npm run test:coverage

# Bundle analysis
npm run analyze
```

### **Performance Monitoring**
```bash
# Lighthouse CI
npm run lighthouse

# Bundle size check
npm run size-limit

# Health check
curl http://localhost:3000/api/health
```

---

## 🚀 Deployment Strategy

### **Free Tier Services**

#### **🔵 Vercel (Frontend)**
- **100GB bandwidth/month**
- **32min build time/month**
- **Edge Functions included**
- **Custom domains**
- **Analytics included**

```bash
# Deploy commands
npm run deploy              # Preview deployment
npm run deploy:github       # GitHub Pages (backup)
./deploy-optimized.sh -p    # Production with optimizations
```

#### **🟣 Railway (Backend - Future)**
- **500h execution time/month**
- **1GB memory limit**
- **Docker deployment**
- **Auto-scaling**

#### **🟢 Supabase (Database - Future)**
- **500MB PostgreSQL**
- **2GB data transfer**
- **Real-time subscriptions**
- **Built-in auth**

### **CI/CD Pipeline**

**GitHub Actions** (`.github/workflows/deploy.yml`):
1. **Code Quality** - TypeScript, ESLint, Tests
2. **Build Optimization** - Production build with analysis
3. **Deploy to Vercel** - Automated deployment
4. **Performance Testing** - Lighthouse CI

---

## 📊 Performance Optimization

### **Bundle Optimization**
- **Code splitting** - Automatic with Next.js
- **Tree shaking** - Remove unused code
- **Dynamic imports** - Lazy load heavy components
- **Image optimization** - Next.js built-in

### **Runtime Performance**
- **Virtualized lists** - Handle large NFT collections
- **Memoization** - React.memo for expensive components
- **Service Worker** - Offline support and caching
- **Web Vitals tracking** - Monitor real user metrics

### **3D Optimization**
- **LOD (Level of Detail)** - Reduce complexity based on distance
- **Texture compression** - Optimize asset loading
- **Frustum culling** - Only render visible objects
- **Instance rendering** - Efficient particle systems

---

## 🛡️ Security Best Practices

### **Environment Variables**
```bash
# Required variables
NEXT_PUBLIC_MULTIVERSX_NETWORK=devnet
NEXT_PUBLIC_GATEWAY_URL=https://devnet-gateway.multiversx.com
NEXT_PUBLIC_CONTRACT_ADDRESS=your_contract_address

# Optional
NEXT_PUBLIC_ANALYTICS_ID=your_analytics_id
NEXT_TELEMETRY_DISABLED=1
```

### **Wallet Security**
- **Never store private keys** in frontend
- **Validate all transactions** before signing
- **Rate limiting** on contract calls
- **Input sanitization** for user data

---

## 🧪 Testing Strategy

### **Unit Tests**
```bash
# Test individual components
npm run test NFTViewer3D
npm run test GameStore
```

### **Integration Tests**
```bash
# Test component interactions
npm run test:integration
```

### **E2E Testing** (Future)
```bash
# Full user workflows
npm run test:e2e
```

---

## 📈 Scaling Path

### **Phase 1: MVP (Current)**
- ✅ **3D NFT Viewer** - Interactive asset visualization
- ✅ **Player Dashboard** - Gaming analytics
- ✅ **State Management** - Zustand store
- ✅ **Tournament System** - Bracket visualization
- ✅ **Deployment Pipeline** - Automated CI/CD

### **Phase 2: Enhancement (Next 2 weeks)**
- 🔄 **Marketplace** - Buy/sell NFTs
- 🔄 **Profile System** - Detailed player profiles
- 🔄 **Social Features** - Friends, chat, guilds
- 🔄 **Mobile App** - React Native version

### **Phase 3: Scale (Month 2)**
- 🔄 **Multi-game Support** - Cross-game assets
- 🔄 **Advanced Analytics** - Player behavior tracking
- 🔄 **AI Integration** - Personalized recommendations
- 🔄 **Premium Features** - Subscription model

---

## 🤝 Contributing

### **Development Guidelines**
1. **Follow TypeScript strict mode**
2. **Write tests for new components**
3. **Use Tailwind for styling**
4. **Mobile-first responsive design**
5. **Optimize for performance**

### **Git Workflow**
```bash
# Feature development
git checkout -b feature/awesome-feature
git commit -m "✨ Add awesome gaming feature"
git push origin feature/awesome-feature
# Create Pull Request
```

### **Commit Convention**
```bash
🎮 feat: new gaming feature
🐛 fix: bug fix
📚 docs: documentation
🎨 style: formatting
♻️  refactor: code restructuring
⚡ perf: performance improvement
✅ test: adding tests
🔧 chore: maintenance
```

---

## 📞 Support

- **GitHub Issues**: [Report bugs](https://github.com/Gzeu/StardustEngine/issues)
- **Discussions**: [Community Q&A](https://github.com/Gzeu/StardustEngine/discussions)
- **Creator**: [@Gzeu](https://github.com/Gzeu)

---

**Built with ❤️ for the MultiversX gaming community**

*Last updated: October 2025*