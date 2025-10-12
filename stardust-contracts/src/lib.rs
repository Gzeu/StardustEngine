#![no_std]

mod combat_system;
mod quest_system;

pub use combat_system::*;
pub use quest_system::*;

use multiversx_sc::imports::*;

/// Enhanced Gaming Infrastructure Contract for StardustEngine
/// The complete blockchain gaming platform with NFT assets, combat, and story progression
#[multiversx_sc::contract]
pub trait StardustContracts: 
    combat_system::CombatSystem + 
    quest_system::QuestSystem 
{
    #[init]
    fn init(&self) {
        self.next_asset_id().set(1u64);
        self.next_tournament_id().set(1u64);
        self.next_battle_id().set(1u64);
        
        // Initialize default missions for Chapter 1
        // This would be called by admin after deployment
    }

    #[upgrade]
    fn upgrade(&self) {}

    // ===== BASIC ENDPOINTS =====
    
    #[endpoint]
    fn hello(&self) -> ManagedBuffer {
        ManagedBuffer::from(b"Welcome to StardustEngine Gaming Platform v2.1!")
    }
    
    #[endpoint]
    fn get_version(&self) -> ManagedBuffer {
        ManagedBuffer::from(b"v2.1.0-complete-gaming")
    }

    // ===== PLAYER MANAGEMENT =====
    
    #[endpoint]
    fn register_player(&self) {
        let caller = self.blockchain().get_caller();
        require!(!self.players().contains(&caller), "Player already registered");
        
        self.players().insert(caller.clone());
        self.player_stats(&caller).set(PlayerStats {
            level: 1u32,
            experience: 0u64,
            games_played: 0u32,
            games_won: 0u32,
            assets_owned: 0u32,
            achievements: ManagedVec::new(),
        });
        
        // Initialize Stardust Points
        self.player_stardust_points(&caller).set(100u64); // Starting bonus
        
        self.player_registered_event(&caller);
    }
    
    #[view]
    fn get_player_stats(&self, player: ManagedAddress) -> OptionalValue<PlayerStats<Self::Api>> {
        if !self.players().contains(&player) {
            OptionalValue::None
        } else {
            OptionalValue::Some(self.player_stats(&player).get())
        }
    }
    
    #[view]
    fn get_player_profile(&self, player: ManagedAddress) -> OptionalValue<PlayerProfile<Self::Api>> {
        if !self.players().contains(&player) {
            OptionalValue::None
        } else {
            let stats = self.player_stats(&player).get();
            let stardust_points = self.player_stardust_points(&player).get();
            let titles = self.get_player_titles(player.clone());
            let active_missions = self.get_player_missions(player.clone());
            
            OptionalValue::Some(PlayerProfile {
                address: player,
                stats,
                stardust_points,
                titles,
                active_missions: active_missions.len() as u32,
                joined_at: self.blockchain().get_block_timestamp(), // Simplified
            })
        }
    }
    
    #[endpoint]
    fn update_player_experience(&self, player: ManagedAddress, exp_gained: u64) {
        self.require_caller_is_admin();
        require!(self.players().contains(&player), "Player not registered");
        
        self.player_stats(&player).update(|stats| {
            stats.experience += exp_gained;
            stats.level = self.calculate_level(stats.experience);
        });
        
        self.experience_gained_event(&player, exp_gained);
    }

    // ===== NFT ASSET SYSTEM =====
    
    #[endpoint]
    #[payable("EGLD")]
    fn mint_game_asset(
        &self,
        asset_type: AssetType,
        rarity: Rarity,
        name: ManagedBuffer,
        description: ManagedBuffer,
    ) -> u64 {
        let payment = self.call_value().egld_value().clone_value();
        let mint_cost = self.get_mint_cost(&rarity);
        require!(payment >= mint_cost, "Insufficient payment for minting");
        
        let caller = self.blockchain().get_caller();
        require!(self.players().contains(&caller), "Player not registered");
        
        let asset_id = self.next_asset_id().get();
        self.next_asset_id().set(asset_id + 1);
        
        let asset = GameAsset {
            id: asset_id,
            owner: caller.clone(),
            asset_type: asset_type.clone(),
            rarity: rarity.clone(),
            name: name.clone(),
            description,
            created_at: self.blockchain().get_block_timestamp(),
            level: 1u32,
            experience: 0u64,
        };
        
        self.game_assets().insert(asset_id);
        self.asset_owner(asset_id).set(caller.clone());
        self.asset_metadata(asset_id).set(asset);
        
        // Update player stats
        self.player_stats(&caller).update(|stats| {
            stats.assets_owned += 1;
        });
        
        self.asset_minted_event(&caller, asset_id, &name, &asset_type, &rarity);
        asset_id
    }
    
    #[endpoint]
    fn transfer_asset(&self, asset_id: u64, to: ManagedAddress) {
        let caller = self.blockchain().get_caller();
        require!(self.game_assets().contains(&asset_id), "Asset does not exist");
        require!(self.asset_owner(asset_id).get() == caller, "Not asset owner");
        require!(self.players().contains(&to), "Recipient not registered");
        
        self.asset_owner(asset_id).set(to.clone());
        self.asset_metadata(asset_id).update(|asset| {
            asset.owner = to.clone();
        });
        
        // Update stats
        self.player_stats(&caller).update(|stats| {
            stats.assets_owned -= 1;
        });
        self.player_stats(&to).update(|stats| {
            stats.assets_owned += 1;
        });
        
        self.asset_transferred_event(&caller, &to, asset_id);
    }
    
    #[view]
    fn get_asset(&self, asset_id: u64) -> OptionalValue<GameAsset<Self::Api>> {
        if !self.game_assets().contains(&asset_id) {
            OptionalValue::None
        } else {
            OptionalValue::Some(self.asset_metadata(asset_id).get())
        }
    }
    
    #[view]
    fn get_player_assets(&self, player: ManagedAddress) -> ManagedVec<GameAsset<Self::Api>> {
        let mut assets = ManagedVec::new();
        for asset_id in self.game_assets().iter() {
            if self.asset_owner(asset_id).get() == player {
                assets.push(self.asset_metadata(asset_id).get());
            }
        }
        assets
    }

    // ===== TOURNAMENT SYSTEM =====
    
    #[endpoint]
    #[payable("EGLD")]
    fn create_tournament(
        &self,
        name: ManagedBuffer,
        entry_fee: BigUint,
        max_participants: u32,
        start_time: u64,
    ) -> u64 {
        let prize_pool = self.call_value().egld_value().clone_value();
        require!(prize_pool > BigUint::zero(), "Prize pool required");
        
        let tournament_id = self.next_tournament_id().get();
        self.next_tournament_id().set(tournament_id + 1);
        
        let tournament = Tournament {
            id: tournament_id,
            name: name.clone(),
            organizer: self.blockchain().get_caller(),
            entry_fee,
            prize_pool: prize_pool.clone(),
            max_participants,
            current_participants: 0u32,
            start_time,
            status: TournamentStatus::Registration,
            participants: ManagedVec::new(),
        };
        
        self.tournaments().insert(tournament_id);
        self.tournament_data(tournament_id).set(tournament);
        
        self.tournament_created_event(tournament_id, &name, &prize_pool);
        tournament_id
    }
    
    #[endpoint]
    #[payable("EGLD")]
    fn join_tournament(&self, tournament_id: u64) {
        let payment = self.call_value().egld_value().clone_value();
        let caller = self.blockchain().get_caller();
        
        require!(self.tournaments().contains(&tournament_id), "Tournament not found");
        require!(self.players().contains(&caller), "Player not registered");
        
        let mut tournament = self.tournament_data(tournament_id).get();
        require!(tournament.status == TournamentStatus::Registration, "Registration closed");
        require!(tournament.current_participants < tournament.max_participants, "Tournament full");
        require!(payment >= tournament.entry_fee, "Insufficient entry fee");
        require!(!tournament.participants.contains(&caller), "Already registered");
        
        tournament.participants.push(caller.clone());
        tournament.current_participants += 1;
        tournament.prize_pool += payment.clone();
        
        self.tournament_data(tournament_id).set(tournament);
        
        self.tournament_joined_event(&caller, tournament_id, &payment);
    }
    
    #[view]
    fn get_tournament(&self, tournament_id: u64) -> OptionalValue<Tournament<Self::Api>> {
        if !self.tournaments().contains(&tournament_id) {
            OptionalValue::None
        } else {
            OptionalValue::Some(self.tournament_data(tournament_id).get())
        }
    }

    // ===== HELPER FUNCTIONS =====
    
    fn calculate_level(&self, experience: u64) -> u32 {
        // Enhanced level calculation for better progression
        ((experience / 100).integer_sqrt() + 1).try_into().unwrap_or(1u32)
    }
    
    fn get_mint_cost(&self, rarity: &Rarity) -> BigUint {
        match rarity {
            Rarity::Common => BigUint::from(1000000000000000000u64), // 1 EGLD
            Rarity::Rare => BigUint::from(2000000000000000000u64),   // 2 EGLD
            Rarity::Epic => BigUint::from(5000000000000000000u64),   // 5 EGLD
            Rarity::Legendary => BigUint::from(10000000000000000000u64), // 10 EGLD
        }
    }
    
    fn require_caller_is_admin(&self) {
        let caller = self.blockchain().get_caller();
        let owner = self.blockchain().get_owner_address();
        require!(caller == owner, "Only admin can call this function");
    }
    
    #[view]
    fn get_player_titles(&self, player: ManagedAddress) -> ManagedVec<ManagedBuffer> {
        let mut titles = ManagedVec::new();
        if self.players().contains(&player) {
            for title in self.player_titles(&player).iter() {
                titles.push(title);
            }
        }
        titles
    }

    // ===== VIEW FUNCTIONS =====
    
    #[view]
    fn get_total_players(&self) -> usize {
        self.players().len()
    }
    
    #[view]
    fn get_total_assets(&self) -> usize {
        self.game_assets().len()
    }
    
    #[view]
    fn get_total_tournaments(&self) -> usize {
        self.tournaments().len()
    }
    
    #[view]
    fn is_player_registered(&self, player: &ManagedAddress) -> bool {
        self.players().contains(player)
    }
    
    #[view]
    fn get_platform_stats(&self) -> PlatformStats {
        PlatformStats {
            total_players: self.get_total_players() as u64,
            total_assets: self.get_total_assets() as u64,
            total_tournaments: self.get_total_tournaments() as u64,
            total_battles: self.battles().len() as u64,
            total_missions: self.mission_templates().len() as u64,
        }
    }

    // ===== STORAGE =====
    
    #[storage_mapper("players")]
    fn players(&self) -> SetMapper<ManagedAddress>;
    
    #[storage_mapper("playerStats")]
    fn player_stats(&self, player: &ManagedAddress) -> SingleValueMapper<PlayerStats<Self::Api>>;
    
    #[storage_mapper("gameAssets")]
    fn game_assets(&self) -> UnorderedSetMapper<u64>;
    
    #[storage_mapper("assetOwner")]
    fn asset_owner(&self, asset_id: u64) -> SingleValueMapper<ManagedAddress>;
    
    #[storage_mapper("assetMetadata")]
    fn asset_metadata(&self, asset_id: u64) -> SingleValueMapper<GameAsset<Self::Api>>;
    
    #[storage_mapper("nextAssetId")]
    fn next_asset_id(&self) -> SingleValueMapper<u64>;
    
    #[storage_mapper("tournaments")]
    fn tournaments(&self) -> UnorderedSetMapper<u64>;
    
    #[storage_mapper("tournamentData")]
    fn tournament_data(&self, tournament_id: u64) -> SingleValueMapper<Tournament<Self::Api>>;
    
    #[storage_mapper("nextTournamentId")]
    fn next_tournament_id(&self) -> SingleValueMapper<u64>;

    // ===== EVENTS =====
    
    #[event("playerRegistered")]
    fn player_registered_event(&self, #[indexed] player: &ManagedAddress);
    
    #[event("assetMinted")]
    fn asset_minted_event(
        &self,
        #[indexed] player: &ManagedAddress,
        #[indexed] asset_id: u64,
        name: &ManagedBuffer,
        asset_type: &AssetType,
        rarity: &Rarity,
    );
    
    #[event("assetTransferred")]
    fn asset_transferred_event(
        &self,
        #[indexed] from: &ManagedAddress,
        #[indexed] to: &ManagedAddress,
        #[indexed] asset_id: u64,
    );
    
    #[event("experienceGained")]
    fn experience_gained_event(
        &self,
        #[indexed] player: &ManagedAddress,
        exp_gained: u64,
    );
    
    #[event("tournamentCreated")]
    fn tournament_created_event(
        &self,
        #[indexed] tournament_id: u64,
        name: &ManagedBuffer,
        prize_pool: &BigUint,
    );
    
    #[event("tournamentJoined")]
    fn tournament_joined_event(
        &self,
        #[indexed] player: &ManagedAddress,
        #[indexed] tournament_id: u64,
        entry_fee: &BigUint,
    );
}

// ===== DATA STRUCTURES =====

#[derive(TypeAbi, TopEncode, TopDecode, NestedEncode, NestedDecode, Clone)]
pub struct PlayerStats<M: ManagedTypeApi> {
    pub level: u32,
    pub experience: u64,
    pub games_played: u32,
    pub games_won: u32,
    pub assets_owned: u32,
    pub achievements: ManagedVec<M, ManagedBuffer<M>>,
}

#[derive(TypeAbi, TopEncode, TopDecode, NestedEncode, NestedDecode, Clone)]
pub struct PlayerProfile<M: ManagedTypeApi> {
    pub address: ManagedAddress<M>,
    pub stats: PlayerStats<M>,
    pub stardust_points: u64,
    pub titles: ManagedVec<M, ManagedBuffer<M>>,
    pub active_missions: u32,
    pub joined_at: u64,
}

#[derive(TypeAbi, TopEncode, TopDecode, NestedEncode, NestedDecode, Clone)]
pub struct GameAsset<M: ManagedTypeApi> {
    pub id: u64,
    pub owner: ManagedAddress<M>,
    pub asset_type: AssetType,
    pub rarity: Rarity,
    pub name: ManagedBuffer<M>,
    pub description: ManagedBuffer<M>,
    pub created_at: u64,
    pub level: u32,
    pub experience: u64,
}

#[derive(TypeAbi, TopEncode, TopDecode, NestedEncode, NestedDecode, Clone)]
pub struct Tournament<M: ManagedTypeApi> {
    pub id: u64,
    pub name: ManagedBuffer<M>,
    pub organizer: ManagedAddress<M>,
    pub entry_fee: BigUint<M>,
    pub prize_pool: BigUint<M>,
    pub max_participants: u32,
    pub current_participants: u32,
    pub start_time: u64,
    pub status: TournamentStatus,
    pub participants: ManagedVec<M, ManagedAddress<M>>,
}

#[derive(TypeAbi, TopEncode, TopDecode, NestedEncode, NestedDecode, Clone)]
pub struct PlatformStats {
    pub total_players: u64,
    pub total_assets: u64,
    pub total_tournaments: u64,
    pub total_battles: u64,
    pub total_missions: u64,
}

#[derive(TypeAbi, TopEncode, TopDecode, NestedEncode, NestedDecode, Clone, PartialEq, Eq)]
pub enum AssetType {
    Weapon,
    Character,
    Skin,
    Consumable,
    Vehicle,
    Structure,
}

#[derive(TypeAbi, TopEncode, TopDecode, NestedEncode, NestedDecode, Clone, PartialEq, Eq, PartialOrd, Ord)]
pub enum Rarity {
    Common,
    Rare,
    Epic,
    Legendary,
}

#[derive(TypeAbi, TopEncode, TopDecode, NestedEncode, NestedDecode, Clone, PartialEq, Eq)]
pub enum TournamentStatus {
    Registration,
    Active,
    Completed,
    Cancelled,
}