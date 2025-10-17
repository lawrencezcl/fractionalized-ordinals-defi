#!/bin/bash

# Vercel Deployment Script for Fractionalized Ordinals DeFi Platform
# This script handles secure deployment to Vercel using environment variables

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

# Check dependencies
check_dependencies() {
    print_header "🔧 Checking Dependencies..."

    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed"
        exit 1
    fi

    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed"
        exit 1
    fi

    if ! command -v vercel &> /dev/null; then
        print_status "Installing Vercel CLI..."
        npm install -g vercel
    fi

    print_status "Dependencies ✓"
}

# Check environment variables
check_env_vars() {
    print_header "📋 Checking Environment Variables..."

    if [ -z "$VERCEL_TOKEN" ]; then
        print_error "VERCEL_TOKEN environment variable is not set"
        print_status "Please set your Vercel token: export VERCEL_TOKEN=your_token"
        exit 1
    fi

    if [ -z "$GITHUB_TOKEN" ]; then
        print_warning "GITHUB_TOKEN not set. Automatic commits to GitHub will be skipped"
    fi

    print_status "Environment variables checked ✓"
}

# Prepare for deployment
prepare_deployment() {
    print_header "📦 Preparing Deployment..."

    # Install dependencies
    print_status "Installing dependencies..."
    npm install --legacy-peer-deps

    # Build application
    print_status "Building application..."
    npm run build

    print_status "Deployment preparation complete ✓"
}

# Deploy to Vercel
deploy_to_vercel() {
    print_header "🚀 Deploying to Vercel..."

    # Set environment variables for Vercel
    export VERCEL_ORG_ID="$VERCEL_ORG_ID"
    export VERCEL_PROJECT_ID="$VERCEL_PROJECT_ID"

    # Deploy using Vercel CLI
    if [ "$1" = "prod" ]; then
        print_status "Deploying to production..."
        vercel --prod --token "$VERCEL_TOKEN"
    else
        print_status "Deploying to preview..."
        vercel --token "$VERCEL_TOKEN"
    fi

    print_status "Deployment complete ✓"
}

# Push to GitHub (optional)
push_to_github() {
    print_header "📤 Pushing to GitHub..."

    if [ -n "$GITHUB_TOKEN" ]; then
        # Configure Git with token
        git remote set-url origin "https://$GITHUB_TOKEN@github.com/$(git config --get remote.origin.url | sed 's/.*github.com\///')"

        # Push changes
        git push origin main

        print_status "Changes pushed to GitHub ✓"
    else
        print_warning "Skipping GitHub push (no token provided)"
    fi
}

# Cleanup
cleanup() {
    print_header "🧹 Cleaning Up..."

    # Remove sensitive environment variables from current session
    unset VERCEL_TOKEN
    unset GITHUB_TOKEN

    print_status "Cleanup complete ✓"
}

# Show deployment info
show_deployment_info() {
    print_header "📊 Deployment Information"

    echo "Deployment completed successfully!"
    echo ""
    echo "Next steps:"
    echo "1. Visit your Vercel dashboard to monitor deployment"
    echo "2. Configure custom domain in Vercel settings"
    echo "3. Set up environment variables in Vercel dashboard"
    echo "4. Test the deployed application"
    echo ""
    echo "Environment variables to configure in Vercel:"
    echo "- NEXT_PUBLIC_NETWORK_ENV"
    echo "- BITCOIN_NETWORK"
    echo "- STARKNET_NETWORK"
    echo "- NEXT_PUBLIC_API_URL"
    echo "- NEXT_PUBLIC_RPC_URL"
}

# Show help
show_help() {
    print_header "Fractionalized Ordinals DeFi Platform - Vercel Deployment"
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  preview     Deploy to preview environment"
    echo "  prod        Deploy to production"
    echo "  help        Show this help message"
    echo ""
    echo "Required Environment Variables:"
    echo "  VERCEL_TOKEN    Your Vercel API token"
    echo "  GITHUB_TOKEN    Your GitHub personal access token (optional)"
    echo ""
    echo "Optional Environment Variables:"
    echo "  VERCEL_ORG_ID   Your Vercel organization ID"
    echo "  VERCEL_PROJECT_ID  Your Vercel project ID"
    echo ""
    echo "Example:"
    echo "  export VERCEL_TOKEN=your_vercel_token"
    echo "  export GITHUB_TOKEN=your_github_token"
    echo "  $0 prod"
}

# Main execution
main() {
    print_header "Fractionalized Ordinals DeFi Platform - Vercel Deployment"
    echo ""

    case "${1:-preview}" in
        "preview")
            check_dependencies
            check_env_vars
            prepare_deployment
            push_to_github
            deploy_to_vercel "preview"
            show_deployment_info
            cleanup
            ;;
        "prod")
            check_dependencies
            check_env_vars
            prepare_deployment
            push_to_github
            deploy_to_vercel "prod"
            show_deployment_info
            cleanup
            ;;
        "help"|"--help"|"-h")
            show_help
            ;;
        *)
            print_error "Unknown command: $1"
            echo ""
            show_help
            exit 1
            ;;
    esac
}

# Execute main function
main "$@"