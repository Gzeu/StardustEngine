'use client'

import React, { useState, useEffect, useRef } from 'react'

interface GameData {
  id: string
  title: string
  thumbnail: string
  description: string
  players: number
  rating: number
  category: string
}

interface Particle {
  id: number
  x: number
  y: number
  size: number
  speed: number
  opacity: number
  color: string
}

const HologramEffect: React.FC = () => {
  const [particles, setParticles] = useState<Particle[]>([])
  const [activeGame, setActiveGame] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number>()

  // Sample game data
  const games: GameData[] = [
    {
      id: '1',
      title: 'Cosmic Raiders',
      thumbnail: '/api/placeholder/200/120',
      description: 'Epic space combat adventure',
      players: 1247,
      rating: 4.8,
      category: 'Action'
    },
    {
      id: '2',
      title: 'NFT Quest',
      thumbnail: '/api/placeholder/200/120',
      description: 'Collectible adventure RPG',
      players: 892,
      rating: 4.6,
      category: 'RPG'
    },
    {
      id: '3',
      title: 'Chain Legends',
      thumbnail: '/api/placeholder/200/120',
      description: 'Strategic blockchain warfare',
      players: 634,
      rating: 4.9,
      category: 'Strategy'
    },
    {
      id: '4',
      title: 'Token Rush',
      thumbnail: '/api/placeholder/200/120',
      description: 'Fast-paced racing experience',
      players: 1108,
      rating: 4.7,
      category: 'Racing'
    }
  ]

  // Initialize particles
  useEffect(() => {
    const createParticles = () => {
      const newParticles: Particle[] = []
      for (let i = 0; i < 50; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 4 + 1,
          speed: Math.random() * 2 + 0.5,
          opacity: Math.random() * 0.8 + 0.2,
          color: ['#00f5ff', '#ff006e', '#8338ec', '#3a86ff', '#06ffa5'][Math.floor(Math.random() * 5)]
        })
      }
      setParticles(newParticles)
    }

    createParticles()
  }, [])

  // Animate particles
  useEffect(() => {
    const animateParticles = () => {
      setParticles(prev => prev.map(particle => ({
        ...particle,
        y: particle.y <= -5 ? 105 : particle.y - particle.speed * 0.1,
        opacity: particle.y <= -5 ? Math.random() * 0.8 + 0.2 : particle.opacity
      })))
      animationRef.current = requestAnimationFrame(animateParticles)
    }

    animationRef.current = requestAnimationFrame(animateParticles)
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  return (
    <div className="hologram-container relative w-full h-96 overflow-hidden bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-cyan-900/20 rounded-2xl border border-cyan-500/30 backdrop-blur-sm">
      {/* Particle System */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map(particle => (
          <div
            key={particle.id}
            className="absolute w-1 h-1 rounded-full animate-pulse"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              backgroundColor: particle.color,
              opacity: particle.opacity,
              boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
            }}
          />
        ))}
      </div>

      {/* Hologram Grid Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="w-full h-full" style={{
          backgroundImage: `
            linear-gradient(rgba(0, 245, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 245, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px'
        }} />
      </div>

      {/* Main Hologram Pyramid */}
      <div 
        ref={containerRef}
        className="hologram-pyramid relative w-full h-full flex items-center justify-center perspective-1000"
      >
        {/* Pyramid Base Glow */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-80 h-2 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-60 blur-sm" />
        
        {/* 3D Game Cards Container */}
        <div className="relative w-80 h-80 transform-gpu preserve-3d animate-float">
          {games.map((game, index) => {
            const angle = (index / games.length) * 360
            const isActive = activeGame === game.id
            
            return (
              <div
                key={game.id}
                className={`absolute w-48 h-32 cursor-pointer transition-all duration-500 transform-gpu preserve-3d ${
                  isActive ? 'scale-110 z-20' : 'hover:scale-105'
                }`}
                style={{
                  transform: `
                    rotateY(${angle}deg) 
                    translateZ(120px) 
                    ${isActive ? 'rotateY(0deg) translateZ(150px)' : ''}
                  `,
                  transformOrigin: 'center center'
                }}
                onMouseEnter={() => setActiveGame(game.id)}
                onMouseLeave={() => setActiveGame(null)}
              >
                {/* Game Card */}
                <div className={`relative w-full h-full rounded-xl border-2 overflow-hidden transition-all duration-300 ${
                  isActive 
                    ? 'border-cyan-400 shadow-2xl shadow-cyan-400/50' 
                    : 'border-purple-500/50 shadow-lg shadow-purple-500/20'
                }`}>
                  {/* Holographic Border Effect */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 animate-pulse" />
                  
                  {/* Game Thumbnail */}
                  <div className="relative w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex flex-col items-center justify-center text-white">
                    <div className="w-12 h-12 mb-2 rounded-lg bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center">
                      <span className="text-xl font-bold">🎮</span>
                    </div>
                    <h3 className="text-sm font-bold text-center px-2 glitch-text" data-text={game.title}>
                      {game.title}
                    </h3>
                    <p className="text-xs opacity-80 text-center px-2 mt-1">
                      {game.description}
                    </p>
                    
                    {/* Game Stats */}
                    <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center text-xs">
                      <span className="text-green-400">👥 {game.players}</span>
                      <span className="text-yellow-400">⭐ {game.rating}</span>
                    </div>
                  </div>

                  {/* Glitch Overlay */}
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent animate-glitch" />
                  )}
                </div>

                {/* Hologram Projection Lines */}
                {isActive && (
                  <>
                    <div className="absolute top-0 left-1/2 w-px h-20 bg-gradient-to-t from-cyan-400 to-transparent transform -translate-x-1/2 -translate-y-20" />
                    <div className="absolute bottom-0 left-1/2 w-px h-20 bg-gradient-to-b from-cyan-400 to-transparent transform -translate-x-1/2 translate-y-20" />
                    <div className="absolute left-0 top-1/2 w-20 h-px bg-gradient-to-l from-cyan-400 to-transparent transform -translate-y-1/2 -translate-x-20" />
                    <div className="absolute right-0 top-1/2 w-20 h-px bg-gradient-to-r from-cyan-400 to-transparent transform -translate-y-1/2 translate-x-20" />
                  </>
                )}
              </div>
            )
          })}
        </div>

        {/* Central Hologram Core */}
        <div className="absolute w-4 h-4 bg-cyan-400 rounded-full animate-pulse shadow-2xl shadow-cyan-400/50" style={{
          boxShadow: '0 0 20px #00f5ff, 0 0 40px #00f5ff, 0 0 60px #00f5ff'
        }} />

        {/* Rotating Ring */}
        <div className="absolute w-64 h-64 border-2 border-purple-500/30 rounded-full animate-spin-slow" />
        <div className="absolute w-48 h-48 border border-cyan-500/30 rounded-full animate-spin-reverse" />
      </div>

      {/* Hologram Info Panel */}
      {activeGame && (
        <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm border border-cyan-500/50 rounded-lg p-4 w-64 transition-all duration-300 transform translate-x-0">
          {(() => {
            const game = games.find(g => g.id === activeGame)
            if (!game) return null
            
            return (
              <>
                <h3 className="text-lg font-bold text-cyan-400 mb-2 glitch-text" data-text={game.title}>
                  {game.title}
                </h3>
                <p className="text-gray-300 text-sm mb-3">{game.description}</p>
                <div className="flex justify-between text-sm">
                  <span className="text-green-400">👥 {game.players} players</span>
                  <span className="text-yellow-400">⭐ {game.rating}/5.0</span>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-700">
                  <span className="inline-block px-2 py-1 bg-purple-500/20 border border-purple-500/50 rounded text-xs text-purple-300">
                    {game.category}
                  </span>
                </div>
                <button className="w-full mt-3 px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg font-semibold hover:from-cyan-400 hover:to-purple-400 transition-all duration-300 transform hover:scale-105">
                  Launch Game 🚀
                </button>
              </>
            )
          })()}
        </div>
      )}

      {/* Scanning Line Effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-scan" />
      </div>
    </div>
  )
}

export default HologramEffect