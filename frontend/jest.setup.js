// Jest setup file for StardustEngine testing environment

import '@testing-library/jest-dom';

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter: () => ({
    route: '/',
    pathname: '/',
    query: {},
    asPath: '/',
    push: jest.fn(),
    replace: jest.fn(),
    reload: jest.fn(),
    back: jest.fn(),
    prefetch: jest.fn(),
    beforePopState: jest.fn(),
    events: {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn()
    }
  })
}));

// Mock Next.js navigation (App Router)
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    prefetch: jest.fn()
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams()
}));

// Mock environment variables
process.env.NEXT_PUBLIC_CONTRACT_ADDRESS = 'erd1qqqqqqqqqqqqqpgqtest123';
process.env.NEXT_PUBLIC_MULTIVERSX_NETWORK = 'devnet';
process.env.NEXT_PUBLIC_GATEWAY_URL = 'https://devnet-gateway.multiversx.com';
process.env.NEXT_PUBLIC_API_URL = 'https://devnet-api.multiversx.com';

// Mock MultiversX SDK
jest.mock('@multiversx/sdk-core', () => ({
  Address: jest.fn().mockImplementation((address) => ({ toString: () => address })),
  ContractFunction: jest.fn(),
  BytesValue: jest.fn(),
  BigUIntValue: jest.fn(),
  U64Value: jest.fn(),
  Transaction: jest.fn(),
  TransactionPayload: jest.fn()
}));

// Mock MultiversX Dapp hooks with default implementations
jest.mock('@multiversx/sdk-dapp/hooks', () => ({
  useGetLoginInfo: jest.fn(() => ({ isLoggedIn: false })),
  useGetAccountInfo: jest.fn(() => ({ account: null, address: null })),
  useGetNetworkConfig: jest.fn(() => ({ network: { id: 'devnet' } })),
  useGetActiveTransactionsStatus: jest.fn(() => ({ pending: false, success: false, failed: false }))
}));

// Mock MultiversX Dapp services
jest.mock('@multiversx/sdk-dapp/services', () => ({
  sendTransactions: jest.fn(() => Promise.resolve({ sessionId: 'test-session' })),
  refreshAccount: jest.fn(() => Promise.resolve()),
  getAccount: jest.fn(() => Promise.resolve({ address: 'erd1test', balance: '1000000000000000000' }))
}));

// Mock Framer Motion for consistent testing
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    button: ({ children, ...props }) => <button {...props}>{children}</button>,
    span: ({ children, ...props }) => <span {...props}>{children}</span>,
    section: ({ children, ...props }) => <section {...props}>{children}</section>,
    h1: ({ children, ...props }) => <h1 {...props}>{children}</h1>,
    h2: ({ children, ...props }) => <h2 {...props}>{children}</h2>,
    h3: ({ children, ...props }) => <h3 {...props}>{children}</h3>,
    p: ({ children, ...props }) => <p {...props}>{children}</p>
  },
  AnimatePresence: ({ children }) => children,
  useAnimation: () => ({
    start: jest.fn(),
    stop: jest.fn(),
    set: jest.fn()
  }),
  useInView: () => [null, true]
}));

// Mock Lucide React icons
jest.mock('lucide-react', () => ({
  Gamepad2: () => <div data-testid="gamepad-icon">🎮</div>,
  Zap: () => <div data-testid="zap-icon">⚡</div>,
  Trophy: () => <div data-testid="trophy-icon">🏆</div>,
  Users: () => <div data-testid="users-icon">👥</div>,
  ArrowRight: () => <div data-testid="arrow-icon">→</div>,
  Code2: () => <div data-testid="code-icon">💻</div>,
  Wallet: () => <div data-testid="wallet-icon">👛</div>,
  Globe: () => <div data-testid="globe-icon">🌐</div>,
  Play: () => <div data-testid="play-icon">▶️</div>,
  Pause: () => <div data-testid="pause-icon">⏸️</div>,
  RefreshCw: () => <div data-testid="refresh-icon">🔄</div>,
  Swords: () => <div data-testid="swords-icon">⚔️</div>,
  Crown: () => <div data-testid="crown-icon">👑</div>
}));

// Mock window.localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Mock window.matchMedia for responsive design testing
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn()
  }))
});

// Mock IntersectionObserver for animation triggers
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn()
}));

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn()
}));

// Suppress console warnings in tests
const originalWarn = console.warn;
const originalError = console.error;

beforeAll(() => {
  console.warn = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render')
    ) {
      return;
    }
    originalWarn.call(console, ...args);
  };
  
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Warning:') || args[0].includes('Error: Not implemented'))
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.warn = originalWarn;
  console.error = originalError;
});

// Global test utilities
global.testUtils = {
  // Helper to simulate wallet connection
  mockWalletConnected: (address = 'erd1test123') => {
    require('@multiversx/sdk-dapp/hooks').useGetLoginInfo.mockReturnValue({ isLoggedIn: true });
    require('@multiversx/sdk-dapp/hooks').useGetAccountInfo.mockReturnValue({ 
      account: { address }, 
      address 
    });
  },
  
  // Helper to simulate wallet disconnection
  mockWalletDisconnected: () => {
    require('@multiversx/sdk-dapp/hooks').useGetLoginInfo.mockReturnValue({ isLoggedIn: false });
    require('@multiversx/sdk-dapp/hooks').useGetAccountInfo.mockReturnValue({ 
      account: null, 
      address: null 
    });
  },
  
  // Helper to mock successful transactions
  mockTransactionSuccess: () => {
    require('@multiversx/sdk-dapp/services').sendTransactions.mockResolvedValue({ 
      sessionId: 'test-success' 
    });
  },
  
  // Helper to mock transaction failures
  mockTransactionFailure: (error = new Error('Transaction failed')) => {
    require('@multiversx/sdk-dapp/services').sendTransactions.mockRejectedValue(error);
  }
};