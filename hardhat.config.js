import "@nomicfoundation/hardhat-ethers";
import "@nomicfoundation/hardhat-verify";
import "dotenv/config";

// Networks config - hardhat network is provided by default, no need to configure it
const networks = {
  arbitrum: {
    url: process.env.ALCHEMY_ARBITRUM_RPC,
    accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    chainId: 42161,
    type: "http",
  },
  arbitrumTestnet: {
    url: process.env.ALCHEMY_ARBITRUM_TESTNET_RPC || "https://sepolia-rollup.arbitrum.io/rpc",
    accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    chainId: 421614,
    type: "http",
  },
};

/** @type import('hardhat/config').HardhatUserConfig */
export default {
  solidity: "0.8.19",
  networks,
  etherscan: {
    apiKey: {
      arbitrumOne: process.env.ARBISCAN_API_KEY,
      arbitrumSepolia: process.env.ARBISCAN_API_KEY,
    },
  },
};
