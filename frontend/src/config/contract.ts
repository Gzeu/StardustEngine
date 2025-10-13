// StardustEngine Contract Configuration

// Contract Address
export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || 'erd1hek3gle53u9xcya7r56t4uppnwr98u477hdjrm0l6l47zf708n9s769wf7';

// Network Configuration
export const NETWORK_CONFIG = {
  id: 'devnet',
  name: 'Devnet',
  egldLabel: 'EGLD',
  decimals: 18,
  gasPerDataByte: 1500,
  apiTimeout: 10000,
  walletConnectDeepLink: 'https://maiar.page.link/?apn=com.elrond.maiar.wallet&isi=1519405832&ibi=com.elrond.maiar.wallet&link=https://maiar.com/',
};

// API Endpoints
export const API_CONFIG = {
  gateway: process.env.NEXT_PUBLIC_GATEWAY_URL || 'https://devnet-gateway.multiversx.com',
  api: process.env.NEXT_PUBLIC_API_URL || 'https://devnet-api.multiversx.com',
  explorer: process.env.NEXT_PUBLIC_EXPLORER_URL || 'https://devnet-explorer.multiversx.com',
  ipfsGateway: process.env.NEXT_PUBLIC_IPFS_GATEWAY || 'https://ipfs.io/ipfs/',
};

// Contract Functions
export const CONTRACT_FUNCTIONS = {
  // Player functions
  REGISTER_PLAYER: 'register_player',
  GET_PLAYER_STATS: 'get_player_stats',
  UPDATE_PLAYER_EXPERIENCE: 'update_player_experience',
  
  // Asset functions
  MINT_GAME_ASSET: 'mint_game_asset',
  GET_ASSET: 'get_asset',
  GET_ALL_ASSETS: 'get_all_assets',
  GET_PLAYER_ASSETS: 'get_player_assets',
  TRANSFER_ASSET: 'transfer_asset',
  
  // Tournament functions
  CREATE_TOURNAMENT: 'create_tournament',
  JOIN_TOURNAMENT: 'join_tournament',
  GET_TOURNAMENT: 'get_tournament',
  GET_ALL_TOURNAMENTS: 'get_all_tournaments',
  
  // General
  GET_VERSION: 'get_version',
  HELLO: 'hello'
};

// Asset Types
export const ASSET_TYPES = {
  WEAPON: 'Weapon',
  CHARACTER: 'Character', 
  SKIN: 'Skin',
  CONSUMABLE: 'Consumable',
  VEHICLE: 'Vehicle',
  STRUCTURE: 'Structure'
} as const;

// Rarity Levels
export const RARITY_LEVELS = {
  COMMON: 'Common',
  RARE: 'Rare', 
  EPIC: 'Epic',
  LEGENDARY: 'Legendary'
} as const;

// Rarity Prices (in EGLD)
export const RARITY_PRICES = {
  [RARITY_LEVELS.COMMON]: 1,
  [RARITY_LEVELS.RARE]: 2,
  [RARITY_LEVELS.EPIC]: 5,
  [RARITY_LEVELS.LEGENDARY]: 10
};

// Rarity Colors
export const RARITY_COLORS = {
  [RARITY_LEVELS.COMMON]: '#9CA3AF',    // Gray
  [RARITY_LEVELS.RARE]: '#3B82F6',      // Blue  
  [RARITY_LEVELS.EPIC]: '#8B5CF6',      // Purple
  [RARITY_LEVELS.LEGENDARY]: '#F59E0B'  // Gold
};

// Gas Limits for Contract Functions
export const GAS_LIMITS = {
  REGISTER_PLAYER: 5_000_000,
  MINT_ASSET: 15_000_000,
  TRANSFER_ASSET: 10_000_000,
  CREATE_TOURNAMENT: 12_000_000,
  JOIN_TOURNAMENT: 8_000_000,
  DEFAULT: 6_000_000
};

// Feature Flags
export const FEATURE_FLAGS = {
  ENABLE_SOUND: process.env.NEXT_PUBLIC_ENABLE_SOUND === 'true',
  ENABLE_PARTICLES: process.env.NEXT_PUBLIC_ENABLE_PARTICLES === 'true',
  ENABLE_3D: process.env.NEXT_PUBLIC_ENABLE_3D === 'true',
  DEBUG_MODE: process.env.NEXT_PUBLIC_DEBUG === 'true',
  PERFORMANCE_MONITORING: process.env.NEXT_PUBLIC_PERFORMANCE_MONITORING === 'true'
};

// Helper function to get explorer link
export function getExplorerLink(hash: string, type: 'transaction' | 'address' | 'block' = 'transaction'): string {
  return `${API_CONFIG.explorer}/${type}s/${hash}`;
}

// Helper function to format IPFS URL
export function getIPFSUrl(hash: string): string {
  if (hash.startsWith('http')) return hash;
  return `${API_CONFIG.ipfsGateway}${hash.replace('ipfs://', '')}`;
}

// Helper function to validate MultiversX address
export function isValidAddress(address: string): boolean {
  return /^erd1[a-z0-9]{58}$/.test(address);
}

// Contract ABI (basic structure)
export const CONTRACT_ABI = {
  name: 'StardustEngine',
  endpoints: [
    {
      name: CONTRACT_FUNCTIONS.REGISTER_PLAYER,
      inputs: [],
      outputs: []
    },
    {
      name: CONTRACT_FUNCTIONS.MINT_GAME_ASSET,
      inputs: [
        { name: 'asset_type', type: 'bytes' },
        { name: 'rarity', type: 'bytes' },
        { name: 'name', type: 'bytes' },
        { name: 'description', type: 'bytes' }
      ],
      outputs: [{ type: 'u64' }]
    },
    {
      name: CONTRACT_FUNCTIONS.GET_PLAYER_STATS,
      inputs: [{ name: 'player_address', type: 'Address' }],
      outputs: [
        { name: 'level', type: 'u32' },
        { name: 'experience', type: 'u64' },
        { name: 'games_played', type: 'u32' },
        { name: 'games_won', type: 'u32' },
        { name: 'assets_owned', type: 'u32' }
      ]
    }
  ]
};

export type AssetType = typeof ASSET_TYPES[keyof typeof ASSET_TYPES];
export type RarityLevel = typeof RARITY_LEVELS[keyof typeof RARITY_LEVELS];