"use strict";
/**
 * Submit metrics returns "Payload accepted" response
 */
exports.__esModule = true;
var datadog_api_client_1 = require("@datadog/datadog-api-client");
var configuration = datadog_api_client_1.v1.createConfiguration();
var apiInstance = new datadog_api_client_1.v1.MetricsApi(configuration);
datadog_api_client_1.v1.setServerVariables(configuration, {
    site: "datadoghq.eu"
});

const postMetric = async (unstakes) => {
    for (let i = 0; i < 100; i++) {
        unstakes += 10213
        console.log(`unstakes: ${unstakes}`)
        var params = {
            body: {
                series: [
                    {
                        metric: "test.paidnetwork.value",
                        type: "guage",
                        points: [[new Date().getTime() / 1000, 0.178393]],
                        tags: ["chain:bsc", "env:mainnet"]
                    },
                    {
                        metric: "test.paidnetwork.telegram",
                        type: "guage",
                        points: [[new Date().getTime() / 1000, 0.178393]],
                        tags: ["chain:bsc", "env:mainnet"]
                    },
                    {
                        metric: "test.paidnetwork.unstakes",
                        type: "gauge",
                        points: [[new Date().getTime() / 1000, unstakes]],
                        tags: ["chain:bsc", "env:mainnet"]
                    },
                    {
                        metric: "test.paidnetwork.stake.duration",
                        type: "gauge",
                        points: [[new Date().getTime() / 1000, unstakes * 0.08]],
                        tags: ["chain:bsc", "env:mainnet", "shortTerm"]
                    },
                    {
                        metric: "test.paidnetwork.stake.duration",
                        type: "gauge",
                        points: [[new Date().getTime() / 1000, unstakes * 0.12]],
                        tags: ["chain:bsc", "env:mainnet", "1"]
                    },
                    {
                        metric: "test.paidnetwork.stake.duration",
                        type: "gauge",
                        points: [[new Date().getTime() / 1000, unstakes * 0.03]],
                        tags: ["chain:bsc", "env:mainnet", "2"]
                    },
                    {
                        metric: "test.paidnetwork.stake.duration",
                        type: "gauge",
                        points: [[new Date().getTime() / 1000, unstakes * 0.17]],
                        tags: ["chain:bsc", "env:mainnet", "3"]
                    },
                    {
                        metric: "test.paidnetwork.stake.duration",
                        type: "gauge",
                        points: [[new Date().getTime() / 1000, unstakes * 0.20]],
                        tags: ["chain:bsc", "env:mainnet", "4"]
                    },
                    {
                        metric: "test.paidnetwork.stake.duration",
                        type: "gauge",
                        points: [[new Date().getTime() / 1000, unstakes * 0.35]],
                        tags: ["chain:bsc", "env:mainnet", "5"]
                    },
                    {
                        metric: "test.paidnetwork.stake.duration",
                        type: "gauge",
                        points: [[new Date().getTime() / 1000, unstakes * 0.05]],
                        tags: ["chain:bsc", "env:mainnet", "6+"]
                    },
                ]
            }
        };
        console.log("here")
        apiInstance
            .submitMetrics(params)
            .then(function (data) {
            console.log("API called successfully. Returned data: " + JSON.stringify(data));
        })["catch"](function (error) { return console.error(error); });

        await new Promise(resolve => setTimeout(resolve, 6000));
    }    
}

postMetric(2810213)


