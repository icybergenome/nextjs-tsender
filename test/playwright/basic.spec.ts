import basicSetup from '../wallet-setup/basic.setup';
import { testWithSynpress } from '@synthetixio/synpress';
import { MetaMask, metaMaskFixtures } from '@synthetixio/synpress/playwright';
import { L } from 'vitest/dist/chunks/reporters.d.DG9VKi4m.js';

const test = testWithSynpress(metaMaskFixtures(basicSetup))

const {expect} = test

test('has title', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/TSender/);
});

test('should show Airdrop Form when connected, otherwise, not', async ({ page, context, metamaskPage, extensionId }) => {
  await page.goto('/');
  // check we see "Please connect Wallet"
  await expect(page.getByText('Please connect')).toBeVisible();

  const metamask = new MetaMask(context, metamaskPage, basicSetup.walletPassword, extensionId);
  await page.getByTestId('rk-connect-button').click();
  await page.getByTestId('rk-wallet-option-io.metamask').waitFor({
    state: 'visible',
    timeout: 30000,
  });
  await page.getByTestId('rk-wallet-option-io.metamask').click();
  await metamask.connectToDapp();

  // Optional: Add a custom network to do airdrop etc
  // const customNetwork = {
  //   name: 'Anvil',
  //   rpcUrl: 'http://127.0.0.1:8545',
  //   chainId: 31337,
  //   symbol: 'ETH',
  // };

  // await metamask.addNetwork(customNetwork);

  await expect(page.getByText("Token Address")).toBeVisible();
})