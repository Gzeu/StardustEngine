// StardustEngine Gaming Platform Type Definitions

// ===== PLAYER SYSTEM =====

export interface PlayerStats {
  level: number;
  experience: number;
  games_played: number;
  games_won: number;
  assets_owned: number;
  achievements: string[];
  total_points: number;
  last_activity: number;
  win_rate: number;
}

export interface PlayerProfile {
  address: string;
  username?: string;
  avatar_url?: string;
  registered_at: number;
  stats: PlayerStats;
  badges: PlayerBadge[];
  guild_id?: number;
}

export interface PlayerBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: Rarity;
  unlocked_at: number;
}

// ===== NFT ASSET SYSTEM =====

export interface GameAsset {
  id: number;
  owner: string;
  creator: string;
  asset_type: AssetType;
  rarity: Rarity;
  name: string;
  description: string;
  image_uri?: string;
  created_at: number;
  level: number;
  experience: number;
  stats: AssetStats;
  compatible_games: string[];
  is_tradeable: boolean;
  usage_count: number;
  market_value?: string;
}

export interface AssetStats {
  attack: number;
  defense: number;
  speed: number;
  durability: number;
  special_power: number;
  critical_chance: number;
  energy_cost: number;
}

export enum AssetType {
  Weapon = 'Weapon',
  Character = 'Character',
  Skin = 'Skin',
  Consumable = 'Consumable',
  Vehicle = 'Vehicle',
  Structure = 'Structure',
  Accessory = 'Accessory',
  Pet = 'Pet'
}

export enum Rarity {
  Common = 'Common',
  Rare = 'Rare',
  Epic = 'Epic',
  Legendary = 'Legendary',
  Mythic = 'Mythic'
}

// ===== TOURNAMENT SYSTEM =====

export interface Tournament {
  id: number;
  name: string;
  description: string;
  organizer: string;
  entry_fee: string;
  prize_pool: string;
  max_participants: number;
  current_participants: number;
  start_time: number;
  end_time: number;
  registration_deadline: number;
  status: TournamentStatus;
  participants: TournamentParticipant[];
  winners: TournamentWinner[];
  rules: string;
  game_mode: GameMode;
}

export interface TournamentParticipant {
  player_address: string;
  player_name?: string;
  joined_at: number;
  entry_fee_paid: string;
  current_rank?: number;
  score?: number;
  eliminated?: boolean;
}

export interface TournamentWinner {
  player_address: string;
  player_name?: string;
  position: number; // 1st, 2nd, 3rd, etc.
  prize_amount: string;
  awarded_at: number;
}

export enum TournamentStatus {
  Registration = 'Registration',
  Active = 'Active',
  Completed = 'Completed',
  Cancelled = 'Cancelled',
  Postponed = 'Postponed'
}

export enum GameMode {
  BattleRoyale = 'BattleRoyale',
  OneVsOne = 'OneVsOne',
  TeamBased = 'TeamBased',
  Survival = 'Survival',
  Racing = 'Racing',
  Strategy = 'Strategy'
}

// ===== ACHIEVEMENT SYSTEM =====

export interface Achievement {
  id: number;
  name: string;
  description: string;
  icon: string;
  points: number;
  rarity: Rarity;
  category: AchievementCategory;
  unlock_condition: string;
  unlock_requirement: number;
  created_at: number;
  total_unlocked: number;
}

export interface PlayerAchievement {
  achievement_id: number;
  player_address: string;
  unlocked_at: number;
  progress: number;
  completed: boolean;
}

export enum AchievementCategory {
  Combat = 'Combat',
  Collection = 'Collection',
  Social = 'Social',
  Tournament = 'Tournament',
  Exploration = 'Exploration',
  Trading = 'Trading',
  Milestone = 'Milestone'
}

// ===== GUILD SYSTEM =====

export interface Guild {
  id: number;
  name: string;
  description: string;
  founder: string;
  created_at: number;
  member_count: number;
  max_members: number;
  level: number;
  experience: number;
  treasury: string; // EGLD amount
  status: GuildStatus;
  requirements: GuildRequirements;
}

export interface GuildMember {
  player_address: string;
  player_name?: string;
  role: GuildRole;
  joined_at: number;
  contribution_points: number;
  last_activity: number;
}

export interface GuildRequirements {
  min_level: number;
  min_assets: number;
  application_required: boolean;
  invitation_only: boolean;
}

export enum GuildRole {
  Member = 'Member',
  Officer = 'Officer',
  Leader = 'Leader',
  Founder = 'Founder'
}

export enum GuildStatus {
  Active = 'Active',
  Recruiting = 'Recruiting',
  Closed = 'Closed',
  Disbanded = 'Disbanded'
}

// ===== CONTRACT INTERACTION =====

export interface ContractTransaction {
  function: string;
  args: any[];
  value: string;
  gas_limit: number;
  receiver: string;
}

export interface TransactionResult {
  success: boolean;
  session_id: string;
  transaction_hash?: string;
  error_message?: string;
  block_number?: number;
  timestamp?: number;
}

export interface ContractQuery {
  function: string;
  args: any[];
}

export interface QueryResult<T = any> {
  success: boolean;
  data: T | null;
  error_message?: string;
}

// ===== NETWORK CONFIGURATION =====

export interface NetworkConfig {
  id: string;
  name: string;
  gateway_url: string;
  api_url: string;
  explorer_url: string;
  wallet_url: string;
  chain_id: string;
}

export type NetworkType = 'devnet' | 'testnet' | 'mainnet';

// ===== UI STATE MANAGEMENT =====

export interface GameUIState {
  activeTab: string;
  loading: boolean;
  error: string | null;
  walletConnected: boolean;
  playerRegistered: boolean;
  showMintForm: boolean;
  selectedAsset: GameAsset | null;
  notifications: NotificationMessage[];
}

export interface NotificationMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: number;
  duration?: number;
}

// ===== MARKETPLACE =====

export interface MarketplaceListing {
  id: number;
  asset_id: number;
  seller_address: string;
  price: string;
  currency: 'EGLD' | 'USDC';
  listed_at: number;
  expires_at?: number;
  status: ListingStatus;
  views: number;
  favorites: number;
}

export enum ListingStatus {
  Active = 'Active',
  Sold = 'Sold',
  Cancelled = 'Cancelled',
  Expired = 'Expired'
}

// ===== GAME INTEGRATION =====

export interface GameIntegration {
  game_id: string;
  game_name: string;
  developer: string;
  supported_assets: AssetType[];
  api_endpoint: string;
  integration_status: IntegrationStatus;
  player_count: number;
  last_updated: number;
}

export enum IntegrationStatus {
  Active = 'Active',
  Beta = 'Beta',
  Development = 'Development',
  Deprecated = 'Deprecated'
}

// ===== ANALYTICS =====

export interface PlatformAnalytics {
  total_players: number;
  total_assets: number;
  total_tournaments: number;
  total_transactions: number;
  total_volume: string; // EGLD
  daily_active_users: number;
  assets_minted_today: number;
  tournaments_today: number;
  last_updated: number;
}

export interface PlayerAnalytics {
  player_address: string;
  total_time_played: number;
  favorite_asset_type: AssetType;
  most_used_asset: number;
  trading_volume: string;
  tournament_participation: number;
  achievement_completion_rate: number;
  social_interactions: number;
}

// ===== FORM VALIDATION =====

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
  code?: string;
}

// ===== API RESPONSES =====

export interface APIResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
  timestamp: number;
}

export interface PaginatedResponse<T = any> {
  items: T[];
  total_count: number;
  page: number;
  per_page: number;
  has_next: boolean;
  has_previous: boolean;
}

// ===== EVENT TYPES =====

export interface GameEvent {
  id: string;
  type: GameEventType;
  player_address: string;
  data: any;
  timestamp: number;
  block_number: number;
  transaction_hash: string;
}

export enum GameEventType {
  PlayerRegistered = 'PlayerRegistered',
  AssetMinted = 'AssetMinted',
  AssetTransferred = 'AssetTransferred',
  TournamentCreated = 'TournamentCreated',
  TournamentJoined = 'TournamentJoined',
  AchievementUnlocked = 'AchievementUnlocked',
  ExperienceGained = 'ExperienceGained',
  LevelUp = 'LevelUp'
}

// ===== EXPORT ALL TYPES =====

export type {
  // Re-export all interfaces for easy importing
  PlayerStats,
  PlayerProfile,
  PlayerBadge,
  GameAsset,
  AssetStats,
  Tournament,
  TournamentParticipant,
  TournamentWinner,
  Achievement,
  PlayerAchievement,
  Guild,
  GuildMember,
  GuildRequirements,
  ContractTransaction,
  TransactionResult,
  ContractQuery,
  QueryResult,
  NetworkConfig,
  GameUIState,
  NotificationMessage,
  MarketplaceListing,
  GameIntegration,
  PlatformAnalytics,
  PlayerAnalytics,
  ValidationResult,
  ValidationError,
  APIResponse,
  PaginatedResponse,
  GameEvent
};

// Export all enums
export {
  AssetType,
  Rarity,
  TournamentStatus,
  GameMode,
  AchievementCategory,
  GuildRole,
  GuildStatus,
  ListingStatus,
  IntegrationStatus,
  GameEventType
};