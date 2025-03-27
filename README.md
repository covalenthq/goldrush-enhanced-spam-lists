<div align="center">
  
# GoldRush Enhanced Spam Token Lists

<br />

[![NPM Version](https://img.shields.io/npm/v/@covalenthq/ai-agent-sdk)](https://www.npmjs.com/package/@covalenthq/goldrush-enhanced-spam-token-lists)
[![NPM Downloads](https://img.shields.io/npm/dt/@covalenthq/datasource-spam-filter)](https://www.npmjs.com/package/@covalenthq/goldrush-enhanced-spam-token-lists)
[![GitHub license](https://img.shields.io/github/license/covalenthq/datasource-spam-filter)](https://github.com/covalenthq/datasource-spam-filter/blob/main/LICENSE)
[![GitHub last commit](https://img.shields.io/github/last-commit/covalenthq/datasource-spam-filter)](https://github.com/covalenthq/datasource-spam-filter/commits/master)
[![GitHub contributors](https://img.shields.io/github/contributors/covalenthq/datasource-spam-filter)](https://github.com/covalenthq/datasource-spam-filter/graphs/contributors)
[![GitHub issues](https://img.shields.io/github/issues/covalenthq/datasource-spam-filter)](https://github.com/covalenthq/datasource-spam-filter/issues)
[![GitHub pull requests](https://img.shields.io/github/issues-pr/covalenthq/datasource-spam-filter)](https://github.com/covalenthq/datasource-spam-filter/pulls)

[![GitHub stars](https://img.shields.io/github/stars/covalenthq/datasource-spam-filter)](https://github.com/covalenthq/datasource-spam-filter/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/covalenthq/datasource-spam-filter)](https://github.com/covalenthq/datasource-spam-filter/network/members)

</div>

`@covalenthq/goldrush-enhanced-spam-token-lists` is a public, open-source npm package that provides enhanced spam lists for ERC20 tokens and NFTs. Our mission is to restore trust and transparency in Web3 by helping developers, explorers, wallets, and indexers protect their users from scam tokens and malicious contracts.

---

## Overview

In response to the growing problem of spam in the crypto ecosystem, GoldRush is proud to launch the first-ever multichain enhanced spam token lists for ERC20 tokens and NFTs. This package initially supports the following six [Foundational Chains](https://goldrush.dev/chains/) with plans to expand chain support:
- Ethereum
- Base
- Polygon
- BNB Smart Chain (BSC)
- Optimism

These enhanced spam token lists are currently **updated weekly.**

### Key Features

- Multichain support.
- Dedicated ERC20 and NFT spam lists.
- Enhanced classification for ERC20 tokens:
  - `yes`: token contracts confirmed as spam.
  - `maybe`: token contracts that are potentially spam.
- Each entry includes a **spam_score** to indicate the level of risk.
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

Install the package using npm:

```bash
npm install @covalenthq/goldrush-enhanced-spam-token-lists
```

### Usage

#### For ERC20 Tokens

Import the package and check for spam contracts and spam score. For example, to verify if a contract is confirmed spam on Ethereum:

```javascript
const spamTokens = require('@covalenthq/goldrush-enhanced-spam-token-lists');
const chainId = '1';
const contractAddress = '0xYourContractAddressHere'.toLowerCase();

const findSpamScore = list => {
  const entry = list.find(e => {
    const [cid, addr] = e.split('/');
    return cid === chainId && addr.toLowerCase() === contractAddress;
  });
  return entry ? entry.split('/')[2] : null;
};

let spamScore = findSpamScore(spamTokens.erc20.eth_mainnet_token_spam_contracts_yes);
if (spamScore) {
  console.log(`This contract is confirmed as spam with a spam score of ${spamScore}.`);
} else if ((spamScore = findSpamScore(spamTokens.erc20.eth_mainnet_token_spam_contracts_maybe))) {
  console.log(`This contract is potentially spam with a spam score of ${spamScore}.`);
} else {
  console.log('This contract is not flagged.');
}
```

> _Note:_ Adjust the file name based on the target chain (e.g., `base_mainnet_token_spam_contracts_yes.yaml` for Base).

#### For NFTs

Import the package and check for NFT spam contracts and spam score. For example, to verify if an NFT contract is flagged as spam on Ethereum:

```javascript
const nftSpamList = require('@covalenthq/goldrush-enhanced-spam-token-lists');
const chainId = '1';
const contractAddress = '0xYourNFTContractAddressHere'.toLowerCase();

const findSpamScore = list => {
  const entry = list.find(e => {
    const [cid, addr] = e.split('/');
    return cid === chainId && addr.toLowerCase() === contractAddress;
  });
  return entry ? entry.split('/')[2] : null;
};

const spamScore = findSpamScore(nftSpamList.nft.eth_mainnet_nft_spam_contracts);
if (spamScore) {
  console.log(`This NFT contract is flagged as spam with a spam score of ${spamScore}.`);
} else {
  console.log('This NFT contract is not flagged.');
}

```

> _Note:_ Replace `eth_mainnet_nft_spam_contracts` with the appropriate file for the desired chain.

---

## 🤝 Contributing

We welcome contributions from the community! If you have suggestions, improvements, or new spam contract addresses to add, please open an issue or submit a pull request. Feel free to check <a href="https://github.com/covalenthq/datasource-spam-filter/issues">issues</a> page.

## Show your support

Give a ⭐️ if this project helped you!

## 📝 License

This project is <a href="https://github.com/covalenthq/datasource-spam-filter/blob/main/LICENSE">MIT</a> licensed.

*Cleaning up crypto, one spam token at a time.*
