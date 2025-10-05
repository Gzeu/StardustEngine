from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import httpx
import json
import os
from typing import Optional

app = FastAPI(
    title="StardustEngine API",
    description="Gaming Infrastructure API for MultiversX Smart Contracts",
    version="1.0.0"
)

# CORS middleware pentru frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configurare MultiversX
MULTIVERSX_PROXY = "https://devnet-api.multiversx.com"
CONTRACT_ADDRESS = "erd1qqqqqqqqqqqqqpgqfm0kd3wse7ddgtf4haplm3p5mdl90msp634qxrfmt3"

class ContractCall(BaseModel):
    function: str
    args: Optional[list] = []

@app.get("/")
async def root():
    return {
        "message": "StardustEngine API is running!",
        "version": "1.0.0",
        "contract_address": CONTRACT_ADDRESS,
        "network": "devnet"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": "2024-01-01T00:00:00Z"}

@app.get("/contract/info")
async def contract_info():
    """Obține informații despre contractul deployat"""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{MULTIVERSX_PROXY}/accounts/{CONTRACT_ADDRESS}")
            if response.status_code == 200:
                return response.json()
            else:
                raise HTTPException(status_code=404, detail="Contract not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching contract info: {str(e)}")

@app.post("/contract/call")
async def call_contract(call: ContractCall):
    """Apel funcție de contract"""
    try:
        # Într-o implementare reală, aici ai apela contractul prin mxpy
        # Pentru demo, returnăm un răspuns mock

        mock_responses = {
            "hello": "Hello from StardustEngine!",
            "get_version": "v1.0.0"
        }

        result = mock_responses.get(call.function, "Function not implemented")

        return {
            "success": True,
            "function": call.function,
            "result": result,
            "transaction_hash": "mock_tx_hash_123"
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error calling contract: {str(e)}")

@app.get("/contract/endpoints")
async def contract_endpoints():
    """Lista endpoint-uri disponibile în contract"""
    return {
        "endpoints": [
            {
                "name": "hello",
                "description": "Returns a welcome message",
                "type": "view"
            },
            {
                "name": "get_version",
                "description": "Returns contract version",
                "type": "view"
            }
        ]
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
