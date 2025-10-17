#!/bin/bash

# Server Management Script for Fractionalized Ordinals DeFi Platform
# This script provides comprehensive server management capabilities

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
APP_NAME="fractionalized-ordinals-defi"
APP_DIR="/root/fractionalized-ordinals-defi"
LOG_DIR="$APP_DIR/logs"
PID_FILE="$APP_DIR/server.pid"
ENV_FILE="$APP_DIR/.env.local"

# Default values
DEFAULT_PORT="3000"
DEFAULT_HOST="0.0.0.0"

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

# Check if server is running
is_server_running() {
    if [ -f "$PID_FILE" ]; then
        local pid=$(cat "$PID_FILE")
        if ps -p "$pid" > /dev/null 2>&1; then
            return 0
        else
            rm -f "$PID_FILE"
            return 1
        fi
    fi
    return 1
}

# Start development server
start_dev_server() {
    print_header "🚀 Starting Development Server..."

    cd "$APP_DIR"

    # Ensure environment file exists
    if [ ! -f "$ENV_FILE" ]; then
        print_warning "Environment file not found. Creating from testnet template..."
        cp .env.testnet "$ENV_FILE"
    fi

    # Create logs directory
    mkdir -p "$LOG_DIR"

    # Start server with IPv4 binding
    if [ "$1" = "testnet" ]; then
        print_status "Starting testnet development server on $DEFAULT_HOST:$DEFAULT_PORT..."
        nohup npm run dev:testnet:ipv4 > "$LOG_DIR/dev-server.log" 2>&1 &
    else
        print_status "Starting development server on $DEFAULT_HOST:$DEFAULT_PORT..."
        nohup npm run dev:ipv4 > "$LOG_DIR/dev-server.log" 2>&1 &
    fi

    # Save PID
    echo $! > "$PID_FILE"

    print_status "Development server started successfully!"
    print_status "Access the application at: http://$DEFAULT_HOST:$DEFAULT_PORT"
    print_status "Log file: $LOG_DIR/dev-server.log"
}

# Start production server
start_prod_server() {
    print_header "🏭 Starting Production Server..."

    cd "$APP_DIR"

    # Build application
    print_status "Building application for production..."
    npm run build:prod

    # Create logs directory
    mkdir -p "$LOG_DIR"

    # Start production server
    if [ "$1" = "testnet" ]; then
        print_status "Starting testnet production server on $DEFAULT_HOST:$DEFAULT_PORT..."
        nohup npm run server:testnet > "$LOG_DIR/prod-server.log" 2>&1 &
    else
        print_status "Starting production server on $DEFAULT_HOST:$DEFAULT_PORT..."
        nohup npm run server:prod > "$LOG_DIR/prod-server.log" 2>&1 &
    fi

    # Save PID
    echo $! > "$PID_FILE"

    print_status "Production server started successfully!"
    print_status "Access the application at: http://$DEFAULT_HOST:$DEFAULT_PORT"
    print_status "Log file: $LOG_DIR/prod-server.log"
}

# Stop server
stop_server() {
    print_header "🛑 Stopping Server..."

    if is_server_running; then
        local pid=$(cat "$PID_FILE")
        print_status "Stopping server process (PID: $pid)..."
        kill "$pid"

        # Wait for process to stop
        local count=0
        while ps -p "$pid" > /dev/null 2>&1 && [ $count -lt 10 ]; do
            sleep 1
            count=$((count + 1))
        done

        if ps -p "$pid" > /dev/null 2>&1; then
            print_warning "Server didn't stop gracefully, forcing termination..."
            kill -9 "$pid"
        fi

        rm -f "$PID_FILE"
        print_status "Server stopped successfully!"
    else
        print_warning "Server is not running"
    fi
}

# Restart server
restart_server() {
    print_header "🔄 Restarting Server..."

    stop_server
    sleep 2

    if [ "$1" = "prod" ]; then
        start_prod_server "$2"
    else
        start_dev_server "$2"
    fi
}

# Show server status
show_status() {
    print_header "📊 Server Status"

    if is_server_running; then
        local pid=$(cat "$PID_FILE")
        print_status "Server is running (PID: $pid)"

        # Show process details
        ps -p "$pid" -o pid,ppid,cmd,etime

        # Show network connections
        print_status "Network connections:"
        netstat -tlnp 2>/dev/null | grep ":$DEFAULT_PORT" || ss -tlnp 2>/dev/null | grep ":$DEFAULT_PORT"

        # Show recent logs
        if [ -f "$LOG_DIR/dev-server.log" ]; then
            print_status "Recent development logs:"
            tail -10 "$LOG_DIR/dev-server.log"
        elif [ -f "$LOG_DIR/prod-server.log" ]; then
            print_status "Recent production logs:"
            tail -10 "$LOG_DIR/prod-server.log"
        fi
    else
        print_warning "Server is not running"
    fi
}

# Show server logs
show_logs() {
    print_header "📋 Server Logs"

    local log_file=""

    if [ "$1" = "prod" ] && [ -f "$LOG_DIR/prod-server.log" ]; then
        log_file="$LOG_DIR/prod-server.log"
    elif [ -f "$LOG_DIR/dev-server.log" ]; then
        log_file="$LOG_DIR/dev-server.log"
    else
        print_error "No log files found"
        return 1
    fi

    if [ "$2" = "follow" ]; then
        print_status "Following logs (Ctrl+C to stop)..."
        tail -f "$log_file"
    else
        print_status "Showing last 50 lines of logs:"
        tail -50 "$log_file"
    fi
}

# Server health check
health_check() {
    print_header "🏥 Server Health Check"

    local url="http://$DEFAULT_HOST:$DEFAULT_PORT"

    if is_server_running; then
        print_status "Server process is running"

        # Check HTTP response
        if command -v curl &> /dev/null; then
            print_status "Checking HTTP response..."
            local response=$(curl -s -o /dev/null -w "%{http_code}" "$url" 2>/dev/null || echo "000")

            if [ "$response" = "200" ]; then
                print_status "✅ Server is responding correctly (HTTP 200)"
            else
                print_warning "⚠️  Server returned HTTP $response"
            fi
        else
            print_warning "curl not available, cannot check HTTP response"
        fi

        # Check memory usage
        if is_server_running; then
            local pid=$(cat "$PID_FILE")
            local memory=$(ps -p "$pid" -o rss= 2>/dev/null | tr -d ' ')
            if [ -n "$memory" ]; then
                print_status "Memory usage: $((memory / 1024))MB"
            fi
        fi

        # Check disk space
        local disk_usage=$(df -h "$APP_DIR" | awk 'NR==2 {print $5}')
        print_status "Disk usage: $disk_usage"

    else
        print_error "❌ Server is not running"
        return 1
    fi
}

# Update application
update_app() {
    print_header "🔄 Updating Application..."

    cd "$APP_DIR"

    # Pull latest changes
    print_status "Pulling latest changes..."
    git pull

    # Install dependencies
    print_status "Installing dependencies..."
    npm install --legacy-peer-deps

    # Restart server if running
    if is_server_running; then
        print_status "Restarting server with new changes..."
        restart_server "$1" "$2"
    else
        print_status "Application updated. Start server manually when ready."
    fi
}

# Show help
show_help() {
    print_header "Fractionalized Ordinals DeFi Platform - Server Management"
    echo ""
    echo "Usage: $0 [COMMAND] [OPTIONS]"
    echo ""
    echo "Commands:"
    echo "  start [dev|prod] [testnet]     Start server (default: dev)"
    echo "  stop                          Stop server"
    echo "  restart [dev|prod] [testnet]  Restart server"
    echo "  status                        Show server status"
    echo "  logs [dev|prod] [follow]      Show server logs"
    echo "  health                        Perform health check"
    echo "  update [dev|prod] [testnet]   Update and restart server"
    echo "  help                          Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 start dev                  Start development server"
    echo "  $0 start prod testnet         Start production testnet server"
    echo "  $0 logs prod follow           Follow production logs"
    echo "  $0 health                     Check server health"
    echo ""
    echo "Default configuration:"
    echo "  Host: $DEFAULT_HOST"
    echo "  Port: $DEFAULT_PORT"
    echo "  App Directory: $APP_DIR"
    echo "  Log Directory: $LOG_DIR"
}

# Main execution
case "${1:-}" in
    "start")
        if [ "${2:-}" = "prod" ]; then
            start_prod_server "${3:-}"
        else
            start_dev_server "${3:-}"
        fi
        ;;
    "stop")
        stop_server
        ;;
    "restart")
        restart_server "${2:-}" "${3:-}"
        ;;
    "status")
        show_status
        ;;
    "logs")
        show_logs "${2:-}" "${3:-}"
        ;;
    "health")
        health_check
        ;;
    "update")
        update_app "${2:-}" "${3:-}"
        ;;
    "help"|"--help"|"-h")
        show_help
        ;;
    *)
        print_error "Unknown command: ${1:-}"
        echo ""
        show_help
        exit 1
        ;;
esac