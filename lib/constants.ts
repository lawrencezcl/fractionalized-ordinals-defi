// Network configurations
export const NETWORKS = {
  BITCOIN: {
    MAINNET: {
      network: 'mainnet',
      apiUrl: 'https://blockstream.info/api',
      explorerUrl: 'https://blockstream.info'
    },
    TESTNET: {
      network: 'testnet',
      apiUrl: 'https://blockstream.info/testnet/api',
      explorerUrl: 'https://blockstream.info/testnet'
    }
  },
  STARKNET: {
    MAINNET: {
      network: 'mainnet-alpha',
      rpcUrl: 'https://starknet-mainnet.public.blastapi.io',
      explorerUrl: 'https://starkscan.co',
      multicallAddress: '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7'
    },
    TESTNET: {
      network: 'goerli-alpha',
      rpcUrl: 'https://starknet-goerli.public.blastapi.io',
      explorerUrl: 'https://testnet.starkscan.co',
      multicallAddress: '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7'
    }
  }
} as const

// Contract addresses
export const CONTRACTS = {
  STARKNET: {
    ASSET_RUNES_BRIDGE: '0x05a6f307cb0a58c4d3d4b3c4e0b8c0c0b8c0b8c0b8c0b8c0b8c0b8c0b8c0b8c',
    VESU_PROTOCOL: '0x0176c762874cf44eaf41c4d2c39c0ba4faf9c92b8fa8a1c6d6b7b3f3b3b3b3b3',
    EKUBO_DEX: '0x02f3c8f8e7a2e3e4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d',
    ORACLES: {
      BITCOIN_PRICE: '0x03a8a8a8a8a8a8a8a8a8a8a8a8a8a8a8a8a8a8a8a8a8a8a8a8a8a8a8a8a8a8',
      ORDINALS_FLOOR_PRICE: '0x04b4b4b4b4b4b4b4b4b4b4b4b4b4b4b4b4b4b4b4b4b4b4b4b4b4b4b4b4b4b4'
    }
  }
} as const

// API endpoints
export const API_ENDPOINTS = {
  MAGIC_EDEN: 'https://api-mainnet.magiceden.dev/v2',
  MAGIC_EDEN_TESTNET: 'https://api-testnet.magiceden.dev/v2',
  ORDINALHUB: 'https://api.ordinalswallet.com',
  GAMMA: 'https://gamma-api.io',
  XVERSE: 'https://api.xverse.app/v1',
  COINGECKO: 'https://api.coingecko.com/api/v3',
  COINBASE: 'https://api.coinbase.com/v2',
  BINANCE: 'https://api.binance.com/api/v3'
} as const

// Vault configuration
export const VAULT_CONFIG = {
  MIN_VAULT_AMOUNT: 546, // Dust limit for Ordinals
  REDEMPTION_THRESHOLD: 75, // 75% of shares needed for redemption
  DEFAULT_SHARE_COUNT: 10000,
  MIN_SHARE_COUNT: 1000,
  MAX_SHARE_COUNT: 100000,
  FEE_PERCENTAGE: 2.5, // 2.5% platform fee
  MULTISIG_THRESHOLD: 2, // 2-of-3 multisig
} as const

// DeFi configuration
export const DEFICONFIG = {
  VESU: {
    MAX_LTV: 0.6, // 60% loan-to-value ratio
    LIQUIDATION_THRESHOLD: 0.8, // 80% liquidation threshold
    INTEREST_RATE: 0.05, // 5% annual interest rate
  },
  EKUBO: {
    DEFAULT_FEE_TIER: 3000, // 0.3% fee tier
    MIN_LIQUIDITY: 1000, // Minimum liquidity in tokens
    SLIPPAGE_TOLERANCE: 0.005, // 0.5% slippage tolerance
  }
} as const

// Supported Ordinals collections
export const SUPPORTED_COLLECTIONS = [
  'Bitcoin Punks',
  'NodeMonkes',
  'Bitcoin Frogs',
  'Rocks',
  'DeGods',
  'BTC DeGods',
  'Pudgy Penguins',
  'Ordinals Maxi Biz'
] as const

// Token mappings
export const TOKENS = {
  BTC: {
    symbol: 'BTC',
    decimals: 8,
    name: 'Bitcoin'
  },
  WBTC: {
    symbol: 'WBTC',
    decimals: 8,
    name: 'Wrapped Bitcoin',
    starknetAddress: '0x03fe2b97c1fd336e7500874984665c0f28f49b2059576d75a92c8a33684b84cc'
  },
  USDC: {
    symbol: 'USDC',
    decimals: 6,
    name: 'USD Coin',
    starknetAddress: '0x053c9123bc169192557d20fc990ea7a5fa1e618fb4bfbd1b9b5a2f2a6065eb22'
  },
  ETH: {
    symbol: 'ETH',
    decimals: 18,
    name: 'Ethereum',
    starknetAddress: '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7'
  },
  STRK: {
    symbol: 'STRK',
    decimals: 18,
    name: 'Starknet Token',
    starknetAddress: '0x04718f5a0fc34cc1af16a1cdee98ffb20a31f4bd369f9eb04d70b8ef979dcf4f'
  }
} as const

// Environment
export const ENVIRONMENT = process.env.NEXT_PUBLIC_NETWORK_ENV || 'PRODUCTION'
export const IS_MAINNET = ENVIRONMENT === 'MAINNET' || ENVIRONMENT === 'PRODUCTION'

// Error messages
export const ERROR_MESSAGES = {
  WALLET_NOT_CONNECTED: 'Wallet not connected. Please connect your wallet to continue.',
  INSUFFICIENT_BALANCE: 'Insufficient balance to complete this transaction.',
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  TRANSACTION_FAILED: 'Transaction failed. Please try again.',
  INVALID_AMOUNT: 'Invalid amount. Please enter a valid number.',
  UNSUPPORTED_COLLECTION: 'This collection is not supported for fractionalization.',
  VAULT_LIMIT_REACHED: 'Vault limit reached. Please try again later.',
  ORACLE_ERROR: 'Price oracle error. Unable to fetch current prices.',
  PERMISSION_DENIED: 'Permission denied. Please check your wallet permissions.'
} as const

// Success messages
export const SUCCESS_MESSAGES = {
  VAULT_CREATED: 'Ordinal successfully vaulted and fractionalized!',
  SHARES_MINTED: 'Shares have been minted to your wallet.',
  TRANSACTION_SUCCESS: 'Transaction completed successfully.',
  SUPPLY_SUCCESS: 'Tokens supplied as collateral.',
  BORROW_SUCCESS: 'Loan successfully borrowed.',
  LIQUIDITY_ADDED: 'Liquidity added to pool.',
  REDEMPTION_INITIATED: 'Redemption process initiated.'
} as const