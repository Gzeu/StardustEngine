use multiversx_sc::imports::*;
use crate::stardust_contracts::*;

/// Combat System Module for StardustEngine
/// Implements turn-based strategic combat with NFT assets
pub trait CombatSystem {
    
    // ===== COMBAT MECHANICS =====
    
    #[endpoint]
    fn initiate_battle(
        &self,
        opponent: ManagedAddress,
        attacker_assets: ManagedVec<u64>,
        battle_type: BattleType,
    ) -> u64 {
        let caller = self.blockchain().get_caller();
        require!(self.players().contains(&caller), "Player not registered");
        require!(self.players().contains(&opponent), "Opponent not registered");
        require!(attacker_assets.len() <= 3, "Maximum 3 assets per battle");
        
        // Validate asset ownership
        for asset_id in attacker_assets.iter() {
            require!(self.asset_owner(asset_id).get() == caller, "Asset not owned");
        }
        
        let battle_id = self.next_battle_id().get();
        self.next_battle_id().set(battle_id + 1);
        
        let battle = Battle {
            id: battle_id,
            attacker: caller.clone(),
            defender: opponent.clone(),
            attacker_assets: attacker_assets.clone(),
            defender_assets: ManagedVec::new(),
            battle_type,
            status: BattleStatus::WaitingForDefender,
            turn: 1u32,
            created_at: self.blockchain().get_block_timestamp(),
            moves: ManagedVec::new(),
        };
        
        self.battles().insert(battle_id);
        self.battle_data(battle_id).set(battle);
        
        self.battle_initiated_event(&caller, &opponent, battle_id);
        battle_id
    }
    
    #[endpoint]
    fn accept_battle(&self, battle_id: u64, defender_assets: ManagedVec<u64>) {
        let caller = self.blockchain().get_caller();
        require!(self.battles().contains(&battle_id), "Battle not found");
        
        let mut battle = self.battle_data(battle_id).get();
        require!(battle.defender == caller, "Not the defender");
        require!(battle.status == BattleStatus::WaitingForDefender, "Battle already accepted");
        require!(defender_assets.len() <= 3, "Maximum 3 assets per battle");
        
        // Validate asset ownership
        for asset_id in defender_assets.iter() {
            require!(self.asset_owner(asset_id).get() == caller, "Asset not owned");
        }
        
        battle.defender_assets = defender_assets;
        battle.status = BattleStatus::Active;
        
        self.battle_data(battle_id).set(battle);
        self.battle_accepted_event(&caller, battle_id);
    }
    
    #[endpoint]
    fn make_move(
        &self,
        battle_id: u64,
        asset_id: u64,
        move_type: MoveType,
        target_asset: OptionalValue<u64>,
    ) {
        let caller = self.blockchain().get_caller();
        require!(self.battles().contains(&battle_id), "Battle not found");
        
        let mut battle = self.battle_data(battle_id).get();
        require!(battle.status == BattleStatus::Active, "Battle not active");
        
        // Verify it's player's turn
        let is_attacker_turn = battle.turn % 2 == 1;
        if is_attacker_turn {
            require!(battle.attacker == caller, "Not your turn");
            require!(battle.attacker_assets.contains(&asset_id), "Asset not in battle");
        } else {
            require!(battle.defender == caller, "Not your turn");
            require!(battle.defender_assets.contains(&asset_id), "Asset not in battle");
        }
        
        let battle_move = BattleMove {
            turn: battle.turn,
            player: caller.clone(),
            asset_id,
            move_type: move_type.clone(),
            target_asset: target_asset.into_option(),
            timestamp: self.blockchain().get_block_timestamp(),
        };
        
        battle.moves.push(battle_move);
        battle.turn += 1;
        
        // Auto-resolve battle after certain number of turns or conditions
        if battle.turn > 10 || self.check_battle_end_conditions(&battle) {
            battle.status = BattleStatus::Completed;
            let winner = self.calculate_battle_winner(&battle);
            self.resolve_battle(battle_id, winner);
        }
        
        self.battle_data(battle_id).set(battle);
        self.move_made_event(&caller, battle_id, asset_id, &move_type);
    }
    
    fn calculate_battle_winner(&self, battle: &Battle<Self::Api>) -> ManagedAddress {
        let mut attacker_power = 0u32;
        let mut defender_power = 0u32;
        
        // Calculate total power based on assets and moves
        for asset_id in battle.attacker_assets.iter() {
            let asset = self.asset_metadata(asset_id).get();
            attacker_power += self.calculate_asset_power(&asset);
        }
        
        for asset_id in battle.defender_assets.iter() {
            let asset = self.asset_metadata(asset_id).get();
            defender_power += self.calculate_asset_power(&asset);
        }
        
        // Factor in move strategy and synergies
        attacker_power += self.calculate_move_bonus(&battle.moves, &battle.attacker);
        defender_power += self.calculate_move_bonus(&battle.moves, &battle.defender);
        
        if attacker_power >= defender_power {
            battle.attacker.clone()
        } else {
            battle.defender.clone()
        }
    }
    
    fn calculate_asset_power(&self, asset: &GameAsset<Self::Api>) -> u32 {
        let base_power = match asset.rarity {
            Rarity::Common => 10,
            Rarity::Rare => 25,
            Rarity::Epic => 50,
            Rarity::Legendary => 100,
        };
        
        let level_bonus = asset.level * 5;
        let exp_bonus = (asset.experience / 100) as u32;
        
        base_power + level_bonus + exp_bonus
    }
    
    fn calculate_move_bonus(&self, moves: &ManagedVec<Self::Api, BattleMove<Self::Api>>, player: &ManagedAddress) -> u32 {
        let mut bonus = 0u32;
        
        for battle_move in moves.iter() {
            if battle_move.player == *player {
                bonus += match battle_move.move_type {
                    MoveType::Attack => 10,
                    MoveType::Defend => 5,
                    MoveType::Special => 15,
                    MoveType::Combo => 20,
                };
            }
        }
        
        bonus
    }
    
    fn resolve_battle(&self, battle_id: u64, winner: ManagedAddress) {
        let battle = self.battle_data(battle_id).get();
        let loser = if winner == battle.attacker {
            battle.defender.clone()
        } else {
            battle.attacker.clone()
        };
        
        // Award experience and update stats
        let winner_exp = 100u64;
        let loser_exp = 25u64;
        
        self.player_stats(&winner).update(|stats| {
            stats.experience += winner_exp;
            stats.games_played += 1;
            stats.games_won += 1;
            stats.level = self.calculate_level(stats.experience);
        });
        
        self.player_stats(&loser).update(|stats| {
            stats.experience += loser_exp;
            stats.games_played += 1;
            stats.level = self.calculate_level(stats.experience);
        });
        
        // Award asset experience
        for asset_id in battle.attacker_assets.iter() {
            self.asset_metadata(asset_id).update(|asset| {
                asset.experience += if winner == battle.attacker { 50 } else { 10 };
                asset.level = self.calculate_asset_level(asset.experience);
            });
        }
        
        for asset_id in battle.defender_assets.iter() {
            self.asset_metadata(asset_id).update(|asset| {
                asset.experience += if winner == battle.defender { 50 } else { 10 };
                asset.level = self.calculate_asset_level(asset.experience);
            });
        }
        
        self.battle_resolved_event(&winner, &loser, battle_id);
    }
    
    fn calculate_asset_level(&self, experience: u64) -> u32 {
        ((experience / 50).integer_sqrt() + 1).try_into().unwrap_or(1u32)
    }
    
    fn check_battle_end_conditions(&self, battle: &Battle<Self::Api>) -> bool {
        // Check for special end conditions
        battle.moves.len() >= 20 // Maximum moves per battle
    }
    
    // ===== VIEW FUNCTIONS =====
    
    #[view]
    fn get_battle(&self, battle_id: u64) -> OptionalValue<Battle<Self::Api>> {
        if !self.battles().contains(&battle_id) {
            OptionalValue::None
        } else {
            OptionalValue::Some(self.battle_data(battle_id).get())
        }
    }
    
    #[view]
    fn get_player_battles(&self, player: ManagedAddress) -> ManagedVec<u64> {
        let mut player_battles = ManagedVec::new();
        for battle_id in self.battles().iter() {
            let battle = self.battle_data(battle_id).get();
            if battle.attacker == player || battle.defender == player {
                player_battles.push(battle_id);
            }
        }
        player_battles
    }
    
    #[view]
    fn get_asset_power(&self, asset_id: u64) -> u32 {
        require!(self.game_assets().contains(&asset_id), "Asset not found");
        let asset = self.asset_metadata(asset_id).get();
        self.calculate_asset_power(&asset)
    }
    
    // ===== STORAGE =====
    
    #[storage_mapper("battles")]
    fn battles(&self) -> UnorderedSetMapper<u64>;
    
    #[storage_mapper("battleData")]
    fn battle_data(&self, battle_id: u64) -> SingleValueMapper<Battle<Self::Api>>;
    
    #[storage_mapper("nextBattleId")]
    fn next_battle_id(&self) -> SingleValueMapper<u64>;
    
    // ===== EVENTS =====
    
    #[event("battleInitiated")]
    fn battle_initiated_event(
        &self,
        #[indexed] attacker: &ManagedAddress,
        #[indexed] defender: &ManagedAddress,
        #[indexed] battle_id: u64,
    );
    
    #[event("battleAccepted")]
    fn battle_accepted_event(
        &self,
        #[indexed] defender: &ManagedAddress,
        #[indexed] battle_id: u64,
    );
    
    #[event("moveMade")]
    fn move_made_event(
        &self,
        #[indexed] player: &ManagedAddress,
        #[indexed] battle_id: u64,
        asset_id: u64,
        move_type: &MoveType,
    );
    
    #[event("battleResolved")]
    fn battle_resolved_event(
        &self,
        #[indexed] winner: &ManagedAddress,
        #[indexed] loser: &ManagedAddress,
        #[indexed] battle_id: u64,
    );
}

// ===== DATA STRUCTURES =====

#[derive(TypeAbi, TopEncode, TopDecode, NestedEncode, NestedDecode, Clone)]
pub struct Battle<M: ManagedTypeApi> {
    pub id: u64,
    pub attacker: ManagedAddress<M>,
    pub defender: ManagedAddress<M>,
    pub attacker_assets: ManagedVec<M, u64>,
    pub defender_assets: ManagedVec<M, u64>,
    pub battle_type: BattleType,
    pub status: BattleStatus,
    pub turn: u32,
    pub created_at: u64,
    pub moves: ManagedVec<M, BattleMove<M>>,
}

#[derive(TypeAbi, TopEncode, TopDecode, NestedEncode, NestedDecode, Clone)]
pub struct BattleMove<M: ManagedTypeApi> {
    pub turn: u32,
    pub player: ManagedAddress<M>,
    pub asset_id: u64,
    pub move_type: MoveType,
    pub target_asset: Option<u64>,
    pub timestamp: u64,
}

#[derive(TypeAbi, TopEncode, TopDecode, NestedEncode, NestedDecode, Clone, PartialEq, Eq)]
pub enum BattleType {
    Casual,
    Ranked,
    Tournament,
    Guild,
}

#[derive(TypeAbi, TopEncode, TopDecode, NestedEncode, NestedDecode, Clone, PartialEq, Eq)]
pub enum BattleStatus {
    WaitingForDefender,
    Active,
    Completed,
    Cancelled,
}

#[derive(TypeAbi, TopEncode, TopDecode, NestedEncode, NestedDecode, Clone, PartialEq, Eq)]
pub enum MoveType {
    Attack,
    Defend,
    Special,
    Combo,
}