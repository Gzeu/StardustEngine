'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, LogOut, Copy, ExternalLink, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface WalletConnectProps {
  isConnected: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
  variant?: 'default' | 'large';
}

const mockWalletAddress = 'erd1qqqqqqqqqqqqqpgqfm0kd3wse7ddgtf4haplm3p5mdl90msp634qxrfmt3';
const mockBalance = '125.45 EGLD';

export default function WalletConnect({ 
  isConnected, 
  onConnect, 
  onDisconnect, 
  variant = 'default' 
}: WalletConnectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(mockWalletAddress);
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2000);
    } catch (err) {
      console.error('Failed to copy address:', err);
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 8)}...${address.slice(-8)}`;
  };

  if (variant === 'large') {
    return (
      <div className="text-center">
        {!isConnected ? (
          <motion.button
            onClick={onConnect}
            className="px-12 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 flex items-center mx-auto text-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Wallet className="mr-3 h-6 w-6" />
            Connect Wallet
          </motion.button>
        ) : (
          <motion.div
            className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 p-8 max-w-md mx-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wallet className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Wallet Connected</h3>
              <p className="text-gray-400">Manage your gaming assets and transactions</p>
            </div>

            <div className="space-y-4">
              <div className="bg-white/5 rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-1">Balance</div>
                <div className="text-2xl font-bold text-white">{mockBalance}</div>
              </div>

              <div className="bg-white/5 rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-2">Address</div>
                <div className="flex items-center space-x-2">
                  <code className="text-xs text-blue-300 font-mono bg-blue-900/20 px-2 py-1 rounded flex-1 truncate">
                    {formatAddress(mockWalletAddress)}
                  </code>
                  <button
                    onClick={copyAddress}
                    className="text-gray-400 hover:text-white transition-colors"
                    title="Copy address"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <button
                onClick={onDisconnect}
                className="w-full py-3 bg-red-600/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-600/30 transition-all duration-200 flex items-center justify-center"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Disconnect Wallet
              </button>
            </div>
          </motion.div>
        )}
      </div>
    );
  }

  if (!isConnected) {
    return (
      <motion.button
        onClick={onConnect}
        className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 flex items-center"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Wallet className="mr-2 h-4 w-4" />
        Connect
      </motion.button>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 hover:bg-white/20 transition-all duration-200"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
          <Wallet className="h-3 w-3 text-white" />
        </div>
        <span className="text-white font-medium text-sm">
          {formatAddress(mockWalletAddress)}
        </span>
        <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
          isOpen ? 'rotate-180' : ''
        }`} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-80 bg-gray-900/95 backdrop-blur-xl rounded-xl border border-white/20 shadow-2xl z-50"
          >
            <div className="p-4">
              {/* Header */}
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                  <Wallet className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-white font-medium">Wallet Connected</div>
                  <div className="text-xs text-gray-400">MultiversX Network</div>
                </div>
              </div>

              {/* Balance */}
              <div className="bg-white/5 rounded-lg p-3 mb-4">
                <div className="text-xs text-gray-400 mb-1">Balance</div>
                <div className="text-xl font-bold text-white">{mockBalance}</div>
              </div>

              {/* Address */}
              <div className="bg-white/5 rounded-lg p-3 mb-4">
                <div className="text-xs text-gray-400 mb-2">Address</div>
                <div className="flex items-center space-x-2">
                  <code className="text-xs text-blue-300 font-mono bg-blue-900/20 px-2 py-1 rounded flex-1">
                    {mockWalletAddress}
                  </code>
                  <div className="flex space-x-1">
                    <button
                      onClick={copyAddress}
                      className="text-gray-400 hover:text-white transition-colors p-1"
                      title="Copy address"
                    >
                      {copiedAddress ? (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="text-green-400"
                        >
                          ✓
                        </motion.div>
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </button>
                    <a
                      href={`https://devnet-explorer.multiversx.com/accounts/${mockWalletAddress}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-white transition-colors p-1"
                      title="View in Explorer"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2">
                <button className="w-full py-2 px-3 bg-white/10 text-white text-sm rounded-lg hover:bg-white/20 transition-all duration-200 flex items-center justify-center">
                  View Transactions
                </button>
                <button
                  onClick={() => {
                    onDisconnect();
                    setIsOpen(false);
                  }}
                  className="w-full py-2 px-3 bg-red-600/20 text-red-400 text-sm border border-red-500/30 rounded-lg hover:bg-red-600/30 transition-all duration-200 flex items-center justify-center"
                >
                  <LogOut className="mr-2 h-3 w-3" />
                  Disconnect
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}