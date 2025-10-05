'use client'

import React, { useState, useEffect } from 'react'
import HologramEffect from './HologramEffect'
import '../styles/hologram.css'

interface DemoStats {
  activeGames: number
  totalPlayers: number
  hologramFPS: number
  particleCount: number
}

const HologramDemo: React.FC = () => {
  const [demoStats, setDemoStats] = useState<DemoStats>({
    activeGames: 4,
    totalPlayers: 3879,
    hologramFPS: 60,
    particleCount: 50
  })
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(false)

  // Simulate real-time stats updates
  useEffect(() => {
    const interval = setInterval(() => {
      setDemoStats(prev => ({
        ...prev,
        totalPlayers: prev.totalPlayers + Math.floor(Math.random() * 10) - 5,
        hologramFPS: 58 + Math.floor(Math.random() * 5),
        particleCount: 45 + Math.floor(Math.random() * 10)
      }))
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  return (
    <div className="hologram-demo-container">
      {/* Demo Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              🎭 Holographic Gaming Hub
            </h2>
            <p className="text-gray-400 mt-1">Next-generation 3D game showcase with interactive holographic effects</p>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={() => setShowControls(!showControls)}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-all duration-300 flex items-center gap-2"
            >
              ⚙️ Controls
            </button>
            <button
              onClick={toggleFullscreen}
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-all duration-300 flex items-center gap-2"
            >
              {isFullscreen ? '📉' : '🔍'} {isFullscreen ? 'Exit' : 'Fullscreen'}
            </button>
          </div>
        </div>

        {/* Real-time Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-black/40 backdrop-blur-sm border border-cyan-500/30 rounded-lg p-3">
            <div className="text-cyan-400 text-sm font-semibold">🎮 Active Games</div>
            <div className="text-2xl font-bold text-white">{demoStats.activeGames}</div>
          </div>
          <div className="bg-black/40 backdrop-blur-sm border border-green-500/30 rounded-lg p-3">
            <div className="text-green-400 text-sm font-semibold">👥 Total Players</div>
            <div className="text-2xl font-bold text-white">{demoStats.totalPlayers.toLocaleString()}</div>
          </div>
          <div className="bg-black/40 backdrop-blur-sm border border-yellow-500/30 rounded-lg p-3">
            <div className="text-yellow-400 text-sm font-semibold">⚡ Hologram FPS</div>
            <div className="text-2xl font-bold text-white">{demoStats.hologramFPS}</div>
          </div>
          <div className="bg-black/40 backdrop-blur-sm border border-purple-500/30 rounded-lg p-3">
            <div className="text-purple-400 text-sm font-semibold">✨ Particles</div>
            <div className="text-2xl font-bold text-white">{demoStats.particleCount}</div>
          </div>
        </div>

        {/* Demo Controls Panel */}
        {showControls && (
          <div className="bg-black/60 backdrop-blur-sm border border-gray-700 rounded-lg p-4 mb-6 animate-in slide-in-from-top duration-300">
            <h3 className="text-lg font-semibold text-white mb-3">⚙️ Demo Controls</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Particle Density</label>
                <input 
                  type="range" 
                  min="20" 
                  max="100" 
                  defaultValue="50" 
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Animation Speed</label>
                <input 
                  type="range" 
                  min="0.5" 
                  max="2" 
                  step="0.1" 
                  defaultValue="1" 
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Glow Intensity</label>
                <input 
                  type="range" 
                  min="0.1" 
                  max="1" 
                  step="0.1" 
                  defaultValue="0.6" 
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Hologram Display */}
      <div className={`transition-all duration-500 ${isFullscreen ? 'fixed inset-0 z-50 bg-black p-8' : 'relative'}`}>
        {isFullscreen && (
          <button
            onClick={toggleFullscreen}
            className="absolute top-4 right-4 z-60 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-all duration-300"
          >
            ❌ Exit Fullscreen
          </button>
        )}
        
        <div className={`${isFullscreen ? 'h-full' : 'h-96'} relative`}>
          <HologramEffect />
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        <div className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6">
          <h3 className="text-xl font-bold text-purple-400 mb-3">🎭 3D Holographic Display</h3>
          <p className="text-gray-300 text-sm mb-4">
            Experience games in a revolutionary 3D holographic pyramid with real-time particle effects and interactive navigation.
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="px-2 py-1 bg-purple-600/30 text-purple-300 text-xs rounded">#3D</span>
            <span className="px-2 py-1 bg-purple-600/30 text-purple-300 text-xs rounded">#Hologram</span>
            <span className="px-2 py-1 bg-purple-600/30 text-purple-300 text-xs rounded">#Interactive</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-cyan-900/50 to-teal-900/50 backdrop-blur-sm border border-cyan-500/30 rounded-xl p-6">
          <h3 className="text-xl font-bold text-cyan-400 mb-3">✨ Particle System</h3>
          <p className="text-gray-300 text-sm mb-4">
            Dynamic particle animations create an immersive gaming environment with customizable density and effects.
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="px-2 py-1 bg-cyan-600/30 text-cyan-300 text-xs rounded">#Particles</span>
            <span className="px-2 py-1 bg-cyan-600/30 text-cyan-300 text-xs rounded">#Animation</span>
            <span className="px-2 py-1 bg-cyan-600/30 text-cyan-300 text-xs rounded">#Real-time</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-pink-900/50 to-red-900/50 backdrop-blur-sm border border-pink-500/30 rounded-xl p-6">
          <h3 className="text-xl font-bold text-pink-400 mb-3">🎮 Gaming Integration</h3>
          <p className="text-gray-300 text-sm mb-4">
            Seamlessly showcases blockchain games with live statistics, ratings, and instant launch capabilities.
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="px-2 py-1 bg-pink-600/30 text-pink-300 text-xs rounded">#Gaming</span>
            <span className="px-2 py-1 bg-pink-600/30 text-pink-300 text-xs rounded">#Blockchain</span>
            <span className="px-2 py-1 bg-pink-600/30 text-pink-300 text-xs rounded">#NFT</span>
          </div>
        </div>
      </div>

      {/* Technical Specs */}
      <div className="mt-8 bg-black/40 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">📊 Technical Specifications</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-cyan-400 mb-2">Performance Features</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• 60 FPS smooth animations</li>
              <li>• GPU-accelerated 3D transforms</li>
              <li>• Optimized particle rendering</li>
              <li>• Responsive mobile support</li>
              <li>• Hardware acceleration</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-purple-400 mb-2">Visual Effects</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Glitch text animations</li>
              <li>• Holographic projections</li>
              <li>• Dynamic particle system</li>
              <li>• 3D card rotations</li>
              <li>• Gradient overlays</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HologramDemo