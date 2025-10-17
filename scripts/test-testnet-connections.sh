#!/bin/bash

# Testnet Connection Testing Script
# This script tests real connections to Bitcoin and Starknet testnets

set -e

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
    echo -e "${BLUE}$1${NC}"
}

# Test Bitcoin testnet connection
test_bitcoin_testnet() {
    print_header "🪙 Testing Bitcoin Testnet Connection..."

    local testnet_rpc="https://blockstream.info/testnet/api"
    local block_height_url="$testnet_rpc/blocks/tip/height"

    print_status "Testing Bitcoin testnet RPC: $testnet_rpc"

    if curl -s "$block_height_url" | grep -q '^[0-9]\+$'; then
        local block_height=$(curl -s "$block_height_url")
        print_status "✅ Bitcoin testnet RPC working - Current block: $block_height"
    else
        print_error "❌ Bitcoin testnet RPC not accessible"
        return 1
    fi

    # Test mempool
    local mempool_url="$testnet_rpc/mempool"
    if curl -s "$memppool_url" | jq empty > /dev/null 2>&1; then
        print_status "✅ Bitcoin testnet mempool accessible"
        local mempool_size=$(curl -s "$memppool_url" | jq '. | length' 2>/dev/null || echo "N/A")
        print_status "Mempool size: $mempool_size transactions"
    else
        print_warning "⚠️  Bitcoin testnet mempool not accessible (JSON parsing failed)"
    fi

    return 0
}

# Test Starknet testnet connection
test_starknet_testnet() {
    print_header "⚡ Testing Starknet Testnet Connection..."

    local testnet_rpc="https://starknet-goerli.public.blastapi.io"
    local chain_id_url="$testnet_rpc"

    print_status "Testing Starknet testnet RPC: $testnet_rpc"

    # Test chain ID
    local chain_id_response=$(curl -s -X POST "$chain_id_url" \
        -H "Content-Type: application/json" \
        -d '{"jsonrpc":"2.0","method":"starknet_chainId","params":[],"id":1}' 2>/dev/null)

    if echo "$chain_id_response" | grep -q '"0x534e5f4f4e45"'; then
        print_status "✅ Starknet testnet RPC working - Chain ID: Goerli Alpha"
    else
        print_error "❌ Starknet testnet RPC not accessible"
        return 1
    fi

    # Test block number
    local block_response=$(curl -s -X POST "$testnet_rpc" \
        -H "Content-Type: application/json" \
        -d '{"jsonrpc":"2.0","method":"starknet_blockNumber","params":["latest"],"id":1}' 2>/dev/null)

    if echo "$block_response" | grep -q '"result"'; then
        local block_number=$(echo "$block_response" | jq -r '.result' 2>/dev/null)
        print_status "✅ Starknet testnet block height: $block_number"
    else
        print_warning "⚠️  Could not fetch Starknet block height"
    fi

    return 0
}

# Test Magic Eden API
test_magic_eden_api() {
    print_header "🎨 Testing Magic Eden API..."

    local api_endpoint="https://api-testnet.magiceden.dev/v2"
    local collections_url="$api_endpoint/collections/trending?limit=5"

    print_status "Testing Magic Eden testnet API: $api_endpoint"

    if curl -s "$collections_url" | grep -q '"collections"'; then
        print_status "✅ Magic Eden testnet API working"
        local collections_count=$(curl -s "$collections_url" | jq '.collections | length' 2>/dev/null || echo "N/A")
        print_status "Found $collections_count trending collections"
    else
        print_warning "⚠️  Magic Eden testnet API not accessible"
        return 1
    fi

    return 0
}

# Test Bitcoin price oracle
test_bitcoin_price_oracle() {
    print_header "💰 Testing Bitcoin Price Oracle..."

    local coingecko_url="https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd"

    print_status "Testing CoinGecko API: $coingecko_url"

    if curl -s "$coingecko_url" | grep -q '"bitcoin"'; then
        local btc_price=$(curl -s "$coingecko_url" | jq -r '.bitcoin.usd' 2>/dev/null)
        print_status "✅ Bitcoin price oracle working - Current price: $${btc_price} USD"

        local satoshi_value=$(echo "scale=8; 1 / $btc_price * 100000000" | bc 2>/dev/null || echo "N/A")
        print_status "1 Satoshi = $${satoshi_value} USD"
    else
        print_warning "⚠️  Bitcoin price oracle not accessible"
        return 1
    fi

    return 0
}

# Test Ordinals API
test_ordinals_api() {
    print_header "📜 Testing Ordinals API..."

    local ordinals_url="https://ordinals.com"

    print_status "Testing Ordinals API: $ordinals_url"

    if curl -s "$ordinals_url" | grep -q "Ordinals"; then
        print_status "✅ Ordinals API accessible"
    else
        print_warning "⚠️  Ordinals API not accessible"
        return 1
    fi

    return 0
}

# Test local development server
test_local_server() {
    print_header "🌐 Testing Local Development Server..."

    local health_url="http://localhost:3000/api/health"

    print_status "Testing local health endpoint: $health_url"

    if curl -s "$health_url" | grep -q '"status":"healthy"'; then
        print_status "✅ Local server is running and healthy"

        local network_env=$(curl -s "$health_url" | jq -r '.network' 2>/dev/null || echo "unknown")
        print_status "Network environment: $network_env"

        local version=$(curl -s "$health_url" | jq -r '.version' 2>/dev/null || echo "unknown")
        print_status "App version: $version"
    else
        print_error "❌ Local server is not running or unhealthy"
        return 1
    fi

    return 0
}

# Test testnet faucet accessibility
test_testnet_faucets() {
    print_header "💧 Testing Testnet Faucets..."

    local bitcoin_faucet="https://bitcoinfaucet.uo1.net"
    local starknet_faucet="https://faucet.sepolia.starknet.io/"

    print_status "Testing Bitcoin faucet: $bitcoin_faucet"
    if curl -s --max-time 5 "$bitcoin_faucet" | grep -q "Bitcoin"; then
        print_status "✅ Bitcoin testnet faucet accessible"
    else
        print_warning "⚠️  Bitcoin testnet faucet may be slow or unavailable"
    fi

    print_status "Testing Starknet faucet: $starknet_faucet"
    if curl -s --max-time 5 "$starknet_faucet" | grep -q "Starknet"; then
        print_status "✅ Starknet testnet faucet accessible"
    else
        print_warning "⚠️  Starknet testnet faucet may require authentication"
    fi

    return 0
}

# Main testing function
main() {
    print_header "🧪 Fractionalized Ordinals DeFi Platform - Testnet Connection Tests"
    echo ""

    print_status "Running comprehensive testnet connectivity tests..."
    echo ""

    local tests=(
        "Bitcoin Testnet"
        "Starknet Testnet"
        "Magic Eden API"
        "Bitcoin Price Oracle"
        "Ordinals API"
        "Local Server"
        "Testnet Faucets"
    )

    local failed_tests=0
    local total_tests=${#tests[@]}

    for test in "${tests[@]}"; do
        echo ""
        case "$test" in
            "Bitcoin Testnet")
                test_bitcoin_testnet || ((failed_tests++))
                ;;
            "Starknet Testnet")
                test_starknet_testnet || ((failed_tests++))
                ;;
            "Magic Eden API")
                test_magic_eden_api || ((failed_tests++))
                ;;
            "Bitcoin Price Oracle")
                test_bitcoin_price_oracle || ((failed_tests++))
                ;;
            "Ordinals API")
                test_ordinals_api || ((failed_tests++))
                ;;
            "Local Server")
                test_local_server || ((failed_tests++))
                ;;
            "Testnet Faucets")
                test_testnet_faucets || ((failed_tests++))
                ;;
        esac
    done

    echo ""
    print_header "📊 Test Results Summary"
    echo ""

    if [ $failed_tests -eq 0 ]; then
        print_status "🎉 ALL TESTS PASSED!"
        print_status "✅ Your testnet environment is fully functional"
        print_status "✅ Ready for real testnet transactions"
    else
        print_error "❌ $failed_tests out of $total_tests tests failed"
        print_warning "⚠️  Some testnet services may be unavailable"
        print_status "You can still test with mock data enabled"
    fi

    echo ""
    print_status "Next steps:"
    if [ $failed_tests -eq 0 ]; then
        echo "1. Test vault creation with real testnet Ordinals"
        echo "2. Try fractional share minting"
        echo "3. Test DeFi operations (Vesu/Ekubo)"
        echo "4. Verify transactions in testnet explorers"
    else
        echo "1. Check network connectivity"
        echo "2. Verify testnet RPC endpoints"
        echo "3. Try enabling mock data for testing"
        echo "4. Check testnet faucet availability"
    fi
}

# Show help
show_help() {
    print_header "Testnet Connection Testing Script"
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  (none)      Run all tests"
    echo "  bitcoin     Test Bitcoin testnet connection"
    echo "  starknet    Test Starknet testnet connection"
    echo "  magiceden   Test Magic Eden API"
    echo  " price       Test price oracles"
    echo  " ordinals    Test Ordinals API"
    echo "  server      Test local server"
    echo "  faucets     Test testnet faucets"
    echo "  help        Show this help message"
    echo ""
    echo "Environment:"
    echo "  Ensure testnet environment is configured"
    echo "  Local server should be running on port 3000"
    echo "  Internet connection required for external APIs"
}

# Command line interface
case "${1:-}" in
    "bitcoin")
        test_bitcoin_testnet
        ;;
    "starknet")
        test_starknet_testnet
        ;;
    "magiceden")
        test_magic_eden_api
        ;;
    "price")
        test_bitcoin_price_oracle
        ;;
    "ordinals")
        test_ordinals_api
        ;;
    "server")
        test_local_server
        ;;
    "faucets")
        test_testnet_faucets
        ;;
    "help"|"--help"|"-h")
        show_help
        ;;
    *)
        main
        ;;
esac