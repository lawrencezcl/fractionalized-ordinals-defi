export interface XverseProvider {
  connect: () => Promise<string>
  disconnect: () => Promise<void>
  getAccounts: () => Promise<string[]>
  signTransaction: (psbtBase64: string) => Promise<string>
  signMessage: (message: string, address: string) => Promise<string>
  sendBitcoin: (recipients: Array<{ address: string; amount: number; inscription?: string }>) => Promise<{ txid: string }>
  getBalance: () => Promise<number>
  getInscriptions: () => Promise<Inscription[]>
}

export interface Inscription {
  id: string
  content: string
  content_type: string
  content_length: number
  inscription_number: number
  satpoint: string
  address: string
  output_value: number
  preview: string
  timestamp: number
  genesis_address: string
  genesis_fee: number
  genesis_height: number
  location: string
  output: string
  offset: number
  sat_ordinal: string
  sat_rarity: string
  collection?: {
    name: string
    id: string
  }
}

export interface XverseWalletState {
  isConnected: boolean
  address: string | null
  publicKey: string | null
  balance: number
  inscriptions: Inscription[]
  network: 'mainnet' | 'testnet'
  networkName: string
}

class XverseWallet {
  private provider: XverseProvider | null = null
  private state: XverseWalletState = {
    isConnected: false,
    address: null,
    publicKey: null,
    balance: 0,
    inscriptions: [],
    network: 'testnet', // Default to testnet for development
    networkName: 'Testnet'
  }

  constructor() {
    this.initializeProvider()
  }

  /**
   * Initialize Xverse provider
   */
  private async initializeProvider(): Promise<void> {
    if (typeof window !== 'undefined' && 'BitcoinProvider' in window) {
      this.provider = (window as any).BitcoinProvider

      // Listen for account changes
      this.provider.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length === 0) {
          this.disconnect()
        } else {
          this.state.address = accounts[0]
        }
      })

      // Listen for network changes
      this.provider.on('networkChanged', (network: string) => {
        this.state.network = network === 'mainnet' ? 'mainnet' : 'testnet'
        this.state.networkName = network === 'mainnet' ? 'Mainnet' : 'Testnet'
      })

      // Listen for disconnection
      this.provider.on('disconnect', () => {
        this.disconnect()
      })
    }
  }

  /**
   * Check if Xverse wallet is available
   */
  isAvailable(): boolean {
    return typeof window !== 'undefined' && 'BitcoinProvider' in window
  }

  /**
   * Connect to Xverse wallet
   */
  async connect(): Promise<XverseWalletState> {
    if (!this.provider) {
      throw new Error('Xverse wallet is not available. Please install Xverse wallet.')
    }

    try {
      const accounts = await this.provider.connect()

      if (accounts.length === 0) {
        throw new Error('No accounts found')
      }

      this.state.isConnected = true
      this.state.address = accounts[0]

      // Get balance and inscriptions
      await this.updateBalance()
      await this.updateInscriptions()

      return { ...this.state }
    } catch (error) {
      console.error('Error connecting to Xverse wallet:', error)
      throw new Error(`Failed to connect wallet: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Disconnect from Xverse wallet
   */
  async disconnect(): Promise<void> {
    if (this.provider) {
      try {
        await this.provider.disconnect()
      } catch (error) {
        console.error('Error disconnecting from wallet:', error)
      }
    }

    this.state = {
      isConnected: false,
      address: null,
      publicKey: null,
      balance: 0,
      inscriptions: [],
      network: 'testnet',
      networkName: 'Testnet'
    }
  }

  /**
   * Get current wallet state
   */
  getState(): XverseWalletState {
    return { ...this.state }
  }

  /**
   * Update wallet balance
   */
  private async updateBalance(): Promise<void> {
    if (!this.provider || !this.state.isConnected) {
      return
    }

    try {
      this.state.balance = await this.provider.getBalance()
    } catch (error) {
      console.error('Error updating balance:', error)
    }
  }

  /**
   * Update wallet inscriptions
   */
  private async updateInscriptions(): Promise<void> {
    if (!this.provider || !this.state.isConnected) {
      return
    }

    try {
      this.state.inscriptions = await this.provider.getInscriptions()
    } catch (error) {
      console.error('Error updating inscriptions:', error)
    }
  }

  /**
   * Send Bitcoin with optional inscription
   */
  async sendBitcoin(
    recipients: Array<{ address: string; amount: number; inscription?: string }>
  ): Promise<{ txid: string }> {
    if (!this.provider || !this.state.isConnected) {
      throw new Error('Wallet not connected')
    }

    try {
      const result = await this.provider.sendBitcoin(recipients)

      // Update balance after transaction
      await this.updateBalance()

      return result
    } catch (error) {
      console.error('Error sending Bitcoin:', error)
      throw new Error(`Failed to send Bitcoin: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Sign a transaction
   */
  async signTransaction(psbtBase64: string): Promise<string> {
    if (!this.provider || !this.state.isConnected) {
      throw new Error('Wallet not connected')
    }

    try {
      return await this.provider.signTransaction(psbtBase64)
    } catch (error) {
      console.error('Error signing transaction:', error)
      throw new Error(`Failed to sign transaction: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Sign a message
   */
  async signMessage(message: string): Promise<string> {
    if (!this.provider || !this.state.isConnected || !this.state.address) {
      throw new Error('Wallet not connected')
    }

    try {
      return await this.provider.signMessage(message, this.state.address)
    } catch (error) {
      console.error('Error signing message:', error)
      throw new Error(`Failed to sign message: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Get inscriptions filtered by collection
   */
  getInscriptionsByCollection(collectionName: string): Inscription[] {
    return this.state.inscriptions.filter(
      inscription => inscription.collection?.name.toLowerCase() === collectionName.toLowerCase()
    )
  }

  /**
   * Get inscription by ID
   */
  getInscriptionById(inscriptionId: string): Inscription | undefined {
    return this.state.inscriptions.find(
      inscription => inscription.id === inscriptionId
    )
  }

  /**
   * Get supported inscriptions for fractionalization
   */
  getSupportedInscriptions(): Inscription[] {
    const supportedCollections = [
      'Bitcoin Punks',
      'NodeMonkes',
      'Bitcoin Frogs',
      'Rocks',
      'DeGods',
      'BTC DeGods',
      'Pudgy Penguins',
      'Ordinals Maxi Biz'
    ]

    return this.state.inscriptions.filter(
      inscription =>
        inscription.collection &&
        supportedCollections.includes(inscription.collection.name)
    )
  }

  /**
   * Refresh wallet data
   */
  async refresh(): Promise<void> {
    if (!this.state.isConnected) {
      return
    }

    await this.updateBalance()
    await this.updateInscriptions()
  }

  /**
   * Request wallet permissions
   */
  async requestPermissions(): Promise<boolean> {
    if (!this.provider) {
      throw new Error('Xverse wallet is not available')
    }

    try {
      await this.connect()
      return true
    } catch (error) {
      console.error('Error requesting permissions:', error)
      return false
    }
  }

  /**
   * Get wallet info
   */
  getWalletInfo(): {
    name: string
    version: string
    network: string
    connected: boolean
  } {
    return {
      name: 'Xverse',
      version: '1.0.0', // This would be dynamic in real implementation
      network: this.state.network,
      connected: this.state.isConnected
    }
  }

  /**
   * Check if specific inscription is owned by the wallet
   */
  ownsInscription(inscriptionId: string): boolean {
    return this.state.inscriptions.some(
      inscription => inscription.id === inscriptionId
    )
  }

  /**
   * Get total value of inscriptions (estimated)
   */
  getInscriptionsValue(): number {
    // This would typically use a price oracle
    // For now, return a mock calculation
    return this.state.inscriptions.length * 100000 // Mock value in satoshis
  }
}

// Create singleton instance
export const xverseWallet = new XverseWallet()

// Export types for external use
export type { XverseWallet }