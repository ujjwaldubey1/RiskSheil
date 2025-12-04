import hre from "hardhat";
import { ethers } from "ethers";

/**
 * Deploy AlertRegistry to Arbitrum Testnet (Sepolia)
 * 
 * This is a dry run before mainnet deployment.
 */

async function main() {
  console.log("🧪 Deploying to Arbitrum Testnet (Sepolia)...\n");

  const network = await ethers.provider.getNetwork();
  console.log("📡 Network:", network.name);
  console.log("📡 Chain ID:", network.chainId.toString());
  console.log("");

  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying with account:", deployer.address);
  
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", ethers.formatEther(balance), "ETH");
  console.log("");

  if (balance === 0n) {
    console.error("❌ Insufficient balance! Get testnet ETH from:");
    console.error("   https://faucet.quicknode.com/arbitrum/sepolia");
    process.exit(1);
  }

  // Deploy AlertRegistry
  console.log("📦 Deploying AlertRegistry contract...");
  const AlertRegistry = await ethers.getContractFactory("AlertRegistry");
  const alertRegistry = await AlertRegistry.deploy();
  await alertRegistry.waitForDeployment();

  const address = await alertRegistry.getAddress();
  console.log("✅ AlertRegistry deployed to:", address);
  console.log("");

  // Wait for a few confirmations
  console.log("⏳ Waiting for confirmations...");
  await new Promise(resolve => setTimeout(resolve, 30000)); // Wait 30 seconds
  console.log("");

  // Verify on Arbiscan
  console.log("🔍 Verifying contract on Arbiscan...");
  try {
    await hre.run("verify:verify", {
      address: address,
      constructorArguments: [],
    });
    console.log("✅ Contract verified on Arbiscan!");
  } catch (error) {
    console.log("⚠️  Verification failed (may already be verified):", error.message);
  }
  console.log("");

  console.log("✅ Testnet deployment complete!");
  console.log("\n📋 Next steps:");
  console.log("   1. Update backend/.env:");
  console.log("      ALERT_REGISTRY=" + address);
  console.log("      ALCHEMY_ARBITRUM_RPC=<testnet_rpc_url>");
  console.log("   2. Test backend on testnet");
  console.log("   3. Verify end-to-end functionality");
  console.log("   4. Deploy to mainnet when ready");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });

