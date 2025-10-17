import { Account, Contract, Provider, cairo, num, uint256, stark, hash } from 'starknet'
import fs from 'fs'
import path from 'path'

// Testnet configuration
const TESTNET_RPC_URL = 'https://starknet-goerli.public.blastapi.io'
const TESTNET_ACCOUNT_ADDRESS = '0x1234567890abcdef1234567890abcdef12345678' // Replace with actual testnet account
const TESTNET_PRIVATE_KEY = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef' // Replace with actual private key

// Contract class hashes (these would be the actual compiled contract hashes)
const FRACTIONALIZED_ORDINALS_CLASS_HASH = '0x048dd32de97e49e5e6d08ff13b7f1e3f0d0dd8a9311c0d9c3e1b0b1b3b3b3b3b'
const PRICE_ORACLE_CLASS_HASH = '0x05a6f307cb0a58c4d3d4b3c4e0b8c0c0b8c0b8c0b8c0b8c0b8c0b8c0b8c0b8c'

interface DeploymentResult {
  contractAddress: string
  transactionHash: string
  blockNumber: number
  success: boolean
  error?: string
}

class TestnetDeployer {
  private provider: Provider
  private account: Account

  constructor() {
    this.provider = new Provider({ rpc: { nodeUrl: TESTNET_RPC_URL } })
    this.account = new Account(
      this.provider,
      TESTNET_ACCOUNT_ADDRESS,
      TESTNET_PRIVATE_KEY
    )
  }

  async deployFractionalizedOrdinalsFactory(): Promise<DeploymentResult> {
    try {
      console.log('🚀 Deploying Fractionalized Ordinals Factory to Starknet Testnet...')

      // Deploy the contract
      const deployResponse = await this.account.declareAndDeploy({
        contract: fs.readFileSync('./contracts/FractionalizedOrdinalsFactory.json', 'utf-8'),
        classHash: FRACTIONALIZED_ORDINALS_CLASS_HASH,
        constructorCalldata: [
          TESTNET_ACCOUNT_ADDRESS, // Deployer as initial admin
          75, // Default redemption threshold (75%)
        ]
      })

      const result: DeploymentResult = {
        contractAddress: deployResponse.deploy.contract_address,
        transactionHash: deployResponse.deploy.transaction_hash,
        blockNumber: deployResponse.deploy.block_number,
        success: true
      }

      console.log('✅ Factory deployed successfully!')
      console.log(`   Contract Address: ${result.contractAddress}`)
      console.log(`   Transaction Hash: ${result.transactionHash}`)

      return result
    } catch (error) {
      console.error('❌ Failed to deploy factory:', error)
      return {
        contractAddress: '',
        transactionHash: '',
        blockNumber: 0,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  async deployPriceOracle(): Promise<DeploymentResult> {
    try {
      console.log('🔮 Deploying Price Oracle to Starknet Testnet...')

      const deployResponse = await this.account.declareAndDeploy({
        contract: fs.readFileSync('./contracts/PriceOracle.json', 'utf-8'),
        classHash: PRICE_ORACLE_CLASS_HASH,
        constructorCalldata: [
          TESTNET_ACCOUNT_ADDRESS, // Deployer as initial oracle updater
        ]
      })

      const result: DeploymentResult = {
        contractAddress: deployResponse.deploy.contract_address,
        transactionHash: deployResponse.deploy.transaction_hash,
        blockNumber: deployResponse.deploy.block_number,
        success: true
      }

      console.log('✅ Price Oracle deployed successfully!')
      console.log(`   Contract Address: ${result.contractAddress}`)
      console.log(`   Transaction Hash: ${result.transactionHash}`)

      return result
    } catch (error) {
      console.error('❌ Failed to deploy price oracle:', error)
      return {
        contractAddress: '',
        transactionHash: '',
        blockNumber: 0,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  async verifyDeployment(contractAddress: string): Promise<boolean> {
    try {
      const code = await this.provider.getCode(contractAddress)
      return code.abi && code.abi.length > 0
    } catch (error) {
      console.error('Error verifying deployment:', error)
      return false
    }
  }

  async deployAll(): Promise<{
    factory: DeploymentResult
    oracle: DeploymentResult
  }> {
    console.log('🏗️  Starting testnet deployment...\n')

    // Deploy factory
    const factoryResult = await this.deployFractionalizedOrdinalsFactory()

    // Deploy oracle
    const oracleResult = await this.deployPriceOracle()

    // Verify deployments
    console.log('\n🔍 Verifying deployments...')
    const factoryVerified = await this.verifyDeployment(factoryResult.contractAddress)
    const oracleVerified = await this.verifyDeployment(oracleResult.contractAddress)

    console.log(`   Factory verified: ${factoryVerified ? '✅' : '❌'}`)
    console.log(`   Oracle verified: ${oracleVerified ? '✅' : '❌'}`)

    return {
      factory: factoryResult,
      oracle: oracleResult
    }
  }
}

// Testnet faucet helper
async function getTestnetFunds(): Promise<void> {
  console.log('💰 Getting testnet funds...')
  console.log(`   Bitcoin Testnet Faucet: https://bitcoinfaucet.uo1.net`)
  console.log(`   Starknet Testnet Faucet: https://faucet.sepolia.starknet.io/`)
  console.log('\n   Steps:')
  console.log('   1. Visit the Bitcoin faucet to get testnet BTC')
  console.log('   2. Visit the Starknet faucet to get testnet ETH')
  console.log('   3. Update the account address and private key in this script')
  console.log('   4. Run the deployment script again')
}

// Configuration file generator
function generateTestnetConfig(deployments: {
  factory: DeploymentResult
  oracle: DeploymentResult
}): void {
  const config = {
    network: 'testnet',
    starknet: {
      rpcUrl: TESTNET_RPC_URL,
      chainId: '0x534e5f4f4e45', // SN_TESTNET
      contracts: {
        factory: deployments.factory.contractAddress,
        oracle: deployments.oracle.contractAddress,
      }
    },
    bitcoin: {
      network: 'testnet',
      rpcUrl: 'https://blockstream.info/testnet/api',
    },
    deployed: {
      timestamp: new Date().toISOString(),
      factory: deployments.factory,
      oracle: deployments.oracle,
    }
  }

  const configPath = './config/testnet-deployment.json'
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2))
  console.log(`📝 Testnet configuration saved to: ${configPath}`)
}

// Main execution
async function main() {
  // Check if we have proper credentials
  if (!TESTNET_ACCOUNT_ADDRESS || !TESTNET_PRIVATE_KEY) {
    console.log('⚠️  Please update the testnet account credentials in this script')
    await getTestnetFunds()
    return
  }

  // Check if contract files exist
  if (!fs.existsSync('./contracts/FractionalizedOrdinalsFactory.json')) {
    console.log('❌ Contract files not found. Please compile the contracts first.')
    console.log('   Run: npm run compile-contracts')
    return
  }

  const deployer = new TestnetDeployer()
  const deployments = await deployer.deployAll()

  if (deployments.factory.success && deployments.oracle.success) {
    generateTestnetConfig(deployments)
    console.log('\n🎉 Testnet deployment completed successfully!')
    console.log('\n📋 Next steps:')
    console.log('   1. Update frontend with new contract addresses')
    console.log('   2. Test the platform on testnet')
    console.log('   3. Verify all integrations work correctly')
  } else {
    console.log('\n❌ Testnet deployment failed. Please check the errors above.')
  }
}

// Run the deployment
if (require.main === module) {
  main().catch(console.error)
}

export { TestnetDeployer, getTestnetFunds, generateTestnetConfig }