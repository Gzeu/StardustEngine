'use client';

import { useState, useEffect } from 'react';
import { useGetLoginInfo, useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';
import { sendTransactions } from '@multiversx/sdk-dapp/services';
import { motion } from 'framer-motion';

interface PlayerStats {
  level: number;
  experience: number;
  games_played: number;
  games_won: number;
  assets_owned: number;
  achievements: string[];
}

interface GameAsset {
  id: number;
  owner: string;
  asset_type: string;
  rarity: string;
  name: string;
  description: string;
  created_at: number;
  level: number;
  experience: number;
}

const rarityColors = {
  Common: 'from-gray-600 to-gray-700',
  Rare: 'from-blue-600 to-blue-700',
  Epic: 'from-purple-600 to-purple-700',
  Legendary: 'from-yellow-600 to-yellow-700',
};

const rarityPrices = {
  Common: '1',
  Rare: '2', 
  Epic: '5',
  Legendary: '10',
};

const assetTypes = ['Weapon', 'Character', 'Skin', 'Consumable', 'Vehicle', 'Structure'];

export const GameContract = () => {
  const { isLoggedIn } = useGetLoginInfo();
  const { account, address } = useGetAccountInfo();
  const [playerStats, setPlayerStats] = useState<PlayerStats | null>(null);
  const [playerAssets, setPlayerAssets] = useState<GameAsset[]>([]);
  const [isRegistered, setIsRegistered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedAssetType, setSelectedAssetType] = useState('Weapon');
  const [assetName, setAssetName] = useState('');
  const [assetDescription, setAssetDescription] = useState('');
  const [showMintForm, setShowMintForm] = useState(false);

  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || 'erd1qqqqqqqqqqqqqpgqmhm6kg3mj3k0w9a3nda9xuw4tac3n5zx2jps8rp6sd';

  useEffect(() => {
    if (isLoggedIn && address) {
      checkPlayerRegistration();
      loadPlayerData();
    }
  }, [isLoggedIn, address]);

  const checkPlayerRegistration = async () => {
    // Implementation for checking if player is registered
    // This would typically involve a contract query
    setIsRegistered(true); // Temporary - implement actual check
  };

  const loadPlayerData = async () => {
    if (!isRegistered) return;
    
    // Load player stats and assets
    // These would be actual contract queries
    setPlayerStats({
      level: 5,
      experience: 1250,
      games_played: 25,
      games_won: 18,
      assets_owned: 7,
      achievements: ['First Blood', 'Asset Collector', 'Tournament Winner']
    });

    setPlayerAssets([
      {
        id: 1,
        owner: address || '',
        asset_type: 'Weapon',
        rarity: 'Epic',
        name: 'Dragon Slayer',
        description: 'A legendary sword forged in dragon fire',
        created_at: Date.now(),
        level: 3,
        experience: 450
      },
      {
        id: 2,
        owner: address || '',
        asset_type: 'Character',
        rarity: 'Rare',
        name: 'Shadow Warrior',
        description: 'Master of stealth and combat',
        created_at: Date.now(),
        level: 2,
        experience: 200
      }
    ]);
  };

  const registerPlayer = async () => {
    if (!isLoggedIn) return;
    
    setLoading(true);
    try {
      const transaction = {
        value: '0',
        data: 'register_player',
        receiver: contractAddress,
        gasLimit: 5000000,
      };

      await sendTransactions({
        transactions: [transaction],
        transactionsDisplayInfo: {
          processingMessage: 'Registering player...',
          errorMessage: 'Registration failed',
          successMessage: 'Successfully registered! Welcome to StardustEngine!'
        }
      });

      setIsRegistered(true);
    } catch (error) {
      console.error('Registration failed:', error);
    }
    setLoading(false);
  };

  const mintAsset = async (rarity: string) => {
    if (!isLoggedIn || !isRegistered || !assetName.trim() || !assetDescription.trim()) return;
    
    setLoading(true);
    try {
      const value = (parseFloat(rarityPrices[rarity as keyof typeof rarityPrices]) * 1e18).toString();
      
      const transaction = {
        value,
        data: `mint_game_asset@${Buffer.from(selectedAssetType).toString('hex')}@${Buffer.from(rarity).toString('hex')}@${Buffer.from(assetName).toString('hex')}@${Buffer.from(assetDescription).toString('hex')}`,
        receiver: contractAddress,
        gasLimit: 15000000,
      };

      await sendTransactions({
        transactions: [transaction],
        transactionsDisplayInfo: {
          processingMessage: `Minting ${rarity} ${selectedAssetType}...`,
          errorMessage: 'Asset minting failed',
          successMessage: `${rarity} ${selectedAssetType} "${assetName}" minted successfully!`
        }
      });

      // Reset form
      setAssetName('');
      setAssetDescription('');
      setShowMintForm(false);
      
      // Refresh player data
      setTimeout(() => loadPlayerData(), 2000);
    } catch (error) {
      console.error('Minting failed:', error);
    }
    setLoading(false);
  };

  if (!isLoggedIn) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center p-8 bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700"
      >
        <div className="text-6xl mb-4">🚀</div>
        <h3 className="text-2xl font-bold text-white mb-4">Connect Your Wallet</h3>
        <p className="text-gray-400 mb-6">
          Connect your MultiversX wallet to access the StardustEngine gaming platform and start collecting NFT assets.
        </p>
        <div className="inline-flex items-center space-x-2 text-blue-400">
          <span>Ready for Web3 Gaming</span>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            ⚡
          </motion.div>
        </div>
      </motion.div>
    );
  }

  if (!isRegistered) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center p-8 bg-gradient-to-br from-purple-900/20 to-blue-900/20 backdrop-blur-sm rounded-xl border border-purple-500/30"
      >
        <div className="text-6xl mb-4">🎮</div>
        <h3 className="text-3xl font-bold text-white mb-4">Welcome to StardustEngine!</h3>
        <p className="text-gray-300 mb-6 max-w-md mx-auto">
          Join the next generation of NFT gaming. Register now to start collecting assets, 
          leveling up, and competing in tournaments.
        </p>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={registerPlayer}
          disabled={loading}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 text-white px-8 py-3 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg"
        >
          {loading ? (
            <div className="flex items-center space-x-2">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                ⭐
              </motion.div>
              <span>Registering...</span>
            </div>
          ) : (
            'Register Player'
          )}
        </motion.button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Player Stats Dashboard */}
      {playerStats && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm p-6 rounded-xl border border-gray-700"
        >
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
            <span className="mr-3">👤</span>
            Player Dashboard
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { label: 'Level', value: playerStats.level, icon: '⭐', color: 'text-yellow-400' },
              { label: 'Experience', value: playerStats.experience.toLocaleString(), icon: '💎', color: 'text-blue-400' },
              { label: 'Games Played', value: playerStats.games_played, icon: '🎯', color: 'text-green-400' },
              { label: 'Games Won', value: playerStats.games_won, icon: '🏆', color: 'text-purple-400' },
              { label: 'Win Rate', value: `${Math.round((playerStats.games_won / playerStats.games_played) * 100)}%`, icon: '📊', color: 'text-orange-400' },
              { label: 'Assets', value: playerStats.assets_owned, icon: '🎴', color: 'text-red-400' }
            ].map((stat, index) => (
              <motion.div 
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-4 bg-gray-800/50 rounded-lg border border-gray-600"
              >
                <div className="text-2xl mb-2">{stat.icon}</div>
                <p className="text-gray-400 text-sm">{stat.label}</p>
                <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
              </motion.div>
            ))}
          </div>

          {playerStats.achievements.length > 0 && (
            <div className="mt-6">
              <h4 className="text-lg font-semibold text-white mb-3">🏅 Achievements</h4>
              <div className="flex flex-wrap gap-2">
                {playerStats.achievements.map((achievement, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="px-3 py-1 bg-gradient-to-r from-yellow-600 to-orange-600 text-white rounded-full text-sm font-medium"
                  >
                    {achievement}
                  </motion.span>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Asset Minting Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 backdrop-blur-sm p-6 rounded-xl border border-purple-500/30"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-white flex items-center">
            <span className="mr-3">⚔️</span>
            Asset Forge
          </h3>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowMintForm(!showMintForm)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            {showMintForm ? 'Hide Form' : 'Create Asset'}
          </motion.button>
        </div>

        {showMintForm && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 p-4 bg-gray-800/50 rounded-lg border border-gray-600"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-white text-sm font-medium mb-2">Asset Type</label>
                <select 
                  value={selectedAssetType}
                  onChange={(e) => setSelectedAssetType(e.target.value)}
                  className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 border border-gray-600 focus:border-purple-500 focus:outline-none"
                >
                  {assetTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-white text-sm font-medium mb-2">Asset Name</label>
                <input
                  type="text"
                  value={assetName}
                  onChange={(e) => setAssetName(e.target.value)}
                  placeholder="Enter asset name..."
                  className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 border border-gray-600 focus:border-purple-500 focus:outline-none"
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-white text-sm font-medium mb-2">Description</label>
              <textarea
                value={assetDescription}
                onChange={(e) => setAssetDescription(e.target.value)}
                placeholder="Describe your asset..."
                rows={3}
                className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 border border-gray-600 focus:border-purple-500 focus:outline-none resize-none"
              />
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(rarityColors).map(([rarity, colorClass]) => (
            <motion.button
              key={rarity}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => mintAsset(rarity)}
              disabled={loading || !showMintForm || !assetName.trim() || !assetDescription.trim()}
              className={`p-4 rounded-xl bg-gradient-to-br ${colorClass} text-white font-semibold transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed border-2 border-transparent hover:border-white/20`}
            >
              <div className="text-2xl mb-2">
                {rarity === 'Common' ? '⚪' : rarity === 'Rare' ? '🔵' : rarity === 'Epic' ? '🟣' : '🟡'}
              </div>
              <div className="text-lg font-bold">{rarity}</div>
              <div className="text-sm opacity-90">{rarityPrices[rarity as keyof typeof rarityPrices]} EGLD</div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Player Assets Gallery */}
      {playerAssets.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm p-6 rounded-xl border border-gray-700"
        >
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
            <span className="mr-3">🎴</span>
            Asset Collection
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {playerAssets.map((asset, index) => (
              <motion.div
                key={asset.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className={`p-4 rounded-xl bg-gradient-to-br ${rarityColors[asset.rarity as keyof typeof rarityColors]} backdrop-blur-sm border border-gray-600 shadow-lg`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="text-lg font-bold text-white">{asset.name}</h4>
                    <p className="text-sm text-gray-200">{asset.asset_type}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold text-white bg-black/30`}>
                    {asset.rarity}
                  </span>
                </div>
                
                <p className="text-sm text-gray-200 mb-3">{asset.description}</p>
                
                <div className="flex justify-between items-center text-xs text-gray-300">
                  <span>Level {asset.level}</span>
                  <span>{asset.experience} XP</span>
                </div>
                
                <div className="mt-2 bg-gray-800/50 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-400 to-purple-400 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(asset.experience % 500) / 5}%` }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default GameContract;