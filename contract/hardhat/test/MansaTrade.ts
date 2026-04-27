import assert from "node:assert/strict";
import { describe, it } from "node:test";

import hre from "hardhat";
const { viem, networkHelpers } = await hre.network.create();

describe("MansaTrade Escrow Mechanics", function () {

    it("Should deploy the contract and successfully create an offer", async function () {

        const [owner, firDiv, secDiv] = await viem.getWalletClients();
        const publicClient = await viem.getPublicClient();
        
        const mansaTrade = await viem.deployContract("MansaTrade", [
            firDiv.account.address,
            secDiv.account.address
        ]);
        
        console.log(`Contract deployed successfully at: ${mansaTrade.address}`);
    
        // construct the offer

        const txHash = await mansaTrade.write.createOffer([
          "0x0000000000000000000000000000000000000000",  // address token_address,
          "GBP",                                        // string memory fiat, 
          "2500",                                       // string memory rate, 
          "Bank Transfer",                              // string memory payment_options, 
          "mock_public_key",                            // string memory public_key, 
          "prompt settlement expected.",                // string memory offer_terms, 
          30,                                           // uint8 time_limit, 
          true,                                         // bool eth, -> first pass testing
          10000000000000000000n,                        // uint256 token_amount, 
          1000000000000000000n,                         // uint256 min_limit, 
          10000000000000000000n                         // uint256 max_limit 
        ])
        
        const createdOffer = await mansaTrade.read.getOfferByIndex([0n]);
        console.log(`Offer created. Transaction Hash: ${txHash}`);
        
        
    
    });
})


// async function main() {

//     const walletClients = await hre.viem.getWalletClients();
//     const addresses = accounts.map(client => client.account.address);

//     console.log("Available accounts: ", addresses);

//     const [owner, otherAccount] =  await hre.viem.getWalletClients();
// }

// main();
