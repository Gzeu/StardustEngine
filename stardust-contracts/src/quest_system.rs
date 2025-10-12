use multiversx_sc::imports::*;
use crate::stardust_contracts::*;

/// Quest System Module for StardustEngine
/// Implements story-driven missions and objectives
pub trait QuestSystem {
    
    // ===== QUEST MANAGEMENT =====
    
    #[endpoint]
    fn start_mission(&self, mission_id: u64) {
        let caller = self.blockchain().get_caller();
        require!(self.players().contains(&caller), "Player not registered");
        require!(!self.active_missions(&caller).contains(&mission_id), "Mission already active");
        
        let mission = self.get_mission_template(mission_id);
        require!(mission.is_some(), "Mission not found");
        
        let mission_template = mission.unwrap();
        
        // Check requirements
        self.validate_mission_requirements(&caller, &mission_template);
        
        let player_mission = PlayerMission {
            mission_id,
            player: caller.clone(),
            status: MissionStatus::Active,
            progress: 0u32,
            started_at: self.blockchain().get_block_timestamp(),
            objectives_completed: ManagedVec::new(),
        };
        
        self.active_missions(&caller).insert(mission_id);
        self.player_mission_data(&caller, mission_id).set(player_mission);
        
        self.mission_started_event(&caller, mission_id);
    }
    
    #[endpoint]
    fn complete_objective(
        &self,
        mission_id: u64,
        objective_id: u64,
        proof_assets: ManagedVec<u64>,
    ) {
        let caller = self.blockchain().get_caller();
        require!(self.active_missions(&caller).contains(&mission_id), "Mission not active");
        
        let mut player_mission = self.player_mission_data(&caller, mission_id).get();
        require!(player_mission.status == MissionStatus::Active, "Mission not active");
        require!(!player_mission.objectives_completed.contains(&objective_id), "Objective already completed");
        
        // Validate objective completion
        self.validate_objective_completion(&caller, mission_id, objective_id, &proof_assets);
        
        player_mission.objectives_completed.push(objective_id);
        player_mission.progress += 1;
        
        // Check if mission is completed
        let mission_template = self.get_mission_template(mission_id).unwrap();
        if player_mission.progress >= mission_template.total_objectives {
            player_mission.status = MissionStatus::Completed;
            self.complete_mission(&caller, mission_id);
        }
        
        self.player_mission_data(&caller, mission_id).set(player_mission);
        self.objective_completed_event(&caller, mission_id, objective_id);
    }
    
    fn complete_mission(&self, player: &ManagedAddress, mission_id: u64) {
        let mission_template = self.get_mission_template(mission_id).unwrap();
        
        // Award rewards
        for reward in mission_template.rewards.iter() {
            match reward.reward_type {
                RewardType::Experience => {
                    self.player_stats(player).update(|stats| {
                        stats.experience += reward.amount;
                        stats.level = self.calculate_level(stats.experience);
                    });
                },
                RewardType::StardustPoints => {
                    self.player_stardust_points(player).update(|points| *points += reward.amount);
                },
                RewardType::Asset => {
                    // Mint reward asset
                    self.mint_reward_asset(player, reward.asset_template.as_ref().unwrap());
                },
                RewardType::Title => {
                    self.player_titles(player).insert(reward.title.as_ref().unwrap().clone());
                }
            }
        }
        
        // Update mission completion stats
        self.player_stats(player).update(|stats| {
            if let Some(ref mut achievements) = Some(&mut stats.achievements) {
                if mission_template.chapter == 1 && !achievements.contains(&ManagedBuffer::from(b"Chapter 1 Complete")) {
                    achievements.push(ManagedBuffer::from(b"Chapter 1 Complete"));
                }
            }
        });
        
        self.active_missions(player).remove(&mission_id);
        self.completed_missions(player).insert(mission_id);
        
        self.mission_completed_event(player, mission_id);
    }
    
    fn validate_mission_requirements(&self, player: &ManagedAddress, mission: &MissionTemplate<Self::Api>) {
        // Check level requirement
        let player_stats = self.player_stats(player).get();
        require!(player_stats.level >= mission.required_level, "Level requirement not met");
        
        // Check prerequisite missions
        for prereq in mission.prerequisites.iter() {
            require!(self.completed_missions(player).contains(&prereq), "Prerequisite mission not completed");
        }
        
        // Check required assets
        for required_asset in mission.required_assets.iter() {
            let player_assets = self.get_player_assets(player.clone());
            let has_asset = player_assets.iter().any(|asset| 
                asset.asset_type == required_asset.asset_type && 
                asset.rarity >= required_asset.min_rarity
            );
            require!(has_asset, "Required asset not found");
        }
    }
    
    fn validate_objective_completion(
        &self,
        player: &ManagedAddress,
        mission_id: u64,
        objective_id: u64,
        proof_assets: &ManagedVec<u64>,
    ) {
        let mission_template = self.get_mission_template(mission_id).unwrap();
        let objective = mission_template.objectives.get(objective_id as usize - 1);
        
        match objective.objective_type {
            ObjectiveType::CollectAssets => {
                require!(proof_assets.len() >= objective.target_amount as usize, "Insufficient assets collected");
                for asset_id in proof_assets.iter() {
                    require!(self.asset_owner(asset_id).get() == *player, "Asset not owned");
                }
            },
            ObjectiveType::WinBattles => {
                let player_stats = self.player_stats(player).get();
                require!(player_stats.games_won >= objective.target_amount, "Insufficient battles won");
            },
            ObjectiveType::ReachLevel => {
                let player_stats = self.player_stats(player).get();
                require!(player_stats.level >= objective.target_amount, "Level requirement not met");
            },
            ObjectiveType::JoinTournament => {
                // Check tournament participation (simplified)
                require!(!proof_assets.is_empty(), "Tournament proof required");
            },
            ObjectiveType::ExploreTerritory => {
                // Territory exploration validation
                require!(!proof_assets.is_empty(), "Exploration proof required");
            },
        }
    }
    
    fn mint_reward_asset(&self, player: &ManagedAddress, template: &AssetTemplate<Self::Api>) {
        let asset_id = self.next_asset_id().get();
        self.next_asset_id().set(asset_id + 1);
        
        let asset = GameAsset {
            id: asset_id,
            owner: player.clone(),
            asset_type: template.asset_type.clone(),
            rarity: template.rarity.clone(),
            name: template.name.clone(),
            description: template.description.clone(),
            created_at: self.blockchain().get_block_timestamp(),
            level: 1u32,
            experience: 0u64,
        };
        
        self.game_assets().insert(asset_id);
        self.asset_owner(asset_id).set(player.clone());
        self.asset_metadata(asset_id).set(asset);
        
        // Update player stats
        self.player_stats(player).update(|stats| {
            stats.assets_owned += 1;
        });
    }
    
    // ===== STORY CHAPTERS =====
    
    #[endpoint]
    fn initialize_chapter_missions(&self) {
        self.require_caller_is_admin();
        
        // Chapter 1: The Awakening
        self.create_mission_template(1, MissionTemplate {
            id: 1,
            name: ManagedBuffer::from(b"Training Academy"),
            description: ManagedBuffer::from(b"Complete your training as a Stardust Engineer"),
            chapter: 1,
            required_level: 1,
            total_objectives: 3,
            prerequisites: ManagedVec::new(),
            required_assets: ManagedVec::new(),
            objectives: vec![
                Objective {
                    id: 1,
                    description: ManagedBuffer::from(b"Mint your first Common asset"),
                    objective_type: ObjectiveType::CollectAssets,
                    target_amount: 1,
                },
                Objective {
                    id: 2,
                    description: ManagedBuffer::from(b"Win a practice battle"),
                    objective_type: ObjectiveType::WinBattles,
                    target_amount: 1,
                },
                Objective {
                    id: 3,
                    description: ManagedBuffer::from(b"Reach Level 2"),
                    objective_type: ObjectiveType::ReachLevel,
                    target_amount: 2,
                }
            ].into(),
            rewards: vec![
                Reward {
                    reward_type: RewardType::Experience,
                    amount: 200,
                    asset_template: None,
                    title: None,
                },
                Reward {
                    reward_type: RewardType::Asset,
                    amount: 1,
                    asset_template: Some(AssetTemplate {
                        asset_type: AssetType::Weapon,
                        rarity: Rarity::Rare,
                        name: ManagedBuffer::from(b"Training Blade"),
                        description: ManagedBuffer::from(b"A blade forged for new Engineers"),
                    }),
                    title: None,
                },
                Reward {
                    reward_type: RewardType::Title,
                    amount: 1,
                    asset_template: None,
                    title: Some(ManagedBuffer::from(b"Rookie Engineer")),
                }
            ].into(),
        });
        
        // Additional chapters would be added here...
    }
    
    fn create_mission_template(&self, mission_id: u64, template: MissionTemplate<Self::Api>) {
        self.mission_templates().insert(mission_id);
        self.mission_template_data(mission_id).set(template);
    }
    
    fn get_mission_template(&self, mission_id: u64) -> Option<MissionTemplate<Self::Api>> {
        if self.mission_templates().contains(&mission_id) {
            Some(self.mission_template_data(mission_id).get())
        } else {
            None
        }
    }
    
    // ===== VIEW FUNCTIONS =====
    
    #[view]
    fn get_player_missions(&self, player: ManagedAddress) -> ManagedVec<PlayerMission<Self::Api>> {
        let mut missions = ManagedVec::new();
        for mission_id in self.active_missions(&player).iter() {
            missions.push(self.player_mission_data(&player, mission_id).get());
        }
        missions
    }
    
    #[view]
    fn get_available_missions(&self, player: ManagedAddress) -> ManagedVec<u64> {
        let mut available = ManagedVec::new();
        let player_stats = self.player_stats(&player).get();
        
        for mission_id in self.mission_templates().iter() {
            let template = self.mission_template_data(mission_id).get();
            
            // Check if mission is available (not completed, meets requirements)
            if !self.completed_missions(&player).contains(&mission_id) &&
               !self.active_missions(&player).contains(&mission_id) &&
               player_stats.level >= template.required_level {
                
                // Check prerequisites
                let mut prerequisites_met = true;
                for prereq in template.prerequisites.iter() {
                    if !self.completed_missions(&player).contains(&prereq) {
                        prerequisites_met = false;
                        break;
                    }
                }
                
                if prerequisites_met {
                    available.push(mission_id);
                }
            }
        }
        
        available
    }
    
    #[view]
    fn get_mission_details(&self, mission_id: u64) -> OptionalValue<MissionTemplate<Self::Api>> {
        if self.mission_templates().contains(&mission_id) {
            OptionalValue::Some(self.mission_template_data(mission_id).get())
        } else {
            OptionalValue::None
        }
    }
    
    // ===== STORAGE =====
    
    #[storage_mapper("missionTemplates")]
    fn mission_templates(&self) -> UnorderedSetMapper<u64>;
    
    #[storage_mapper("missionTemplateData")]
    fn mission_template_data(&self, mission_id: u64) -> SingleValueMapper<MissionTemplate<Self::Api>>;
    
    #[storage_mapper("activeMissions")]
    fn active_missions(&self, player: &ManagedAddress) -> UnorderedSetMapper<u64>;
    
    #[storage_mapper("completedMissions")]
    fn completed_missions(&self, player: &ManagedAddress) -> UnorderedSetMapper<u64>;
    
    #[storage_mapper("playerMissionData")]
    fn player_mission_data(&self, player: &ManagedAddress, mission_id: u64) -> SingleValueMapper<PlayerMission<Self::Api>>;
    
    #[storage_mapper("playerStardustPoints")]
    fn player_stardust_points(&self, player: &ManagedAddress) -> SingleValueMapper<u64>;
    
    #[storage_mapper("playerTitles")]
    fn player_titles(&self, player: &ManagedAddress) -> UnorderedSetMapper<ManagedBuffer>;
    
    // ===== EVENTS =====
    
    #[event("missionStarted")]
    fn mission_started_event(
        &self,
        #[indexed] player: &ManagedAddress,
        #[indexed] mission_id: u64,
    );
    
    #[event("objectiveCompleted")]
    fn objective_completed_event(
        &self,
        #[indexed] player: &ManagedAddress,
        #[indexed] mission_id: u64,
        objective_id: u64,
    );
    
    #[event("missionCompleted")]
    fn mission_completed_event(
        &self,
        #[indexed] player: &ManagedAddress,
        #[indexed] mission_id: u64,
    );
}

// ===== DATA STRUCTURES =====

#[derive(TypeAbi, TopEncode, TopDecode, NestedEncode, NestedDecode, Clone)]
pub struct MissionTemplate<M: ManagedTypeApi> {
    pub id: u64,
    pub name: ManagedBuffer<M>,
    pub description: ManagedBuffer<M>,
    pub chapter: u32,
    pub required_level: u32,
    pub total_objectives: u32,
    pub prerequisites: ManagedVec<M, u64>,
    pub required_assets: ManagedVec<M, RequiredAsset>,
    pub objectives: ManagedVec<M, Objective<M>>,
    pub rewards: ManagedVec<M, Reward<M>>,
}

#[derive(TypeAbi, TopEncode, TopDecode, NestedEncode, NestedDecode, Clone)]
pub struct PlayerMission<M: ManagedTypeApi> {
    pub mission_id: u64,
    pub player: ManagedAddress<M>,
    pub status: MissionStatus,
    pub progress: u32,
    pub started_at: u64,
    pub objectives_completed: ManagedVec<M, u64>,
}

#[derive(TypeAbi, TopEncode, TopDecode, NestedEncode, NestedDecode, Clone)]
pub struct Objective<M: ManagedTypeApi> {
    pub id: u64,
    pub description: ManagedBuffer<M>,
    pub objective_type: ObjectiveType,
    pub target_amount: u32,
}

#[derive(TypeAbi, TopEncode, TopDecode, NestedEncode, NestedDecode, Clone)]
pub struct Reward<M: ManagedTypeApi> {
    pub reward_type: RewardType,
    pub amount: u64,
    pub asset_template: Option<AssetTemplate<M>>,
    pub title: Option<ManagedBuffer<M>>,
}

#[derive(TypeAbi, TopEncode, TopDecode, NestedEncode, NestedDecode, Clone)]
pub struct AssetTemplate<M: ManagedTypeApi> {
    pub asset_type: AssetType,
    pub rarity: Rarity,
    pub name: ManagedBuffer<M>,
    pub description: ManagedBuffer<M>,
}

#[derive(TypeAbi, TopEncode, TopDecode, NestedEncode, NestedDecode, Clone)]
pub struct RequiredAsset {
    pub asset_type: AssetType,
    pub min_rarity: Rarity,
}

#[derive(TypeAbi, TopEncode, TopDecode, NestedEncode, NestedDecode, Clone, PartialEq, Eq)]
pub enum MissionStatus {
    Available,
    Active,
    Completed,
    Failed,
}

#[derive(TypeAbi, TopEncode, TopDecode, NestedEncode, NestedDecode, Clone, PartialEq, Eq)]
pub enum ObjectiveType {
    CollectAssets,
    WinBattles,
    ReachLevel,
    JoinTournament,
    ExploreTerritory,
}

#[derive(TypeAbi, TopEncode, TopDecode, NestedEncode, NestedDecode, Clone, PartialEq, Eq)]
pub enum RewardType {
    Experience,
    StardustPoints,
    Asset,
    Title,
}