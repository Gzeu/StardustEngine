'use client';

import { motion } from 'framer-motion';
import { Play, Star, Users, Trophy, ArrowRight, Gamepad2 } from 'lucide-react';
import { useState } from 'react';

const games = [
  {
    id: 1,
    title: 'Cosmic Conquest',
    description: 'Epic space strategy game with NFT fleets and cross-galaxy battles',
    image: '/api/placeholder/400/240',
    status: 'Coming Soon',
    players: '2.5K+',
    rating: 4.8,
    category: 'Strategy',
    features: ['NFT Ships', 'P2E Rewards', 'Guild Wars'],
    gradient: 'from-blue-600 to-purple-600'
  },
  {
    id: 2,
    title: 'Dragon Realms',
    description: 'Fantasy RPG with breeding dragons and magical artifact trading',
    image: '/api/placeholder/400/240',
    status: 'Alpha Testing',
    players: '1.8K+',
    rating: 4.6,
    category: 'RPG',
    features: ['Dragon NFTs', 'Breeding', 'Quests'],
    gradient: 'from-green-600 to-emerald-600'
  },
  {
    id: 3,
    title: 'Cyber Racing',
    description: 'High-speed racing with customizable vehicles and track ownership',
    image: '/api/placeholder/400/240',
    status: 'Beta',
    players: '3.2K+',
    rating: 4.9,
    category: 'Racing',
    features: ['Vehicle NFTs', 'Track Building', 'Tournaments'],
    gradient: 'from-orange-600 to-red-600'
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
};

export default function GameShowcase() {
  const [hoveredGame, setHoveredGame] = useState<number | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Coming Soon':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'Alpha Testing':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'Beta':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Live':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <section className="py-16">
      <div className="text-center mb-12">
        <motion.h2 
          className="text-3xl font-bold text-white mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Featured Games
        </motion.h2>
        <motion.p 
          className="text-gray-400 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Experience the next generation of blockchain gaming with true asset ownership, 
          cross-game compatibility, and play-to-earn mechanics.
        </motion.p>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {games.map((game) => (
          <motion.div
            key={game.id}
            variants={cardVariants}
            whileHover={{ y: -10, scale: 1.02 }}
            onHoverStart={() => setHoveredGame(game.id)}
            onHoverEnd={() => setHoveredGame(null)}
            className="group relative overflow-hidden rounded-xl bg-white/5 backdrop-blur-lg border border-white/10 hover:border-white/20 transition-all duration-300"
          >
            {/* Background gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${game.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
            
            {/* Image placeholder */}
            <div className="relative h-48 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center overflow-hidden">
              <Gamepad2 className="h-16 w-16 text-gray-600" />
              
              {/* Play button overlay */}
              <motion.div 
                className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                initial={false}
                animate={{ opacity: hoveredGame === game.id ? 1 : 0 }}
              >
                <motion.button 
                  className="bg-white/20 backdrop-blur-md rounded-full p-4 hover:bg-white/30 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Play className="h-6 w-6 text-white" />
                </motion.button>
              </motion.div>
            </div>

            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-1 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-white group-hover:to-gray-300 transition-all duration-300">
                    {game.title}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(game.status)}`}>
                      {game.status}
                    </span>
                    <span className="text-gray-500 text-sm">{game.category}</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-400 text-sm mb-4 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                {game.description}
              </p>

              {/* Features */}
              <div className="flex flex-wrap gap-2 mb-4">
                {game.features.map((feature, index) => (
                  <span 
                    key={index}
                    className="px-2 py-1 bg-white/10 text-gray-300 text-xs rounded-md border border-white/20"
                  >
                    {feature}
                  </span>
                ))}
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center text-gray-400">
                    <Users className="h-4 w-4 mr-1" />
                    <span className="text-sm">{game.players}</span>
                  </div>
                  <div className="flex items-center text-gray-400">
                    <Star className="h-4 w-4 mr-1 text-yellow-400" />
                    <span className="text-sm">{game.rating}</span>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <motion.button 
                className={`w-full py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 bg-gradient-to-r ${game.gradient} hover:shadow-lg`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="text-white">
                  {game.status === 'Coming Soon' ? 'Join Waitlist' : 
                   game.status === 'Alpha Testing' ? 'Request Access' : 
                   game.status === 'Beta' ? 'Play Beta' : 'Play Now'}
                </span>
                <ArrowRight className="h-4 w-4 text-white" />
              </motion.button>
            </div>

            {/* Hover shine effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[400%] transition-transform duration-700"></div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* View All Games Button */}
      <motion.div 
        className="text-center mt-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <button className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 transform hover:scale-105 flex items-center mx-auto">
          <Trophy className="mr-2 h-4 w-4" />
          Explore All Games
          <ArrowRight className="ml-2 h-4 w-4" />
        </button>
      </motion.div>
    </section>
  );
}