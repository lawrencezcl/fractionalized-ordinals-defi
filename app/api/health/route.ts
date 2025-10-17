import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const timestamp = new Date().toISOString()
    const networkEnv = process.env.NEXT_PUBLIC_NETWORK_ENV || 'mainnet'
    const nodeEnv = process.env.NODE_ENV || 'development'

    // Check critical dependencies
    const health = {
      status: 'healthy',
      timestamp,
      environment: nodeEnv,
      network: networkEnv,
      version: process.env.npm_package_version || '0.1.0',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      checks: {
        server: true,
        nextjs: true,
        environment: !!process.env.NEXT_PUBLIC_NETWORK_ENV
      }
    }

    return NextResponse.json(health, {
      status: 200,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}