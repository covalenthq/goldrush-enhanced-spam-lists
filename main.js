import { isERC20Spam } from "./src/index.js";

(async () => {
    const isSpam = await isERC20Spam(
        "0x00a7b9517d6184db4a9efdf07bdbc93515fa8bdd",
        "base-mainnet",
        "yes"
    );
    console.log(isSpam);
})();
