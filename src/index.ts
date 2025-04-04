import fs from "fs";
import fetch from "isomorphic-fetch";
import yaml from "js-yaml";
import os from "os";
import path from "path";

const BASE_GITHUB_URL =
    "https://raw.githubusercontent.com/covalenthq/goldrush-enhanced-spam-lists/main/src/lists";

const dataCache: Record<string, SpamListData> = {};

const defaultCache = true;

const CACHE_DIR = path.join(os.tmpdir(), "goldrush-spam-cache");
if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
}

export interface SpamListData {
    SpamContracts: string[];
}

/**
 * Asynchronously loads a YAML file from GitHub
 * @param {string} filePath - Local file path (relative to package)
 * @returns {Promise<SpamListData>} Parsed YAML content
 */
const loadYaml = async (
    filePath: string,
    cache: boolean
): Promise<SpamListData> => {
    if (cache && dataCache[filePath]) {
        return dataCache[filePath];
    }

    if (cache) {
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
    }

    try {
        const response = await fetch(`${BASE_GITHUB_URL}/${filePath}`);
        if (!response.ok) {
            throw new Error(
                `Failed to fetch YAML file: ${response.statusText}`
            );
        }

        const content = await response.text();
        const data = yaml.load(content) as SpamListData;

        if (cache) {
            dataCache[filePath] = data;
            const cacheFile = path.join(
                CACHE_DIR,
                `${filePath.replace(/\//g, "_")}.json`
            );
            fs.writeFileSync(cacheFile, JSON.stringify(data));
        }

        return data;
    } catch (error: Error | any) {
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
    } catch (error: Error | any) {
        console.error(`Error clearing disk cache: ${error.message}`);
    }
}

/**
 * Networks supported by the spam lists
 * @enum {string}
 */
export enum Networks {
    ETHEREUM_MAINNET = "eth-mainnet",
    POLYGON_MAINNET = "pol-mainnet",
    BASE_MAINNET = "base-mainnet",
    BSC_MAINNET = "bsc-mainnet",
    OPTIMISM_MAINNET = "op-mainnet",
    GNOSIS_MAINNET = "gnosis-mainnet",
}

/**
 * Confidence levels for spam classification
 * @enum {string}
 */
export enum Confidence {
    YES = "yes",
    MAYBE = "maybe",
}

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
export const getERC20List = async (
    network: Networks,
    confidence: Confidence,
    cache: boolean = defaultCache
): Promise<string[]> => {
    const networkKey = network.replaceAll("-", "_");

    let key = `${networkKey}_token_spam_contracts_${confidence}`;

    if (network === Networks.BSC_MAINNET && confidence === Confidence.YES) {
        try {
            const part1 = await loadYaml(`erc20/${key}_1.yaml`, cache);
            const part2 = await loadYaml(`erc20/${key}_2.yaml`, cache);
            return [...part1.SpamContracts, ...part2.SpamContracts];
        } catch (error: Error | any) {
            throw new Error(`Failed to load BSC spam lists: ${error.message}`);
        }
    }

    try {
        const data = await loadYaml(`erc20/${key}.yaml`, cache);
        return data.SpamContracts;
    } catch (error: Error | any) {
        throw new Error(
            `Spam list for ${network} with confidence ${confidence} not found: ${error.message}`
        );
    }
};

/**
 * Retrieves a specific NFT spam list by network
 * @param {string} network - Network identifier (use Networks enum)
 * @returns {Promise<string[]>} Promise resolving to array of spam NFT contract addresses
 * @throws {Error} If the file doesn't exist or can't be fetched
 * @example
 * // Get spam NFTs on Polygon
 * const polygonNftSpam = await getNFTList(Networks.POLYGON);
 */
export const getNFTList = async (
    network: Networks,
    cache: boolean = defaultCache
): Promise<string[]> => {
    const networkKey = network.replaceAll("-", "_");

    let key = `${networkKey}_nft_spam_contracts`;

    try {
        const data = await loadYaml(`nft/${key}.yaml`, cache);
        return data.SpamContracts;
    } catch (error: Error | any) {
        throw new Error(
            `NFT spam list for ${network} not found: ${error.message}`
        );
    }
};

/**
 * Check if an address is in the spam list
 * @param {string} address - Contract address to check
 * @param {string[]} spamList - List of spam entries in format "chainId/address/score"
 * @returns {boolean} True if the address is in the spam list
 */
export const isContractSpam = (address: string, spamList: string[]) => {
    const normalizedAddress = address.toLowerCase();

    return spamList.some((entry: string) => {
        const parts = entry.split("/");
        if (parts.length >= 2) {
            return parts?.[1]?.toLowerCase() === normalizedAddress;
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
export const isERC20Spam = async (
    address: string,
    network: Networks,
    confidence: Confidence = Confidence.YES,
    cache: boolean = defaultCache
): Promise<boolean> => {
    const spamList = await getERC20List(network, confidence, cache);
    return isContractSpam(address, spamList);
};

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
export const isNFTSpam = async (
    address: string,
    network: Networks,
    cache: boolean = defaultCache
): Promise<boolean> => {
    const spamList = await getNFTList(network, cache);
    return isContractSpam(address, spamList);
};

/**
 * Extracts the spam score from a list entry
 * @param {string} entry - Entry from spam list in format "chainId/address/score"
 * @returns {string} The spam score
 * @example
 * // Get the spam score from an entry
 * const score = getSpamScore("1/0xabcdef1234567890/75");
 */
export const getSpamScore = (entry: string) => {
    return entry.split("/")[2];
};
