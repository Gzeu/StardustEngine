#!/bin/bash

# StardustEngine - MultiversX Development Environment
# Quick setup script for Docker-based development

set -e

echo "🌟 StardustEngine - MultiversX Development Setup"
echo "================================================"

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
    echo -e "${BLUE}[SETUP]${NC} $1"
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

# Create project directories
setup_directories() {
    print_header "Setting up project structure..."
    
    directories=(
        "contracts"
        "contracts/game-assets"
        "contracts/marketplace"
        "contracts/tournaments"
        "contracts/guilds"
        "sdk"
        "api"
        "frontend"
        "docs"
        "scripts"
        "tests"
    )
    
    for dir in "${directories[@]}"; do
        if [ ! -d "$dir" ]; then
            mkdir -p "$dir"
            print_status "Created directory: $dir"
        fi
    done
}

# Start MultiversX development container
start_container() {
    print_header "Starting MultiversX development container..."
    
    CONTAINER_NAME="stardust-dev"
    WORKSPACE_PATH="$(pwd)"
    
    # Stop existing container if running
    if [ "$(docker ps -q -f name=$CONTAINER_NAME)" ]; then
        print_warning "Stopping existing container..."
        docker stop $CONTAINER_NAME
    fi
    
    # Remove existing container if exists
    if [ "$(docker ps -aq -f name=$CONTAINER_NAME)" ]; then
        docker rm $CONTAINER_NAME
    fi
    
    print_status "Starting new development container..."
    
    docker run -it --rm \
        --name $CONTAINER_NAME \
        -v "$WORKSPACE_PATH:/workspace" \
        -w /workspace \
        -p 8080:8080 \
        -p 3000:3000 \
        -p 8000:8000 \
        multiversx/devcontainer-smart-contracts-rust:latest bash
}

# Create initial smart contract
create_initial_contract() {
    print_header "Would you like to create an initial smart contract? (y/n)"
    read -r response
    
    if [[ "$response" =~ ^[Yy]$ ]]; then
        print_status "Creating initial game-assets contract..."
        
        # This will be executed inside the container
        cat > contracts/setup-contracts.sh << 'EOF'
#!/bin/bash

echo "🎮 Setting up StardustEngine smart contracts..."

# Create game-assets contract
cd /workspace/contracts/game-assets
sc-meta new --template empty game-assets-contract

# Create marketplace contract  
cd /workspace/contracts/marketplace
sc-meta new --template empty marketplace-contract

# Create tournaments contract
cd /workspace/contracts/tournaments
sc-meta new --template empty tournaments-contract

# Create guilds contract
cd /workspace/contracts/guilds
sc-meta new --template empty guilds-contract

echo "✅ Smart contracts structure created!"
echo "📁 Check the contracts/ directory for your new contracts"
EOF
        
        chmod +x contracts/setup-contracts.sh
        print_status "Contract setup script created at contracts/setup-contracts.sh"
        print_status "Run this script inside the Docker container to create initial contracts"
    fi
}

# Main execution
main() {
    print_header "Starting StardustEngine development setup..."
    
    check_docker
    setup_directories
    create_initial_contract
    
    print_status "Setup complete! 🚀"
    print_status "Run the following command to start development:"
    echo -e "${BLUE}./docker-dev.sh${NC}"
    echo ""
    print_status "Inside the container, run:"
    echo -e "${BLUE}./contracts/setup-contracts.sh${NC} (to create initial contracts)"
    echo -e "${BLUE}mxpy localnet setup${NC} (to setup local testnet)"
    echo -e "${BLUE}mxpy localnet start${NC} (to start local testnet)"
    echo ""
    
    start_container
}

# Handle script arguments
case "${1:-}" in
    "start")
        check_docker
        start_container
        ;;
    "setup")
        check_docker
        setup_directories
        create_initial_contract
        ;;
    *)
        main
        ;;
esac