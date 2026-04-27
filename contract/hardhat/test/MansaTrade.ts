import assert from "node:assert/strict";
import { describe, it } from "node:test";

import hre from "hardhat";
import { create } from "node:domain";
const { viem, networkHelpers } = await hre.network.create();

// Define the structure as it exists in Solidity
interface Offer {
    owner: `0x${string}`;
    token_address: `0x${string}`;
    fiat: string;
    rate: string;
    payment_options: string;
    public_key: string;
    offer_terms: string;
    token_amount: bigint;
    min_limit: bigint;
    max_limit: bigint;
    bought: bigint;
    created_at: bigint;
    offer_index: bigint;
    time_limit: number;
    status: boolean;
    eth: boolean;
}


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
          "0x0000000000000000000000000000000000000000",  // address token_address
          "GBP",                                        // string memory fiat 
          "2500",                                       // string memory rate 
          "Bank Transfer",                              // string memory payment_options, 
          "mock_public_key",                            // string memory public_key, 
          "prompt settlement expected.",                // string memory offer_terms, 
          30,                                           // uint8 time_limit
          true,                                         // bool eth
          10000000000000000000n,                        // uint256 token_amount, 
          1000000000000000000n,                         // uint256 min_limit
          10000000000000000000n                         // uint256 max_limit 
        ])
        await publicClient.waitForTransactionReceipt({hash: txHash})
        
        const createdOffer = await mansaTrade.read.getOfferByIndex([0n]) as Offer;

        console.log(`Offer created. Transaction Hash: ${txHash}`);
        
        // Tests!

        assert.equal(
            createdOffer.owner.toLocaleLowerCase(),
            owner.account.address.toLocaleLowerCase(),
            "The offer owner should match the wallet that created it."
        );

        assert.equal(
            createdOffer.public_key,
            "mock_public_key",
            "The offer public key should match as input."
        );

        assert.equal(
            createdOffer.eth,
            true,
            "The offer should be flagged for native ETH, as input."
        );

        assert.equal(
            createdOffer.fiat, 
            "GBP", 
            "The offer fiat currency should match as input per owner's desired fiat."
        );

        assert.equal(
            createdOffer.rate,
            "2500",
            "The offer rate should match as input per owner's offered rate."
        );

        assert.equal(
            createdOffer.token_amount,
            10000000000000000000n,
            "The token amount should match as input per owner's offer of 10 ETH."
        );

        assert.equal(
            createdOffer.payment_options,
            "Bank Transfer",
            "The offer payment options should match as input."
        );
        
        assert.equal(
            createdOffer.offer_terms,
            "prompt settlement expected.",
            "The offer terms should match as input."
        );

        assert.equal(
            createdOffer.time_limit,
            30,
            "The offer time limit should match as input."
        );

        assert.equal(
            createdOffer.min_limit,
            1000000000000000000n,
            "The offer min limit should match as input per owner's 1 ETH limit."
        );

        assert.equal(
            createdOffer.max_limit,
            10000000000000000000n,
            "The offer max limit should match as input per owner's 10 ETH limit."
        );
    
    });
})


