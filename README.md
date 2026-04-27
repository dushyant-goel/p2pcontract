# Aim
To create the test for "createOffer" function of MansaTrade.sol

# Run
`npx hardhat test --network localhost test/MansaTrade.ts`

(at `../contract/hardhat/`)

# Issues with createOffer 
(Responsibility of .sol file)
- Add check for `min_amount` < `token_amount` < `max_amount`
