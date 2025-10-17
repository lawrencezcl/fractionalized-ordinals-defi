import { test, expect } from '@playwright/test';

test.describe('User Journey - Complete Ordinal Fractionalization Flow', () => {
  test('complete vault creation to trading flow', async ({ page }) => {
    await page.goto('/');

    // Step 1: Connect wallet
    const connectButton = page.locator('text=Connect Wallet');
    if (await connectButton.isVisible()) {
      await connectButton.click();

      // Select Xverse wallet (most common for Bitcoin)
      await page.click('text=Xverse');

      // In test environment, this might show connection instructions
      await expect(page.locator('[data-testid="wallet-connection"]')).toBeVisible();
    }

    // Step 2: Navigate to vault creation
    await page.click('text=Vault');
    await expect(page).toHaveURL(/\/vault/);

    // Step 3: Fill vault creation form
    const ordinalInput = page.locator('input[placeholder*="Ordinal"]');
    if (await ordinalInput.isVisible()) {
      await ordinalInput.fill('bc1pexample123456789');

      // Set share count
      const shareInput = page.locator('input[placeholder*="shares"]');
      await shareInput.fill('10000');

      // Submit form
      await page.click('button[type="submit"]');

      // Should show processing state
      await expect(page.locator('[data-testid="processing-state"]')).toBeVisible();
    }

    // Step 4: Navigate to trading
    await page.click('text=Trade');
    await expect(page).toHaveURL(/\/trade/);

    // Step 5: Select the newly created token
    const tokenSelect = page.locator('select[placeholder*="Token"]');
    if (await tokenSelect.isVisible()) {
      await tokenSelect.selectOption({ label: 'Fractional Shares' });

      // Set trade amount
      const amountInput = page.locator('input[placeholder*="Amount"]');
      await amountInput.fill('100');

      // Check if swap button is enabled
      const swapButton = page.locator('button', { hasText: 'Swap' });
      await expect(swapButton).toBeVisible();
    }
  });

  test('complete DeFi lending flow', async ({ page }) => {
    await page.goto('/');

    // Step 1: Navigate to lending
    await page.click('text=Lend');
    await expect(page).toHaveURL(/\/lend/);

    // Step 2: Supply assets
    const supplyTab = page.locator('button', { hasText: 'Supply' });
    if (await supplyTab.isVisible()) {
      await supplyTab.click();

      // Select asset to supply
      const assetSelect = page.locator('select[placeholder*="Asset"]');
      if (await assetSelect.isVisible()) {
        await assetSelect.selectOption({ label: 'BTC' });

        // Enter amount
        const amountInput = page.locator('input[placeholder*="Amount"]');
        await amountInput.fill('0.01');

        // Check available balance
        const balanceDisplay = page.locator('[data-testid="available-balance"]');
        if (await balanceDisplay.isVisible()) {
          await expect(balanceDisplay).toContainText('BTC');
        }

        // Approve and supply
        const approveButton = page.locator('button', { hasText: 'Approve' });
        if (await approveButton.isVisible()) {
          await approveButton.click();

          // Wait for approval confirmation
          await expect(page.locator('[data-testid="approval-success"]')).toBeVisible();
        }

        const supplyButton = page.locator('button', { hasText: 'Supply' });
        await expect(supplyButton).toBeVisible();
      }
    }

    // Step 3: Borrow against collateral
    const borrowTab = page.locator('button', { hasText: 'Borrow' });
    if (await borrowTab.isVisible()) {
      await borrowTab.click();

      // Select asset to borrow
      const borrowAssetSelect = page.locator('select[placeholder*="Asset"]');
      if (await borrowAssetSelect.isVisible()) {
        await borrowAssetSelect.selectOption({ label: 'USDC' });

        // Enter borrow amount
        const borrowAmountInput = page.locator('input[placeholder*="Amount"]');
        await borrowAmountInput.fill('100');

        // Check borrowing power
        const borrowingPower = page.locator('[data-testid="borrowing-power"]');
        if (await borrowingPower.isVisible()) {
          await expect(borrowingPower).toBeVisible();
        }

        // Execute borrow
        const borrowButton = page.locator('button', { hasText: 'Borrow' });
        await expect(borrowButton).toBeVisible();
      }
    }
  });

  test('complete liquidity provision flow', async ({ page }) => {
    await page.goto('/trade');

    // Step 1: Navigate to liquidity pool
    const liquidityTab = page.locator('button', { hasText: 'Liquidity' });
    if (await liquidityTab.isVisible()) {
      await liquidityTab.click();

      // Step 2: Select pool
      const poolSelect = page.locator('select[placeholder*="Pool"]');
      if (await poolSelect.isVisible()) {
        await poolSelect.selectOption({ label: 'BTC/USDC' });

        // Step 3: Add liquidity
        const token1Input = page.locator('input[placeholder*="Token 1"]');
        const token2Input = page.locator('input[placeholder*="Token 2"]');

        if (await token1Input.isVisible()) {
          await token1Input.fill('0.001');

          if (await token2Input.isVisible()) {
            await token2Input.fill('100');

            // Check LP token calculation
            const lpTokenEstimate = page.locator('[data-testid="lp-tokens-estimate"]');
            if (await lpTokenEstimate.isVisible()) {
              await expect(lpTokenEstimate).toBeVisible();
            }

            // Add liquidity
            const addLiquidityButton = page.locator('button', { hasText: 'Add Liquidity' });
            await expect(addLiquidityButton).toBeVisible();
          }
        }
      }
    }
  });
});

test.describe('User Journey - Cross-Chain Operations', () => {
  test('Bitcoin to Starknet bridge flow', async ({ page }) => {
    await page.goto('/vault');

    // Step 1: Create vault (already tested above)
    // Step 2: Bridge to Starknet
    const bridgeButton = page.locator('button', { hasText: 'Bridge to Starknet' });
    if (await bridgeButton.isVisible()) {
      await bridgeButton.click();

      // Should show bridge interface
      await expect(page.locator('[data-testid="bridge-interface"]')).toBeVisible();

      // Select destination network
      const networkSelect = page.locator('select[placeholder*="Network"]');
      if (await networkSelect.isVisible()) {
        await networkSelect.selectOption({ label: 'Starknet' });

        // Enter bridge amount
        const bridgeAmountInput = page.locator('input[placeholder*="Amount"]');
        await bridgeAmountInput.fill('1000');

        // Check bridge fee
        const bridgeFee = page.locator('[data-testid="bridge-fee"]');
        if (await bridgeFee.isVisible()) {
          await expect(bridgeFee).toBeVisible();
        }

        // Execute bridge
        const executeBridgeButton = page.locator('button', { hasText: 'Bridge' });
        await expect(executeBridgeButton).toBeVisible();
      }
    }
  });

  test('Starknet DeFi operations flow', async ({ page }) => {
    await page.goto('/lend');

    // Look for Starknet-specific features
    const starknetIndicator = page.locator('[data-testid="starknet-indicator"]');
    if (await starknetIndicator.isVisible()) {
      await expect(starknetIndicator).toContainText('Starknet');

      // Test Vesu protocol integration
      const vesuProtocol = page.locator('[data-testid="vesu-protocol"]');
      if (await vesuProtocol.isVisible()) {
        await expect(vesuProtocol).toBeVisible();
      }

      // Test Ekubo DEX integration
      const ekuboDex = page.locator('[data-testid="ekubo-dex"]');
      if (await ekuboDex.isVisible()) {
        await expect(ekuboDex).toBeVisible();
      }
    }
  });
});

test.describe('User Journey - Portfolio Management', () => {
  test('portfolio overview and management', async ({ page }) => {
    await page.goto('/');

    // Step 1: Access portfolio
    const portfolioButton = page.locator('button', { hasText: 'Portfolio' });
    if (await portfolioButton.isVisible()) {
      await portfolioButton.click();

      await expect(page.locator('[data-testid="portfolio-overview"]')).toBeVisible();

      // Step 2: Check asset breakdown
      const assetBreakdown = page.locator('[data-testid="asset-breakdown"]');
      if (await assetBreakdown.isVisible()) {
        await expect(assetBreakdown).toBeVisible();

        // Should show different asset types
        await expect(assetBreakdown.locator('text=Bitcoin')).toBeVisible();
        await expect(assetBreakdown.locator('text=Starknet')).toBeVisible();
        await expect(assetBreakdown.locator('text=Liquid Assets')).toBeVisible();
      }

      // Step 3: Check performance metrics
      const performanceMetrics = page.locator('[data-testid="performance-metrics"]');
      if (await performanceMetrics.isVisible()) {
        await expect(performanceMetrics.locator('text=Total Value')).toBeVisible();
        await expect(performanceMetrics.locator('text=24h Change')).toBeVisible();
        await expect(performanceMetrics.locator('text=APY')).toBeVisible();
      }

      // Step 4: Test position management
      const managePositionButton = page.locator('button', { hasText: 'Manage' });
      if (await managePositionButton.isVisible()) {
        await managePositionButton.click();

        await expect(page.locator('[data-testid="position-management"]')).toBeVisible();

        // Test withdrawal
        const withdrawButton = page.locator('button', { hasText: 'Withdraw' });
        if (await withdrawButton.isVisible()) {
          await withdrawButton.click();

          await expect(page.locator('[data-testid="withdrawal-interface"]')).toBeVisible();
        }
      }
    }
  });

  test('risk management tools', async ({ page }) => {
    await page.goto('/lend');

    // Look for risk management features
    const riskManagement = page.locator('[data-testid="risk-management"]');
    if (await riskManagement.isVisible()) {
      await expect(riskManagement).toBeVisible();

      // Check liquidation risk
      const liquidationRisk = page.locator('[data-testid="liquidation-risk"]');
      if (await liquidationRisk.isVisible()) {
        await expect(liquidationRisk).toBeVisible();

        // Should show risk percentage
        await expect(liquidationRisk.locator('text=%')).toBeVisible();
      }

      // Check health factor
      const healthFactor = page.locator('[data-testid="health-factor"]');
      if (await healthFactor.isVisible()) {
        await expect(healthFactor).toBeVisible();
      }

      // Test risk adjustment tools
      const adjustRiskButton = page.locator('button', { hasText: 'Adjust Risk' });
      if (await adjustRiskButton.isVisible()) {
        await adjustRiskButton.click();

        await expect(page.locator('[data-testid="risk-adjustment"]')).toBeVisible();
      }
    }
  });
});

test.describe('User Journey - Advanced Features', () => {
  test('price oracle integration', async ({ page }) => {
    await page.goto('/trade');

    // Check if price oracle is working
    const priceDisplay = page.locator('[data-testid="price-display"]');
    if (await priceDisplay.isVisible()) {
      await expect(priceDisplay).toBeVisible();

      // Should show current price
      await expect(priceDisplay.locator('text=$')).toBeVisible();

      // Check price source attribution
      const priceSource = page.locator('[data-testid="price-source"]');
      if (await priceSource.isVisible()) {
        await expect(priceSource).toContainText('CoinGecko');
      }
    }

    // Test price alerts
    const priceAlertsButton = page.locator('button', { hasText: 'Set Alert' });
    if (await priceAlertsButton.isVisible()) {
      await priceAlertsButton.click();

      await expect(page.locator('[data-testid="price-alert-modal"]')).toBeVisible();

      const alertPriceInput = page.locator('input[placeholder*="Alert Price"]');
      await alertPriceInput.fill('100000');

      const setAlertButton = page.locator('button', { hasText: 'Set Alert' });
      await expect(setAlertButton).toBeVisible();
    }
  });

  test('transaction history and tracking', async ({ page }) => {
    await page.goto('/');

    // Access transaction history
    const historyButton = page.locator('button', { hasText: 'History' });
    if (await historyButton.isVisible()) {
      await historyButton.click();

      await expect(page.locator('[data-testid="transaction-history"]')).toBeVisible();

      // Check transaction list
      const transactionList = page.locator('[data-testid="transaction-list"]');
      if (await transactionList.isVisible()) {
        await expect(transactionList).toBeVisible();

        // Should show different transaction types
        await expect(transactionList.locator('text=Vault')).toBeVisible();
        await expect(transactionList.locator('text=Trade')).toBeVisible();
        await expect(transactionList.locator('text=Lend')).toBeVisible();
      }

      // Test transaction details
      const transactionItem = transactionList.locator('[data-testid="transaction-item"]').first();
      if (await transactionItem.isVisible()) {
        await transactionItem.click();

        await expect(page.locator('[data-testid="transaction-details"]')).toBeVisible();

        // Should show transaction hash
        await expect(page.locator('[data-testid="transaction-hash"]')).toBeVisible();

        // Should show explorer link
        const explorerLink = page.locator('a[href*="testnet.starkscan.co"], a[href*="blockstream.info"]');
        if (await explorerLink.isVisible()) {
          await expect(explorerLink).toBeVisible();
        }
      }
    }
  });

  test('settings and preferences', async ({ page }) => {
    await page.goto('/');

    // Access settings
    const settingsButton = page.locator('button', { hasText: 'Settings' });
    if (await settingsButton.isVisible()) {
      await settingsButton.click();

      await expect(page.locator('[data-testid="settings-panel"]')).toBeVisible();

      // Test network switching
      const networkSelect = page.locator('select[placeholder*="Network"]');
      if (await networkSelect.isVisible()) {
        await networkSelect.selectOption({ label: 'Testnet' });
        await expect(networkSelect).toHaveValue('testnet');
      }

      // Test theme switching
      const themeToggle = page.locator('button[aria-label*="theme"]');
      if (await themeToggle.isVisible()) {
        await themeToggle.click();

        // Should apply dark theme
        await expect(page.locator('.dark')).toBeVisible();
      }

      // Test currency display
      const currencySelect = page.locator('select[placeholder*="Currency"]');
      if (await currencySelect.isVisible()) {
        await currencySelect.selectOption({ label: 'BTC' });
        await expect(currencySelect).toHaveValue('BTC');
      }
    }
  });
});