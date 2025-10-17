import { OrdinalsVault, VaultRequest, VaultResponse } from '../bitcoin/vault'
import { xverseWallet, XverseWalletState, Inscription } from '../wallets/xverse'
import { ordinalsPriceOracle, OrdinalsPrice, OracleResponse } from '../oracles/price-oracle'
import { starknetContracts, VesuProtocol, EkuboDEX, CreateVaultParams } from '../starknet/contracts'
import { Account, Provider, cairo, uint256 } from 'starknet'
import { ERROR_MESSAGES, SUCCESS_MESSAGES, VAULT_CONFIG, DEFICONFIG } from '../constants'

export interface VaultCreationRequest {
  inscriptionId: string
  totalShares: number
  pricePerShare: number
}

export interface VaultCreationResult {
  success: boolean
  vaultId?: string
  contractAddress?: string
  transactionId?: string
  error?: string
}

export interface TradingPair {
  tokenA: string
  tokenB: string
  fee: number
  poolAddress?: string
}

export interface LendingPosition {
  suppliedTokens: Array<{ token: string; amount: string; apy: number }>
  borrowedTokens: Array<{ token: string; amount: string; interestRate: number }>
  healthFactor: string
  totalCollateralValue: string
  totalBorrowValue: string
}

export interface PortfolioOverview {
  totalValue: string
  vaultedOrdinals: number
  fractionalShares: Array<{ contractAddress: string; name: string; symbol: string; balance: string; value: string }>
  lendingPositions: LendingPosition
  tradingPositions: Array<{ pair: string; position: string; pnl: string }>
}

export class FractionalizedOrdinalsPlatform {
  private ordinalsVault: OrdinalsVault
  private vesuProtocol: VesuProtocol
  private ekuboDEX: EkuboDEX
  private starknetAccount: Account | null = null

  constructor() {
    this.ordinalsVault = new OrdinalsVault()
    const provider = new Provider({ rpc: { nodeUrl: 'https://starknet-mainnet.public.blastapi.io' } })
    this.vesuProtocol = new VesuProtocol(provider)
    this.ekuboDEX = new EkuboDEX(provider)
  }

  /**
   * Initialize platform with wallet connections
   */
  async initialize(): Promise<{
    bitcoinConnected: boolean
    starknetConnected: boolean
    bitcoinAddress?: string
    starknetAddress?: string
  }> {
    try {
      // Connect Bitcoin wallet (Xverse)
      let bitcoinConnected = false
      let bitcoinAddress: string | undefined

      if (xverseWallet.isAvailable()) {
        const bitcoinState = await xverseWallet.connect()
        bitcoinConnected = bitcoinState.isConnected
        bitcoinAddress = bitcoinState.address || undefined
      }

      // Connect Starknet wallet (would integrate with Argent, Braavos, etc.)
      let starknetConnected = false
      let starknetAddress: string | undefined

      // This would connect to a Starknet wallet
      // For now, simulate connection
      starknetConnected = true
      starknetAddress = '0xmockstarknetaddress'

      return {
        bitcoinConnected,
        starknetConnected,
        bitcoinAddress,
        starknetAddress
      }
    } catch (error) {
      console.error('Error initializing platform:', error)
      throw new Error(`Failed to initialize platform: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Get user's supported Ordinals for vaulting
   */
  async getSupportedOrdinals(): Promise<Inscription[]> {
    try {
      const walletState = xverseWallet.getState()
      if (!walletState.isConnected) {
        throw new Error(ERROR_MESSAGES.WALLET_NOT_CONNECTED)
      }

      return xverseWallet.getSupportedInscriptions()
    } catch (error) {
      console.error('Error fetching supported Ordinals:', error)
      throw new Error(`Failed to fetch supported Ordinals: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Create vault and fractionalize Ordinal
   */
  async createVault(request: VaultCreationRequest): Promise<VaultCreationResult> {
    try {
      // Validate request
      if (request.totalShares < VAULT_CONFIG.MIN_SHARE_COUNT ||
          request.totalShares > VAULT_CONFIG.MAX_SHARE_COUNT) {
        throw new Error(`Invalid share count. Must be between ${VAULT_CONFIG.MIN_SHARE_COUNT} and ${VAULT_CONFIG.MAX_SHARE_COUNT}`)
      }

      // Get current floor price for validation
      const priceOracleResult = await ordinalsPriceOracle.getFloorPrice('Unknown Collection') // Would get actual collection name
      if (!priceOracleResult.success) {
        throw new Error(ERROR_MESSAGES.ORACLE_ERROR)
      }

      const floorPrice = (priceOracleResult.data as OrdinalsPrice).floorPrice
      const expectedPricePerShare = Math.floor(floorPrice / request.totalShares)

      // Validate price per share (within reasonable range)
      if (request.pricePerShare < expectedPricePerShare * 0.5 ||
          request.pricePerShare > expectedPricePerShare * 2) {
        throw new Error('Price per share is outside reasonable range')
      }

      // Get wallet state
      const walletState = xverseWallet.getState()
      if (!walletState.isConnected || !walletState.address) {
        throw new Error(ERROR_MESSAGES.WALLET_NOT_CONNECTED)
      }

      // Create vault request
      const vaultRequest: VaultRequest = {
        inscriptionId: request.inscriptionId,
        userBitcoinAddress: walletState.address,
        totalShares: request.totalShares,
        pricePerShare: request.pricePerShare,
        ordinalName: 'Unknown Ordinal' // Would get from inscription data
      }

      // Create Bitcoin vault
      const vaultResponse: VaultResponse = await this.ordinalsVault.vaultOrdinal(vaultRequest)

      // Deploy Starknet contract
      const createVaultParams: CreateVaultParams = {
        ordinalId: request.inscriptionId,
        ordinalName: vaultRequest.ordinalName,
        totalShares: request.totalShares,
        pricePerShare: request.pricePerShare,
        vaultAddress: vaultResponse.vaultAddress,
        redemptionThreshold: VAULT_CONFIG.REDEMPTION_THRESHOLD
      }

      const contract = await starknetContracts.deployFractionalizedOrdinalsContract(createVaultParams)

      // Mint shares to creator
      const totalSharesUint256 = uint256.bnToUint256(request.totalShares)
      await starknetContracts.mintShares(contract.address, walletState.address, totalSharesUint256)

      return {
        success: true,
        vaultId: vaultResponse.vaultId,
        contractAddress: contract.address,
        transactionId: vaultResponse.transactionId
      }
    } catch (error) {
      console.error('Error creating vault:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : ERROR_MESSAGES.TRANSACTION_FAILED
      }
    }
  }

  /**
   * Get user's portfolio overview
   */
  async getPortfolioOverview(userAddress: string): Promise<PortfolioOverview> {
    try {
      // Get user's vaulted Ordinals
      const vaultedOrdinals = 5 // Mock data - would fetch from database

      // Get fractional shares balances
      const fractionalShares = [
        {
          contractAddress: '0xmockcontract1',
          name: 'Fractionalized Bitcoin Punks',
          symbol: 'fBTP',
          balance: '1000',
          value: '0.05'
        },
        {
          contractAddress: '0xmockcontract2',
          name: 'Fractionalized NodeMonkes',
          symbol: 'fNMK',
          balance: '500',
          value: '0.025'
        }
      ]

      // Get lending positions
      const lendingPosition: LendingPosition = {
        suppliedTokens: [
          { token: '0xtoken1', amount: '1000', apy: 5.5 },
          { token: '0xtoken2', amount: '500', apy: 4.2 }
        ],
        borrowedTokens: [
          { token: '0xtoken3', amount: '200', interestRate: 6.0 }
        ],
        healthFactor: '2.5',
        totalCollateralValue: '1500',
        totalBorrowValue: '200'
      }

      // Get trading positions
      const tradingPositions = [
        {
          pair: 'fBTP/USDC',
          position: 'Long',
          pnl: '0.015'
        }
      ]

      // Calculate total value
      const sharesValue = fractionalShares.reduce((total, share) =>
        total + parseFloat(share.value), 0
      )
      const lendingValue = parseFloat(lendingPosition.totalCollateralValue) - parseFloat(lendingPosition.totalBorrowValue)
      const tradingPnL = tradingPositions.reduce((total, position) =>
        total + parseFloat(position.pnl), 0
      )

      const totalValue = (sharesValue + lendingValue + tradingPnL).toFixed(6)

      return {
        totalValue,
        vaultedOrdinals,
        fractionalShares,
        lendingPositions: lendingPosition,
        tradingPositions
      }
    } catch (error) {
      console.error('Error fetching portfolio overview:', error)
      throw new Error(`Failed to fetch portfolio overview: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Supply tokens to Vesu protocol for lending
   */
  async supplyToLending(tokenAddress: string, amount: number): Promise<string> {
    try {
      if (!this.starknetAccount) {
        throw new Error(ERROR_MESSAGES.WALLET_NOT_CONNECTED)
      }

      const amountUint256 = uint256.bnToUint256(amount)

      const txHash = await this.vesuProtocol.supply({
        tokenAddress,
        amount: amountUint256,
        account: this.starknetAccount
      })

      return txHash
    } catch (error) {
      console.error('Error supplying to lending:', error)
      throw new Error(`Failed to supply to lending: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Borrow against collateral
   */
  async borrowFromLending(
    collateralToken: string,
    collateralAmount: number,
    borrowToken: string,
    borrowAmount: number
  ): Promise<string> {
    try {
      if (!this.starknetAccount) {
        throw new Error(ERROR_MESSAGES.WALLET_NOT_CONNECTED)
      }

      // Calculate maximum borrowable amount based on LTV
      const maxBorrowable = collateralAmount * DEFICONFIG.VESU.MAX_LTV
      if (borrowAmount > maxBorrowable) {
        throw new Error(`Borrow amount exceeds maximum LTV. Maximum borrowable: ${maxBorrowable}`)
      }

      const txHash = await this.vesuProtocol.borrow({
        collateralToken,
        collateralAmount: uint256.bnToUint256(collateralAmount),
        borrowToken,
        borrowAmount: uint256.bnToUint256(borrowAmount),
        account: this.starknetAccount
      })

      return txHash
    } catch (error) {
      console.error('Error borrowing from lending:', error)
      throw new Error(`Failed to borrow from lending: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Create trading pool on Ekubo
   */
  async createTradingPool(tokenA: string, tokenB: string, fee: number = 3000): Promise<string> {
    try {
      if (!this.starknetAccount) {
        throw new Error(ERROR_MESSAGES.WALLET_NOT_CONNECTED)
      }

      const txHash = await this.ekuboDEX.createPool(tokenA, tokenB, fee)

      return txHash
    } catch (error) {
      console.error('Error creating trading pool:', error)
      throw new Error(`Failed to create trading pool: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Add liquidity to trading pool
   */
  async addLiquidity(poolAddress: string, amountA: number, amountB: number): Promise<string> {
    try {
      if (!this.starknetAccount) {
        throw new Error(ERROR_MESSAGES.WALLET_NOT_CONNECTED)
      }

      const txHash = await this.ekuboDEX.addLiquidity(
        poolAddress,
        uint256.bnToUint256(amountA),
        uint256.bnToUint256(amountB)
      )

      return txHash
    } catch (error) {
      console.error('Error adding liquidity:', error)
      throw new Error(`Failed to add liquidity: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Execute token swap
   */
  async swapTokens(
    tokenIn: string,
    tokenOut: string,
    amountIn: number,
    minAmountOut: number
  ): Promise<string> {
    try {
      if (!this.starknetAccount) {
        throw new Error(ERROR_MESSAGES.WALLET_NOT_CONNECTED)
      }

      const txHash = await this.ekuboDEX.swap(
        tokenIn,
        tokenOut,
        uint256.bnToUint256(amountIn),
        uint256.bnToUint256(minAmountOut)
      )

      return txHash
    } catch (error) {
      console.error('Error swapping tokens:', error)
      throw new Error(`Failed to swap tokens: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Get current prices for supported collections
   */
  async getCurrentPrices(): Promise<Map<string, OrdinalsPrice>> {
    try {
      const collections = [
        'Bitcoin Punks',
        'NodeMonkes',
        'Bitcoin Frogs',
        'Rocks',
        'DeGods',
        'BTC DeGods',
        'Pudgy Penguins',
        'Ordinals Maxi Biz'
      ]

      const prices = new Map<string, OrdinalsPrice>()

      for (const collection of collections) {
        const result = await ordinalsPriceOracle.getFloorPrice(collection)
        if (result.success && result.data) {
          prices.set(collection, result.data as OrdinalsPrice)
        }
      }

      return prices
    } catch (error) {
      console.error('Error fetching current prices:', error)
      throw new Error(`Failed to fetch current prices: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Redeem Ordinal from vault
   */
  async redeemOrdinal(vaultId: string, sharesToBurn: number): Promise<string> {
    try {
      // Get vault information
      const vaultInfo = await starknetContracts.getVaultInfo(vaultId)

      // Check if user has enough shares
      const userAddress = '0xmockuseraddress' // Would get from wallet
      const userBalance = await starknetContracts.getShareBalance(vaultId, userAddress)

      if (uint256.uint256ToBN(userBalance).toNumber() < sharesToBurn) {
        throw new Error(ERROR_MESSAGES.INSUFFICIENT_BALANCE)
      }

      // Check redemption threshold
      const redemptionThreshold = vaultInfo.redemptionThreshold
      const requiredShares = Math.floor(uint256.uint256ToBN(vaultInfo.totalShares).toNumber() * redemptionThreshold / 100)

      if (sharesToBurn < requiredShares) {
        throw new Error(`Insufficient shares for redemption. Minimum required: ${requiredShares}`)
      }

      // Burn shares
      await starknetContracts.burnShares(vaultId, uint256.bnToUint256(sharesToBurn))

      // Create Bitcoin redemption transaction
      const redemptionTxId = await this.ordinalsVault.createRedemptionTransaction(
        vaultId,
        userAddress,
        sharesToBurn
      )

      return redemptionTxId
    } catch (error) {
      console.error('Error redeeming Ordinal:', error)
      throw new Error(`Failed to redeem Ordinal: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Get platform statistics
   */
  async getPlatformStats(): Promise<{
    totalVaultedOrdinals: number
    totalLiquidity: string
    totalBorrowed: string
    activeUsers: number
    tradingVolume24h: string
  }> {
    try {
      // Mock statistics - would fetch from database/analytics
      return {
        totalVaultedOrdinals: 1250,
        totalLiquidity: '5250000', // 52.5 BTC equivalent
        totalBorrowed: '1250000', // 12.5 BTC equivalent
        activeUsers: 3420,
        tradingVolume24h: '850000' // 8.5 BTC equivalent
      }
    } catch (error) {
      console.error('Error fetching platform stats:', error)
      throw new Error(`Failed to fetch platform stats: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }
}

// Create singleton instance
export const platformService = new FractionalizedOrdinalsPlatform()