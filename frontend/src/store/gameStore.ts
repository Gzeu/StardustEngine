import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

// Game asset interface
export interface GameAsset {
  id: string;
  name: string;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  type: 'Weapon' | 'Character' | 'Skin' | 'Consumable' | 'Vehicle' | 'Structure';
  level: number;
  experience: number;
  description: string;
  price?: number;
  owner?: string;
  createdAt: number;
  metadata?: Record<string, any>;
}

// Player stats interface
export interface PlayerStats {
  level: number;
  experience: number;
  experienceToNext: number;
  gamesPlayed: number;
  gamesWon: number;
  assetsOwned: number;
  totalValue: number;
  achievements: string[];
  rank: string;
  winRate: number;
  registeredAt?: number;
}

// Tournament interface
export interface Tournament {
  id: string;
  name: string;
  entryFee: number;
  prizePool: number;
  maxParticipants: number;
  currentParticipants: number;
  startTime: number;
  status: 'upcoming' | 'active' | 'completed';
  participants: string[];
  winner?: string;
}

// Notification interface
export interface GameNotification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
  timestamp: number;
  read?: boolean;
}

// UI state interface
export interface UIState {
  theme: 'cyberpunk' | 'fantasy' | 'space';
  soundEnabled: boolean;
  animationsEnabled: boolean;
  sidebarCollapsed: boolean;
  activeModal: string | null;
  loading: boolean;
}

// Main game store interface
interface GameStore {
  // Player data
  playerAddress: string | null;
  playerStats: PlayerStats | null;
  playerAssets: GameAsset[];
  
  // Game data
  allAssets: GameAsset[];
  tournaments: Tournament[];
  
  // UI state
  uiState: UIState;
  notifications: GameNotification[];
  
  // Actions - Player
  setPlayerAddress: (address: string | null) => void;
  setPlayerStats: (stats: PlayerStats) => void;
  updatePlayerStats: (updates: Partial<PlayerStats>) => void;
  
  // Actions - Assets
  addAsset: (asset: GameAsset) => void;
  updateAsset: (id: string, updates: Partial<GameAsset>) => void;
  removeAsset: (id: string) => void;
  setPlayerAssets: (assets: GameAsset[]) => void;
  setAllAssets: (assets: GameAsset[]) => void;
  
  // Actions - Tournaments
  addTournament: (tournament: Tournament) => void;
  updateTournament: (id: string, updates: Partial<Tournament>) => void;
  setTournaments: (tournaments: Tournament[]) => void;
  joinTournament: (tournamentId: string, playerAddress: string) => void;
  
  // Actions - UI
  setTheme: (theme: UIState['theme']) => void;
  toggleSound: () => void;
  toggleAnimations: () => void;
  toggleSidebar: () => void;
  setActiveModal: (modal: string | null) => void;
  setLoading: (loading: boolean) => void;
  
  // Actions - Notifications
  addNotification: (notification: Omit<GameNotification, 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  markNotificationRead: (id: string) => void;
  clearAllNotifications: () => void;
  
  // Actions - Utility
  reset: () => void;
  hydrate: () => void;
}

// Default UI state
const defaultUIState: UIState = {
  theme: 'cyberpunk',
  soundEnabled: true,
  animationsEnabled: true,
  sidebarCollapsed: false,
  activeModal: null,
  loading: false
};

// Create the store
export const useGameStore = create<GameStore>()(n  devtools(
    persist(
      (set, get) => ({
        // Initial state
        playerAddress: null,
        playerStats: null,
        playerAssets: [],
        allAssets: [],
        tournaments: [],
        uiState: defaultUIState,
        notifications: [],

        // Player actions
        setPlayerAddress: (address) => 
          set({ playerAddress: address }, false, 'setPlayerAddress'),
          
        setPlayerStats: (stats) => 
          set({ playerStats: stats }, false, 'setPlayerStats'),
          
        updatePlayerStats: (updates) => 
          set((state) => ({
            playerStats: state.playerStats 
              ? { ...state.playerStats, ...updates }
              : null
          }), false, 'updatePlayerStats'),

        // Asset actions
        addAsset: (asset) => 
          set((state) => ({
            allAssets: [...state.allAssets, asset],
            playerAssets: asset.owner === state.playerAddress 
              ? [...state.playerAssets, asset]
              : state.playerAssets
          }), false, 'addAsset'),
          
        updateAsset: (id, updates) => 
          set((state) => ({
            allAssets: state.allAssets.map(asset => 
              asset.id === id ? { ...asset, ...updates } : asset
            ),
            playerAssets: state.playerAssets.map(asset => 
              asset.id === id ? { ...asset, ...updates } : asset
            )
          }), false, 'updateAsset'),
          
        removeAsset: (id) => 
          set((state) => ({
            allAssets: state.allAssets.filter(asset => asset.id !== id),
            playerAssets: state.playerAssets.filter(asset => asset.id !== id)
          }), false, 'removeAsset'),
          
        setPlayerAssets: (assets) => 
          set({ playerAssets: assets }, false, 'setPlayerAssets'),
          
        setAllAssets: (assets) => 
          set({ allAssets: assets }, false, 'setAllAssets'),

        // Tournament actions
        addTournament: (tournament) => 
          set((state) => ({
            tournaments: [...state.tournaments, tournament]
          }), false, 'addTournament'),
          
        updateTournament: (id, updates) => 
          set((state) => ({
            tournaments: state.tournaments.map(tournament => 
              tournament.id === id ? { ...tournament, ...updates } : tournament
            )
          }), false, 'updateTournament'),
          
        setTournaments: (tournaments) => 
          set({ tournaments }, false, 'setTournaments'),
          
        joinTournament: (tournamentId, playerAddress) => 
          set((state) => ({
            tournaments: state.tournaments.map(tournament => {
              if (tournament.id === tournamentId && !tournament.participants.includes(playerAddress)) {
                return {
                  ...tournament,
                  participants: [...tournament.participants, playerAddress],
                  currentParticipants: tournament.currentParticipants + 1
                };
              }
              return tournament;
            })
          }), false, 'joinTournament'),

        // UI actions
        setTheme: (theme) => 
          set((state) => ({
            uiState: { ...state.uiState, theme }
          }), false, 'setTheme'),
          
        toggleSound: () => 
          set((state) => ({
            uiState: { ...state.uiState, soundEnabled: !state.uiState.soundEnabled }
          }), false, 'toggleSound'),
          
        toggleAnimations: () => 
          set((state) => ({
            uiState: { ...state.uiState, animationsEnabled: !state.uiState.animationsEnabled }
          }), false, 'toggleAnimations'),
          
        toggleSidebar: () => 
          set((state) => ({
            uiState: { ...state.uiState, sidebarCollapsed: !state.uiState.sidebarCollapsed }
          }), false, 'toggleSidebar'),
          
        setActiveModal: (modal) => 
          set((state) => ({
            uiState: { ...state.uiState, activeModal: modal }
          }), false, 'setActiveModal'),
          
        setLoading: (loading) => 
          set((state) => ({
            uiState: { ...state.uiState, loading }
          }), false, 'setLoading'),

        // Notification actions
        addNotification: (notification) => 
          set((state) => ({
            notifications: [{
              ...notification,
              id: Date.now().toString(),
              timestamp: Date.now()
            }, ...state.notifications]
          }), false, 'addNotification'),
          
        removeNotification: (id) => 
          set((state) => ({
            notifications: state.notifications.filter(n => n.id !== id)
          }), false, 'removeNotification'),
          
        markNotificationRead: (id) => 
          set((state) => ({
            notifications: state.notifications.map(n => 
              n.id === id ? { ...n, read: true } : n
            )
          }), false, 'markNotificationRead'),
          
        clearAllNotifications: () => 
          set({ notifications: [] }, false, 'clearAllNotifications'),

        // Utility actions
        reset: () => 
          set({
            playerAddress: null,
            playerStats: null,
            playerAssets: [],
            allAssets: [],
            tournaments: [],
            notifications: [],
            uiState: defaultUIState
          }, false, 'reset'),
          
        hydrate: () => {
          // This will be called after store rehydration
          // Can be used for post-hydration setup
        }
      }),
      {
        name: 'stardust-game-store',
        version: 1,
        partialize: (state) => ({
          playerAddress: state.playerAddress,
          playerStats: state.playerStats,
          playerAssets: state.playerAssets,
          uiState: state.uiState
        })
      }
    ),
    {
      name: 'StardustEngine Game Store'
    }
  )
);

// Selectors for common use cases
export const usePlayerData = () => {
  const { playerAddress, playerStats, playerAssets } = useGameStore();
  return { playerAddress, playerStats, playerAssets };
};

export const useUIState = () => {
  const { uiState, setTheme, toggleSound, toggleAnimations, toggleSidebar, setActiveModal, setLoading } = useGameStore();
  return { uiState, setTheme, toggleSound, toggleAnimations, toggleSidebar, setActiveModal, setLoading };
};

export const useNotifications = () => {
  const { 
    notifications, 
    addNotification, 
    removeNotification, 
    markNotificationRead, 
    clearAllNotifications 
  } = useGameStore();
  return { 
    notifications, 
    addNotification, 
    removeNotification, 
    markNotificationRead, 
    clearAllNotifications 
  };
};

export const useTournaments = () => {
  const { 
    tournaments, 
    addTournament, 
    updateTournament, 
    setTournaments, 
    joinTournament 
  } = useGameStore();
  return { 
    tournaments, 
    addTournament, 
    updateTournament, 
    setTournaments, 
    joinTournament 
  };
};

// Export types
export type { GameStore, UIState, GameNotification, Tournament };