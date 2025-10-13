'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FixedSizeGrid as Grid } from 'react-window';
import { NFTViewer3D } from './NFTViewer3D';
import { MagnifyingGlassIcon, FunnelIcon, Squares2X2Icon, ListBulletIcon } from '@heroicons/react/24/outline';

interface NFTAsset {
  id: string;
  name: string;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  type: 'Weapon' | 'Character' | 'Skin' | 'Consumable' | 'Vehicle' | 'Structure';
  level: number;
  description: string;
  price?: number;
  owner?: string;
}

interface NFTGalleryProps {
  assets: NFTAsset[];
  loading?: boolean;
  onAssetSelect?: (asset: NFTAsset) => void;
  showPrices?: boolean;
  allowFiltering?: boolean;
}

type ViewMode = 'grid' | 'list';
type SortBy = 'name' | 'rarity' | 'level' | 'price';
type FilterBy = 'all' | 'Weapon' | 'Character' | 'Skin' | 'Consumable' | 'Vehicle' | 'Structure';

const RARITY_ORDER = { 'Common': 1, 'Rare': 2, 'Epic': 3, 'Legendary': 4 };

// Grid item component for virtualization
function GridItem({ 
  columnIndex, 
  rowIndex, 
  style, 
  data 
}: {
  columnIndex: number;
  rowIndex: number;
  style: React.CSSProperties;
  data: { assets: NFTAsset[]; columnCount: number; onSelect?: (asset: NFTAsset) => void; showPrices?: boolean; }
}) {
  const { assets, columnCount, onSelect, showPrices } = data;
  const index = rowIndex * columnCount + columnIndex;
  const asset = assets[index];
  
  if (!asset) return null;

  return (
    <div style={style} className="p-2">
      <motion.div
        className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden hover:border-gray-500 transition-all cursor-pointer"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onSelect?.(asset)}
        layout
      >
        <div className="aspect-square">
          <NFTViewer3D 
            asset={asset} 
            size="sm" 
            interactive={false}
          />
        </div>
        
        <div className="p-3">
          <h3 className="text-white font-semibold text-sm truncate">{asset.name}</h3>
          <p className="text-gray-400 text-xs">{asset.type} • Level {asset.level}</p>
          {showPrices && asset.price && (
            <p className="text-blue-400 font-bold text-sm mt-1">{asset.price} EGLD</p>
          )}
        </div>
      </motion.div>
    </div>
  );
}

// List item component
function ListItem({ 
  asset, 
  onSelect, 
  showPrices 
}: { 
  asset: NFTAsset; 
  onSelect?: (asset: NFTAsset) => void;
  showPrices?: boolean;
}) {
  return (
    <motion.div
      className="bg-gray-800/30 backdrop-blur-sm rounded-lg border border-gray-700 p-4 hover:border-gray-500 transition-all cursor-pointer"
      whileHover={{ scale: 1.01 }}
      onClick={() => onSelect?.(asset)}
      layout
    >
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 flex-shrink-0">
          <NFTViewer3D 
            asset={asset} 
            size="sm" 
            interactive={false}
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-semibold truncate">{asset.name}</h3>
          <p className="text-gray-400 text-sm">{asset.type} • {asset.rarity}</p>
          <p className="text-gray-500 text-xs truncate">{asset.description}</p>
        </div>
        
        <div className="text-right">
          <p className="text-gray-400 text-sm">Level {asset.level}</p>
          {showPrices && asset.price && (
            <p className="text-blue-400 font-bold">{asset.price} EGLD</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export function NFTGallery({
  assets,
  loading = false,
  onAssetSelect,
  showPrices = false,
  allowFiltering = true
}: NFTGalleryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState<FilterBy>('all');
  const [sortBy, setSortBy] = useState<SortBy>('name');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [showFilters, setShowFilters] = useState(false);

  // Filtered and sorted assets
  const filteredAssets = useMemo(() => {
    let filtered = assets;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(asset =>
        asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply type filter
    if (filterBy !== 'all') {
      filtered = filtered.filter(asset => asset.type === filterBy);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'rarity':
          return RARITY_ORDER[b.rarity] - RARITY_ORDER[a.rarity];
        case 'level':
          return b.level - a.level;
        case 'price':
          return (b.price || 0) - (a.price || 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [assets, searchTerm, filterBy, sortBy]);

  const columnCount = viewMode === 'grid' ? 4 : 1;
  const rowCount = Math.ceil(filteredAssets.length / columnCount);
  const itemHeight = viewMode === 'grid' ? 280 : 100;

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-12 bg-gray-700 rounded-lg mb-4"></div>
          <div className="grid grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-square bg-gray-700 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with search and controls */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">NFT Collection</h2>
          
          <div className="flex items-center space-x-2">
            {/* View mode toggle */}
            <div className="bg-gray-800 rounded-lg p-1 flex">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                <Squares2X2Icon className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                <ListBulletIcon className="w-4 h-4" />
              </button>
            </div>
            
            {allowFiltering && (
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="bg-gray-800 hover:bg-gray-700 text-white p-2 rounded-lg transition-colors"
              >
                <FunnelIcon className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Search bar */}
        <div className="relative">
          <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search assets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Filters */}
        <AnimatePresence>
          {allowFiltering && showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Filter by Type</label>
                  <select
                    value={filterBy}
                    onChange={(e) => setFilterBy(e.target.value as FilterBy)}
                    className="w-full bg-gray-700 border border-gray-600 rounded text-white p-2"
                  >
                    <option value="all">All Types</option>
                    <option value="Weapon">Weapons</option>
                    <option value="Character">Characters</option>
                    <option value="Skin">Skins</option>
                    <option value="Consumable">Consumables</option>
                    <option value="Vehicle">Vehicles</option>
                    <option value="Structure">Structures</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Sort by</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortBy)}
                    className="w-full bg-gray-700 border border-gray-600 rounded text-white p-2"
                  >
                    <option value="name">Name</option>
                    <option value="rarity">Rarity</option>
                    <option value="level">Level</option>
                    {showPrices && <option value="price">Price</option>}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Results</label>
                  <p className="text-white p-2">{filteredAssets.length} assets found</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Assets display */}
      {filteredAssets.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">No assets found matching your criteria</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="h-[600px]">
          <Grid
            columnCount={columnCount}
            rowCount={rowCount}
            columnWidth={280}
            rowHeight={itemHeight}
            height={600}
            width={1120}
            itemData={{ 
              assets: filteredAssets, 
              columnCount, 
              onSelect: onAssetSelect, 
              showPrices 
            }}
          >
            {GridItem}
          </Grid>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredAssets.map((asset) => (
            <ListItem
              key={asset.id}
              asset={asset}
              onSelect={onAssetSelect}
              showPrices={showPrices}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default NFTGallery;