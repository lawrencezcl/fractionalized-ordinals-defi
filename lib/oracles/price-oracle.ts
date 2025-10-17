import axios from 'axios'
import { API_ENDPOINTS, ERROR_MESSAGES } from '../constants'
import { NetworkConfig } from '../config/network'

export interface OrdinalsPrice {
  collectionId: string
  collectionName: string
  floorPrice: number // in satoshis
  volume24h: number
  marketCap: number
  supply: number
  lastUpdated: number
  priceChange24h: number
}

export interface BitcoinPrice {
  usd: number
  satoshi: number
  lastUpdated: number
}

export interface OracleResponse {
  success: boolean
  data?: OrdinalsPrice | BitcoinPrice
  error?: string
}

export class OrdinalsPriceOracle {
  private cache: Map<string, { data: OrdinalsPrice; timestamp: number }> = new Map()
  private readonly CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

  /**
   * Get floor price for a specific Ordinals collection
   */
  async getFloorPrice(collectionName: string): Promise<OracleResponse> {
    try {
      // Check cache first
      const cacheKey = collectionName.toLowerCase()
      const cached = this.cache.get(cacheKey)

      if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
        return { success: true, data: cached.data }
      }

      // Try multiple API sources for redundancy
      const sources = [
        this.fetchFromMagicEden,
        this.fetchFromOrdinalHub,
        this.fetchFromGamma
      ]

      for (const source of sources) {
        try {
          const result = await source(collectionName)
          if (result.success && result.data) {
            // Cache the result
            this.cache.set(cacheKey, {
              data: result.data,
              timestamp: Date.now()
            })
            return result
          }
        } catch (error) {
          console.warn(`Failed to fetch from ${source.name}:`, error)
          continue
        }
      }

      throw new Error('All price sources failed')
    } catch (error) {
      console.error('Error fetching floor price:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : ERROR_MESSAGES.ORACLE_ERROR
      }
    }
  }

  /**
   * Get Bitcoin price in USD
   */
  async getBitcoinPrice(): Promise<OracleResponse> {
    try {
      const response = await axios.get(
        'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true'
      )

      if (response.data && response.data.bitcoin) {
        const btcData = response.data.bitcoin
        const satoshiValue = 1 / btcData.usd * 100000000 // 1 BTC = 100M satoshis

        const priceData: BitcoinPrice = {
          usd: btcData.usd,
          satoshi: satoshiValue,
          lastUpdated: Date.now()
        }

        return { success: true, data: priceData }
      }

      throw new Error('Invalid price data format')
    } catch (error) {
      console.error('Error fetching Bitcoin price:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : ERROR_MESSAGES.ORACLE_ERROR
      }
    }
  }

  /**
   * Fetch from Magic Eden API
   */
  private async fetchFromMagicEden(collectionName: string): Promise<OracleResponse> {
    try {
      // First, search for the collection
      const searchResponse = await axios.get(
        `${API_ENDPOINTS.MAGIC_EDEN}/collections?q=${encodeURIComponent(collectionName)}&limit=10`
      )

      if (!searchResponse.data?.collections?.length) {
        throw new Error('Collection not found on Magic Eden')
      }

      const collection = searchResponse.data.collections[0]
      const collectionSymbol = collection.symbol

      // Get collection stats
      const statsResponse = await axios.get(
        `${API_ENDPOINTS.MAGIC_EDEN}/collections/${collectionSymbol}/stats`
      )

      if (!statsResponse.data) {
        throw new Error('Failed to fetch collection stats')
      }

      const stats = statsResponse.data
      const floorPriceInBTC = stats.floorPrice?.price || 0
      const floorPriceInSats = Math.floor(floorPriceInBTC * 100000000)

      const priceData: OrdinalsPrice = {
        collectionId: collection.symbol,
        collectionName: collection.name,
        floorPrice: floorPriceInSats,
        volume24h: stats.volume1day || 0,
        marketCap: stats.marketCap || 0,
        supply: stats.supply || 0,
        lastUpdated: Date.now(),
        priceChange24h: stats.floorPrice?.change24h || 0
      }

      return { success: true, data: priceData }
    } catch (error) {
      throw new Error(`Magic Eden API error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Fetch from OrdinalHub API
   */
  private async fetchFromOrdinalHub(collectionName: string): Promise<OracleResponse> {
    try {
      const response = await axios.get(
        `${API_ENDPOINTS.ORDINALHUB}/collections/search?q=${encodeURIComponent(collectionName)}`
      )

      if (!response.data?.length) {
        throw new Error('Collection not found on OrdinalHub')
      }

      const collection = response.data[0]
      const floorPriceInSats = collection.floor_price || 0

      const priceData: OrdinalsPrice = {
        collectionId: collection.id,
        collectionName: collection.name,
        floorPrice: floorPriceInSats,
        volume24h: collection.volume_24h || 0,
        marketCap: collection.market_cap || 0,
        supply: collection.total_supply || 0,
        lastUpdated: Date.now(),
        priceChange24h: collection.price_change_24h || 0
      }

      return { success: true, data: priceData }
    } catch (error) {
      throw new Error(`OrdinalHub API error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Fetch from Gamma API
   */
  private async fetchFromGamma(collectionName: string): Promise<OracleResponse> {
    try {
      const response = await axios.get(
        `${API_ENDPOINTS.GAMMA}/collections/search?q=${encodeURIComponent(collectionName)}`
      )

      if (!response.data?.collections?.length) {
        throw new Error('Collection not found on Gamma')
      }

      const collection = response.data.collections[0]
      const floorPriceInBTC = collection.floor_price || 0
      const floorPriceInSats = Math.floor(floorPriceInBTC * 100000000)

      const priceData: OrdinalsPrice = {
        collectionId: collection.id,
        collectionName: collection.name,
        floorPrice: floorPriceInSats,
        volume24h: collection.volume_24h || 0,
        marketCap: collection.market_cap || 0,
        supply: collection.total_supply || 0,
        lastUpdated: Date.now(),
        priceChange24h: collection.price_change_24h || 0
      }

      return { success: true, data: priceData }
    } catch (error) {
      throw new Error(`Gamma API error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Get price history for a collection
   */
  async getPriceHistory(collectionName: string, days: number = 30): Promise<OracleResponse> {
    try {
      // This would typically fetch historical price data
      // For now, return mock historical data
      const history = []
      const now = Date.now()
      const dayMs = 24 * 60 * 60 * 1000

      for (let i = days; i >= 0; i--) {
        const timestamp = now - (i * dayMs)
        const randomVariation = 0.8 + Math.random() * 0.4 // 80% to 120% of current price

        history.push({
          timestamp,
          price: Math.floor(100000 * randomVariation), // Mock price in satoshis
          volume: Math.floor(1000000 * randomVariation) // Mock volume
        })
      }

      return { success: true, data: history as any }
    } catch (error) {
      console.error('Error fetching price history:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : ERROR_MESSAGES.ORACLE_ERROR
      }
    }
  }

  /**
   * Get trending collections
   */
  async getTrendingCollections(): Promise<OracleResponse> {
    try {
      const response = await axios.get(
        `${API_ENDPOINTS.MAGIC_EDEN}/collections/trending?limit=10`
      )

      if (!response.data?.collections) {
        throw new Error('Failed to fetch trending collections')
      }

      const trending = response.data.collections.map((collection: any) => ({
        collectionId: collection.symbol,
        collectionName: collection.name,
        floorPrice: Math.floor((collection.floorPrice?.price || 0) * 100000000),
        volume24h: collection.volume1day || 0,
        priceChange24h: collection.floorPrice?.change24h || 0,
        image: collection.image
      }))

      return { success: true, data: trending as any }
    } catch (error) {
      console.error('Error fetching trending collections:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : ERROR_MESSAGES.ORACLE_ERROR
      }
    }
  }

  /**
   * Calculate price for fractional shares
   */
  calculateSharePrice(floorPrice: number, totalShares: number): number {
    return Math.floor(floorPrice / totalShares)
  }

  /**
   * Get market cap for fractionalized collection
   */
  calculateMarketCap(floorPrice: number, totalSupply: number): number {
    return floorPrice * totalSupply
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear()
  }

  /**
   * Get cache size
   */
  getCacheSize(): number {
    return this.cache.size
  }

  /**
   * Validate price data
   */
  private validatePriceData(data: any): boolean {
    return (
      data &&
      typeof data.collectionId === 'string' &&
      typeof data.collectionName === 'string' &&
      typeof data.floorPrice === 'number' &&
      data.floorPrice >= 0 &&
      typeof data.lastUpdated === 'number'
    )
  }
}

// Create singleton instance
export const ordinalsPriceOracle = new OrdinalsPriceOracle()

export class BitcoinPriceOracle {
  /**
   * Get current Bitcoin price with multiple sources
   */
  async getCurrentPrice(): Promise<OracleResponse> {
    const sources = [
      this.fetchFromCoinGecko,
      this.fetchFromCoinbase,
      this.fetchFromBinance
    ]

    for (const source of sources) {
      try {
        const result = await source()
        if (result.success) {
          return result
        }
      } catch (error) {
        console.warn(`Failed to fetch from ${source.name}:`, error)
        continue
      }
    }

    throw new Error('All Bitcoin price sources failed')
  }

  /**
   * Fetch from CoinGecko
   */
  private async fetchFromCoinGecko(): Promise<OracleResponse> {
    try {
      const response = await axios.get(
        'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true'
      )

      if (response.data?.bitcoin) {
        const btcData = response.data.bitcoin
        return {
          success: true,
          data: {
            usd: btcData.usd,
            satoshi: 1 / btcData.usd * 100000000,
            lastUpdated: Date.now()
          } as BitcoinPrice
        }
      }

      throw new Error('Invalid response format')
    } catch (error) {
      throw new Error(`CoinGecko error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Fetch from Coinbase
   */
  private async fetchFromCoinbase(): Promise<OracleResponse> {
    try {
      const response = await axios.get(
        'https://api.coinbase.com/v2/exchange-rates?currency=BTC'
      )

      if (response.data?.data?.rates?.USD) {
        const usdRate = parseFloat(response.data.data.rates.USD)
        return {
          success: true,
          data: {
            usd: usdRate,
            satoshi: 1 / usdRate * 100000000,
            lastUpdated: Date.now()
          } as BitcoinPrice
        }
      }

      throw new Error('Invalid response format')
    } catch (error) {
      throw new Error(`Coinbase error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Fetch from Binance
   */
  private async fetchFromBinance(): Promise<OracleResponse> {
    try {
      const response = await axios.get(
        'https://api.binance.com/api/v3/ticker/24hr?symbol=BTCUSDT'
      )

      if (response.data?.lastPrice) {
        const lastPrice = parseFloat(response.data.lastPrice)
        return {
          success: true,
          data: {
            usd: lastPrice,
            satoshi: 1 / lastPrice * 100000000,
            lastUpdated: Date.now()
          } as BitcoinPrice
        }
      }

      throw new Error('Invalid response format')
    } catch (error) {
      throw new Error(`Binance error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }
}

export const bitcoinPriceOracle = new BitcoinPriceOracle()