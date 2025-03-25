const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

function loadYaml(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  return yaml.load(content);
}

const erc20 = {
  eth_mainnet_token_spam_contracts_yes: loadYaml(path.join(__dirname, 'erc20', 'eth_mainnet_token_spam_contracts_yes.yaml')).SpamContracts,
  eth_mainnet_token_spam_contracts_maybe: loadYaml(path.join(__dirname, 'erc20', 'eth_mainnet_token_spam_contracts_maybe.yaml')).SpamContracts,
  pol_mainnet_token_spam_contracts_yes: loadYaml(path.join(__dirname, 'erc20', 'pol_mainnet_token_spam_contracts_yes.yaml')).SpamContracts,
  pol_mainnet_token_spam_contracts_maybe: loadYaml(path.join(__dirname, 'erc20', 'pol_mainnet_token_spam_contracts_maybe.yaml')).SpamContracts,
  base_mainnet_token_spam_contracts_yes: loadYaml(path.join(__dirname, 'erc20', 'base_mainnet_token_spam_contracts_yes.yaml')).SpamContracts,
  base_mainnet_token_spam_contracts_maybe: loadYaml(path.join(__dirname, 'erc20', 'base_mainnet_token_spam_contracts_maybe.yaml')).SpamContracts,
  bsc_mainnet_token_spam_contracts_yes_1: loadYaml(path.join(__dirname, 'erc20', 'bsc_mainnet_token_spam_contracts_yes_1.yaml')).SpamContracts,
  bsc_mainnet_token_spam_contracts_yes_2: loadYaml(path.join(__dirname, 'erc20', 'bsc_mainnet_token_spam_contracts_yes_2.yaml')).SpamContracts,
  bsc_mainnet_token_spam_contracts_maybe: loadYaml(path.join(__dirname, 'erc20', 'bsc_mainnet_token_spam_contracts_maybe.yaml')).SpamContracts,
  op_mainnet_token_spam_contracts_yes: loadYaml(path.join(__dirname, 'erc20', 'op_mainnet_token_spam_contracts_yes.yaml')).SpamContracts,
  op_mainnet_token_spam_contracts_maybe: loadYaml(path.join(__dirname, 'erc20', 'op_mainnet_token_spam_contracts_maybe.yaml')).SpamContracts,
  gnosis_mainnet_token_spam_contracts_yes: loadYaml(path.join(__dirname, 'erc20', 'gnosis_mainnet_token_spam_contracts_yes.yaml')).SpamContracts,
  gnosis_mainnet_token_spam_contracts_maybe: loadYaml(path.join(__dirname, 'erc20', 'gnosis_mainnet_token_spam_contracts_maybe.yaml')).SpamContracts
};

const nft = {
  eth_mainnet_nft_spam_contracts: loadYaml(path.join(__dirname, 'nft', 'eth_mainnet_nft_spam_contracts.yaml')).SpamCollections,
  pol_mainnet_nft_spam_contracts: loadYaml(path.join(__dirname, 'nft', 'pol_mainnet_nft_spam_contracts.yaml')).SpamCollections,
  base_mainnet_nft_spam_contracts: loadYaml(path.join(__dirname, 'nft', 'base_mainnet_nft_spam_contracts.yaml')).SpamCollections,
  bsc_mainnet_nft_spam_contracts: loadYaml(path.join(__dirname, 'nft', 'bsc_mainnet_nft_spam_contracts.yaml')).SpamCollections,
  op_mainnet_nft_spam_contracts: loadYaml(path.join(__dirname, 'nft', 'op_mainnet_nft_spam_contracts.yaml')).SpamCollections,
  gnosis_mainnet_nft_spam_contracts: loadYaml(path.join(__dirname, 'nft', 'gnosis_mainnet_nft_spam_contracts.yaml')).SpamCollections
};

module.exports = {
  erc20,
  nft
};
