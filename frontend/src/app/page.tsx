'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Gamepad2, 
  Zap, 
  Trophy, 
  Users, 
  ArrowRight, 
  Code2, 
  Wallet, 
  Globe,
  Play,
  Pause,
  RefreshCw,
  Swords,
  Crown
} from 'lucide-react';

import ContractDashboard from '../components/ContractDashboard';
import FeatureCard from '../components/FeatureCard';
import StatsGrid from '../components/StatsGrid';
import GameShowcase from '../components/GameShowcase';
import WalletConnect from '../components/WalletConnect';
import NetworkStatus from '../components/NetworkStatus';
import GameContract from '../components/GameContract';
import HologramDemo from '../components/HologramDemo';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5
    }
  }
};

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isConnected, setIsConnected] = useState(false);
  const [networkStatus, setNetworkStatus] = useState('online');

  useEffect(() => {
    // Check network status
    const checkNetworkStatus = () => {
      setNetworkStatus(navigator.onLine ? 'online' : 'offline');
    };

    window.addEventListener('online', checkNetworkStatus);
    window.addEventListener('offline', checkNetworkStatus);
    checkNetworkStatus();

    return () => {
      window.removeEventListener('online', checkNetworkStatus);
      window.removeEventListener('offline', checkNetworkStatus);
    };
  }, []);

  const features = [
    {
      icon: <Gamepad2 className="h-8 w-8" />,
      title: 'NFT Gaming Assets',
      description: 'Mint, trade, and upgrade unique gaming assets as blockchain NFTs with true ownership',
      gradient: 'from-blue-500 to-purple-600'
    },
    {
      icon: <Swords className="h-8 w-8" />,
      title: 'Cross-Game Items',
      description: 'Use your weapons, characters, and items across multiple games in the StardustEngine ecosystem',
      gradient: 'from-red-500 to-orange-500'
    },
    {
      icon: <Trophy className="h-8 w-8" />,
      title: 'Tournaments & Rewards',
      description: 'Compete in tournaments, earn achievements, and win EGLD prizes in epic gaming competitions',
      gradient: 'from-green-400 to-blue-500'
    },
    {
      icon: <Crown className="h-8 w-8" />,
      title: 'Player Progression',
      description: 'Level up your character, gain experience, and unlock exclusive achievements and rewards',
      gradient: 'from-purple-400 to-pink-500'
    }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <Globe className="h-4 w-4" /> },
    { id: 'gaming', label: 'Gaming Platform', icon: <Gamepad2 className="h-4 w-4" /> },
    { id: 'hologram', label: 'Hologram Demo', icon: <Zap className="h-4 w-4" /> },
    { id: 'dashboard', label: 'Smart Contracts', icon: <Code2 className="h-4 w-4" /> },
    { id: 'wallet', label: 'Wallet', icon: <Wallet className="h-4 w-4" /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <motion.div 
              className="flex items-center space-x-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                🌟 StardustEngine
              </div>
              <div className="hidden sm:block text-sm text-gray-300">
                NFT Gaming Platform on MultiversX
              </div>
            </motion.div>
            
            <div className="flex items-center space-x-4">
              <NetworkStatus status={networkStatus} />
              <WalletConnect 
                isConnected={isConnected} 
                onConnect={() => setIsConnected(true)}
                onDisconnect={() => setIsConnected(false)}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="relative z-10 bg-black/10 backdrop-blur-sm border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'overview' && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-12"
              >
                {/* Hero Section */}
                <motion.section variants={itemVariants} className="text-center py-12">
                  <h1 className="text-5xl font-bold text-white mb-6">
                    Next-Generation
                    <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                      NFT Gaming Platform
                    </span>
                  </h1>
                  <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                    StardustEngine combines cutting-edge blockchain technology with spectacular gaming experiences. 
                    Mint NFT assets, compete in tournaments, and build your gaming legacy on MultiversX.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button 
                      onClick={() => setActiveTab('gaming')}
                      className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 flex items-center justify-center"
                    >
                      Start Gaming
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => setActiveTab('hologram')}
                      className="px-8 py-3 border border-gray-600 text-gray-300 font-semibold rounded-lg hover:bg-gray-800 transition-all duration-200 flex items-center justify-center"
                    >
                      View Hologram Demo
                      <Zap className="ml-2 h-4 w-4" />
                    </button>
                  </div>
                </motion.section>

                {/* Stats Grid */}
                <motion.section variants={itemVariants}>
                  <StatsGrid />
                </motion.section>

                {/* Features Grid */}
                <motion.section variants={itemVariants}>
                  <h2 className="text-3xl font-bold text-white text-center mb-12">
                    Revolutionary Gaming Features
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                      <FeatureCard key={index} {...feature} index={index} />
                    ))}
                  </div>
                </motion.section>

                {/* Game Showcase */}
                <motion.section variants={itemVariants}>
                  <GameShowcase />
                </motion.section>
              </motion.div>
            )}

            {activeTab === 'gaming' && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-8"
              >
                <motion.div variants={itemVariants} className="text-center mb-8">
                  <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center">
                    <Gamepad2 className="mr-3 h-10 w-10 text-blue-400" />
                    Gaming Platform
                  </h1>
                  <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                    Experience the future of blockchain gaming with NFT assets, tournaments, and player progression.
                  </p>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <GameContract />
                </motion.div>
              </motion.div>
            )}

            {activeTab === 'hologram' && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-8"
              >
                <motion.div variants={itemVariants} className="text-center mb-8">
                  <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center">
                    <Zap className="mr-3 h-10 w-10 text-purple-400" />
                    Hologram Technology Demo
                  </h1>
                  <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                    Experience our cutting-edge holographic interface technology with 3D effects and particle systems.
                  </p>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <HologramDemo />
                </motion.div>
              </motion.div>
            )}

            {activeTab === 'dashboard' && (
              <motion.div variants={itemVariants}>
                <div className="text-center mb-8">
                  <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center">
                    <Code2 className="mr-3 h-10 w-10 text-green-400" />
                    Smart Contract Dashboard
                  </h1>
                  <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                    Interact directly with StardustEngine smart contracts and explore blockchain functionality.
                  </p>
                </div>
                <ContractDashboard isConnected={isConnected} />
              </motion.div>
            )}

            {activeTab === 'wallet' && (
              <div className="text-center py-20">
                <Wallet className="h-20 w-20 text-gray-400 mx-auto mb-6" />
                <h2 className="text-2xl font-bold text-white mb-4">
                  {isConnected ? 'Wallet Connected' : 'Connect Your Wallet'}
                </h2>
                <p className="text-gray-400 mb-8 max-w-md mx-auto">
                  {isConnected 
                    ? 'Manage your gaming assets, NFTs, and participate in the StardustEngine ecosystem.'
                    : 'Connect your MultiversX wallet to start your Web3 gaming journey.'
                  }
                </p>
                {!isConnected && (
                  <WalletConnect 
                    isConnected={isConnected} 
                    onConnect={() => setIsConnected(true)}
                    onDisconnect={() => setIsConnected(false)}
                    variant="large"
                  />
                )}
                {isConnected && (
                  <div className="mt-8">
                    <button 
                      onClick={() => setActiveTab('gaming')}
                      className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 flex items-center justify-center mx-auto"
                    >
                      Access Gaming Platform
                      <Gamepad2 className="ml-2 h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 bg-black/20 backdrop-blur-xl mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-400">
            <p className="mb-2">🚀 Built with MultiversX Smart Contracts</p>
            <p>🎮 Powered by React + TypeScript + Framer Motion</p>
            <p className="mt-4 text-sm">
              © 2025 StardustEngine. Built with ❤️ by{' '}
              <a href="https://github.com/Gzeu" className="text-blue-400 hover:text-blue-300 transition-colors">
                George Pricop
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}