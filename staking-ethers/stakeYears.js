const helpers = require('./helpers');
const { ethers } = require("ethers");
const util = require('util');

const stakingAddressBSCMainnet = "0xD9dA44C4131986F64951aB0dDcDB36a0C73160d5";
const stakingContractAbi = require('./staking.json');
const paidTokenBSCMainnet = '0xAD86d0E9764ba90DDD68747D64BFfBd79879a238';

const totals = {
    0: 0,
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0
};    

// Web3 Provider
const mainnetBSCNodeProvider = 'https://aged-withered-flower.bsc.quiknode.pro/7af22bf6a00dc835df81b02bd1549ffe37fd98f5/';
const bscProvider = new ethers.providers.JsonRpcProvider(mainnetBSCNodeProvider);
const bscStakingContract = new ethers.Contract(stakingAddressBSCMainnet, stakingContractAbi, bscProvider);

const activeStakeAccounts = helpers.readSetFromFile('./stakingAccounts.txt')
activeStakeAccounts.forEach(async function (customerAccount) {
    const userStakes = await bscStakingContract.stakesFor(paidTokenBSCMainnet, customerAccount);
    userStakes.forEach(userStake => {
    try {
        const years = userStake.stakedYears.toNumber();
        if (years > 0) {
            const amount = parseInt(ethers.utils.formatEther(userStake.amount));
            if (amount > 0) {
                // console.log(`Years ${util.inspect(years)}, Amount ${util.inspect(amount)}`);
                totals[years] += amount;
            }
        }
    } catch (e){
        console.log("=======")
        console.log(e)
        console.log(`Amount: ${userStake.amount}, StakedYears: ${userStake.stakedYears}`);
        console.log("\n=======\n\n")

    }
})

  // const customerAddress = "0xbeb97a859d2011781d79de156a3bcd8a3c15a8dd"

  
  })