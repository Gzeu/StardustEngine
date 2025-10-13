'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrophyIcon, 
  UserIcon, 
  ClockIcon,
  FireIcon,
  StarIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

interface Player {
  id: string;
  name: string;
  avatar?: string;
  level: number;
  rank: string;
  winRate: number;
}

interface Match {
  id: string;
  player1: Player | null;
  player2: Player | null;
  winner: Player | null;
  score?: string;
  status: 'pending' | 'active' | 'completed';
  round: number;
  position: number;
  scheduledTime?: number;
}

interface TournamentData {
  id: string;
  name: string;
  status: 'upcoming' | 'active' | 'completed';
  participants: Player[];
  matches: Match[];
  prizePool: number;
  entryFee: number;
  startTime: number;
  currentRound: number;
  totalRounds: number;
}

interface TournamentBracketProps {
  tournament: TournamentData;
  onMatchSelect?: (match: Match) => void;
  interactive?: boolean;
}

// Generate bracket structure from participants
function generateBracket(participants: Player[]): Match[] {
  const matches: Match[] = [];
  let matchId = 1;
  
  // Calculate number of rounds needed
  const totalRounds = Math.ceil(Math.log2(participants.length));
  
  // Generate first round matches
  const firstRoundMatches = participants.length / 2;
  for (let i = 0; i < firstRoundMatches; i++) {
    matches.push({
      id: `match-${matchId++}`,
      player1: participants[i * 2] || null,
      player2: participants[i * 2 + 1] || null,
      winner: null,
      status: 'pending',
      round: 1,
      position: i + 1
    });
  }
  
  // Generate subsequent rounds
  let currentRoundMatches = firstRoundMatches;
  for (let round = 2; round <= totalRounds; round++) {
    currentRoundMatches = Math.floor(currentRoundMatches / 2);
    for (let i = 0; i < currentRoundMatches; i++) {
      matches.push({
        id: `match-${matchId++}`,
        player1: null,
        player2: null,
        winner: null,
        status: 'pending',
        round,
        position: i + 1
      });
    }
  }
  
  return matches;
}

// Player card component
function PlayerCard({ 
  player, 
  isWinner, 
  size = 'md' 
}: { 
  player: Player | null; 
  isWinner?: boolean;
  size?: 'sm' | 'md';
}) {
  if (!player) {
    return (
      <div className={`
        bg-gray-800/50 border-2 border-dashed border-gray-600 rounded-lg 
        flex items-center justify-center text-gray-500 text-sm
        ${size === 'sm' ? 'h-12 px-2' : 'h-16 px-4'}
      `}>
        TBD
      </div>
    );
  }
  
  return (
    <motion.div
      className={`
        bg-gradient-to-r from-gray-800 to-gray-700 border-2 rounded-lg transition-all
        flex items-center space-x-2 cursor-pointer hover:from-gray-700 hover:to-gray-600
        ${size === 'sm' ? 'h-12 px-2' : 'h-16 px-4'}
        ${isWinner 
          ? 'border-yellow-400 shadow-lg shadow-yellow-400/20' 
          : 'border-gray-600'
        }
      `}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
    >
      {/* Avatar */}
      <div className={`
        bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center font-bold text-white
        ${size === 'sm' ? 'w-8 h-8 text-xs' : 'w-10 h-10 text-sm'}
      `}>
        {player.avatar || player.name.charAt(0).toUpperCase()}
      </div>
      
      {/* Player info */}
      <div className="flex-1 min-w-0">
        <p className={`text-white font-semibold truncate ${
          size === 'sm' ? 'text-xs' : 'text-sm'
        }`}>
          {player.name}
        </p>
        {size === 'md' && (
          <p className="text-gray-400 text-xs">
            Lv.{player.level} • {player.winRate}% WR
          </p>
        )}
      </div>
      
      {/* Winner indicator */}
      {isWinner && (
        <TrophyIcon className="w-4 h-4 text-yellow-400" />
      )}
    </motion.div>
  );
}

// Match component
function MatchCard({ 
  match, 
  onSelect,
  interactive = true 
}: { 
  match: Match;
  onSelect?: (match: Match) => void;
  interactive?: boolean;
}) {
  const getStatusColor = () => {
    switch (match.status) {
      case 'active': return 'border-green-400 bg-green-400/10';
      case 'completed': return 'border-blue-400 bg-blue-400/10';
      default: return 'border-gray-600 bg-gray-800/30';
    }
  };
  
  return (
    <motion.div
      className={`
        backdrop-blur-sm rounded-xl p-4 border-2 transition-all
        ${getStatusColor()}
        ${interactive ? 'cursor-pointer hover:scale-105' : ''}
      `}
      onClick={() => interactive && onSelect?.(match)}
      whileHover={interactive ? { scale: 1.02 } : {}}
      layout
    >
      {/* Match header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${
            match.status === 'active' ? 'bg-green-400 animate-pulse' :
            match.status === 'completed' ? 'bg-blue-400' : 'bg-gray-500'
          }`} />
          <span className="text-xs text-gray-400 font-medium">
            Round {match.round}
          </span>
        </div>
        
        {match.status === 'active' && (
          <div className="flex items-center space-x-1 text-green-400">
            <FireIcon className="w-3 h-3" />
            <span className="text-xs font-medium">LIVE</span>
          </div>
        )}
        
        {match.score && (
          <span className="text-xs font-bold text-white">{match.score}</span>
        )}
      </div>
      
      {/* Players */}
      <div className="space-y-2">
        <PlayerCard 
          player={match.player1}
          isWinner={match.winner?.id === match.player1?.id}
          size="sm"
        />
        <div className="flex justify-center">
          <div className="text-gray-500 text-sm font-bold">VS</div>
        </div>
        <PlayerCard 
          player={match.player2}
          isWinner={match.winner?.id === match.player2?.id}
          size="sm"
        />
      </div>
      
      {/* Match time */}
      {match.scheduledTime && (
        <div className="flex items-center justify-center mt-3 text-gray-400">
          <ClockIcon className="w-3 h-3 mr-1" />
          <span className="text-xs">
            {new Date(match.scheduledTime).toLocaleTimeString()}
          </span>
        </div>
      )}
    </motion.div>
  );
}

// Round component
function RoundColumn({ 
  round, 
  matches, 
  onMatchSelect,
  interactive 
}: {
  round: number;
  matches: Match[];
  onMatchSelect?: (match: Match) => void;
  interactive?: boolean;
}) {
  const roundMatches = matches.filter(m => m.round === round);
  
  return (
    <div className="flex flex-col space-y-4">
      {/* Round header */}
      <div className="text-center">
        <h3 className="text-lg font-bold text-white mb-1">
          {round === matches.reduce((max, m) => Math.max(max, m.round), 0) 
            ? 'Final' 
            : `Round ${round}`
          }
        </h3>
        <div className="h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent rounded" />
      </div>
      
      {/* Matches */}
      <div className="space-y-6">
        {roundMatches.map((match) => (
          <MatchCard
            key={match.id}
            match={match}
            onSelect={onMatchSelect}
            interactive={interactive}
          />
        ))}
      </div>
    </div>
  );
}

export function TournamentBracket({
  tournament,
  onMatchSelect,
  interactive = true
}: TournamentBracketProps) {
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  
  const bracketMatches = useMemo(() => {
    return tournament.matches.length > 0 
      ? tournament.matches 
      : generateBracket(tournament.participants);
  }, [tournament.matches, tournament.participants]);
  
  const rounds = useMemo(() => {
    const maxRound = bracketMatches.reduce((max, match) => Math.max(max, match.round), 0);
    return Array.from({ length: maxRound }, (_, i) => i + 1);
  }, [bracketMatches]);
  
  const handleMatchSelect = (match: Match) => {
    setSelectedMatch(match);
    onMatchSelect?.(match);
  };
  
  return (
    <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6">
      {/* Tournament header */}
      <motion.div
        className="mb-8 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-3xl font-bold text-white mb-2">{tournament.name}</h2>
        <div className="flex items-center justify-center space-x-6 text-sm text-gray-400">
          <div className="flex items-center space-x-1">
            <TrophyIcon className="w-4 h-4" />
            <span>{tournament.prizePool} EGLD Prize Pool</span>
          </div>
          <div className="flex items-center space-x-1">
            <UserIcon className="w-4 h-4" />
            <span>{tournament.participants.length} Players</span>
          </div>
          <div className="flex items-center space-x-1">
            <StarIcon className="w-4 h-4" />
            <span>Round {tournament.currentRound} of {tournament.totalRounds}</span>
          </div>
        </div>
      </motion.div>
      
      {/* Bracket grid */}
      <div className="overflow-x-auto">
        <div className="flex space-x-8 min-w-max pb-4">
          {rounds.map((round, index) => (
            <React.Fragment key={round}>
              <RoundColumn
                round={round}
                matches={bracketMatches}
                onMatchSelect={handleMatchSelect}
                interactive={interactive}
              />
              
              {/* Connector lines */}
              {index < rounds.length - 1 && (
                <div className="flex items-center">
                  <ChevronRightIcon className="w-6 h-6 text-gray-600" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
      
      {/* Selected match details */}
      <AnimatePresence>
        {selectedMatch && (
          <motion.div
            className="mt-8 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <h3 className="text-xl font-bold text-white mb-4">Match Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-gray-400 font-medium mb-2">Players</h4>
                {selectedMatch.player1 && (
                  <PlayerCard 
                    player={selectedMatch.player1}
                    isWinner={selectedMatch.winner?.id === selectedMatch.player1.id}
                  />
                )}
                <div className="text-center py-2 text-gray-500">vs</div>
                {selectedMatch.player2 && (
                  <PlayerCard 
                    player={selectedMatch.player2}
                    isWinner={selectedMatch.winner?.id === selectedMatch.player2.id}
                  />
                )}
              </div>
              
              <div>
                <h4 className="text-gray-400 font-medium mb-2">Match Info</h4>
                <div className="space-y-2">
                  <p className="text-white">
                    <span className="text-gray-400">Round:</span> {selectedMatch.round}
                  </p>
                  <p className="text-white">
                    <span className="text-gray-400">Status:</span> 
                    <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
                      selectedMatch.status === 'active' ? 'bg-green-500/20 text-green-400' :
                      selectedMatch.status === 'completed' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {selectedMatch.status.toUpperCase()}
                    </span>
                  </p>
                  {selectedMatch.score && (
                    <p className="text-white">
                      <span className="text-gray-400">Score:</span> {selectedMatch.score}
                    </p>
                  )}
                  {selectedMatch.scheduledTime && (
                    <p className="text-white">
                      <span className="text-gray-400">Scheduled:</span> 
                      {new Date(selectedMatch.scheduledTime).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default TournamentBracket;