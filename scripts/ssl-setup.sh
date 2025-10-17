#!/bin/bash

# SSL Certificate Setup Script for Fractionalized Ordinals DeFi Platform
# This script generates self-signed certificates for development or helps set up Let's Encrypt for production

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
APP_NAME="fractionalized-ordinals-defi"
SSL_DIR="/root/fractionalized-ordinals-defi/docker/ssl"
CERT_FILE="$SSL_DIR/cert.pem"
KEY_FILE="$SSL_DIR/key.pem"

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

# Create SSL directory
create_ssl_directory() {
    print_header "📁 Creating SSL Directory..."

    if [ ! -d "$SSL_DIR" ]; then
        mkdir -p "$SSL_DIR"
        print_status "SSL directory created: $SSL_DIR"
    else
        print_status "SSL directory already exists: $SSL_DIR"
    fi
}

# Generate self-signed certificate for development
generate_self_signed_cert() {
    print_header "🔐 Generating Self-Signed Certificate..."

    cd "$SSL_DIR"

    # Generate private key
    print_status "Generating private key..."
    openssl genrsa -out key.pem 2048

    # Generate certificate signing request
    print_status "Generating certificate signing request..."
    openssl req -new -key key.pem -out server.csr -subj "/C=US/ST=State/L=City/O=Organization/OU=Unit/CN=localhost"

    # Generate self-signed certificate
    print_status "Generating self-signed certificate..."
    openssl x509 -req -days 365 -in server.csr -signkey key.pem -out cert.pem

    # Clean up CSR
    rm server.csr

    print_status "Self-signed certificate generated successfully!"
    print_status "Certificate: $CERT_FILE"
    print_status "Private Key: $KEY_FILE"
    print_warning "Note: This is a self-signed certificate for development only"
    print_warning "Browsers will show security warnings"
}

# Setup Let's Encrypt certificate for production
setup_letsencrypt() {
    print_header "🌐 Setting up Let's Encrypt Certificate..."

    local domain="$1"

    if [ -z "$domain" ]; then
        print_error "Domain name is required for Let's Encrypt setup"
        print_status "Usage: $0 letsencrypt yourdomain.com"
        return 1
    fi

    # Check if certbot is installed
    if ! command -v certbot &> /dev/null; then
        print_status "Installing certbot..."
        apt-get update
        apt-get install -y certbot python3-certbot-nginx
    fi

    print_status "Requesting certificate for domain: $domain"

    # Stop any running services that might be using port 80/443
    if docker ps | grep -q "nginx"; then
        print_status "Stopping nginx container..."
        docker stop fractionalized-ordinals-nginx
    fi

    # Obtain certificate
    certbot certonly --standalone --email admin@"$domain" --agree-tos --no-eff-email -d "$domain"

    # Copy certificates to SSL directory
    cp "/etc/letsencrypt/live/$domain/fullchain.pem" "$CERT_FILE"
    cp "/etc/letsencrypt/live/$domain/privkey.pem" "$KEY_FILE"

    print_status "Let's Encrypt certificate obtained and installed!"
    print_status "Certificate: $CERT_FILE"
    print_status "Private Key: $KEY_FILE"

    # Setup auto-renewal
    print_status "Setting up automatic renewal..."
    (crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet --deploy-hook 'docker restart fractionalized-ordinals-nginx'") | crontab -

    print_status "Auto-renewal configured to run daily at 12:00 PM"
}

# Install existing certificates
install_existing_certs() {
    print_header "📋 Installing Existing Certificates..."

    local cert_path="$1"
    local key_path="$2"

    if [ -z "$cert_path" ] || [ -z "$key_path" ]; then
        print_error "Both certificate and key paths are required"
        print_status "Usage: $0 install /path/to/cert.pem /path/to/key.pem"
        return 1
    fi

    if [ ! -f "$cert_path" ]; then
        print_error "Certificate file not found: $cert_path"
        return 1
    fi

    if [ ! -f "$key_path" ]; then
        print_error "Private key file not found: $key_path"
        return 1
    fi

    cp "$cert_path" "$CERT_FILE"
    cp "$key_path" "$KEY_FILE"

    print_status "Certificates installed successfully!"
    print_status "Certificate: $CERT_FILE"
    print_status "Private Key: $KEY_FILE"
}

# Verify certificates
verify_certificates() {
    print_header "✅ Verifying Certificates..."

    if [ ! -f "$CERT_FILE" ] || [ ! -f "$KEY_FILE" ]; then
        print_error "Certificate files not found!"
        return 1
    fi

    # Check certificate validity
    if openssl x509 -in "$CERT_FILE" -text -noout > /dev/null 2>&1; then
        print_status "✅ Certificate is valid"

        # Show certificate details
        print_status "Certificate details:"
        openssl x509 -in "$CERT_FILE" -text -noout | grep -E "(Subject:|Issuer:|Not Before:|Not After:)" | sed 's/^/  /'

        # Check expiration
        local expiry_date=$(openssl x509 -in "$CERT_FILE" -noout -enddate | cut -d= -f2)
        local expiry_epoch=$(date -d "$expiry_date" +%s)
        local current_epoch=$(date +%s)
        local days_until_expiry=$(( (expiry_epoch - current_epoch) / 86400 ))

        if [ $days_until_expiry -lt 30 ]; then
            print_warning "⚠️  Certificate expires in $days_until_expiry days"
        else
            print_status "✅ Certificate is valid for $days_until_expiry more days"
        fi
    else
        print_error "❌ Certificate is invalid or corrupted"
        return 1
    fi

    # Check private key
    if openssl rsa -in "$KEY_FILE" -check > /dev/null 2>&1; then
        print_status "✅ Private key is valid"
    else
        print_error "❌ Private key is invalid or corrupted"
        return 1
    fi

    # Check if certificate and key match
    local cert_modulus=$(openssl x509 -noout -modulus -in "$CERT_FILE" | openssl md5)
    local key_modulus=$(openssl rsa -noout -modulus -in "$KEY_FILE" | openssl md5)

    if [ "$cert_modulus" = "$key_modulus" ]; then
        print_status "✅ Certificate and private key match"
    else
        print_error "❌ Certificate and private key do not match"
        return 1
    fi

    print_status "✅ All certificate checks passed!"
}

# Show SSL status
show_ssl_status() {
    print_header "📊 SSL Certificate Status"

    if [ ! -f "$CERT_FILE" ] || [ ! -f "$KEY_FILE" ]; then
        print_warning "No SSL certificates found"
        return 1
    fi

    print_status "Certificate file: $CERT_FILE"
    print_status "Private key file: $KEY_FILE"

    # Show certificate info
    if openssl x509 -in "$CERT_FILE" -text -noout > /dev/null 2>&1; then
        print_status ""
        print_status "Certificate Information:"
        openssl x509 -in "$CERT_FILE" -text -noout | grep -E "(Subject:|Issuer:|Not Before:|Not After:)" | sed 's/^/  /'
    else
        print_error "Certificate file is invalid"
    fi
}

# Show help
show_help() {
    print_header "Fractionalized Ordinals DeFi Platform - SSL Setup"
    echo ""
    echo "Usage: $0 [COMMAND] [OPTIONS]"
    echo ""
    echo "Commands:"
    echo "  self-signed                      Generate self-signed certificate (development)"
    echo "  letsencrypt <domain>             Setup Let's Encrypt certificate (production)"
    echo "  install <cert> <key>             Install existing certificates"
    echo "  verify                           Verify installed certificates"
    echo "  status                           Show SSL certificate status"
    echo "  help                             Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 self-signed                   Generate development certificate"
    echo "  $0 letsencrypt yourdomain.com    Setup production certificate"
    echo "  $0 install ./cert.pem ./key.pem Install existing certificates"
    echo "  $0 verify                        Verify certificate installation"
    echo ""
    echo "Certificate location: $SSL_DIR"
    echo "  Certificate: $CERT_FILE"
    echo "  Private Key: $KEY_FILE"
}

# Main execution
case "${1:-}" in
    "self-signed")
        create_ssl_directory
        generate_self_signed_cert
        ;;
    "letsencrypt")
        create_ssl_directory
        setup_letsencrypt "$2"
        ;;
    "install")
        create_ssl_directory
        install_existing_certs "$2" "$3"
        ;;
    "verify")
        verify_certificates
        ;;
    "status")
        show_ssl_status
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