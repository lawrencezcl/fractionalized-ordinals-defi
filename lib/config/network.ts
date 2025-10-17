import { NETWORKS, CONTRACTS, TOKENS, ENVIRONMENT, IS_MAINNET } from '../constants'

export class NetworkConfig {
  static getCurrentNetwork() {
    return IS_MAINNET ? 'MAINNET' : 'TESTNET'
  }

  static getBitcoinNetwork() {
    return IS_MAINNET ? NETWORKS.BITCOIN.MAINNET : NETWORKS.BITCOIN.TESTNET
  }

  static getStarknetNetwork() {
    return IS_MAINNET ? NETWORKS.STARKNET.MAINNET : NETWORKS.STARKNET.TESTNET
  }

  static getBitcoinRpcUrl() {
    const network = this.getBitcoinNetwork()
    return network.apiUrl
  }

  static getStarknetRpcUrl() {
    const network = this.getStarknetNetwork()
    return network.rpcUrl
  }

  static getExplorerUrl(txHash?: string, type: 'bitcoin' | 'starknet' = 'bitcoin') {
    if (type === 'bitcoin') {
      const network = this.getBitcoinNetwork()
      return txHash ? `${network.explorerUrl}/tx/${txHash}` : network.explorerUrl
    } else {
      const network = this.getStarknetNetwork()
      return txHash ? `${network.explorerUrl}/tx/${txHash}` : network.explorerUrl
    }
  }

  static getContracts() {
    return IS_MAINNET ? CONTRACTS.MAINNET : CONTRACTS.TESTNET
  }

  static getTokens() {
    return TOKENS
  }

  static isTestnet() {
    return !IS_MAINNET
  }

  static getNetworkColor() {
    return IS_MAINNET ? 'text-green-600' : 'text-orange-600'
  }

  static getNetworkBadgeVariant() {
    return IS_MAINNET ? 'default' : 'secondary'
  }

  static getNetworkName() {
    return IS_MAINNET ? 'Mainnet' : 'Testnet'
  }
}

// Testnet-specific configurations
export const TESTNET_CONFIG = {
  // Bitcoin Testnet
  BITCOIN_TESTNET: {
    NETWORK: 'testnet',
    BLOCK_EXPLORER: 'https://blockstream.info/testnet',
    RPC_URL: 'https://blockstream.info/testnet/api',
    FAUCET_URL: 'https://bitcoinfaucet.uo1.net',
    MIN_FEE_SATS: 100,
  },

  // Starknet Testnet
  STARKNET_TESTNET: {
    NETWORK: 'goerli-alpha',
    CHAIN_ID: '0x534e5f4f4e45', // SN_MAIN in testnet
    BLOCK_EXPLORER: 'https://testnet.starkscan.co',
    RPC_URL: 'https://starknet-goerli.public.blastapi.io',
    FAUCET_URL: 'https://faucet.sepolia.starknet.io/',
    ACCOUNT_CLASS_HASH: '0x048dd32de97e49e5e6d08ff13b7f1e3f0d0dd8a9311c0d9c3e1b0b1b3b3b3b3b',
  },

  // Testnet Contracts (mock addresses for development)
  TESTNET_CONTRACTS: {
    FRACTIONALIZED_ORDINALS_FACTORY: '0x05a6f307cb0a58c4d3d4b3c4e0b8c0c0b8c0b8c0b8c0b8c0b8c0b8c0b8c0b8c',
    PRICE_ORACLE: '0x03a8a8a8a8a8a8a8a8a8a8a8a8a8a8a8a8a8a8a8a8a8a8a8a8a8a8a8a8a8a8',
    VESU_PROTOCOL: '0x0176c762874cf44eaf41c4d2c39c0ba4faf9c92b8fa8a1c6d6b7b3f3b3b3b3b3',
    EKUBO_DEX: '0x02f3c8f8e7a2e3e4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d',
    USDC_TOKEN: '0x053c9123bc169192557d20fc990ea7a5fa1e618fb4bfbd1b9b5a2f2a6065eb22',
    WBTC_TOKEN: '0x03fe2b97c1fd336e7500874984665c0f28f49b2059576d75a92c8a33684b84cc',
  }
}

// Mainnet configurations for comparison
export const MAINNET_CONFIG = {
  BITCOIN_MAINNET: {
    NETWORK: 'mainnet',
    BLOCK_EXPLORER: 'https://blockstream.info',
    RPC_URL: 'https://blockstream.info/api',
    MIN_FEE_SATS: 1000,
  },

  STARKNET_MAINNET: {
    NETWORK: 'mainnet-alpha',
    CHAIN_ID: '0x534e5f4d41494e', // SN_MAIN
    BLOCK_EXPLORER: 'https://starkscan.co',
    RPC_URL: 'https://starknet-mainnet.public.blastapi.io',
    ACCOUNT_CLASS_HASH: '0x048dd32de97e49e5e6d08ff13b7f1e3f0d0dd8a9311c0d9c3e1b0b1b3b3b3b3b',
  }
}

export function getNetworkConfig() {
  // Return a safe minimal config for build
  return TESTNET_CONFIG
}

export function getFaucetUrl(type: 'bitcoin' | 'starknet') {
  // Return faucet URLs directly
  if (type === 'bitcoin') {
    return 'https://bitcoinfaucet.uo1.net'
  } else {
    return 'https://faucet.sepolia.starknet.io/'
  }
}