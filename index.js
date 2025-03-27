import fs from "fs";
import yaml from "js-yaml";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

function loadYaml(filePath) {
    const content = fs.readFileSync(filePath, "utf8");
    return yaml.load(content);
}

/**
 * Networks supported by the spam lists
 * @enum {string}
 */
export const Networks = {
    /** Ethereum Mainnet */
    ETHEREUM: "eth-mainnet",
    /** Polygon Mainnet */
    POLYGON: "pol-mainnet",
    /** Base Mainnet */
    BASE: "base-mainnet",
    /** BSC (Binance Smart Chain) Mainnet */
    BSC: "bsc-mainnet",
    /** Optimism Mainnet */
    OPTIMISM: "op-mainnet",
    /** Gnosis Mainnet */
    GNOSIS: "gnosis-mainnet",
};

/**
 * Confidence levels for spam classification
 * @enum {string}
 */
export const Confidence = {
    /** High confidence spam classification */
    YES: "yes",
    /** Medium confidence spam classification */
    MAYBE: "maybe",
};

/**
 * Retrieves a specific ERC20 token spam list by network and confidence level
 * @param {string} network - Network identifier (use Networks enum)
 * @param {string} confidence - Confidence level (use Confidence enum)
 * @returns {string[]} Array of spam contract addresses
 * @throws {Error} If the file doesn't exist
 * @example
 * // Get high confidence spam tokens on Ethereum
 * const ethSpam = getERC20List(Networks.ETHEREUM, Confidence.YES);
 */
export function getERC20List(network, confidence) {
    let key = `${network}_mainnet_token_spam_contracts_${confidence}`;

    if (network === Networks.BSC && confidence === Confidence.YES) {
        return [
            ...loadYaml(join(__dirname, "erc20", `${key}_1.yaml`))
                .SpamContracts,
            ...loadYaml(join(__dirname, "erc20", `${key}_2.yaml`))
                .SpamContracts,
        ];
    }

    try {
        return loadYaml(join(__dirname, "erc20", `${key}.yaml`)).SpamContracts;
    } catch (error) {
        throw new Error(
            `Spam list for ${network} with confidence ${confidence} not found: ${error.message}`
        );
    }
}

/**
 * Retrieves a specific NFT spam list by network
 * @param {string} network - Network identifier (use Networks enum)
 * @returns {string[]} Array of spam NFT contract addresses
 * @throws {Error} If the file doesn't exist
 * @example
 * // Get spam NFTs on Polygon
 * const polygonNftSpam = getNFTList(Networks.POLYGON);
 */
export function getNFTList(network) {
    const key = `${network}_mainnet_nft_spam_contracts`;
    try {
        return loadYaml(join(__dirname, "nft", `${key}.yaml`)).SpamContracts;
    } catch (error) {
        throw new Error(
            `NFT spam list for ${network} not found: ${error.message}`
        );
    }
}

function isContractSpam(address, spamList) {
    return spamList.includes(address.toLowerCase());
}

/**
 * Checks if an ERC20 contract is spam
 * @param {string} address - Contract address to check
 * @param {string} network - Network identifier (use Networks enum)
 * @param {string} [confidence=Confidence.YES] - Confidence level (use Confidence enum)
 * @returns {boolean} True if address is a spam ERC20 contract
 * @example
 * // Check if token is spam on Ethereum with high confidence
 * const isTokenSpam = isERC20Spam("0x123...", Networks.ETHEREUM);
 */
export function isERC20Spam(address, network, confidence = Confidence.YES) {
    try {
        const spamList = getERC20List(network, confidence);
        return isContractSpam(address, spamList);
    } catch {
        return false;
    }
}

/**
 * Checks if an NFT contract is spam
 * @param {string} address - Contract address to check
 * @param {string} network - Network identifier (use Networks enum)
 * @returns {boolean} True if address is a spam NFT contract
 * @example
 * // Check if NFT is spam on Optimism
 * const isNftSpam = isNFTSpam("0x123...", Networks.OPTIMISM);
 */
export function isNFTSpam(address, network) {
    try {
        const spamList = getNFTList(network);
        return isContractSpam(address, spamList);
    } catch {
        return false;
    }
}

/**
 * Extracts the spam score from a list entry
 * @param {string} entry - Entry from spam list in format "chainId/address/score"
 * @returns {string} The spam score
 * @example
 * // Get the spam score from an entry
 * const score = getSpamScore("1/0xabcdef1234567890/75");
 */
export function getSpamScore(entry) {
    return entry.split("/")[2];
}
