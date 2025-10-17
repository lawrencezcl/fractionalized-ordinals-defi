# Testnet Integration Guide

This guide provides comprehensive instructions for setting up and using the Fractionalized Ordinals DeFi Platform on testnet.

## 🚀 Quick Start

### Option 1: Automated Setup
```bash
# Run the automated testnet setup
npm run testnet
```

### Option 2: Manual Setup
```bash
# 1. Setup environment
cp .env.testnet .env.local

# 2. Install dependencies
npm install --legacy-peer-deps

# 3. Start testnet server
npm run dev:testnet
```

## 📋 Testnet Overview

### Network Configuration
- **Bitcoin**: Testnet (tBTC)
- **Starknet**: Goerli Testnet
- **Explorer**: [testnet.starkscan.co](https://testnet.starkscan.co)
- **RPC**: Starknet Goerli Public RPC

### Available Features
✅ **Bitcoin Testnet**
- Testnet Ordinals creation
- Vault creation and management
- Multi-signature security (2-of-3)

✅ **Starknet Testnet**
- Smart contract deployment
- Fractional share minting
- DeFi protocol integration

✅ **DeFi Protocols**
- Vesu Protocol (lending/borrowing)
- Ekubo DEX (trading)
- Mock price oracles

✅ **Wallet Support**
- Xverse (Bitcoin)
- Argent/Braavos (Starknet)
- MetaMask (EVM compatible)

## 🛠️ Wallet Setup

### Bitcoin (Xverse)
1. Install [Xverse browser extension](https://xverse.app/)
2. Click Settings → Network → Switch to Testnet
3. Create or import a testnet wallet
4. Copy your testnet Bitcoin address

### Starknet (Argent/Braavos)
1. Install [Argent](https://www.argent.xyz/) or [Braavos](https://braavos.app/)
2. Connect to Starknet Goerli Testnet
3. Create or import a testnet account
4. Copy your testnet Starknet address

## 💰 Getting Testnet Funds

### Bitcoin Testnet Faucet
1. Visit [Bitcoin Faucet](https://bitcoinfaucet.uo1.net)
2. Enter your testnet Bitcoin address
3. Complete the captcha
4. Claim testnet BTC (usually arrives within minutes)

### Starknet Testnet Faucet
1. Visit [Starknet Faucet](https://faucet.sepolia.starknet.io/)
2. Connect your Starknet wallet
3. Verify your account (Twitter, Discord, or email)
4. Claim testnet ETH (0.01 ETH per claim)

## 🧪 Testing Scenarios

### 1. Vault Creation and Fractionalization
```typescript
// Test vault creation with testnet Ordinal
const vaultResult = await platformService.createVault({
  inscriptionId: 'test_inscription_id',
  totalShares: 10000,
  pricePerShare: 0.00005
})
```

### 2. Trading Fractional Shares
```typescript
// Test trading with testnet tokens
const tradeResult = await platformService.swapTokens(
  '0xbtc_testnet_address',
  '0xtoken_testnet_address',
  1000000, // 0.01 tBTC
  950000    // With 5% slippage
)
```

### 3. Lending and Borrowing
```typescript
// Test lending with testnet tokens
const supplyResult = await platformService.supplyToLending(
  '0xtoken_address',
  1000
)

const borrowResult = await platformService.borrowFromLending(
  '0xcollateral_address',
  1000,
  '0xborrow_token_address',
  600  // 60% LTV
)
```

## 🔧 Configuration Files

### Environment Variables (.env.testnet)
```bash
# Network Configuration
NEXT_PUBLIC_NETWORK_ENV=TESTNET
BITCOIN_NETWORK=testnet
STARKNET_NETWORK=goerli-alpha

# Testnet Contract Addresses
FRACTIONALIZED_ORDINALS_FACTORY=0x...
PRICE_ORACLE=0x...
```

### Network Configuration (lib/config/network.ts)
- Dynamic network switching
- Testnet/mainnet contract addresses
- RPC endpoints and explorers
- Faucet URLs and helpers

## 📊 Testnet Dashboard

Access the comprehensive testnet dashboard at:
- **Main Dashboard**: `http://localhost:3000/testnet`
- **Vault**: `http://localhost:3000/vault`
- **Trading**: `http://localhost:3000/trade`
- **Lending**: `http://localhost:3000/lend`

## 🚨 Important Notes

### Testnet vs Mainnet
- **No Real Value**: Testnet tokens cannot be used on mainnet
- **Data Persistence**: Testnet data may be reset periodically
- **Gas Fees**: Testnet transactions use testnet ETH
- **Security**: Same security model as mainnet

### Safety Precautions
1. **Never send mainnet funds to testnet addresses**
2. **Use separate wallet for testnet activities**
3. **Keep testnet and mainnet keys separate**
4. **Don't use testnet addresses in production**

## 🔍 Monitoring and Debugging

### Network Status
- Check network indicator in the header
- Verify connected network in wallet
- Monitor transaction status in explorers

### Logging
```typescript
// Enable debug mode
console.log('Network:', NetworkConfig.getCurrentNetwork())
console.log('Is Testnet:', NetworkConfig.isTestnet())
```

### Transaction Monitoring
- Bitcoin: [Blockstream Testnet Explorer](https://blockstream.info/testnet/)
- Starknet: [Starkscan Testnet](https://testnet.starkscan.co/)

## 📚 Additional Resources

### Documentation
- [API Documentation](./API.md)
- [Smart Contract Docs](./SMART_CONTRACTS.md)
- [Security Guide](./SECURITY.md)

### External Tools
- [Bitcoin Testnet Explorer](https://blockstream.info/testnet/)
- [Starknet Testnet Explorer](https://testnet.starkscan.co/)
- [Xverse Documentation](https://docs.xverse.app/)
- [Argent Documentation](https://docs.argent.xyz/)

### Community Support
- Discord: Fractionalized Ordinals DeFi Community
- GitHub: Repository Issues and Discussions
- Documentation: In-depth guides and tutorials

## 🛠️ Troubleshooting

### Common Issues

**Q: Wallet won't connect to testnet**
A: Ensure wallet is configured for testnet network and refresh the page

**Q: Transactions are failing**
A: Check if you have sufficient testnet funds for gas fees

**Q: Price feeds are not working**
A: Testnet uses mock price feeds for testing purposes

**Q: Can't see my Ordinals**
A: Ensure you have testnet Ordinals in your Xverse wallet

### Debug Mode
Enable debug mode for detailed logging:
```bash
# Add to .env.local
NEXT_PUBLIC_DEBUG_MODE=true
```

## 🎯 Testing Checklist

- [ ] Wallets connected to correct testnet
- [ ] Sufficient testnet funds available
- [ ] Network status shows "Testnet"
- [ ] Can create vaults with testnet Ordinals
- [ ] Can mint fractional shares
- [ ] Can trade on testnet DEX
- [ ] Can supply/borrow on testnet lending
- [ ] Transactions appear in testnet explorers
- [ ] Mock price feeds are working
- [ ] All features function as expected

## 📝 Test Deployment Log

When deploying to testnet, document:
- Contract addresses
- Transaction hashes
- Configuration changes
- Test scenarios performed
- Issues encountered and resolved

This ensures reproducible testnet setups and easier debugging.