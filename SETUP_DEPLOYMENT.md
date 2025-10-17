# 🚀 Quick Deployment Setup Guide

This guide will help you quickly set up automated GitHub commits and Vercel deployment using environment variables.

## ⚠️ Security Notice

**NEVER commit your tokens to version control!** This file and `.env.deploy` are already in `.gitignore`.

## 📋 Step 1: Configure Environment Variables

Edit `.env.deploy` file with your actual credentials:

```bash
# Open the configuration file
nano .env.deploy
```

Replace the placeholder values with your actual tokens:

```bash
# GitHub Configuration
GITHUB_TOKEN=ghp_your_actual_github_token_here
GITHUB_USERNAME=your_github_username
GITHUB_REPO=fractionalized-ordinals-defi

# Vercel Configuration
VERCEL_TOKEN=your_actual_vercel_token_here
VERCEL_ORG_ID=your_vercel_org_id  # Optional
VERCEL_PROJECT_ID=your_vercel_project_id  # Optional

# Deployment Options
DEPLOY_ENV=preview  # preview | prod
AUTO_PUSH=true     # true | false
```

## 🔑 Step 2: Get Your Tokens

### GitHub Token
1. Go to https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Give it a name like "fractionalized-ordinals-deploy"
4. Select scope: `repo` (full repository access)
5. Click "Generate token"
6. **Copy the token immediately** (it won't be shown again)

### Vercel Token
1. Go to https://vercel.com/account/tokens
2. Click "Create Token"
3. Give it a name like "fractionalized-ordinals-deploy"
4. Select scope: Your account
5. Click "Generate"
6. **Copy the token immediately**

### Vercel Org/Project IDs (Optional)
1. Go to your Vercel project dashboard
2. Look at the URL: `https://vercel.com/your-org-id/your-project-id`
3. Copy the org and project IDs

## 🚀 Step 3: Deploy!

### Option 1: Full Automated Deployment
```bash
# Deploy to preview environment
npm run deploy:preview

# Deploy to production
npm run deploy:prod
```

### Option 2: Step-by-Step Deployment
```bash
# Commit to GitHub only
npm run deploy:git

# Deploy to Vercel only
npm run deploy:vercel

# Check configuration
npm run deploy:config
```

### Option 3: Manual Script Execution
```bash
# Full deployment
./scripts/auto-deploy.sh

# Git only
./scripts/auto-deploy.sh git-only

# Vercel only
./scripts/auto-deploy.sh vercel-only
```

## ✅ Step 4: Verify Deployment

The script will automatically:
1. ✅ Commit all changes to GitHub
2. ✅ Deploy to Vercel
3. ✅ Perform health checks
4. ✅ Provide deployment URL
5. ✅ Clean up sensitive data

## 📊 What Happens During Deployment

1. **Configuration Validation**: Checks all tokens are properly set
2. **Git Operations**:
   - Adds all changes to git
   - Creates a timestamped commit message
   - Pushes to GitHub repository
3. **Vercel Deployment**:
   - Installs dependencies
   - Builds the application
   - Deploys to specified environment (preview/prod)
4. **Health Checks**: Tests the deployed application
5. **Cleanup**: Removes sensitive tokens from environment

## 🔧 Troubleshooting

### Common Issues

**"GITHUB_TOKEN not configured"**
```bash
# Edit .env.deploy file
nano .env.deploy
# Make sure GITHUB_TOKEN has your actual token
```

**"VERCEL_TOKEN not configured"**
```bash
# Edit .env.deploy file
nano .env.deploy
# Make sure VERCEL_TOKEN has your actual token
```

**"No changes to commit"**
```bash
# Make some changes first, then:
git add .
git commit -m "your changes"
# Or use the deployment script which handles this automatically
```

**Vercel deployment fails**
```bash
# Check Vercel CLI is installed
npm install -g vercel

# Test Vercel connection
vercel --token $VERCEL_TOKEN whoami
```

### Debug Mode

Add debug information by running:
```bash
# Show current configuration
./scripts/auto-deploy.sh config

# Check git status
git status

# Test Vercel CLI
vercel --token $VERCEL_TOKEN ls
```

## 🔄 Continuous Deployment

For automated deployments when you push to GitHub:

1. **Connect GitHub to Vercel:**
   - Go to https://vercel.com/new
   - Import your GitHub repository
   - Configure build settings

2. **Set up GitHub Actions** (optional):
   ```yaml
   # .github/workflows/deploy.yml
   name: Deploy to Vercel
   on:
     push:
       branches: [main]
   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v2
         - name: Deploy to Vercel
           uses: amondnet/vercel-action@v20
           with:
             vercel-token: ${{ secrets.VERCEL_TOKEN }}
             vercel-org-id: ${{ secrets.ORG_ID }}
             vercel-project-id: ${{ secrets.PROJECT_ID }}
   ```

## 📱 Mobile Deployment

You can also deploy from mobile using Termux or similar terminals:
```bash
# Clone repository
git clone https://github.com/your-username/fractionalized-ordinals-defi.git
cd fractionalized-ordinals-defi

# Set up environment variables
echo "GITHUB_TOKEN=your_token" > .env.deploy
echo "VERCEL_TOKEN=your_token" >> .env.deploy

# Deploy
./scripts/auto-deploy.sh
```

## 🎯 Success Indicators

When deployment is successful, you'll see:
- ✅ "Configuration validated"
- ✅ "Changes committed to GitHub"
- ✅ "Vercel deployment complete"
- ✅ "Health check passed"
- 🌐 Deployment URL provided

## 🛡️ Security Reminders

1. **Rotate tokens regularly** (every 30-90 days)
2. **Use minimum required permissions** for tokens
3. **Never share `.env.deploy` file**
4. **Clear command history** after use (script does this automatically)
5. **Monitor token usage** in GitHub/Vercel dashboards

---

**🎉 Your Fractionalized Ordinals DeFi Platform is now ready for automated deployment!**