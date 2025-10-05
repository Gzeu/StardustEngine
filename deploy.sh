#!/bin/bash

# StardustEngine Deployment Automation Script
# Automates the deployment of smart contracts to MultiversX

set -e

echo "🚀 StardustEngine Deployment Automation"
echo "======================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}[DEPLOY]${NC} $1"
}

# Check if Docker is running
check_docker() {
    print_header "Checking Docker status..."
    if ! docker info >/dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker Desktop first."
        exit 1
    fi
    print_status "Docker is running ✓"
}

# Check if mxpy is available
check_mxpy() {
    print_header "Checking MultiversX CLI..."
    if ! command -v mxpy >/dev/null 2>&1; then
        print_error "mxpy (MultiversX CLI) is not installed."
        print_status "Install it with: pip install multiversx-sdk-cli"
        exit 1
    fi
    print_status "mxpy is available ✓"
}

# Create wallet if it doesn't exist
create_wallet() {
    print_header "Setting up deployment wallet..."

    if [ ! -f "stardust-wallet.pem" ]; then
        print_status "Creating new wallet..."
        mxpy wallet new --format pem --outfile stardust-wallet.pem

        # Copy wallet to container location for deployment
        docker cp stardust-wallet.pem stardust-dev:/workspace/stardust-wallet.pem 2>/dev/null || true

        print_status "Wallet created successfully ✓"
    else
        print_status "Using existing wallet ✓"
    fi
}

# Get testnet funds
get_funds() {
    print_header "Requesting testnet funds..."

    # Try devnet first
    print_status "Trying devnet faucet..."
    if mxpy faucet request --pem=stardust-wallet.pem --wallet-url=https://devnet-wallet.multiversx.com --api=https://devnet-api.multiversx.com >/dev/null 2>&1; then
        print_status "Devnet funds requested ✓"
        NETWORK="devnet"
    else
        print_warning "Devnet faucet failed, trying testnet..."
        # Try testnet
        if mxpy config set proxy https://testnet-gateway.multiversx.com && \
           mxpy config set chain T && \
           mxpy faucet request --pem=stardust-wallet.pem --wallet-url=https://testnet-wallet.multiversx.com --api=https://testnet-api.multiversx.com >/dev/null 2>&1; then
            print_status "Testnet funds requested ✓"
            NETWORK="testnet"
        else
            print_error "Failed to get funds from both devnet and testnet faucets"
            print_status "You may need to request funds manually or use an existing wallet with funds"
            exit 1
        fi
    fi
}

# Wait for funds to arrive
wait_for_funds() {
    print_header "Waiting for funds to arrive..."
    print_status "This may take a few minutes..."

    local max_attempts=10
    local attempt=1

    while [ $attempt -le $max_attempts ]; do
        print_status "Checking balance (attempt $attempt/$max_attempts)..."

        if mxpy get account --address=$(mxpy wallet bech32 --pem=stardust-wallet.pem) --proxy=https://devnet-api.multiversx.com | grep -q '"balance": "0"'; then
            if [ "$NETWORK" = "testnet" ]; then
                mxpy get account --address=$(mxpy wallet bech32 --pem=stardust-wallet.pem) --proxy=https://testnet-api.multiversx.com | grep -q '"balance": "0"' || break
            fi
            print_status "Still waiting for funds..."
            sleep 30
            ((attempt++))
        else
            print_status "Funds received ✓"
            break
        fi
    done

    if [ $attempt -gt $max_attempts ]; then
        print_warning "Funds may not have arrived yet. Proceeding with deployment anyway..."
    fi
}

# Deploy contract
deploy_contract() {
    print_header "Deploying StardustEngine contract..."

    local contract_address

    if [ "$NETWORK" = "devnet" ]; then
        contract_address=$(mxpy contract deploy --bytecode=stardust-contracts/output/stardust-contracts.wasm --pem=stardust-wallet.pem --gas-limit=60000000 --proxy=https://devnet-gateway.multiversx.com --send 2>/dev/null | grep "Contract address:" | awk '{print $3}')
    else
        contract_address=$(mxpy contract deploy --bytecode=stardust-contracts/output/stardust-contracts.wasm --pem=stardust-wallet.pem --gas-limit=60000000 --proxy=https://testnet-gateway.multiversx.com --send 2>/dev/null | grep "Contract address:" | awk '{print $3}')
    fi

    if [ -n "$contract_address" ]; then
        print_status "Contract deployed successfully ✓"
        print_status "Contract Address: $contract_address"

        # Save deployment info
        echo "CONTRACT_ADDRESS=$contract_address" > deployment-info.env
        echo "NETWORK=$NETWORK" >> deployment-info.env
        echo "DEPLOYMENT_DATE=$(date)" >> deployment-info.env

        print_status "Deployment info saved to deployment-info.env"
    else
        print_error "Contract deployment failed"
        exit 1
    fi
}

# Test deployed contract
test_contract() {
    print_header "Testing deployed contract..."

    local contract_address=$(grep "CONTRACT_ADDRESS=" deployment-info.env | cut -d'=' -f2)

    if [ -n "$contract_address" ]; then
        print_status "Testing hello endpoint..."

        if [ "$NETWORK" = "devnet" ]; then
            mxpy contract call "$contract_address" --function=hello --pem=stardust-wallet.pem --gas-limit=5000000 --proxy=https://devnet-gateway.multiversx.com --send >/dev/null 2>&1
        else
            mxpy contract call "$contract_address" --function=hello --pem=stardust-wallet.pem --gas-limit=5000000 --proxy=https://testnet-gateway.multiversx.com --send >/dev/null 2>&1
        fi

        print_status "hello() endpoint tested ✓"

        print_status "Testing get_version endpoint..."

        if [ "$NETWORK" = "devnet" ]; then
            mxpy contract call "$contract_address" --function=get_version --pem=stardust-wallet.pem --gas-limit=5000000 --proxy=https://devnet-gateway.multiversx.com --send >/dev/null 2>&1
        else
            mxpy contract call "$contract_address" --function=get_version --pem=stardust-wallet.pem --gas-limit=5000000 --proxy=https://testnet-gateway.multiversx.com --send >/dev/null 2>&1
        fi

        print_status "get_version() endpoint tested ✓"

        print_status "All tests passed ✓"
    else
        print_error "No contract address found for testing"
        exit 1
    fi
}

# Main execution
main() {
    print_header "Starting StardustEngine deployment automation..."

    check_docker
    check_mxpy
    create_wallet
    get_funds
    wait_for_funds
    deploy_contract
    test_contract

    print_status "🎉 Deployment completed successfully!"
    print_status ""
    print_status "Next steps:"
    print_status "1. View contract: $(grep "CONTRACT_ADDRESS=" deployment-info.env | cut -d'=' -f2)"
    print_status "2. Add more endpoints to stardust-contracts/src/stardust_contracts.rs"
    print_status "3. Run this script again to deploy updates"
    print_status ""
    print_status "Happy coding! 🚀"
}

# Handle script arguments
case "${1:-}" in
    "deploy")
        main
        ;;
    "test")
        test_contract
        ;;
    "wallet")
        create_wallet
        ;;
    "funds")
        get_funds
        wait_for_funds
        ;;
    *)
        echo "Usage: $0 {deploy|test|wallet|funds}"
        echo ""
        echo "Commands:"
        echo "  deploy  - Full deployment process (wallet + funds + deploy + test)"
        echo "  test    - Test deployed contract"
        echo "  wallet  - Create deployment wallet only"
        echo "  funds   - Get testnet funds only"
        echo ""
        echo "Example: $0 deploy"
        exit 1
        ;;
esac
