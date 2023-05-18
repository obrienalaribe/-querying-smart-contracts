const fs = require('fs');
const path = require('path');
const util = require('util');
const { ethers } = require("ethers");
const csv = require('fast-csv');
const { format } = require('@fast-csv/format');

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


const main = async () => {
    const allStakes = [];

    const STAKE_ABI = [
        "function name() view returns (string)",
        "function symbol() view returns (string)",
        "function totalSupply() view returns (uint256)",
        "function balanceOf(address) view returns (uint)",
    
        "event Staked(address indexed user, uint256 amount, uint256 stakedOn)",
        "event UnStaked(address indexed user, uint256 amount, uint256 unstakedOn)"
    ];
    const bscProvider = new ethers.providers.JsonRpcProvider(mainnetBSCProvider);
    const bscContract = new ethers.Contract(stakingAddressBSCMainnet, STAKE_ABI, bscProvider);
   
    const genesisBlock = 11909230;
    const latestBlock = await bscProvider.getBlockNumber()
    console.log(`Current block is ${latestBlock}`)

    const INCREMENTOR = 10000
    for (currentBlock = genesisBlock; currentBlock <= latestBlock; currentBlock+=INCREMENTOR ){
        endBlock = currentBlock + INCREMENTOR
        let eventFilter = [bscContract.filters.Staked()];
        // let eventFilter =  {
        //     topics: [
        //         ethers.utils.id("Staked(address,uint256,uint256)"),
        //         ethers.utils.hexZeroPad(record.From, 32)
        //     ],
        // }
        const stakeEvent = await bscContract.queryFilter(eventFilter, currentBlock, endBlock);
        allStakes.push(stakeEvent);

        for (const event of stakeEvent ) {
            console.log(event.blockNumber)
            console.log(event.event)
            console.log(event.args?.amount)
            console.log(ethers.utils.formatEther(event.args?.amount) + ` PAID`)
        }
        console.log("##############")
    }         
}

main();