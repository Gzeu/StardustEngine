#!/usr/bin/env python3
"""
StardustEngine API Backend
Render deployment with Vercel frontend
Author: George Pricop
"""

import os
import time
import json
from typing import Optional, List, Dict, Any
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field

# Configuration
PORT = int(os.getenv("PORT", 8000))
VERCEL_FRONTEND = os.getenv("VERCEL_FRONTEND", "https://stardustengine.vercel.app")
CONTRACT_ADDRESS = os.getenv("CONTRACT_ADDRESS", "erd1qqqqqqqqqqqqqpgq6nm64nh89se5uzl48uz63uq72xu5hwenqj0qs8n5p7u")

# Initialize FastAPI
app = FastAPI(
    title="StardustEngine API",
    description="NFT Gaming Platform API - Render Backend",
    version="2.0.1"
)

# CORS for Vercel frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        VERCEL_FRONTEND,
        "https://gzeu.github.io",
        "http://localhost:3000",
        "*"  # Temporary for setup
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(GZipMiddleware, minimum_size=1000)

# In-memory storage for MVP
players_cache = {}
assets_cache = {}

# Models
class PlayerStats(BaseModel):
    wallet_address: str
    level: int = 1
    experience: int = 0
    games_played: int = 0
    games_won: int = 0
    assets_owned: int = 0

class GameAsset(BaseModel):
    asset_id: int
    owner_address: str
    asset_type: str
    rarity: str
    name: str
    description: Optional[str] = None

class HealthResponse(BaseModel):
    status: str = "healthy"
    timestamp: float = Field(default_factory=time.time)
    service: str = "stardustengine-render"
    version: str = "2.0.1"
    frontend: str = VERCEL_FRONTEND

class MintRequest(BaseModel):
    asset_type: str
    rarity: str
    name: str
    description: Optional[str] = None

# Endpoints
@app.get("/")
async def root():
    return {
        "message": "StardustEngine API - Render Backend",
        "version": "2.0.1",
        "status": "running",
        "frontend": VERCEL_FRONTEND,
        "docs": "/docs",
        "health": "/health",
        "endpoints": {
            "player": "/api/player/{address}",
            "assets": "/api/assets/{address}", 
            "mint": "/api/mint/{address}",
            "contract": "/api/contract/info",
            "stats": "/api/stats"
        }
    }

@app.get("/health", response_model=HealthResponse)
async def health():
    return HealthResponse()

@app.get("/ping")
async def ping():
    """Keep-alive endpoint to prevent cold starts"""
    return {"pong": True, "timestamp": time.time()}

@app.get("/api/player/{address}", response_model=PlayerStats)
async def get_player(address: str):
    """Get player statistics"""
    if address in players_cache:
        return PlayerStats(**players_cache[address])
    
    # Create default player
    player_data = {
        "wallet_address": address,
        "level": 1,
        "experience": 0,
        "games_played": 0,
        "games_won": 0,
        "assets_owned": len([a for a in assets_cache.values() if a.get("owner_address") == address])
    }
    
    players_cache[address] = player_data
    return PlayerStats(**player_data)

@app.post("/api/player/{address}", response_model=PlayerStats)
async def update_player(address: str, stats: PlayerStats):
    """Update player statistics"""
    players_cache[address] = stats.dict()
    return stats

@app.get("/api/assets/{address}", response_model=List[GameAsset])
async def get_assets(address: str):
    """Get player assets"""
    user_assets = [
        GameAsset(**asset) for asset in assets_cache.values()
        if asset.get("owner_address") == address
    ]
    return user_assets

@app.post("/api/mint/{address}", response_model=GameAsset)
async def mint_asset(address: str, mint_request: MintRequest):
    """Mint new game asset"""
    asset_id = len(assets_cache) + 1
    
    asset_data = {
        "asset_id": asset_id,
        "owner_address": address,
        "asset_type": mint_request.asset_type,
        "rarity": mint_request.rarity,
        "name": mint_request.name,
        "description": mint_request.description or f"A {mint_request.rarity} {mint_request.asset_type}"
    }
    
    assets_cache[asset_id] = asset_data
    
    # Update player assets count
    if address in players_cache:
        players_cache[address]["assets_owned"] += 1
    
    return GameAsset(**asset_data)

@app.get("/api/contract/info")
async def contract_info():
    """Get contract information"""
    return {
        "contract_address": CONTRACT_ADDRESS,
        "network": "MultiversX DevNet",
        "frontend": VERCEL_FRONTEND,
        "explorer": f"https://devnet-explorer.multiversx.com/accounts/{CONTRACT_ADDRESS}",
        "gateway": "https://devnet-gateway.multiversx.com",
        "supported_assets": ["Weapon", "Character", "Skin", "Consumable"],
        "rarity_tiers": ["Common", "Rare", "Epic", "Legendary"]
    }

@app.get("/api/stats")
async def platform_stats():
    """Get platform statistics"""
    rarity_count = {}
    for asset in assets_cache.values():
        rarity = asset.get("rarity", "Unknown")
        rarity_count[rarity] = rarity_count.get(rarity, 0) + 1
    
    return {
        "total_players": len(players_cache),
        "total_assets": len(assets_cache),
        "rarity_distribution": rarity_count,
        "version": "2.0.1",
        "last_updated": time.strftime("%Y-%m-%d %H:%M:%S")
    }

# Error handlers
@app.exception_handler(404)
async def not_found_handler(request, exc):
    return JSONResponse(
        status_code=404,
        content={"detail": "Endpoint not found", "docs": "/docs"}
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=PORT)