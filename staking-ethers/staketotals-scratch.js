const fs = require('fs');
const path = require('path');
const util = require('util');
const { ethers, BigNumber } = require("ethers");
const csv = require('fast-csv');
const { format } = require('@fast-csv/format');
const helpers = require('./helpers');
// const { BigNumber } = require("@ethersproject/bignumber");

const stakingContractAbi = require('./staking.json');

const tokenAddressBSCTestnet = '0xD4571aD34970A524FcD50Ff2c4715929C3B0d6b0';
const tokenAddressETHTestnet = '0x4756c2d4BD8C94a91b910bDD9F6e8cC12676A40F';
const tokenAddressETHMainnet = '0x1614f18fc94f47967a3fbe5ffcd46d4e7da3d787';
const tokenAddressBSCMainent = '0xAD86d0E9764ba90DDD68747D64BFfBd79879a238';

const stakingAddressBSCTestnet = "0x3c78b65BF6a1511c37B7De344d6DD5A295712B19";
const stakingAddressBSCMainnet = "0xD9dA44C4131986F64951aB0dDcDB36a0C73160d5";
const stakingAddressETHMainnet = "0xeFb59308f38DC31CBAd9964E0A174074cBE20331";

const testnetETHProvider = 'https://rinkeby.infura.io/v3/218d452eeec34d13b517834ecd154cd0'
const testnetBSCProvider = 'https://data-seed-prebsc-1-s1.binance.org:8545/';

const mainnetETHProvider = 'https://thrumming-falling-surf.quiknode.pro/b03f1dbfbf60a4c440b4a509ef700d10275078f6/'
const mainnetBSCProvider = 'https://aged-withered-flower.bsc.quiknode.pro/7af22bf6a00dc835df81b02bd1549ffe37fd98f5/';

const bscPAIDBlock = 11909230;
const ethPAIDBlock = 13370311;

const main = async () => {
    // const addressSet = new Set();

    const bscProvider = new ethers.providers.JsonRpcProvider(mainnetBSCProvider);
    const bscContract = new ethers.Contract(stakingAddressBSCMainnet, stakingContractAbi, bscProvider);
    const ethProvider = new ethers.providers.JsonRpcProvider(mainnetETHProvider);
    const ethContract = new ethers.Contract(stakingAddressETHMainnet, stakingContractAbi, ethProvider);

    const bscCurrentBlockNumber = await bscProvider.getBlockNumber();
    const ethCurrentBlockNumber = await ethProvider.getBlockNumber();

    let bscBlocksToProcess = bscCurrentBlockNumber - bscPAIDBlock;
    let ethBlocksToProcess = ethCurrentBlockNumber - ethPAIDBlock;

    console.log(`BSC Current Block #: ${bscCurrentBlockNumber}`);
    console.log(`ETH Current Block #: ${ethCurrentBlockNumber}`);
    console.log(`BSC Blocks that need to be processed: ${bscBlocksToProcess}`);
    console.log(`ETH Blocks that need to be processed: ${ethBlocksToProcess}`);
    
    const totals = {
        0: 0,
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
        6: 0
    };    

    let bscFromBlock = bscPAIDBlock;
    const currentBlockChunk = 10000;

    while (bscBlocksToProcess > 0) {
        stakedFilter = {
            topics: [
                // the name of the event, parnetheses containing the data type of each event, no spaces
                ethers.utils.id("Staked(address,uint256,uint256)"),
            ],
        }

        console.log(`Processing 10K blocks starting at block ${bscFromBlock} and ending at block ${bscFromBlock + currentBlockChunk}`);

        const bscStakes = await bscContract.queryFilter(stakedFilter, bscFromBlock, bscFromBlock + currentBlockChunk);
        console.log(`${bscStakes.length} stake events found in this block chunk`);
        for await (const stake of bscStakes) {
            console.log(stake);
            const address = stake.args.user;
            const eventAmount = parseInt(ethers.utils.formatEther(stake.args.amount));
            console.log(`Staked event for account ${address} and amount ${eventAmount}`);
            addressSet.add(address.toLowerCase());
            // console.log(`Stake event object ${util.inspect(stake)}`);
        }

        bscFromBlock += 10001;
        if (bscFromBlock > bscCurrentBlockNumber) {
            bscFromBlock = bscCurrentBlockNumber;
        }

        bscBlocksToProcess -= 10000;
        if (bscBlocksToProcess < 0) {
            bscBlocksToProcess = 0;
        }
        if (bscBlocksToProcess <= 10000) {
            currentBlockChunk = bscBlocksToProcess;
        }
    }

    console.log('\nProcessing addresses using stakesFor...\n');
    const addressSet = helpers.readSetFromFile('./stakingAccounts.txt')

    for await (let address of addressSet) {
        const userStakes = await bscContract.stakesFor(tokenAddressBSCMainent, address);

        userStakes.forEach(userStake => {
            console.log(`stakedYears: ${userStake.stakedYears}`);
            console.log(userStake)
            const years = userStake.stakedYears.toString();
            const stakedOn = userStake.stakedOn.toString();
            const noPenaltyAfter = userStake.noPenaltyAfter.toString();
            const amount = userStake.amount.toString();
            
            console.log(`address: ${address}, years: ${years}, amount: ${amount} stakedOn: ${stakedOn}, noPenaltyAfter: ${noPenaltyAfter} `)

            // if (years.gt(0)) {
            //     const amount = parseInt(ethers.utils.formatEther(userStake.amount));
            //     if (amount > 0) {
            //         console.log(`user stake years ${util.inspect(years)}`);
            //         console.log(`user stake amount ${util.inspect(amount)}`);
            //         totals[years] += amount;
            //     }
            // }
        });
    }

    console.log('Totals:\n\n');
    console.log(util.inspect(totals));

    process.exit(0);
}

main();