import fs from "fs";
import fetch from "isomorphic-fetch";
import yaml from "js-yaml";
import os from "os";
import path from "path";

const BASE_GITHUB_URL =
    "https://raw.githubusercontent.com/covalenthq/goldrush-enhanced-spam-lists/main";

const dataCache = {};

const CACHE_DIR = path.join(os.tmpdir(), "goldrush-spam-cache");
if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
}

/**
 * Asynchronously loads a YAML file from GitHub
 * @param {string} filePath - Local file path (relative to package)
 * @returns {Promise<Object>} Parsed YAML content
 */
const loadYaml = async (filePath, cache) => {
    if (dataCache[filePath]) {
        return dataCache[filePath];
    }

    // Check disk cache
    const cacheFile = path.join(
        CACHE_DIR,
        `${filePath.replace(/\//g, "_")}.json`
    );
    try {
        if (fs.existsSync(cacheFile)) {
            const cached = JSON.parse(fs.readFileSync(cacheFile, "utf8"));
            dataCache[filePath] = cached;
            return cached;
        }
    } catch {
        // Skip errors and continue to fetch from GitHub
    }

    try {
        const response = await fetch(`${BASE_GITHUB_URL}/${filePath}`);
        if (!response.ok) {
            throw new Error(
                `Failed to fetch YAML file: ${response.statusText}`
            );
        }

        const content = await response.text();
        const data = yaml.load(content);

        if (cache) {
            dataCache[filePath] = data;
            fs.writeFileSync(cacheFile, JSON.stringify(data));
        }

        return data;
    } catch (error) {
        throw new Error(`Error loading ${filePath}: ${error.message}`);
    }
};

/**
 * Clear both memory and disk cache
 */
export function clearCache() {
    Object.keys(dataCache).forEach((key) => {
        delete dataCache[key];
    });

    try {
        const files = fs.readdirSync(CACHE_DIR);
        for (const file of files) {
            if (file.endsWith(".json")) {
                fs.unlinkSync(path.join(CACHE_DIR, file));
            }
        }
    } catch (error) {
        console.error(`Error clearing disk cache: ${error.message}`);
    }
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
 * @returns {Promise<string[]>} Promise resolving to array of spam contract addresses
 * @throws {Error} If the file doesn't exist or can't be fetched
 * @example
 * // Get high confidence spam tokens on Ethereum
 * const ethSpam = await getERC20List(Networks.ETHEREUM, Confidence.YES);
 */
export async function getERC20List(network, confidence, cache) {
    const networkKey = network.replaceAll("-", "_");

    let key = `${networkKey}_token_spam_contracts_${confidence}`;

    if (network === Networks.BSC && confidence === Confidence.YES) {
        try {
            const part1 = await loadYaml(`erc20/${key}_1.yaml`, cache);
            const part2 = await loadYaml(`erc20/${key}_2.yaml`, cache);
            return [...part1.SpamContracts, ...part2.SpamContracts];
        } catch (error) {
            throw new Error(`Failed to load BSC spam lists: ${error.message}`);
        }
    }

    try {
        const data = await loadYaml(`erc20/${key}.yaml`, cache);
        return data.SpamContracts;
    } catch (error) {
        throw new Error(
            `Spam list for ${network} with confidence ${confidence} not found: ${error.message}`
        );
    }
}

/**
 * Retrieves a specific NFT spam list by network
 * @param {string} network - Network identifier (use Networks enum)
 * @returns {Promise<string[]>} Promise resolving to array of spam NFT contract addresses
 * @throws {Error} If the file doesn't exist or can't be fetched
 * @example
 * // Get spam NFTs on Polygon
 * const polygonNftSpam = await getNFTList(Networks.POLYGON);
 */
export async function getNFTList(network, cache) {
    const key = `${network}_mainnet_nft_spam_contracts`;
    try {
        const data = await loadYaml(`nft/${key}.yaml`, cache);
        return data.SpamContracts;
    } catch (error) {
        throw new Error(
            `NFT spam list for ${network} not found: ${error.message}`
        );
    }
}

/**
 * Check if an address is in the spam list
 * @param {string} address - Contract address to check
 * @param {string[]} spamList - List of spam entries in format "chainId/address/score"
 * @returns {boolean} True if the address is in the spam list
 */
export const isContractSpam = (address, spamList) => {
    const normalizedAddress = address.toLowerCase();

    return spamList.some((entry) => {
        const parts = entry.split("/");
        if (parts.length >= 2) {
            return parts[1].toLowerCase() === normalizedAddress;
        }
        return false;
    });
};

/**
 * Checks if an ERC20 contract is spam
 * @param {string} address - Contract address to check
 * @param {string} network - Network identifier (use Networks enum)
 * @param {string} [confidence=Confidence.YES] - Confidence level (use Confidence enum)
 * @param {boolean} [cache=true] - Whether to use disk caching
 * @returns {Promise<boolean>} Promise resolving to true if address is a spam ERC20 contract
 * @example
 * // Check if token is spam on Ethereum with high confidence
 * const isTokenSpam = await isERC20Spam("0x123...", Networks.ETHEREUM);
 *
 * // Check without using the disk cache
 * const isTokenSpam = await isERC20Spam("0x123...", Networks.ETHEREUM, Confidence.YES, false);
 */
export async function isERC20Spam(
    address,
    network,
    confidence = Confidence.YES,
    cache = true
) {
    const spamList = await getERC20List(network, confidence, cache);
    return isContractSpam(address, spamList);
}

/**
 * Checks if an NFT contract is spam
 * @param {string} address - Contract address to check
 * @param {string} network - Network identifier (use Networks enum)
 * @param {boolean} [cache=true] - Whether to use disk caching
 * @returns {Promise<boolean>} Promise resolving to true if address is a spam NFT contract
 * @example
 * // Check if NFT is spam on Optimism
 * const isNftSpam = await isNFTSpam("0x123...", Networks.OPTIMISM);
 *
 * // Check without using the disk cache
 * const isNftSpam = await isNFTSpam("0x123...", Networks.OPTIMISM, false);
 */
export async function isNFTSpam(address, network, cache = true) {
    const spamList = await getNFTList(network, cache);
    return isContractSpam(address, spamList);
}

/**
 * Extracts the spam score from a list entry
 * @param {string} entry - Entry from spam list in format "chainId/address/score"
 * @returns {string} The spam score
 * @example
 * // Get the spam score from an entry
 * const score = getSpamScore("1/0xabcdef1234567890/75");
 */
export const getSpamScore = (entry) => {
    return entry.split("/")[2];
};
