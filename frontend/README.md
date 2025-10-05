# StardustEngine Frontend

🌟 **Modern React Frontend for StardustEngine Gaming Infrastructure**

A cutting-edge Web3 gaming platform frontend built with Next.js, TypeScript, and Tailwind CSS, featuring seamless MultiversX blockchain integration.

## ✨ Features

### 🎨 Modern UI/UX
- **Responsive Design** - Mobile-first approach with seamless desktop experience
- **Dark Theme** - Cyberpunk-inspired design with animated backgrounds
- **Glass Morphism** - Modern glass effects and backdrop blur
- **Smooth Animations** - Framer Motion powered transitions and interactions
- **Interactive Components** - Hover effects, loading states, and micro-interactions

### 🔗 Blockchain Integration
- **MultiversX Wallet Connect** - Seamless wallet integration with connection management
- **Smart Contract Dashboard** - Real-time contract interaction and monitoring
- **Transaction History** - Live contract call history with status tracking
- **Network Status** - Real-time connectivity indicators

### 🎮 Gaming Features
- **Game Showcase** - Interactive game cards with detailed information
- **Stats Grid** - Real-time platform metrics and analytics
- **Feature Cards** - Animated feature highlights with gradient effects
- **Tournament System** - Ready for competitive gaming integration

### ⚡ Performance
- **Next.js 14** - Latest App Router with server-side rendering
- **TypeScript** - Full type safety and developer experience
- **Optimized Bundle** - Tree shaking and code splitting
- **Fast Refresh** - Lightning-fast development experience

## 🚀 Quick Start

### Prerequisites

```bash
# Node.js 18+ and npm 9+
node --version  # Should be 18+
npm --version   # Should be 9+
```

### Installation

```bash
# Clone the repository
git clone https://github.com/Gzeu/StardustEngine.git
cd StardustEngine/frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Setup

Create a `.env.local` file in the frontend directory:

```env
# MultiversX Configuration
NEXT_PUBLIC_MULTIVERSX_NETWORK=devnet
NEXT_PUBLIC_CONTRACT_ADDRESS=erd1qqqqqqqqqqqqqpgqfm0kd3wse7ddgtf4haplm3p5mdl90msp634qxrfmt3

# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000

# Feature Flags
NEXT_PUBLIC_ENABLE_WALLET_CONNECT=true
NEXT_PUBLIC_ENABLE_GAMING_FEATURES=true
```

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run typecheck    # TypeScript type checking
npm run format       # Format with Prettier

# Testing
npm run test         # Run tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Generate coverage report
```

### Project Structure

```
frontend/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── page.tsx         # Homepage
│   │   ├── layout.tsx       # Root layout
│   │   └── globals.css      # Global styles
│   ├── components/          # React components
│   │   ├── ContractDashboard.tsx
│   │   ├── FeatureCard.tsx
│   │   ├── GameShowcase.tsx
│   │   ├── NetworkStatus.tsx
│   │   ├── StatsGrid.tsx
│   │   ├── WalletConnect.tsx
│   │   └── ui/              # UI components
│   │       └── toast.tsx
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utilities and configurations
│   └── types/               # TypeScript type definitions
├── public/                  # Static assets
├── tailwind.config.ts       # Tailwind CSS configuration
├── next.config.js          # Next.js configuration
└── package.json            # Dependencies and scripts
```

### Component Architecture

#### Main Page (`src/app/page.tsx`)
- **Navigation Tabs** - Overview, Dashboard, Games, Wallet
- **Animated Background** - Floating blob animations
- **Responsive Layout** - Mobile-first design

#### Key Components

1. **ContractDashboard** - Smart contract interaction interface
   - Real-time contract calls
   - Transaction history
   - Contract information display

2. **WalletConnect** - MultiversX wallet integration
   - Connection management
   - Balance display
   - Address copying and viewing

3. **GameShowcase** - Featured games display
   - Interactive game cards
   - Status indicators
   - Call-to-action buttons

4. **StatsGrid** - Platform statistics
   - Animated counters
   - Trend indicators
   - Real-time updates

## 🎨 Styling

### Tailwind CSS

Custom configuration with:
- **Gaming Theme Colors** - Blue, purple, and cyberpunk palettes
- **Custom Animations** - Blob, glow, and fade effects
- **Glass Morphism** - Backdrop blur and transparency
- **Responsive Utilities** - Mobile-first breakpoints

### Design System

```tsx
// Color Palette
const colors = {
  primary: {
    blue: '#3B82F6',
    purple: '#8B5CF6',
    pink: '#EC4899'
  },
  accent: {
    green: '#10B981',
    yellow: '#F59E0B',
    red: '#EF4444'
  }
};

// Component Classes
.card          // Glass morphism card
.btn-primary   // Gradient primary button
.text-gradient // Gradient text effect
.hover-lift    // Hover elevation effect
```

## 🔗 MultiversX Integration

### Wallet Connection

```tsx
// Wallet connection flow
const { isConnected, connect, disconnect } = useWallet();

// Contract interaction
const callContract = async (functionName: string, args: any[]) => {
  const response = await fetch('/api/contract/call', {
    method: 'POST',
    body: JSON.stringify({ function: functionName, args })
  });
  return response.json();
};
```

### Network Configuration

```tsx
// Network settings
const networkConfig = {
  devnet: {
    id: 'devnet',
    name: 'Devnet',
    apiUrl: 'https://devnet-api.multiversx.com',
    explorerUrl: 'https://devnet-explorer.multiversx.com'
  }
};
```

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Docker

```dockerfile
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine AS runner
WORKDIR /app
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000
CMD ["npm", "start"]
```

### Environment Variables for Production

```env
NEXT_PUBLIC_MULTIVERSX_NETWORK=mainnet
NEXT_PUBLIC_CONTRACT_ADDRESS=your_mainnet_contract_address
NEXT_PUBLIC_API_BASE_URL=https://your-api-domain.com
```

## 🧪 Testing

### Jest Configuration

```javascript
// jest.config.js
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './'
});

const config = {
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js']
};

module.exports = createJestConfig(config);
```

### Example Tests

```tsx
// __tests__/components/WalletConnect.test.tsx
import { render, screen } from '@testing-library/react';
import WalletConnect from '@/components/WalletConnect';

describe('WalletConnect', () => {
  it('renders connect button when not connected', () => {
    render(
      <WalletConnect 
        isConnected={false} 
        onConnect={() => {}} 
        onDisconnect={() => {}} 
      />
    );
    expect(screen.getByText('Connect')).toBeInTheDocument();
  });
});
```

## 📊 Performance

### Optimization Features

- **Code Splitting** - Automatic route-based splitting
- **Image Optimization** - Next.js Image component
- **Bundle Analysis** - Webpack bundle analyzer
- **Compression** - Gzip and Brotli compression
- **Caching** - Static asset caching

### Performance Monitoring

```bash
# Analyze bundle size
npm run build
npm run analyze

# Lighthouse CI
npm run lighthouse
```

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Code Style Guidelines

- Use TypeScript for all new code
- Follow ESLint and Prettier configurations
- Write tests for new components
- Use semantic commit messages
- Document complex functions and components

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

## 🔗 Links

- **Repository**: [github.com/Gzeu/StardustEngine](https://github.com/Gzeu/StardustEngine)
- **MultiversX Docs**: [docs.multiversx.com](https://docs.multiversx.com)
- **Next.js Docs**: [nextjs.org/docs](https://nextjs.org/docs)
- **Tailwind CSS**: [tailwindcss.com](https://tailwindcss.com)

---

**Built with ❤️ by [George Pricop](https://github.com/Gzeu)**