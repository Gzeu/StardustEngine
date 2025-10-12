/**
 * StardustEngine Configuration with Robust Fallbacks
 * Prevents runtime crashes when environment variables are missing
 */

// Helper function for safe environment variable access
const getEnvVar = (key: string, defaultValue: string): string => {
  const value = process.env[key];
  if (value === undefined || value === null || value === '') {
    return defaultValue;
  }
  return value;
};

const getBoolEnvVar = (key: string, defaultValue: boolean = false): boolean => {
  const value = process.env[key];
  if (!value) return defaultValue;
  return value.toLowerCase() === 'true';
};

const getNumberEnvVar = (key: string, defaultValue: number): number => {
  const value = process.env[key];
  if (!value) return defaultValue;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
};

// Network Configuration
export const networkConfig = {
  name: getEnvVar('NEXT_PUBLIC_MULTIVERSX_NETWORK', 'devnet'),
  chainId: getEnvVar('NEXT_PUBLIC_CHAIN_ID', 'D'),
  gatewayUrl: getEnvVar('NEXT_PUBLIC_GATEWAY_URL', 'https://devnet-gateway.multiversx.com'),
  apiUrl: getEnvVar('NEXT_PUBLIC_API_URL', 'https://devnet-api.multiversx.com'),
  explorerUrl: getEnvVar('NEXT_PUBLIC_EXPLORER_URL', 'https://devnet-explorer.multiversx.com'),
  walletUrl: getEnvVar('NEXT_PUBLIC_WEB_WALLET_URL', 'https://devnet-wallet.multiversx.com'),
};

// Smart Contract Configuration
export const contractConfig = {
  address: getEnvVar(
    'NEXT_PUBLIC_CONTRACT_ADDRESS',
    'erd1qqqqqqqqqqqqqpgqmhm6kg3mj3k0w9a3nda9xuw4tac3n5zx2jps8rp6sd'
  ),
  testAddress: getEnvVar('NEXT_PUBLIC_TEST_CONTRACT_ADDRESS', ''),
};

// Gas Limits Configuration
export const gasLimits = {
  register: getNumberEnvVar('NEXT_PUBLIC_GAS_LIMIT_REGISTER', 60_000_000),
  mint: getNumberEnvVar('NEXT_PUBLIC_GAS_LIMIT_MINT', 50_000_000),
  transfer: getNumberEnvVar('NEXT_PUBLIC_GAS_LIMIT_TRANSFER', 60_000_000),
  tournament: getNumberEnvVar('NEXT_PUBLIC_GAS_LIMIT_TOURNAMENT', 70_000_000),
};

// Mint Costs Configuration (in EGLD wei)
export const mintCosts = {
  common: getEnvVar('NEXT_PUBLIC_MINT_COST_COMMON', '1000000000000000000'), // 1 EGLD
  rare: getEnvVar('NEXT_PUBLIC_MINT_COST_RARE', '2000000000000000000'), // 2 EGLD
  epic: getEnvVar('NEXT_PUBLIC_MINT_COST_EPIC', '5000000000000000000'), // 5 EGLD
  legendary: getEnvVar('NEXT_PUBLIC_MINT_COST_LEGENDARY', '10000000000000000000'), // 10 EGLD
};

// Application Configuration
export const appConfig = {
  name: getEnvVar('NEXT_PUBLIC_APP_NAME', 'StardustEngine'),
  description: getEnvVar(
    'NEXT_PUBLIC_APP_DESCRIPTION',
    'Next-generation NFT Gaming Platform on MultiversX'
  ),
  version: getEnvVar('NEXT_PUBLIC_APP_VERSION', '3.0.0'),
  devMode: getBoolEnvVar('NEXT_PUBLIC_DEV_MODE', process.env.NODE_ENV === 'development'),
  debug: getBoolEnvVar('NEXT_PUBLIC_DEBUG', process.env.NODE_ENV === 'development'),
};

// Feature Flags
export const featureFlags = {
  tournaments: getBoolEnvVar('NEXT_PUBLIC_ENABLE_TOURNAMENTS', true),
  achievements: getBoolEnvVar('NEXT_PUBLIC_ENABLE_ACHIEVEMENTS', true),
  assetTrading: getBoolEnvVar('NEXT_PUBLIC_ENABLE_ASSET_TRADING', true),
  analytics: getBoolEnvVar('NEXT_PUBLIC_ENABLE_ANALYTICS', false),
  devTools: getBoolEnvVar('NEXT_PUBLIC_ENABLE_DEV_TOOLS', process.env.NODE_ENV === 'development'),
};

// External Services Configuration
export const externalServices = {
  walletConnectProjectId: getEnvVar('NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID', ''),
  apiBaseUrl: getEnvVar('NEXT_PUBLIC_API_BASE_URL', 'https://stardustengine-api.onrender.com'),
  gaTrackingId: getEnvVar('NEXT_PUBLIC_GA_TRACKING_ID', ''),
  sentryDsn: getEnvVar('NEXT_PUBLIC_SENTRY_DSN', ''),
};

// Social Links
export const socialLinks = {
  github: getEnvVar('NEXT_PUBLIC_GITHUB_URL', 'https://github.com/Gzeu/StardustEngine'),
  discord: getEnvVar('NEXT_PUBLIC_DISCORD_URL', ''),
  twitter: getEnvVar('NEXT_PUBLIC_TWITTER_URL', ''),
};

// Environment helpers
export const isDevelopment = process.env.NODE_ENV === 'development';
export const isProduction = process.env.NODE_ENV === 'production';
export const isTest = process.env.NODE_ENV === 'test';

// Export unified config object
export const config = {
  app: appConfig,
  network: networkConfig,
  contract: contractConfig,
  gasLimits,
  mintCosts,
  featureFlags,
  externalServices,
  socialLinks,
  isDevelopment,
  isProduction,
  isTest,
};

// Utility functions
export const formatEGLD = (weiValue: string): string => {
  try {
    const egld = parseFloat(weiValue) / Math.pow(10, 18);
    return egld.toFixed(2);
  } catch {
    return '0.00';
  }
};

export const toWei = (egldValue: string): string => {
  try {
    const wei = parseFloat(egldValue) * Math.pow(10, 18);
    return Math.floor(wei).toString();
  } catch {
    return '0';
  }
};

// Configuration validation (non-throwing)
export const validateConfig = (): { valid: boolean; warnings: string[] } => {
  const warnings: string[] = [];
  
  if (!externalServices.walletConnectProjectId) {
    warnings.push('WalletConnect Project ID not configured - some wallet features may be limited');
  }
  
  if (contractConfig.address.includes('qqqqqqqqqqqqqqqpgq')) {
    warnings.push('Using default contract address - update for production');
  }
  
  return {
    valid: warnings.length === 0,
    warnings
  };
};

// Log configuration warnings in development
if (isDevelopment) {
  const { warnings } = validateConfig();
  if (warnings.length > 0) {
    console.warn('StardustEngine Config Warnings:', warnings);
  }
}

export default config;