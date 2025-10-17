# Server Deployment Guide

This guide provides comprehensive instructions for deploying the Fractionalized Ordinals DeFi Platform on a server with IPv4 accessibility.

## 🚀 Quick Start

### Option 1: Development Server (IPv4 Access)
```bash
# Start development server accessible from any IP
npm run dev:ipv4

# Start testnet development server
npm run dev:testnet:ipv4
```

### Option 2: Production Deployment
```bash
# Build and start production server
npm run build:prod
npm run server:prod

# Or use server management script
./scripts/server-management.sh start prod
```

## 📋 Prerequisites

### System Requirements
- **OS**: Ubuntu 20.04+ / CentOS 8+ / Debian 11+
- **Node.js**: Version 18 or higher
- **Memory**: Minimum 2GB RAM (4GB recommended)
- **Storage**: Minimum 10GB free space
- **Network**: IPv4 connectivity with port 3000 available

### Required Software
```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Git
sudo apt install -y git

# Install additional build tools
sudo apt install -y build-essential python3 make g++ curl
```

## 🔧 Configuration

### Environment Setup
```bash
# Clone the repository
git clone <repository-url>
cd fractionalized-ordinals-defi

# Copy environment configuration
cp .env.testnet .env.local

# Install dependencies
npm install --legacy-peer-deps
```

### Environment Variables
Edit `.env.local` with your configuration:

```bash
# Network Configuration
NEXT_PUBLIC_NETWORK_ENV=TESTNET  # or MAINNET
BITCOIN_NETWORK=testnet          # or mainnet
STARKNET_NETWORK=goerli-alpha    # or mainnet-alpha

# Server Configuration
NODE_ENV=production
HOSTNAME=0.0.0.0                 # Bind to all interfaces
PORT=3000                        # Server port

# Security (optional but recommended)
REDIS_PASSWORD=your_redis_password
GRAFANA_PASSWORD=your_grafana_password
```

## 🐳 Docker Deployment (Recommended)

### Build and Run with Docker Compose
```bash
# Navigate to docker directory
cd docker

# Generate SSL certificates (development)
../scripts/ssl-setup.sh self-signed

# For production, use Let's Encrypt
# ../scripts/ssl-setup.sh letsencrypt yourdomain.com

# Start all services
docker-compose up -d

# Start with monitoring
docker-compose --profile monitoring up -d
```

### Docker Services
- **app**: Main Next.js application (port 3000)
- **nginx**: Reverse proxy with SSL (ports 80, 443)
- **redis**: Caching layer (port 6379)
- **prometheus**: Monitoring (port 9090, optional)
- **grafana**: Dashboard (port 3001, optional)

## 🛠️ Manual Deployment

### Option 1: Using Server Management Script
```bash
# Make script executable
chmod +x scripts/server-management.sh

# Start development server
./scripts/server-management.sh start dev

# Start production server
./scripts/server-management.sh start prod

# Start testnet production server
./scripts/server-management.sh start prod testnet

# Check server status
./scripts/server-management.sh status

# View logs
./scripts/server-management.sh logs prod follow

# Perform health check
./scripts/server-management.sh health
```

### Option 2: Direct NPM Commands
```bash
# Development server with IPv4 binding
HOSTNAME=0.0.0.0 npm run dev

# Testnet development server
NEXT_PUBLIC_NETWORK_ENV=TESTNET HOSTNAME=0.0.0.0 npm run dev

# Production build and start
npm run build
HOSTNAME=0.0.0.0 npm start
```

## 🔒 SSL/HTTPS Setup

### Self-Signed Certificate (Development)
```bash
# Generate development certificates
./scripts/ssl-setup.sh self-signed

# Verify installation
./scripts/ssl-setup.sh verify
```

### Let's Encrypt Certificate (Production)
```bash
# Setup with domain name
sudo ./scripts/ssl-setup.sh letsencrypt yourdomain.com

# This will:
# - Install certbot if not present
# - Request certificate from Let's Encrypt
# - Configure automatic renewal
# - Install certificates in docker/ssl/
```

### Custom Certificates
```bash
# Install existing certificates
./scripts/ssl-setup.sh install /path/to/cert.pem /path/to/key.pem
```

## 📊 Monitoring and Maintenance

### Health Checks
```bash
# Manual health check
curl http://localhost:3000/api/health

# Using server management script
./scripts/server-management.sh health

# Check container health
docker-compose ps
```

### Log Management
```bash
# View application logs
./scripts/server-management.sh logs

# Follow logs in real-time
./scripts/server-management.sh logs prod follow

# Docker logs
docker-compose logs -f app
docker-compose logs -f nginx
```

### Application Updates
```bash
# Update application and restart
./scripts/server-management.sh update prod

# Manual update process
git pull
npm install --legacy-peer-deps
npm run build
./scripts/server-management.sh restart prod
```

## 🔧 Network Configuration

### Firewall Setup
```bash
# Open required ports
sudo ufw allow 22          # SSH
sudo ufw allow 80          # HTTP
sudo ufw allow 443         # HTTPS
sudo ufw allow 3000        # Application (if not using nginx)

# Enable firewall
sudo ufw enable
```

### Port Forwarding (if behind NAT)
Configure your router to forward:
- Port 80 → Server IP:80
- Port 443 → Server IP:443
- Port 3000 → Server IP:3000 (optional, if accessing directly)

## 🚨 Troubleshooting

### Common Issues

**Server won't start**
```bash
# Check if port is in use
sudo netstat -tlnp | grep :3000

# Kill existing processes
sudo kill -9 <PID>

# Check logs for errors
./scripts/server-management.sh logs
```

**Can't access from external IP**
```bash
# Verify IPv4 binding
./scripts/server-management.sh status

# Check firewall settings
sudo ufw status

# Verify HOSTNAME is set to 0.0.0.0
echo $HOSTNAME
```

**SSL Certificate Issues**
```bash
# Verify certificates
./scripts/ssl-setup.sh verify

# Check certificate details
./scripts/ssl-setup.sh status

# Regenerate if needed
./scripts/ssl-setup.sh self-signed
```

**Memory Issues**
```bash
# Check memory usage
free -h

# Monitor Node.js process
ps aux | grep node

# Restart server to clear memory
./scripts/server-management.sh restart prod
```

### Performance Optimization

**Enable Compression**
```bash
# Already configured in nginx.conf
gzip on;
gzip_types text/plain text/css application/json application/javascript;
```

**Configure Redis Caching**
```bash
# Redis is included in docker-compose.yml
# Connect to Redis CLI
docker exec -it fractionalized-ordinals-redis redis-cli
```

**Monitor Resources**
```bash
# System monitoring
htop
iotop

# Docker monitoring
docker stats
```

## 📚 Additional Resources

### Security Best Practices
1. **Regular Updates**: Keep system and dependencies updated
2. **Strong Passwords**: Use unique passwords for Redis and Grafana
3. **SSL/TLS**: Always use HTTPS in production
4. **Firewall**: Restrict access to necessary ports only
5. **Monitoring**: Set up alerts for unusual activity

### Backup Strategy
```bash
# Backup application data
tar -czf backup-$(date +%Y%m%d).tar.gz \
    logs/ \
    .env.local \
    docker/ssl/ \
    contracts/

# Backup to external location
scp backup-*.tar.gz user@backup-server:/backups/
```

### Scaling Considerations
- **Load Balancing**: Use nginx upstream configuration
- **Database**: Consider external Redis cluster for large deployments
- **CDN**: Use CloudFlare or similar for static assets
- **Monitoring**: Implement comprehensive monitoring with Prometheus/Grafana

## 🆘 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review logs in the `logs/` directory
3. Check the GitHub repository for known issues
4. Create an issue with detailed error messages and system information

### System Information Collection
```bash
# Collect system information
uname -a > system-info.txt
node --version >> system-info.txt
npm --version >> system-info.txt
docker --version >> system-info.txt
docker-compose --version >> system-info.txt
free -h >> system-info.txt
df -h >> system-info.txt
```