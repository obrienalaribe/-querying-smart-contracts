const { ethers } = require("ethers");
const util = require('util');
const stakingContractEvents = require('./covalent_stakes');
const helpers = require('./helpers');

const bsc = {
    "id": 56,
    "stakingAddress": "0xD9dA44C4131986F64951aB0dDcDB36a0C73160d5",
    "startBlock": 11909230,
    "endBlock": 12909230
}

const eth = {
    "id": 1,
    "stakingAddress": "test",
    "startBlock": 11909230,
    "endBlock": 12909230
}

const totals = {
  0: 0,
  1: 0,
  2: 0,
  3: 0,
  4: 0,
  5: 0,
  6: 0
}; 

const chains = [bsc, eth]

chains.forEach(async function (chain) {
    let apiConfig = {
        "pageNumber": 0,
        "pageSize": 1000,
        "blockChunks": 1000000
    }
    
    const mainnetBSCNodeProvider = 'https://aged-withered-flower.bsc.quiknode.pro/7af22bf6a00dc835df81b02bd1549ffe37fd98f5/';
    const bscProvider = new ethers.providers.JsonRpcProvider(mainnetBSCNodeProvider);

    let latestBlock = await bscProvider.getBlockNumber()
    console.log(`latestBlock: ${latestBlock}`)

    let hasMoreTransactionsInBlockRange = true
    let blocksToProcess = latestBlock - chain.startBlock
    console.log(`Total blocksToProcess ${blocksToProcess}`)

    while(blocksToProcess != 0) {

        console.log(`Outstanding blocksToProcess: ${blocksToProcess}`);
        // console.log(apiConfig);
        // console.log(chain);

        const result = await stakingContractEvents.fetchAccounts(chain, apiConfig);
        console.log(`Total Stakers: ${stakingContractEvents.stakingAccounts.size}, hasMore: ${result.hasMoreTransactions}`)    

        // await new Promise(resolve => setTimeout(resolve, 3000));
        apiConfig.pageNumber++
        hasMoreTransactionsInBlockRange = result.hasMoreTransactions
        
        // Iterate over pagination until Items returned is 0
        if (hasMoreTransactionsInBlockRange == false){
            // console.log(apiConfig)
            // console.log(chain);
            apiConfig.pageNumber = 0
            chain.startBlock += apiConfig.blockChunks
            blocksToProcess = latestBlock - chain.endBlock

            // If blocksToProcess is less than 1mill set endblock to latestBlock
            if (blocksToProcess < apiConfig.blockChunks) {
                console.log(`=> Final run, outstanding blocksToProcess: ${blocksToProcess}`)
                chain.endBlock = latestBlock
            } else{
              chain.endBlock += apiConfig.blockChunks
            }
            hasMoreTransactionsInBlockRange = true
        }
    }

    helpers.writeToFile(stakingContractEvents.stakingAccounts, "./stakingAccounts.txt")

});





// const main = async () => {
//   const userStakes = await bscStakingContract.stakesFor(paidTokenBSCMainnet, customerAddress);
//   userStakes.forEach(userStake => {
//     const years = userStake.stakedYears.toNumber();
//     const stakedOn = userStake.stakedOn;
//     const noPenaltyAfter = userStake.noPenaltyAfter.toNumber();
//     const amount = parseInt(ethers.utils.formatEther(userStake.amount));

//     console.log(`years: ${util.inspect(years)}, stakedOn: ${stakedOn}, noPenaltyAfter: ${noPenaltyAfter},  amount: ${util.inspect(amount)}`)
//     if (years > 0) {
//         const amount = parseInt(ethers.utils.formatEther(userStake.amount));
//         if (amount > 0 && amount === eventAmount) {
//             console.log(`user stake years ${util.inspect(years)}`);
//             console.log(`user stake amount ${util.inspect(amount)}`);
//             totals[years] += amount;
//         }
//     }
// });
// }

// main()
