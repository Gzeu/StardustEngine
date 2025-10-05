'use client';

import { motion } from 'framer-motion';
import { Wifi, WifiOff, AlertCircle } from 'lucide-react';

interface NetworkStatusProps {
  status: 'online' | 'offline' | 'connecting';
}

export default function NetworkStatus({ status }: NetworkStatusProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'online':
        return {
          icon: <Wifi className="h-4 w-4" />,
          text: 'Online',
          color: 'text-green-400',
          bgColor: 'bg-green-500/20',
          borderColor: 'border-green-500/30',
          dotColor: 'bg-green-500'
        };
      case 'offline':
        return {
          icon: <WifiOff className="h-4 w-4" />,
          text: 'Offline',
          color: 'text-red-400',
          bgColor: 'bg-red-500/20',
          borderColor: 'border-red-500/30',
          dotColor: 'bg-red-500'
        };
      case 'connecting':
        return {
          icon: <AlertCircle className="h-4 w-4" />,
          text: 'Connecting',
          color: 'text-yellow-400',
          bgColor: 'bg-yellow-500/20',
          borderColor: 'border-yellow-500/30',
          dotColor: 'bg-yellow-500'
        };
      default:
        return {
          icon: <WifiOff className="h-4 w-4" />,
          text: 'Unknown',
          color: 'text-gray-400',
          bgColor: 'bg-gray-500/20',
          borderColor: 'border-gray-500/30',
          dotColor: 'bg-gray-500'
        };
    }
  };

  const config = getStatusConfig();

  return (
    <motion.div
      className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg border ${config.bgColor} ${config.borderColor}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative">
        <div className={`w-2 h-2 rounded-full ${config.dotColor} ${status === 'connecting' ? 'animate-pulse' : ''}`}></div>
        {status === 'online' && (
          <motion.div
            className={`absolute inset-0 w-2 h-2 rounded-full ${config.dotColor} opacity-75`}
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        )}
      </div>
      <div className={`${config.color} text-sm font-medium flex items-center`}>
        {config.icon}
        <span className="ml-1 hidden sm:inline">{config.text}</span>
      </div>
    </motion.div>
  );
}