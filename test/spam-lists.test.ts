import {
    clearCache,
    Confidence,
    getERC20List,
    getSpamScore,
    isContractSpam,
    isERC20Spam,
    isNFTSpam,
    Networks,
} from "../src/index";
import { beforeAll, describe, expect, it } from "vitest";

describe("Spam Detection Tests", () => {
    beforeAll(async () => {
        clearCache();
    });

    describe("Core Functionality", () => {
        it("checks ERC20 spam detection with different confidence levels", async () => {
            const isSpamYes = await isERC20Spam(
                "0x00a7b9517d6184db4a9efdf07bdbc93515fa8bdd",
                Networks.BASE_MAINNET,
                Confidence.YES
            );
            expect(typeof isSpamYes).toBe("boolean");
            expect(isSpamYes).toBe(true);

            const isSpamMaybe = await isERC20Spam(
                "0x00a7b9517d6184db4a9efdf07bdbc93515fa8bdd",
                Networks.BASE_MAINNET,
                Confidence.MAYBE
            );
            expect(typeof isSpamMaybe).toBe("boolean");
        });

        it("handles NFT spam detection", async () => {
            try {
                const isSpam = await isNFTSpam(
                    "0x1234567890123456789012345678901234567890",
                    Networks.ETHEREUM_MAINNET
                );
                expect(typeof isSpam).toBe("boolean");
            } catch (error: any) {
                expect(error.message).toContain("NFT spam list for");
            }
        });

        it("works with caching enabled and disabled", async () => {
            const withCache = await isERC20Spam(
                "0x00a7b9517d6184db4a9efdf07bdbc93515fa8bdd",
                Networks.BASE_MAINNET,
                Confidence.YES,
                true
            );
            expect(typeof withCache).toBe("boolean");

            const withoutCache = await isERC20Spam(
                "0x00a7b9517d6184db4a9efdf07bdbc93515fa8bdd",
                Networks.BASE_MAINNET,
                Confidence.YES,
                false
            );
            expect(typeof withoutCache).toBe("boolean");
        });
    });

    describe("Utility Functions", () => {
        it("handles basic utility functions correctly", () => {
            const score = getSpamScore("1/0xabcdef1234567890/75");
            expect(score).toBe("75");

            const isSpam = isContractSpam("0xABCDEF1234567890", [
                "1/0xabcdef1234567890/75",
                "malformed-entry",
            ]);
            expect(isSpam).toBe(true);
        });

        it("gets spam lists correctly", async () => {
            const spamList = await getERC20List(
                Networks.BASE_MAINNET,
                Confidence.YES
            );
            expect(Array.isArray(spamList)).toBe(true);
            expect(spamList.length).toBeGreaterThan(0);
        });
    });
});
