/**
 * StardustEngine Configuration
 * Centralized management of environment variables and application settings
 */

// Type definitions for configuration
export interface NetworkConfig {
  name: string;
  chainId: string;
  gatewayUrl: string;
  apiUrl: string;
  explorerUrl: string;
  walletUrl: string;
}

export interface ContractConfig {
  address: string;
  testAddress?: string;
}

export interface GasLimits {
  register: number;
  mint: number;
  transfer: number;
  tournament: number;
}

export interface MintCosts {
  common: string;
  rare: string;
  epic: string;
  legendary: string;
}

export interface AppConfig {
  name: string;
  description: string;
  version: string;
  devMode: boolean;
  debug: boolean;
}

// Environment variable getters with fallbacks
const getEnvVar = (key: string, fallback?: string): string => {
  const value = process.env[key];
  if (!value && !fallback) {
    console.warn(`Environment variable ${key} is not defined`);
  }
  return value || fallback || '';
};

const getEnvBool = (key: string, fallback = false): boolean => {
  const value = process.env[key];
  return value ? value.toLowerCase() === 'true' : fallback;
};

const getEnvNumber = (key: string, fallback = 0): number => {
  const value = process.env[key];
  return value ? parseInt(value, 10) : fallback;
};

// Network Configuration
export const networkConfig: NetworkConfig = {
  name: getEnvVar('NEXT_PUBLIC_MULTIVERSX_NETWORK', 'devnet'),
  chainId: getEnvVar('NEXT_PUBLIC_CHAIN_ID', 'D'),
  gatewayUrl: getEnvVar('NEXT_PUBLIC_GATEWAY_URL', 'https://devnet-gateway.multiversx.com'),
  apiUrl: getEnvVar('NEXT_PUBLIC_API_URL', 'https://devnet-api.multiversx.com'),
  explorerUrl: getEnvVar('NEXT_PUBLIC_EXPLORER_URL', 'https://devnet-explorer.multiversx.com'),
  walletUrl: getEnvVar('NEXT_PUBLIC_WEB_WALLET_URL', 'https://devnet-wallet.multiversx.com'),
};

// Smart Contract Configuration
export const contractConfig: ContractConfig = {
  address: getEnvVar(
    'NEXT_PUBLIC_CONTRACT_ADDRESS',
    'erd1qqqqqqqqqqqqqpgqmhm6kg3mj3k0w9a3nda9xuw4tac3n5zx2jps8rp6sd'
  ),
  testAddress: getEnvVar('NEXT_PUBLIC_TEST_CONTRACT_ADDRESS'),
};

// Gas Limits Configuration
export const gasLimits: GasLimits = {
  register: getEnvNumber('NEXT_PUBLIC_GAS_LIMIT_REGISTER', 5000000),
  mint: getEnvNumber('NEXT_PUBLIC_GAS_LIMIT_MINT', 15000000),
  transfer: getEnvNumber('NEXT_PUBLIC_GAS_LIMIT_TRANSFER', 10000000),
  tournament: getEnvNumber('NEXT_PUBLIC_GAS_LIMIT_TOURNAMENT', 12000000),
};

// Mint Costs Configuration (in wei - 18 decimals)
export const mintCosts: MintCosts = {
  common: getEnvVar('NEXT_PUBLIC_MINT_COST_COMMON', '1000000000000000000'), // 1 EGLD
  rare: getEnvVar('NEXT_PUBLIC_MINT_COST_RARE', '2000000000000000000'), // 2 EGLD
  epic: getEnvVar('NEXT_PUBLIC_MINT_COST_EPIC', '5000000000000000000'), // 5 EGLD
  legendary: getEnvVar('NEXT_PUBLIC_MINT_COST_LEGENDARY', '10000000000000000000'), // 10 EGLD
};

// Application Configuration
export const appConfig: AppConfig = {
  name: getEnvVar('NEXT_PUBLIC_APP_NAME', 'StardustEngine'),
  description: getEnvVar(
    'NEXT_PUBLIC_APP_DESCRIPTION',
    'Next-generation NFT Gaming Platform on MultiversX'
  ),
  version: getEnvVar('NEXT_PUBLIC_APP_VERSION', '3.0.0'),
  devMode: getEnvBool('NEXT_PUBLIC_DEV_MODE', true),
  debug: getEnvBool('NEXT_PUBLIC_DEBUG', true),
};

// Feature Flags
export const featureFlags = {
  tournaments: getEnvBool('NEXT_PUBLIC_ENABLE_TOURNAMENTS', true),
  achievements: getEnvBool('NEXT_PUBLIC_ENABLE_ACHIEVEMENTS', true),
  assetTrading: getEnvBool('NEXT_PUBLIC_ENABLE_ASSET_TRADING', true),
  analytics: getEnvBool('NEXT_PUBLIC_ENABLE_ANALYTICS', false),
  devTools: getEnvBool('NEXT_PUBLIC_ENABLE_DEV_TOOLS', true),
};

// External Services Configuration
export const externalServices = {
  walletConnectProjectId: getEnvVar('NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID'),
  apiBaseUrl: getEnvVar('NEXT_PUBLIC_API_BASE_URL', 'https://stardustengine-api.onrender.com'),
  gaTrackingId: getEnvVar('NEXT_PUBLIC_GA_TRACKING_ID'),
  sentryDsn: getEnvVar('NEXT_PUBLIC_SENTRY_DSN'),
};

// Social Links
export const socialLinks = {
  github: getEnvVar('NEXT_PUBLIC_GITHUB_URL', 'https://github.com/Gzeu/StardustEngine'),
  discord: getEnvVar('NEXT_PUBLIC_DISCORD_URL'),
  twitter: getEnvVar('NEXT_PUBLIC_TWITTER_URL'),
};

// Development Utilities
export const isDevelopment = process.env.NODE_ENV === 'development';
export const isProduction = process.env.NODE_ENV === 'production';
export const isTest = process.env.NODE_ENV === 'test';

// Export all configuration as a single object
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

// Validation function to check if all required env vars are set
export const validateConfig = (): boolean => {
  const requiredVars = [
    'NEXT_PUBLIC_MULTIVERSX_NETWORK',
    'NEXT_PUBLIC_CONTRACT_ADDRESS',
  ];

  const missing = requiredVars.filter(varName => !process.env[varName]);
  
  if (missing.length > 0) {
    console.error('Missing required environment variables:', missing);
    return false;
  }
  
  return true;
};

// Helper function to format EGLD values
export const formatEGLD = (weiValue: string): string => {
  const egld = parseFloat(weiValue) / Math.pow(10, 18);
  return egld.toString();
};

// Helper function to convert EGLD to wei
export const toWei = (egldValue: string): string => {
  const wei = parseFloat(egldValue) * Math.pow(10, 18);
  return wei.toString();
};

export default config;