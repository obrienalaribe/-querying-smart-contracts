const axios = require('axios');
const { ethers } = require("ethers");

const client = axios.create({
    auth: {
      username: "ckey_f6f20f6a387444639a7617f8ca3"
    }
  });

const stakingAccounts = new Set();

// This func fetches all events on the SC address & outputs a set of address that interacted with the SC

const fetchAccounts = async (chain, apiConfig) => {
    let hasMoreTransactions = true

    const request =  await client.get(`https://api.covalenthq.com/v1/${chain.id}/events/address/${chain.stakingAddress}/?starting-block=${chain.startBlock}&ending-block=${chain.endBlock}&page-number=${apiConfig.pageNumber}&page-size=${apiConfig.pageSize}`)
    .then(function(response) {
        let transactions = response.data.data.items

        if (transactions.length > 0 && response.status == 200 ) {
            console.log("\nQuerying Covalent API ...\n");

            transactions.forEach(function (transaction) {
                // console.log(transaction)
// 0x528497967730411c6d6cd1f13f6731ed3bda4d15

                let smartContractEvent = transaction.decoded
                console.log(smartContractEvent.params)
                // This event has no data for Staked/Unstaked use RPC call with ABI function instead (i.e Function: stakeReward)
                if (smartContractEvent == null) {
                } else if (smartContractEvent.name === "Staked") {
                    stakingAccounts.add(smartContractEvent.params[0].value);
                } else if (smartContractEvent.name === "Unstaked") {
                    stakingAccounts.delete(smartContractEvent.params[0].value)
                }        
            })
        } else{
            console.log("No more transactions to process, setting hasMoreTransactions to false")
            hasMoreTransactions = false
        }
    }).catch((e) => {
        console.error(`Error: ${e}`,)
        // console.error(`API Error: ${e.response.data.error_code} =>`, e.response.data.error_message)

})
    return { stakingAccounts, hasMoreTransactions };
}

module.exports = { fetchAccounts, stakingAccounts }