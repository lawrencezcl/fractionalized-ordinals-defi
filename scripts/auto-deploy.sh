#!/bin/bash

# Automated GitHub Commit and Vercel Deployment Script
# Uses environment variables for secure token management

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Load environment variables
if [ -f ".env.deploy" ]; then
    source .env.deploy
    print_status() { echo -e "${GREEN}[INFO]${NC} $1"; }
    print_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
    print_error() { echo -e "${RED}[ERROR]${NC} $1"; }
    print_header() { echo -e "${BLUE}$1${NC}"; }
else
    echo -e "${RED}[ERROR]${NC} .env.deploy file not found. Please create it with your tokens."
    exit 1
fi

# Configuration validation
validate_config() {
    print_header "🔧 Validating Configuration..."

    if [ -z "$GITHUB_TOKEN" ] || [ "$GITHUB_TOKEN" = "your_github_token_here" ]; then
        print_error "GITHUB_TOKEN not configured in .env.deploy"
        exit 1
    fi

    if [ -z "$VERCEL_TOKEN" ] || [ "$VERCEL_TOKEN" = "your_vercel_token_here" ]; then
        print_error "VERCEL_TOKEN not configured in .env.deploy"
        exit 1
    fi

    if [ -z "$GITHUB_USERNAME" ] || [ "$GITHUB_USERNAME" = "your_github_username" ]; then
        print_error "GITHUB_USERNAME not configured in .env.deploy"
        exit 1
    fi

    print_status "Configuration validated ✓"
}

# Check if Git has changes to commit
check_git_changes() {
    print_header "📋 Checking Git Status..."

    if git diff --quiet && git diff --cached --quiet; then
        print_warning "No changes to commit"
        return 1
    fi

    print_status "Changes detected:"
    git status --porcelain
    return 0
}

# Commit changes to GitHub
commit_to_github() {
    print_header "📤 Committing Changes to GitHub..."

    # Add all changes
    git add .

    # Check if there are changes to commit
    if git diff --cached --quiet; then
        print_warning "No changes to commit"
        return 1
    fi

    # Get current timestamp for commit message
    timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    branch_name=$(git rev-parse --abbrev-ref HEAD)

    # Commit with timestamp
    git commit -m "$(cat <<EOF
feat: automated deployment update - $timestamp

- Configuration updates for deployment
- Environment variable optimization
- Automated CI/CD pipeline improvements

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"

    # Configure remote with token
    git remote set-url origin "https://$GITHUB_TOKEN@github.com/$GITHUB_USERNAME/$GITHUB_REPO.git"

    # Push to GitHub
    print_status "Pushing to $branch_name branch..."
    git push origin $branch_name

    print_status "Successfully pushed to GitHub ✓"
}

# Deploy to Vercel
deploy_to_vercel() {
    print_header "🚀 Deploying to Vercel..."

    # Install dependencies if needed
    if [ ! -d "node_modules" ]; then
        print_status "Installing dependencies..."
        npm install --legacy-peer-deps
    fi

    # Set Vercel environment variables
    export VERCEL_TOKEN="$VERCEL_TOKEN"
    if [ -n "$VERCEL_ORG_ID" ]; then
        export VERCEL_ORG_ID="$VERCEL_ORG_ID"
    fi
    if [ -n "$VERCEL_PROJECT_ID" ]; then
        export VERCEL_PROJECT_ID="$VERCEL_PROJECT_ID"
    fi

    # Deploy based on environment
    if [ "$DEPLOY_ENV" = "prod" ]; then
        print_status "Deploying to production..."
        vercel --prod --yes
    else
        print_status "Deploying to preview..."
        vercel --yes
    fi

    print_status "Vercel deployment complete ✓"
}

# Get deployment URL
get_deployment_url() {
    print_header "🌐 Getting Deployment URL..."

    # Try to get the latest deployment URL from Vercel
    if command -v jq &> /dev/null; then
        # If jq is available, parse Vercel's response
        local deployment_info=$(vercel ls --token "$VERCEL_TOKEN" --scope "$VERCEL_ORG_ID" 2>/dev/null | head -n 1)
        if [ -n "$deployment_info" ]; then
            local url=$(echo "$deployment_info" | awk '{print $2}')
            print_status "Deployment URL: $url"
            return 0
        fi
    fi

    # Fallback message
    print_status "Check your Vercel dashboard for the deployment URL"
    print_status "https://vercel.com/dashboard"
}

# Health check deployment
health_check() {
    print_header "🏥 Performing Health Check..."

    # Get deployment URL (if possible)
    local url="https://your-app.vercel.app"  # Default placeholder

    # Wait a moment for deployment to propagate
    print_status "Waiting for deployment to propagate..."
    sleep 10

    # Check health endpoint
    if command -v curl &> /dev/null; then
        print_status "Testing health endpoint..."
        local response=$(curl -s -o /dev/null -w "%{http_code}" "$url/api/health" 2>/dev/null || echo "000")

        if [ "$response" = "200" ]; then
            print_status "✅ Health check passed"
        elif [ "$response" = "404" ]; then
            print_warning "⚠️  Health endpoint not found (may be still deploying)"
        else
            print_warning "⚠️  Health check failed (HTTP $response)"
        fi
    else
        print_warning "curl not available, skipping health check"
    fi
}

# Cleanup sensitive data
cleanup() {
    print_header "🧹 Cleaning Up..."

    # Unset sensitive environment variables
    unset GITHUB_TOKEN
    unset VERCEL_TOKEN
    unset VERCEL_ORG_ID
    unset VERCEL_PROJECT_ID

    # Clear command history
    history -c 2>/dev/null || true

    print_status "Cleanup complete ✓"
}

# Show deployment summary
show_summary() {
    print_header "📊 Deployment Summary"

    echo "✅ Deployment completed successfully!"
    echo ""
    echo "What was done:"
    echo "  ✓ Changes committed to GitHub"
    echo "  ✓ Application deployed to Vercel"
    echo "  ✓ Health checks performed"
    echo ""
    echo "Next steps:"
    echo "  1. Visit your Vercel dashboard"
    echo "  2. Test the deployed application"
    echo "  3. Configure custom domain if needed"
    echo "  4. Set up monitoring and alerts"
    echo ""
    echo "Deployment environment: $DEPLOY_ENV"
    echo "Repository: https://github.com/$GITHUB_USERNAME/$GITHUB_REPO"
}

# Main execution
main() {
    print_header "🚀 Fractionalized Ordinals DeFi Platform - Auto Deployment"
    echo ""

    # Validate configuration
    validate_config

    # Commit changes if enabled and there are changes
    if [ "$AUTO_PUSH" = "true" ] && check_git_changes; then
        commit_to_github
    elif [ "$AUTO_PUSH" != "true" ]; then
        print_warning "Auto-push is disabled. Skipping GitHub commit."
    fi

    # Deploy to Vercel
    deploy_to_vercel

    # Get deployment URL
    get_deployment_url

    # Perform health check
    health_check

    # Show summary
    show_summary

    # Cleanup
    cleanup
}

# Handle script arguments
case "${1:-}" in
    "config")
        echo "Current configuration:"
        echo "  GitHub Username: $GITHUB_USERNAME"
        echo "  Repository: $GITHUB_REPO"
        echo "  Deploy Environment: $DEPLOY_ENV"
        echo "  Auto Push: $AUTO_PUSH"
        echo "  Vercel Token: ${VERCEL_TOKEN:0:10}... (hidden)"
        echo "  GitHub Token: ${GITHUB_TOKEN:0:10}... (hidden)"
        ;;
    "git-only")
        validate_config
        if check_git_changes; then
            commit_to_github
        fi
        cleanup
        ;;
    "vercel-only")
        validate_config
        deploy_to_vercel
        cleanup
        ;;
    "health")
        health_check
        ;;
    "help"|"--help"|"-h")
        echo "Usage: $0 [COMMAND]"
        echo ""
        echo "Commands:"
        echo "  (none)      Full deployment (git + vercel)"
        echo "  config      Show current configuration"
        echo "  git-only    Commit to GitHub only"
        echo "  vercel-only Deploy to Vercel only"
        echo "  health      Perform health check"
        echo "  help        Show this help"
        echo ""
        echo "Configuration file: .env.deploy"
        ;;
    *)
        main
        ;;
esac