import hre from "hardhat";
import { ethers } from "ethers";

async function main() {
  // Get the provider from environment variable
  const rpcUrl = process.env.ALCHEMY_ARBITRUM_RPC;
  if (!rpcUrl) {
    throw new Error("ALCHEMY_ARBITRUM_RPC is not set in .env file");
  }
  const provider = new ethers.JsonRpcProvider(rpcUrl);
  
  // Create a wallet from the private key
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  
  console.log("Deploying contracts with the account:", wallet.address);
  const balance = await provider.getBalance(wallet.address);
  console.log("Account balance:", balance.toString());

  // Get the contract artifact
  const artifact = await hre.artifacts.readArtifact("AlertRegistry");
  
  // Create contract factory
  const AlertFactory = new ethers.ContractFactory(artifact.abi, artifact.bytecode, wallet);
  const alert = await AlertFactory.deploy();
  await alert.waitForDeployment();

  const address = await alert.getAddress();
  console.log("AlertRegistry deployed to:", address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

