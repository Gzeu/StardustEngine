'use client';

import { motion } from 'framer-motion';
import { TrendingUp, Users, Zap, Trophy } from 'lucide-react';

const stats = [
  {
    icon: <TrendingUp className="h-6 w-6" />,
    label: 'Contract Calls',
    value: '1,247',
    change: '+12.5%',
    changeType: 'positive' as const,
    color: 'from-blue-500 to-cyan-500'
  },
  {
    icon: <Users className="h-6 w-6" />,
    label: 'Active Developers',
    value: '89',
    change: '+8.2%',
    changeType: 'positive' as const,
    color: 'from-purple-500 to-pink-500'
  },
  {
    icon: <Zap className="h-6 w-6" />,
    label: 'Avg Response Time',
    value: '0.3s',
    change: '-15.3%',
    changeType: 'positive' as const,
    color: 'from-yellow-500 to-orange-500'
  },
  {
    icon: <Trophy className="h-6 w-6" />,
    label: 'Games Built',
    value: '23',
    change: '+4.1%',
    changeType: 'positive' as const,
    color: 'from-green-500 to-emerald-500'
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.9 },
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

export default function StatsGrid() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
    >
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          variants={itemVariants}
          whileHover={{ y: -5, scale: 1.05 }}
          className="group relative overflow-hidden"
        >
          {/* Background gradient */}
          <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-10 group-hover:opacity-20 transition-opacity duration-300 rounded-xl`}></div>
          
          {/* Glow effect */}
          <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-300`}></div>
          
          {/* Card content */}
          <div className="relative bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 p-6 group-hover:border-white/20 transition-all duration-300">
            {/* Icon */}
            <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${stat.color} mb-4`}>
              <div className="text-white">
                {stat.icon}
              </div>
            </div>
            
            {/* Value */}
            <div className="text-3xl font-bold text-white mb-1 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-white group-hover:to-gray-300 transition-all duration-300">
              {stat.value}
            </div>
            
            {/* Label */}
            <div className="text-gray-400 text-sm mb-2 group-hover:text-gray-300 transition-colors duration-300">
              {stat.label}
            </div>
            
            {/* Change indicator */}
            <div className={`flex items-center text-sm ${
              stat.changeType === 'positive' ? 'text-green-400' : 'text-red-400'
            }`}>
              <TrendingUp className={`h-3 w-3 mr-1 ${
                stat.changeType === 'positive' ? '' : 'rotate-180'
              }`} />
              {stat.change}
            </div>
            
            {/* Shine effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[400%] transition-transform duration-700"></div>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}