require("@nomicfoundation/hardhat-toolbox")
require("dotenv").config();

module.exports = {
  solidity: "0.8.28",
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL, // RPC URL from Infura, Alchemy, etc.
      accounts: [process.env.PRIVATE_KEY], // Your private key
    },
    holesky:{
      url: process.env.HOLESKY_RPC_URL,
      accounts: [process.env.PRIVATE_KEY], // Your private key
    },
  },

  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY, // Your Etherscan API key
  },
};

