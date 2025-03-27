<div align="center">
  
# GoldRush Enhanced Spam Lists

[![NPM Version](https://img.shields.io/npm/v/@covalenthq/goldrush-enhanced-spam-lists)](https://www.npmjs.com/package/@covalenthq/goldrush-enhanced-spam-lists)
[![NPM Downloads](https://img.shields.io/npm/dt/@covalenthq/goldrush-enhanced-spam-lists)](https://www.npmjs.com/package/@covalenthq/goldrush-enhanced-spam-lists)
[![GitHub license](https://img.shields.io/github/license/covalenthq/goldrush-enhanced-spam-lists)](https://github.com/covalenthq/goldrush-enhanced-spam-lists/blob/main/LICENSE)
[![GitHub last commit](https://img.shields.io/github/last-commit/covalenthq/goldrush-enhanced-spam-lists)](https://github.com/covalenthq/goldrush-enhanced-spam-lists/commits/master)
[![GitHub contributors](https://img.shields.io/github/contributors/covalenthq/goldrush-enhanced-spam-lists)](https://github.com/covalenthq/goldrush-enhanced-spam-lists/graphs/contributors)
[![GitHub issues](https://img.shields.io/github/issues/covalenthq/goldrush-enhanced-spam-lists)](https://github.com/covalenthq/goldrush-enhanced-spam-lists/issues)
[![GitHub pull requests](https://img.shields.io/github/issues-pr/covalenthq/goldrush-enhanced-spam-lists)](https://github.com/covalenthq/goldrush-enhanced-spam-lists/pulls)

[![GitHub stars](https://img.shields.io/github/stars/covalenthq/goldrush-enhanced-spam-lists)](https://github.com/covalenthq/goldrush-enhanced-spam-lists/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/covalenthq/goldrush-enhanced-spam-lists)](https://github.com/covalenthq/goldrush-enhanced-spam-lists/network/members)

[📖 Documentation](https://goldrush.dev/docs/resources/enhanced-spam-lists)

</div>

`@covalenthq/goldrush-enhanced-spam-lists` is a public, open-source npm package that provides enhanced spam lists for ERC20 tokens and NFTs. Our mission is to restore trust and transparency in Web3 by helping developers, explorers, wallets, and indexers protect their users from scam tokens and malicious contracts.

---

## Overview

In response to the growing problem of spam in the crypto ecosystem, GoldRush is proud to launch the first-ever multichain enhanced spam token lists for ERC20 tokens and NFTs. This package initially supports the following six [Foundational Chains](https://goldrush.dev/chains/):

- Ethereum
- Base
- Polygon
- BNB Smart Chain (BSC)
- Optimism
- Gnosis

There are plans to extend the chain support. These enhanced spam token lists are currently **updated weekly.**

### Key Features

- Multichain support.
- Dedicated ERC20 and NFT spam lists.
- Enhanced classification for ERC20 tokens:
    - `yes`: token contracts confirmed as spam (spam score > 20).
    - `maybe`: token contracts that are potentially spam (12 < spam score < 20).
- Each entry includes a `spam_score` to indicate the level of risk. Higher score indicates a higher spam risk.
- Updated weekly.
- Open source and collaborative.

---

## File Structure

The package organizes YAML files as follows:

```
/
├── erc20/
│   ├── eth_mainnet_token_spam_contracts_yes.yaml
│   ├── eth_mainnet_token_spam_contracts_maybe.yaml
│   ├── base_mainnet_token_spam_contracts_yes.yaml
│   ├── base_mainnet_token_spam_contracts_maybe.yaml
│   ├── polygon_mainnet_token_spam_contracts_yes.yaml
│   ├── polygon_mainnet_token_spam_contracts_maybe.yaml
│   ├── optimism_mainnet_token_spam_contracts_yes.yaml
│   ├── optimism_mainnet_token_spam_contracts_maybe.yaml
│   ├── bsc_mainnet_token_spam_contracts_yes_1.yaml
│   ├── bsc_mainnet_token_spam_contracts_yes_2.yaml
│   ├── bsc_mainnet_token_spam_contracts_maybe.yaml
│   ├── gnosis_mainnet_token_spam_contracts_yes.yaml
│   └── gnosis_mainnet_token_spam_contracts_maybe.yaml
└── nft/
    ├── eth_mainnet_nft_spam_contracts.yaml
    ├── base_mainnet_nft_spam_contracts.yaml
    ├── polygon_mainnet_nft_spam_contracts.yaml
    ├── optimism_mainnet_nft_spam_contracts.yaml
    ├── bsc_mainnet_nft_spam_contracts.yaml
    └── gnosis_mainnet_nft_spam_contracts.yaml
```

- **ERC20 Tokens:**
    - Each chain has two YAML files:
        - `<chain>_token_spam_contracts_yes.yaml` for token contracts confirmed as spam.
        - `<chain>_token_spam_contracts_maybe.yaml` for token contracts that are potentially spam.
- **NFTs:**
    - Each chain has a single YAML file (e.g., `<chain>_nft_spam_contracts.yaml`) listing all NFT spam contracts.

---

## YAML File Formats

### ERC20 YAML File Example

```yaml
---
SpamContracts:
    - 56/0x00107060f34b437c5a7daf6c247e6329cf613759/20
    - 56/0x00518f36d2e0e514e8eb94d34124fc18ee756f10/85
    - 56/0x00757bb08d0367a44be44f9b79c06e6775f733c5/70
    - 56/0x00b09b2d87f88ebfa214fd247be08b1c4c1e5484/18
```

- **Key:** `SpamContracts` lists ERC20 spam contracts.
- **Format:** Each contract entry uses the `<chainid>/<contract_address>/<spam_score>` format.

### NFT YAML File Example

Each NFT YAML file is dedicated to a specific chain. Every contract listed is considered spam. The file follows this format:

```yaml
---
SpamContracts:
    - 100/0x1043868cdc29037cce4ce3e495e601572e2cd78e/80
    - 100/0x642f6eeab36134bbe6fbaab1eeb2a7ebc85739a8/55
    - 100/0x616b02df3e80cec9a5dd764459141b85a91ffba4/30
```

- **Key:** `SpamContracts` lists all NFT spam contracts.
- **Format:** Each entry uses the `<chainid>/<contract_address>/<spam_score>` format.

---

## Getting Started

### Installation

Install the package using your preferred package manager:

```bash
# npm
npm install @covalenthq/goldrush-enhanced-spam-lists

# yarn
yarn add @covalenthq/goldrush-enhanced-spam-lists

# pnpm
pnpm add @covalenthq/goldrush-enhanced-spam-lists
```

### Usage

1. Verify if an ERC20 token is spam on a given network

    ```javascript
    import {
        Networks,
        isERC20Spam,
    } from "@covalenthq/goldrush-enhanced-spam-lists";

    // With default options
    const isSpam = await isERC20Spam("0xTokenAddress", Networks.ETHEREUM);
    console.log(isSpam);
    ```

2. For a potential spam check for an ERC20 token, `Confidence.MAYBE` can be used

    ```javascript
    import {
        Confidence,
        Networks,
        isERC20Spam,
    } from "@covalenthq/goldrush-enhanced-spam-lists";

    const isPotentialSpam = await isERC20Spam(
        "0xTokenAddress",
        Networks.POLYGON,
        Confidence.MAYBE
    );
    console.log(isPotentialSpam);
    ```

3. Verify if an NFT token is spam on a given network

    ```javascript
    import {
        Networks,
        isNFTSpam,
    } from "@covalenthq/goldrush-enhanced-spam-lists";

    const isNftSpam = await isNFTSpam("0xNftAddress", Networks.BSC);
    console.log(isNftSpam);
    ```

4. Control caching behavior

    ```javascript
    import {
        Networks,
        Confidence,
        isERC20Spam,
        clearCache,
    } from "@covalenthq/goldrush-enhanced-spam-lists";

    // With caching enabled (default)
    const withCache = await isERC20Spam(
        "0xTokenAddress",
        Networks.ETHEREUM,
        Confidence.YES,
        true // Enable caching (default)
    );

    // Without caching (always fetches fresh data)
    const withoutCache = await isERC20Spam(
        "0xTokenAddress",
        Networks.ETHEREUM,
        Confidence.YES,
        false // Disable caching
    );

    // Clear memory and disk cache if needed
    clearCache();
    ```

5. For more control, you can get the full lists:

    ```javascript
    import {
        getERC20List,
        getNFTList,
        Confidence,
        Networks,
    } from "@covalenthq/goldrush-enhanced-spam-lists";

    // Get ERC20 spam list with default caching
    const ethSpamTokens = await getERC20List(Networks.ETHEREUM, Confidence.YES);

    // Get NFT spam list with caching disabled
    const bscSpamNfts = await getNFTList(Networks.BSC, false);
    ```

6. Get the specific spam score for a given contract

    ```javascript
    import {
        getERC20List,
        getSpamScore,
        Networks,
        Confidence,
    } from "@covalenthq/goldrush-enhanced-spam-lists";

    const ethSpamTokens = await getERC20List(Networks.ETHEREUM, Confidence.YES);
    const score = getSpamScore(ethSpamTokens[0]);
    console.log(score); // Returns the spam score as a string
    ```

### Caching

This package uses a two-level caching system to improve performance:

1. **In-memory cache**: Keeps data in memory during the lifetime of your application
2. **Disk cache**: Stores data on disk in the system's temporary directory

All functions that fetch data accept an optional `cache` parameter (defaults to `true`):

- `true`: Use both in-memory and disk caching (default)
- `false`: Bypass all caching and always fetch fresh data from the source

You can clear both caches at any time with the `clearCache()` function.

<br>

---

## 🤝 Contributing

We welcome contributions from the community! If you have suggestions, improvements, or new spam contract addresses to add, please open an issue or submit a pull request. Feel free to check <a href="https://github.com/covalenthq/goldrush-enhanced-spam-lists/issues">issues</a> page.

## Show your support

Give a ⭐️ if this project helped you!

## 📝 License

This project is <a href="https://github.com/covalenthq/goldrush-enhanced-spam-lists/blob/main/LICENSE">MIT</a> licensed.

_Cleaning up crypto, one spam token at a time._
