'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Code2, 
  Play, 
  Zap, 
  Globe, 
  Copy, 
  ExternalLink, 
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  Activity,
  Server
} from 'lucide-react';

interface ContractDashboardProps {
  isConnected: boolean;
}

interface ContractCall {
  id: string;
  function: string;
  status: 'pending' | 'success' | 'error';
  result?: any;
  timestamp: Date;
}

const CONTRACT_ADDRESS = 'erd1qqqqqqqqqqqqqpgqfm0kd3wse7ddgtf4haplm3p5mdl90msp634qxrfmt3';
const API_BASE = process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:8000';

export default function ContractDashboard({ isConnected }: ContractDashboardProps) {
  const [calls, setCalls] = useState<ContractCall[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [contractStats, setContractStats] = useState({
    version: 'Unknown',
    bytecodeSize: '451 bytes',
    network: 'MultiversX Devnet',
    deployedAt: '2025-10-05',
    totalCalls: 0,
    uptime: '99.9%'
  });

  const [copiedAddress, setCopiedAddress] = useState(false);

  useEffect(() => {
    // Load initial contract info
    handleContractCall('get_version');
  }, []);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleContractCall = async (functionName: string, args: any[] = []) => {
    const callId = Date.now().toString();
    const newCall: ContractCall = {
      id: callId,
      function: functionName,
      status: 'pending',
      timestamp: new Date()
    };

    setCalls(prev => [newCall, ...prev.slice(0, 9)]); // Keep only last 10 calls
    setIsLoading(true);

    try {
      let endpoint = '';
      let options: RequestInit = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      if (functionName === 'get_info') {
        endpoint = '/contract/info';
        options.method = 'GET';
      } else {
        endpoint = '/contract/call';
        options.method = 'POST';
        options.body = JSON.stringify({
          function: functionName,
          args: args
        });
      }

      const response = await fetch(`${API_BASE}${endpoint}`, options);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      setCalls(prev => prev.map(call => 
        call.id === callId 
          ? { ...call, status: 'success', result: data }
          : call
      ));

      // Update stats if it's a version call
      if (functionName === 'get_version' && data) {
        setContractStats(prev => ({
          ...prev,
          version: data.version || data.result || 'v1.0.0',
          totalCalls: prev.totalCalls + 1
        }));
      }

    } catch (error) {
      setCalls(prev => prev.map(call => 
        call.id === callId 
          ? { 
              ...call, 
              status: 'error', 
              result: { error: error instanceof Error ? error.message : 'Unknown error' }
            }
          : call
      ));
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: ContractCall['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500 animate-spin" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const formatResult = (result: any) => {
    if (!result) return 'No result';
    if (typeof result === 'object') {
      return JSON.stringify(result, null, 2);
    }
    return result.toString();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <motion.h1 
          className="text-4xl font-bold text-white mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Contract Dashboard
        </motion.h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Interact with the StardustEngine smart contract deployed on MultiversX Devnet. 
          Test contract functions and monitor real-time activity.
        </p>
      </div>

      {/* Contract Info Card */}
      <motion.div 
        className="card"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white flex items-center">
            <Server className="h-5 w-5 mr-2 text-blue-400" />
            Contract Information
          </h2>
          <div className="flex items-center space-x-2">
            <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-green-400">Live</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white/5 rounded-lg p-4">
            <div className="text-sm text-gray-400 mb-1">Contract Address</div>
            <div className="flex items-center space-x-2">
              <code className="text-xs text-blue-300 font-mono bg-blue-900/20 px-2 py-1 rounded flex-1 truncate">
                {CONTRACT_ADDRESS}
              </code>
              <button
                onClick={() => copyToClipboard(CONTRACT_ADDRESS)}
                className="text-gray-400 hover:text-white transition-colors"
                title="Copy address"
              >
                {copiedAddress ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </button>
              <a
                href={`https://devnet-explorer.multiversx.com/accounts/${CONTRACT_ADDRESS}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                title="View in Explorer"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div className="bg-white/5 rounded-lg p-4">
            <div className="text-sm text-gray-400 mb-1">Network</div>
            <div className="text-white font-medium">{contractStats.network}</div>
          </div>

          <div className="bg-white/5 rounded-lg p-4">
            <div className="text-sm text-gray-400 mb-1">Version</div>
            <div className="text-white font-medium">{contractStats.version}</div>
          </div>

          <div className="bg-white/5 rounded-lg p-4">
            <div className="text-sm text-gray-400 mb-1">Bytecode Size</div>
            <div className="text-white font-medium">{contractStats.bytecodeSize}</div>
          </div>

          <div className="bg-white/5 rounded-lg p-4">
            <div className="text-sm text-gray-400 mb-1">Deployed</div>
            <div className="text-white font-medium">{contractStats.deployedAt}</div>
          </div>

          <div className="bg-white/5 rounded-lg p-4">
            <div className="text-sm text-gray-400 mb-1">Uptime</div>
            <div className="text-green-400 font-medium">{contractStats.uptime}</div>
          </div>
        </div>
      </motion.div>

      {/* Contract Functions */}
      <motion.div 
        className="card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
          <Code2 className="h-5 w-5 mr-2 text-purple-400" />
          Available Functions
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <button
            onClick={() => handleContractCall('hello')}
            disabled={isLoading}
            className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-lg hover:from-blue-600/30 hover:to-purple-600/30 transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-center">
              <Play className="h-4 w-4 mr-2 text-blue-400" />
              <span className="text-white font-medium">hello()</span>
            </div>
            <div className="text-xs text-gray-400 group-hover:text-gray-300">Test greeting</div>
          </button>

          <button
            onClick={() => handleContractCall('get_version')}
            disabled={isLoading}
            className="flex items-center justify-between p-4 bg-gradient-to-r from-green-600/20 to-blue-600/20 border border-green-500/30 rounded-lg hover:from-green-600/30 hover:to-blue-600/30 transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-center">
              <Zap className="h-4 w-4 mr-2 text-green-400" />
              <span className="text-white font-medium">get_version()</span>
            </div>
            <div className="text-xs text-gray-400 group-hover:text-gray-300">Contract version</div>
          </button>

          <button
            onClick={() => handleContractCall('get_info')}
            disabled={isLoading}
            className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-lg hover:from-purple-600/30 hover:to-pink-600/30 transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-center">
              <Globe className="h-4 w-4 mr-2 text-purple-400" />
              <span className="text-white font-medium">get_info()</span>
            </div>
            <div className="text-xs text-gray-400 group-hover:text-gray-300">Contract info</div>
          </button>
        </div>
      </motion.div>

      {/* Call History */}
      <motion.div 
        className="card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white flex items-center">
            <Activity className="h-5 w-5 mr-2 text-orange-400" />
            Call History
          </h2>
          {isLoading && (
            <div className="flex items-center text-blue-400">
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              <span className="text-sm">Processing...</span>
            </div>
          )}
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          <AnimatePresence>
            {calls.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <Code2 className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No function calls yet. Try calling a contract function above.</p>
              </div>
            ) : (
              calls.map((call) => (
                <motion.div
                  key={call.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-white/5 rounded-lg p-4 border border-white/10"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(call.status)}
                      <code className="text-blue-300 font-mono">{call.function}()</code>
                      <span className="text-xs text-gray-400">
                        {call.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                  {call.result && (
                    <pre className="text-xs text-gray-300 bg-black/30 rounded p-2 mt-2 overflow-x-auto">
                      {formatResult(call.result)}
                    </pre>
                  )}
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}