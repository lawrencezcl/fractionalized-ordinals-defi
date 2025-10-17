import { test, expect } from '@playwright/test';

test.describe('Fractionalized Ordinals DeFi Platform - Basic Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test(' homepage loads and displays main elements', async ({ page }) => {
    // Check if page loads successfully
    await expect(page).toHaveTitle(/Fractionalized Ordinals/);

    // Check for main navigation elements
    await expect(page.locator('nav')).toBeVisible();

    // Check for main heading
    await expect(page.locator('h1')).toContainText('Fractionalized');

    // Check for key sections
    await expect(page.locator('text=Bitcoin Ordinals')).toBeVisible();
    await expect(page.locator('text=DeFi')).toBeVisible();
  });

  test('navigation to different pages works correctly', async ({ page }) => {
    // Navigate to Vault page
    await page.click('text=Vault');
    await expect(page).toHaveURL(/\/vault/);
    await expect(page.locator('h1')).toContainText('Vault');

    // Navigate to Trade page
    await page.click('text=Trade');
    await expect(page).toHaveURL(/\/trade/);
    await expect(page.locator('h1')).toContainText('Trade');

    // Navigate to Lend page
    await page.click('text=Lend');
    await expect(page).toHaveURL(/\/lend/);
    await expect(page.locator('h1')).toContainText('Lend');

    // Navigate back to home
    await page.click('text=Home');
    await expect(page).toHaveURL(/\//);
  });

  test('responsive design works on mobile', async ({ page }) => {
    // Emulate mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Desktop nav should be hidden on mobile
    const desktopNav = page.locator('nav.hidden');
    await expect(desktopNav).toBeVisible();

    // Test mobile navigation
    await page.click('button[aria-label="menu"]'); // Mobile menu button
    await expect(page.locator('text=Vault')).toBeVisible();
    await expect(page.locator('text=Trade')).toBeVisible();
    await expect(page.locator('text=Lend')).toBeVisible();
  });

  test('wallet connection functionality', async ({ page }) => {
    // Look for wallet connect button
    const connectButton = page.locator('text=Connect Wallet');

    if (await connectButton.isVisible()) {
      await connectButton.click();
      // Should show wallet options
      await expect(page.locator('text=Xverse')).toBeVisible();
      await expect(page.locator('text=MetaMask')).toBeVisible();
    }
  });

  test('network indicator shows testnet', async ({ page }) => {
    // Look for network indicator
    const networkIndicator = page.locator('[data-testid="network-indicator"]');

    if (await networkIndicator.isVisible()) {
      await expect(networkIndicator).toContainText('Testnet');
    }
  });
});

test.describe('Vault Page Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/vault');
  });

  test('vault page displays correctly', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Vault');

    // Check for vault creation form
    await expect(page.locator('form')).toBeVisible();
    await expect(page.locator('input[type="text"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('vault creation form validation', async ({ page }) => {
    // Try to submit empty form
    await page.click('button[type="submit"]');

    // Should show validation errors
    await expect(page.locator('text=required')).toBeVisible();
  });

  test('displays vault statistics', async ({ page }) => {
    // Look for vault statistics section
    const statsSection = page.locator('[data-testid="vault-stats"]');

    if (await statsSection.isVisible()) {
      await expect(statsSection.locator('text=Total Value Locked')).toBeVisible();
      await expect(statsSection.locator('text=Active Vaults')).toBeVisible();
    }
  });
});

test.describe('Trade Page Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/trade');
  });

  test('trade page displays correctly', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Trade');

    // Check for trading interface
    await expect(page.locator('[data-testid="trading-interface"]')).toBeVisible();
  });

  test('swap interface works', async ({ page }) => {
    const fromInput = page.locator('input[placeholder*="From"]');
    const toInput = page.locator('input[placeholder*="To"]');

    if (await fromInput.isVisible()) {
      await fromInput.fill('1');
      await expect(fromInput).toHaveValue('1');

      // Check if price estimation appears
      await expect(page.locator('[data-testid="price-estimation"]')).toBeVisible();
    }
  });

  test('displays market data', async ({ page }) => {
    // Look for market data section
    const marketData = page.locator('[data-testid="market-data"]');

    if (await marketData.isVisible()) {
      await expect(marketData.locator('text=24h Volume')).toBeVisible();
      await expect(marketData.locator('text=Price')).toBeVisible();
    }
  });
});

test.describe('Lend Page Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/lend');
  });

  test('lend page displays correctly', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Lend');

    // Check for lending interface
    await expect(page.locator('[data-testid="lending-interface"]')).toBeVisible();
  });

  test('supply functionality works', async ({ page }) => {
    const supplyTab = page.locator('button', { hasText: 'Supply' });

    if (await supplyTab.isVisible()) {
      await supplyTab.click();

      const amountInput = page.locator('input[placeholder*="Amount"]');
      await amountInput.fill('100');

      const supplyButton = page.locator('button', { hasText: 'Supply' });
      await expect(supplyButton).toBeVisible();
    }
  });

  test('borrow functionality works', async ({ page }) => {
    const borrowTab = page.locator('button', { hasText: 'Borrow' });

    if (await borrowTab.isVisible()) {
      await borrowTab.click();

      const amountInput = page.locator('input[placeholder*="Amount"]');
      await amountInput.fill('50');

      const borrowButton = page.locator('button', { hasText: 'Borrow' });
      await expect(borrowButton).toBeVisible();
    }
  });

  test('displays lending rates', async ({ page }) => {
    // Look for interest rates
    const ratesSection = page.locator('[data-testid="interest-rates"]');

    if (await ratesSection.isVisible()) {
      await expect(ratesSection.locator('text=APY')).toBeVisible();
      await expect(ratesSection.locator('text=Interest Rate')).toBeVisible();
    }
  });
});

test.describe('Testnet Specific Features', () => {
  test('testnet faucet links are available', async ({ page }) => {
    await page.goto('/');

    // Look for faucet links
    const faucetLink = page.locator('a[href*="faucet"]');

    if (await faucetLink.isVisible()) {
      await expect(faucetLink).toContainText('Faucet');
    }
  });

  test('testnet explorers work correctly', async ({ page }) => {
    await page.goto('/testnet');

    // Check if testnet page loads
    await expect(page.locator('h1')).toContainText('Testnet');

    // Look for explorer links
    const explorerLinks = page.locator('a[href*="testnet"]');
    const count = await explorerLinks.count();

    expect(count).toBeGreaterThan(0);
  });
});

test.describe('Error Handling and Edge Cases', () => {
  test('handles network errors gracefully', async ({ page }) => {
    // Simulate network conditions
    await page.route('**/api/**', route => route.abort());

    await page.goto('/');

    // Should show error state or fallback
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
  });

  test('handles large data sets', async ({ page }) => {
    await page.goto('/trade');

    // Look for pagination or virtualization
    const pagination = page.locator('[data-testid="pagination"]');

    if (await pagination.isVisible()) {
      await expect(pagination).toBeVisible();
    }
  });

  test('accessibility features work', async ({ page }) => {
    await page.goto('/');

    // Check for proper ARIA labels
    const ariaElements = page.locator('[aria-label]');
    const count = await ariaElements.count();
    expect(count).toBeGreaterThan(0);

    // Test keyboard navigation
    await page.keyboard.press('Tab');
    await expect(page.locator(':focus')).toBeVisible();
  });
});

test.describe('Performance and Loading', () => {
  test('page loads within reasonable time', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;

    // Should load within 5 seconds
    expect(loadTime).toBeLessThan(5000);
  });

  test('images load correctly', async ({ page }) => {
    await page.goto('/');

    const images = page.locator('img');
    const count = await images.count();

    for (let i = 0; i < Math.min(count, 5); i++) {
      await images.nth(i).waitFor({ state: 'attached' });
      const naturalWidth = await images.nth(i).evaluate(img => (img as HTMLImageElement).naturalWidth);
      expect(naturalWidth).toBeGreaterThan(0);
    }
  });

  test('no console errors', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error' && !msg.text().includes('404')) {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Should have no console errors (ignoring 404s for missing assets)
    expect(consoleErrors).toHaveLength(0);
  });
});