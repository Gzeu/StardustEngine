'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrophyIcon, 
  FireIcon, 
  StarIcon,
  ChartBarIcon,
  UserIcon,
  CogIcon,
  BoltIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { NFTGallery } from '@/components/ui/NFTGallery';
import { NFTViewer3D } from '@/components/ui/NFTViewer3D';

interface PlayerStats {
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
}

interface DashboardData {
  playerStats: PlayerStats;
  recentAssets: any[];
  recentMatches: any[];
  featuredTournament?: any;
}

// Mock data - în producție va veni de la API
const mockDashboardData: DashboardData = {
  playerStats: {
    level: 42,
    experience: 15750,
    experienceToNext: 2250,
    gamesPlayed: 156,
    gamesWon: 89,
    assetsOwned: 23,
    totalValue: 47.5,
    achievements: ['First Victory', 'Asset Collector', 'Tournament Winner'],
    rank: 'Diamond',
    winRate: 57.1
  },
  recentAssets: [
    {
      id: '1',
      name: 'Dragon Slayer Sword',
      rarity: 'Legendary' as const,
      type: 'Weapon' as const,
      level: 10,
      description: 'A legendary sword forged in dragon fire'
    },
    {
      id: '2', 
      name: 'Cyber Ninja',
      rarity: 'Epic' as const,
      type: 'Character' as const,
      level: 8,
      description: 'Stealthy warrior from the digital realm'
    }
  ],
  recentMatches: [
    { id: 1, opponent: 'CyberWarrior23', result: 'win', duration: '12:34', mode: 'Ranked' },
    { id: 2, opponent: 'DragonSlayer', result: 'loss', duration: '8:45', mode: 'Tournament' },
    { id: 3, opponent: 'NightShade', result: 'win', duration: '15:22', mode: 'Casual' }
  ]
};

// Statistics card component
function StatCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  color = 'blue',
  trend
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ComponentType<any>;
  color?: string;
  trend?: 'up' | 'down';
}) {
  return (
    <motion.div
      className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-gray-600 transition-all"
      whileHover={{ scale: 1.02 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2 rounded-lg bg-${color}-500/20`}>
          <Icon className={`w-6 h-6 text-${color}-400`} />
        </div>
        {trend && (
          <div className={`flex items-center text-sm ${
            trend === 'up' ? 'text-green-400' : 'text-red-400'
          }`}>
            <span>{trend === 'up' ? '↗' : '↘'}</span>
          </div>
        )}
      </div>
      
      <h3 className="text-gray-400 text-sm font-medium">{title}</h3>
      <p className="text-white text-2xl font-bold">{value}</p>
      {subtitle && (
        <p className="text-gray-500 text-sm mt-1">{subtitle}</p>
      )}
    </motion.div>
  );
}

// Progress bar component
function ProgressBar({ 
  current, 
  max, 
  label, 
  color = 'blue' 
}: {
  current: number;
  max: number;
  label: string;
  color?: string;
}) {
  const percentage = (current / max) * 100;
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-gray-400">{label}</span>
        <span className="text-white">{current} / {max}</span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-2">
        <motion.div
          className={`h-2 rounded-full bg-gradient-to-r from-${color}-500 to-${color}-400`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}

// Recent match component
function RecentMatch({ match }: { match: any }) {
  return (
    <motion.div
      className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg border border-gray-700"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
    >
      <div>
        <p className="text-white font-medium">vs {match.opponent}</p>
        <p className="text-gray-400 text-sm">{match.mode} • {match.duration}</p>
      </div>
      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
        match.result === 'win' 
          ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
          : 'bg-red-500/20 text-red-400 border border-red-500/30'
      }`}>
        {match.result.toUpperCase()}
      </div>
    </motion.div>
  );
}

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<DashboardData>(mockDashboardData);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-white text-xl">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  const { playerStats } = dashboardData;
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Player Dashboard</h1>
              <p className="text-gray-400">Welcome back, {playerStats.rank} Warrior!</p>
            </div>
            <button className="bg-gray-800 hover:bg-gray-700 text-white p-3 rounded-lg transition-colors">
              <CogIcon className="w-6 h-6" />
            </button>
          </div>
        </motion.div>

        {/* Player Level & Progress */}
        <motion.div
          className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-6 mb-8"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-white">{playerStats.level}</span>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white mb-2">Level {playerStats.level} {playerStats.rank}</h2>
              <ProgressBar 
                current={playerStats.experience} 
                max={playerStats.experience + playerStats.experienceToNext}
                label="Experience to Next Level"
                color="purple"
              />
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Games Played"
            value={playerStats.gamesPlayed}
            subtitle="Total matches"
            icon={ChartBarIcon}
            color="blue"
            trend="up"
          />
          <StatCard
            title="Win Rate"
            value={`${playerStats.winRate}%`}
            subtitle={`${playerStats.gamesWon} victories`}
            icon={TrophyIcon}
            color="green"
            trend="up"
          />
          <StatCard
            title="Assets Owned"
            value={playerStats.assetsOwned}
            subtitle={`${playerStats.totalValue} EGLD total`}
            icon={StarIcon}
            color="yellow"
          />
          <StatCard
            title="Achievements"
            value={playerStats.achievements.length}
            subtitle="Unlocked badges"
            icon={ShieldCheckIcon}
            color="purple"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Assets */}
          <div className="lg:col-span-2">
            <motion.div
              className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl p-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                <StarIcon className="w-6 h-6 mr-2 text-yellow-400" />
                Recent Assets
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                {dashboardData.recentAssets.map((asset) => (
                  <motion.div
                    key={asset.id}
                    className="cursor-pointer"
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setSelectedAsset(asset)}
                  >
                    <NFTViewer3D asset={asset} size="sm" />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Recent Matches & Activity */}
          <div className="space-y-6">
            {/* Recent Matches */}
            <motion.div
              className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl p-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <BoltIcon className="w-6 h-6 mr-2 text-blue-400" />
                Recent Matches
              </h3>
              
              <div className="space-y-3">
                {dashboardData.recentMatches.map((match) => (
                  <RecentMatch key={match.id} match={match} />
                ))}
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl p-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
              
              <div className="space-y-3">
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center">
                  <FireIcon className="w-5 h-5 mr-2" />
                  Find Match
                </button>
                <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center">
                  <TrophyIcon className="w-5 h-5 mr-2" />
                  Join Tournament
                </button>
                <button className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center">
                  <UserIcon className="w-5 h-5 mr-2" />
                  View Profile
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}