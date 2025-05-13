require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.19",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      },
      {
        version: "0.8.19",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      },
      {
        version: "0.6.6",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      },
      {
        version: "0.4.18",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      },
     
    ],
  },

  networks: {
    bscTestNet: {
      url: `https://data-seed-prebsc-1-s3.binance.org:8545/`,
      accounts: [process.env.PVT_KEY]
    },
    sepolia: {
      url: `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`, 
      accounts: [process.env.PVT_KEY] 
    },
    polygonAmoy:{
    url: `https://polygon-amoy.infura.io/v3/${process.env.INFURA_API_KEY}`,
    accounts: [process.env.PVT_KEY]
   },
   snowtrace:{
    url: `https://avalanche-fuji.infura.io/v3/${process.env.INFURA_API_KEY}`,
    accounts: [process.env.PVT_KEY]
   },
   polygonMainnet:{
    url: `https://polygon-mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
    accounts:[process.env.PVT_KEY]
   }
  },
  etherscan: {
    apiKey: {
      bscTestnet: process.env.BSCSCAN_API_KEY, 
      sepolia: process.env.SEPOLIA_ETHERSCAN_API_KEY, 
      polygonAmoy:process.env.AMOY_API_KEY,
      polygonMainnet:process.env.AMOY_API_KEY,
      snowtrace: "snowtrace"
    },
    customChains: [
      {
        network: "snowtrace",
        chainId: 43113,
        urls: {
          apiURL: "https://api.routescan.io/v2/network/testnet/evm/43113/etherscan",
          browserURL: "https://avalanche.testnet.localhost:8080"
        }
      },
      {
        network: "polygonAmoy",
        chainId: 80002,
        urls: {
          apiURL: "https://www.oklink.com/api/explorer/v1/contract/verify/async/api/polygonAmoy",
          browserURL: "https://www.oklink.com/polygonAmoy"
        },
      },
      {
        network: "polygonMainnet",
        chainId: 137,
        urls: {
          apiURL: "https://api.polygonscan.com/api",
          browserURL: "https://polygonscan.com"
        }
      }
    ]
  },
  sourcify: {
    enabled: true
  }
}