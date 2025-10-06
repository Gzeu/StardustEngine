import {
  Address,
  ContractFunction,
  ResultsParser,
  SmartContract,
  BytesValue,
  U64Value,
  BigUIntValue,
  StringValue
} from '@multiversx/sdk-core';
import { ProxyNetworkProvider } from '@multiversx/sdk-network-providers';
import { sendTransactions } from '@multiversx/sdk-dapp/services';

// Types and interfaces
export interface PlayerStats {
  level: number;
  experience: number;
  games_played: number;
  games_won: number;
  assets_owned: number;
  achievements: string[];
}

export interface GameAsset {
  id: number;
  owner: string;
  asset_type: AssetType;
  rarity: Rarity;
  name: string;
  description: string;
  created_at: number;
  level: number;
  experience: number;
}

export interface Tournament {
  id: number;
  name: string;
  organizer: string;
  entry_fee: string;
  prize_pool: string;
  max_participants: number;
  current_participants: number;
  start_time: number;
  status: TournamentStatus;
  participants: string[];
}

export enum AssetType {
  Weapon = 'Weapon',
  Character = 'Character',
  Skin = 'Skin',
  Consumable = 'Consumable',
  Vehicle = 'Vehicle',
  Structure = 'Structure'
}

export enum Rarity {
  Common = 'Common',
  Rare = 'Rare',
  Epic = 'Epic',
  Legendary = 'Legendary'
}

export enum TournamentStatus {
  Registration = 'Registration',
  Active = 'Active',
  Completed = 'Completed',
  Cancelled = 'Cancelled'
}

// Contract configuration
export const CONTRACT_CONFIG = {
  address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '',
  gasLimits: {
    registerPlayer: 5000000,
    mintAsset: 15000000,
    transferAsset: 10000000,
    createTournament: 12000000,
    joinTournament: 8000000,
    updateExperience: 6000000
  },
  mintingCosts: {
    [Rarity.Common]: '1000000000000000000',    // 1 EGLD
    [Rarity.Rare]: '2000000000000000000',      // 2 EGLD
    [Rarity.Epic]: '5000000000000000000',      // 5 EGLD
    [Rarity.Legendary]: '10000000000000000000' // 10 EGLD
  }
};

// Network configuration
const getNetworkProvider = () => {
  const network = process.env.NEXT_PUBLIC_MULTIVERSX_NETWORK || 'devnet';
  const gatewayUrl = process.env.NEXT_PUBLIC_GATEWAY_URL || 'https://devnet-gateway.multiversx.com';
  return new ProxyNetworkProvider(gatewayUrl);
};

// Contract instance
const getContract = () => {
  return new SmartContract({
    address: new Address(CONTRACT_CONFIG.address)
  });
};

// Utility functions
export const encodeString = (str: string): string => {
  return Buffer.from(str).toString('hex');
};

export const encodeNumber = (num: number): string => {
  return num.toString(16).padStart(2, '0');
};

export const formatEGLD = (amount: string): string => {
  const egld = parseFloat(amount) / Math.pow(10, 18);
  return egld.toFixed(4);
};

// Contract interaction functions
export class StardustEngineAPI {
  private contract: SmartContract;
  private networkProvider: ProxyNetworkProvider;

  constructor() {
    this.contract = getContract();
    this.networkProvider = getNetworkProvider();
  }

  // ===== PLAYER MANAGEMENT =====

  async registerPlayer(): Promise<string> {
    const transaction = {
      value: '0',
      data: 'register_player',
      receiver: CONTRACT_CONFIG.address,
      gasLimit: CONTRACT_CONFIG.gasLimits.registerPlayer
    };

    const result = await sendTransactions({
      transactions: [transaction],
      transactionsDisplayInfo: {
        processingMessage: 'Registering player on blockchain...',
        errorMessage: 'Player registration failed. Please try again.',
        successMessage: 'Successfully registered! Welcome to StardustEngine!'
      }
    });

    return result.sessionId;
  }

  async getPlayerStats(playerAddress: string): Promise<PlayerStats | null> {
    try {
      const query = this.contract.createQuery({
        func: new ContractFunction('get_player_stats'),
        args: [new StringValue(playerAddress)]
      });

      const response = await this.networkProvider.queryContract(query);
      const parser = new ResultsParser();
      const parsed = parser.parseQueryResponse(response, query.func);

      if (parsed && parsed.length > 0) {
        // Parse the returned data structure
        return {
          level: parsed[0].valueOf()?.level || 1,
          experience: parsed[0].valueOf()?.experience || 0,
          games_played: parsed[0].valueOf()?.games_played || 0,
          games_won: parsed[0].valueOf()?.games_won || 0,
          assets_owned: parsed[0].valueOf()?.assets_owned || 0,
          achievements: parsed[0].valueOf()?.achievements || []
        };
      }

      return null;
    } catch (error) {
      console.error('Error fetching player stats:', error);
      return null;
    }
  }

  async isPlayerRegistered(playerAddress: string): Promise<boolean> {
    try {
      const query = this.contract.createQuery({
        func: new ContractFunction('is_player_registered'),
        args: [new StringValue(playerAddress)]
      });

      const response = await this.networkProvider.queryContract(query);
      const parser = new ResultsParser();
      const parsed = parser.parseQueryResponse(response, query.func);

      return parsed && parsed.length > 0 ? parsed[0].valueOf() : false;
    } catch (error) {
      console.error('Error checking player registration:', error);
      return false;
    }
  }

  // ===== NFT ASSET SYSTEM =====

  async mintGameAsset(
    assetType: AssetType,
    rarity: Rarity,
    name: string,
    description: string
  ): Promise<string> {
    const cost = CONTRACT_CONFIG.mintingCosts[rarity];
    
    const data = [
      'mint_game_asset',
      encodeString(assetType),
      encodeString(rarity),
      encodeString(name),
      encodeString(description)
    ].join('@');

    const transaction = {
      value: cost,
      data,
      receiver: CONTRACT_CONFIG.address,
      gasLimit: CONTRACT_CONFIG.gasLimits.mintAsset
    };

    const result = await sendTransactions({
      transactions: [transaction],
      transactionsDisplayInfo: {
        processingMessage: `Minting ${rarity} ${assetType}...`,
        errorMessage: 'Asset minting failed. Please check your balance and try again.',
        successMessage: `${rarity} ${assetType} "${name}" minted successfully!`
      }
    });

    return result.sessionId;
  }

  async getPlayerAssets(playerAddress: string): Promise<GameAsset[]> {
    try {
      const query = this.contract.createQuery({
        func: new ContractFunction('get_player_assets'),
        args: [new StringValue(playerAddress)]
      });

      const response = await this.networkProvider.queryContract(query);
      const parser = new ResultsParser();
      const parsed = parser.parseQueryResponse(response, query.func);

      if (parsed && parsed.length > 0) {
        return parsed[0].valueOf() || [];
      }

      return [];
    } catch (error) {
      console.error('Error fetching player assets:', error);
      return [];
    }
  }

  async getAsset(assetId: number): Promise<GameAsset | null> {
    try {
      const query = this.contract.createQuery({
        func: new ContractFunction('get_asset'),
        args: [new U64Value(assetId)]
      });

      const response = await this.networkProvider.queryContract(query);
      const parser = new ResultsParser();
      const parsed = parser.parseQueryResponse(response, query.func);

      return parsed && parsed.length > 0 ? parsed[0].valueOf() : null;
    } catch (error) {
      console.error('Error fetching asset:', error);
      return null;
    }
  }

  async transferAsset(assetId: number, toAddress: string): Promise<string> {
    const data = [
      'transfer_asset',
      assetId.toString(),
      encodeString(toAddress)
    ].join('@');

    const transaction = {
      value: '0',
      data,
      receiver: CONTRACT_CONFIG.address,
      gasLimit: CONTRACT_CONFIG.gasLimits.transferAsset
    };

    const result = await sendTransactions({
      transactions: [transaction],
      transactionsDisplayInfo: {
        processingMessage: 'Transferring asset...',
        errorMessage: 'Asset transfer failed. Please verify ownership and recipient address.',
        successMessage: 'Asset transferred successfully!'
      }
    });

    return result.sessionId;
  }

  // ===== TOURNAMENT SYSTEM =====

  async createTournament(
    name: string,
    entryFee: string,
    maxParticipants: number,
    startTime: number,
    prizePool: string
  ): Promise<string> {
    const data = [
      'create_tournament',
      encodeString(name),
      entryFee,
      maxParticipants.toString(),
      startTime.toString()
    ].join('@');

    const transaction = {
      value: prizePool,
      data,
      receiver: CONTRACT_CONFIG.address,
      gasLimit: CONTRACT_CONFIG.gasLimits.createTournament
    };

    const result = await sendTransactions({
      transactions: [transaction],
      transactionsDisplayInfo: {
        processingMessage: 'Creating tournament...',
        errorMessage: 'Tournament creation failed. Please check your balance.',
        successMessage: `Tournament "${name}" created successfully!`
      }
    });

    return result.sessionId;
  }

  async joinTournament(tournamentId: number, entryFee: string): Promise<string> {
    const data = [
      'join_tournament',
      tournamentId.toString()
    ].join('@');

    const transaction = {
      value: entryFee,
      data,
      receiver: CONTRACT_CONFIG.address,
      gasLimit: CONTRACT_CONFIG.gasLimits.joinTournament
    };

    const result = await sendTransactions({
      transactions: [transaction],
      transactionsDisplayInfo: {
        processingMessage: 'Joining tournament...',
        errorMessage: 'Failed to join tournament. Please check entry fee and registration status.',
        successMessage: 'Successfully joined tournament! Good luck!'
      }
    });

    return result.sessionId;
  }

  async getTournament(tournamentId: number): Promise<Tournament | null> {
    try {
      const query = this.contract.createQuery({
        func: new ContractFunction('get_tournament'),
        args: [new U64Value(tournamentId)]
      });

      const response = await this.networkProvider.queryContract(query);
      const parser = new ResultsParser();
      const parsed = parser.parseQueryResponse(response, query.func);

      return parsed && parsed.length > 0 ? parsed[0].valueOf() : null;
    } catch (error) {
      console.error('Error fetching tournament:', error);
      return null;
    }
  }

  // ===== CONTRACT STATISTICS =====

  async getTotalPlayers(): Promise<number> {
    try {
      const query = this.contract.createQuery({
        func: new ContractFunction('get_total_players')
      });

      const response = await this.networkProvider.queryContract(query);
      const parser = new ResultsParser();
      const parsed = parser.parseQueryResponse(response, query.func);

      return parsed && parsed.length > 0 ? parsed[0].valueOf() : 0;
    } catch (error) {
      console.error('Error fetching total players:', error);
      return 0;
    }
  }

  async getTotalAssets(): Promise<number> {
    try {
      const query = this.contract.createQuery({
        func: new ContractFunction('get_total_assets')
      });

      const response = await this.networkProvider.queryContract(query);
      const parser = new ResultsParser();
      const parsed = parser.parseQueryResponse(response, query.func);

      return parsed && parsed.length > 0 ? parsed[0].valueOf() : 0;
    } catch (error) {
      console.error('Error fetching total assets:', error);
      return 0;
    }
  }

  async getTotalTournaments(): Promise<number> {
    try {
      const query = this.contract.createQuery({
        func: new ContractFunction('get_total_tournaments')
      });

      const response = await this.networkProvider.queryContract(query);
      const parser = new ResultsParser();
      const parsed = parser.parseQueryResponse(response, query.func);

      return parsed && parsed.length > 0 ? parsed[0].valueOf() : 0;
    } catch (error) {
      console.error('Error fetching total tournaments:', error);
      return 0;
    }
  }

  // ===== UTILITY FUNCTIONS =====

  calculateLevel(experience: number): number {
    return Math.floor(Math.sqrt(experience / 100)) + 1;
  }

  getExperienceForLevel(level: number): number {
    return Math.pow(level - 1, 2) * 100;
  }

  getExperienceToNextLevel(experience: number): number {
    const currentLevel = this.calculateLevel(experience);
    const nextLevelExp = this.getExperienceForLevel(currentLevel + 1);
    return nextLevelExp - experience;
  }

  formatTimestamp(timestamp: number): string {
    return new Date(timestamp * 1000).toLocaleString();
  }

  validateAssetName(name: string): boolean {
    return name.trim().length >= 3 && name.trim().length <= 50;
  }

  validateAssetDescription(description: string): boolean {
    return description.trim().length >= 10 && description.trim().length <= 500;
  }

  // ===== ADMIN FUNCTIONS =====

  async updatePlayerExperience(
    playerAddress: string,
    experienceGained: number
  ): Promise<string> {
    const data = [
      'update_player_experience',
      encodeString(playerAddress),
      experienceGained.toString()
    ].join('@');

    const transaction = {
      value: '0',
      data,
      receiver: CONTRACT_CONFIG.address,
      gasLimit: CONTRACT_CONFIG.gasLimits.updateExperience
    };

    const result = await sendTransactions({
      transactions: [transaction],
      transactionsDisplayInfo: {
        processingMessage: 'Updating player experience...',
        errorMessage: 'Failed to update experience. Admin privileges required.',
        successMessage: `Added ${experienceGained} experience points!`
      }
    });

    return result.sessionId;
  }

  // ===== CONTRACT INFO =====

  async getContractVersion(): Promise<string> {
    try {
      const query = this.contract.createQuery({
        func: new ContractFunction('get_version')
      });

      const response = await this.networkProvider.queryContract(query);
      const parser = new ResultsParser();
      const parsed = parser.parseQueryResponse(response, query.func);

      return parsed && parsed.length > 0 ? parsed[0].valueOf() : 'Unknown';
    } catch (error) {
      console.error('Error fetching contract version:', error);
      return 'Unknown';
    }
  }

  async getContractGreeting(): Promise<string> {
    try {
      const query = this.contract.createQuery({
        func: new ContractFunction('hello')
      });

      const response = await this.networkProvider.queryContract(query);
      const parser = new ResultsParser();
      const parsed = parser.parseQueryResponse(response, query.func);

      return parsed && parsed.length > 0 ? parsed[0].valueOf() : 'Hello from StardustEngine!';
    } catch (error) {
      console.error('Error fetching contract greeting:', error);
      return 'Hello from StardustEngine!';
    }
  }
}

// Export singleton instance
export const stardustAPI = new StardustEngineAPI();

// Export utility functions
export {
  CONTRACT_CONFIG,
  encodeString,
  encodeNumber,
  formatEGLD
};