# Vercel Deployment Guide

This guide provides secure instructions for deploying the Fractionalized Ordinals DeFi Platform to Vercel.

## 🚨 Important Security Notice

**Never share your API tokens in plain text!** If you've shared tokens in conversations, immediately:

1. **Revoke the compromised tokens:**
   - GitHub: https://github.com/settings/tokens
   - Vercel: https://vercel.com/account/tokens

2. **Create new tokens with minimal permissions**

3. **Use environment variables for token storage**

## 📋 Prerequisites

### Required Accounts
- **GitHub Account**: https://github.com
- **Vercel Account**: https://vercel.com
- **Git Repository**: Pushed to GitHub

### Required Tools
```bash
# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Vercel CLI
npm install -g vercel

# Clone your repository
git clone https://github.com/your-username/fractionalized-ordinals-defi.git
cd fractionalized-ordinals-defi
```

## 🔐 Secure Token Setup

### 1. Create New Vercel Token
1. Visit https://vercel.com/account/tokens
2. Click "Create Token"
3. Give it a descriptive name (e.g., "fractionalized-ordinals-deployment")
4. Select scope: Your account
5. Click "Generate"
6. **Copy the token immediately** (it won't be shown again)

### 2. Create New GitHub Token (Optional)
1. Visit https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Give it a descriptive name
4. Select scope: `repo` (for full repository access)
5. Click "Generate token"
6. **Copy the token immediately**

### 3. Set Environment Variables
```bash
# Set your tokens as environment variables (never in version control)
export VERCEL_TOKEN=your_new_vercel_token_here
export GITHUB_TOKEN=your_new_github_token_here  # optional
```

## 🚀 Deployment Methods

### Option 1: Automated Deployment Script
```bash
# Make the deployment script executable
chmod +x scripts/deploy-vercel.sh

# Deploy to preview
./scripts/deploy-vercel.sh preview

# Deploy to production
./scripts/deploy-vercel.sh prod
```

### Option 2: Manual Vercel CLI Deployment
```bash
# Install dependencies
npm install --legacy-peer-deps

# Build application
npm run build

# Deploy to preview
vercel --token $VERCEL_TOKEN

# Deploy to production
vercel --prod --token $VERCEL_TOKEN
```

### Option 3: Vercel Dashboard Deployment
1. **Connect Repository:**
   - Visit https://vercel.com/new
   - Import your GitHub repository
   - Configure build settings

2. **Configure Environment Variables:**
   ```
   NEXT_PUBLIC_NETWORK_ENV=MAINNET
   BITCOIN_NETWORK=mainnet
   STARKNET_NETWORK=mainnet-alpha
   NEXT_PUBLIC_API_URL=https://your-domain.com
   NEXT_PUBLIC_RPC_URL=https://starknet-mainnet.public.blastapi.io
   ```

3. **Deploy:**
   - Click "Deploy"
   - Wait for build completion
   - Test the deployed URL

## ⚙️ Vercel Configuration

### Build Settings
Create `vercel.json` in your project root:

```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "env": {
    "NEXT_PUBLIC_NETWORK_ENV": "mainnet",
    "BITCOIN_NETWORK": "mainnet",
    "STARKNET_NETWORK": "mainnet-alpha"
  },
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30
    }
  },
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "no-cache, no-store, must-revalidate"
        }
      ]
    }
  ]
}
```

### Domain Configuration
1. **Custom Domain:**
   - Go to Vercel Dashboard → Project Settings → Domains
   - Add your custom domain
   - Configure DNS records
   - Wait for SSL certificate issuance

2. **Environment-Specific Domains:**
   - Preview: `your-project-name.vercel.app`
   - Production: `your-custom-domain.com`

## 🔍 Deployment Verification

### Health Check
```bash
# Test health endpoint
curl https://your-domain.com/api/health

# Expected response
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "production",
  "network": "mainnet",
  "version": "0.1.0"
}
```

### Manual Testing Checklist
- [ ] Homepage loads correctly
- [ ] All navigation links work
- [ ] Wallet connection works
- [ ] Testnet features are hidden in mainnet mode
- [ ] API endpoints respond correctly
- [ ] No console errors
- [ ] Mobile responsive design
- [ ] SSL certificate is valid

## 🔧 Troubleshooting

### Common Issues

**Build Failures**
```bash
# Check build logs locally
npm run build

# Fix dependency issues
npm install --legacy-peer-deps

# Clear Vercel cache
vercel rm --token $VERCEL_TOKEN --yes
```

**Environment Variables Not Working**
```bash
# Verify environment variables in Vercel dashboard
vercel env ls --token $VERCEL_TOKEN

# Pull environment variables locally
vercel env pull .env.production --token $VERCEL_TOKEN
```

**Deployment Stuck**
```bash
# Cancel current deployment
vercel cancel --token $VERCEL_TOKEN

# Redeploy
vercel --prod --token $VERCEL_TOKEN
```

### Performance Optimization
1. **Image Optimization:** Configure domains in `next.config.mjs`
2. **Bundle Size:** Analyze with `npm run build`
3. **Caching:** Configure proper headers in `vercel.json`
4. **CDN:** Vercel provides global CDN automatically

## 📊 Monitoring

### Vercel Analytics
1. Enable Vercel Analytics in project settings
2. Monitor page views, performance metrics
3. Set up custom events for user actions

### Custom Monitoring
```bash
# Set up uptime monitoring
# Configure alerts for downtime
# Monitor API response times
```

## 🔒 Security Best Practices

### Environment Variables
- Never commit `.env.local` to version control
- Use Vercel's encrypted environment variables
- Rotate tokens regularly
- Use principle of least privilege

### SSL and HTTPS
- Vercel provides automatic SSL certificates
- Ensure all HTTP traffic redirects to HTTPS
- Configure security headers in `next.config.mjs`

### Content Security Policy
```javascript
// next.config.mjs
async headers() {
  return [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'Content-Security-Policy',
          value: "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
        }
      ]
    }
  ]
}
```

## 🚀 Post-Deployment

### DNS Configuration
1. Update DNS records to point to Vercel
2. Configure subdomains if needed
3. Set up email forwarding

### Performance Monitoring
1. Set up Google Analytics
2. Configure Vercel Analytics
3. Monitor Core Web Vitals
4. Set up alerting for downtime

### Backup Strategy
- Code is stored in GitHub
- Environment variables in Vercel
- Consider database backups if applicable
- Document deployment process

## 📞 Support

If you encounter issues:
1. Check Vercel deployment logs
2. Review GitHub Actions (if configured)
3. Test locally with `npm run build && npm start`
4. Create issue in GitHub repository
5. Contact Vercel support for platform-specific issues

### Environment Variable Reset
If you need to reset environment variables:
```bash
# Remove all local environment files
rm .env.local .env.production

# Pull fresh from Vercel
vercel env pull .env.production --token $VERCEL_TOKEN
```

Remember: **Never share tokens in plain text!** Always use environment variables and rotate them regularly.