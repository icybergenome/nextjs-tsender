This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Features
- Rainbow kit for wallet connection
- Implement AirDrop for ERC20 token:
```solidity
 function airdropERC20(
        address tokenAddress,
        address[] calldata recipients,
        uint256[] calldata amounts,
        uint256 totalAmount
    )
```
- Wallet connect feature to support third party wallets connection as well apart from basic ones i.e. Metamask, Phantom:
    - [RainbowConfig](./src/rainbowKitConfig.tsx) ProjectId reflect to project id from [WalletConnect](https://cloud.reown.com/sign-in)
- `Wagmi` acts as a provider for RainbowKit, its build on top of viem. Its encompass all the configs needed for RainbowKit
- `wagmi` package provides hooks to interact with blockchain/smart contracts via viem.
  - `wagmi/core` provides vanillajs library. Where ever we need interactivity without hooks we would use this.
- In case anvil chain blocks are not mined automatically use command `pnpm anvil --block-time 10`
- Unit testing using [Vitest](https://vitest.dev/)
- E2E testing using:
  - [Synpress](https://www.synpress.io/) - Test environment interactivity with web3
  - [Playwright](https://playwright.dev/)
```shell
pnpm exec playwright test --ui
```

* Resolve Synpress cache issue
```shell
# create wallet cache
pnpm synpress
```
* After running above run the playwright test again, error related to cache still appear bt we should copy the cache name and update `.cache-synpress/<cache-name>`
