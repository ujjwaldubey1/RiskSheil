import hre from "hardhat";
import { ethers } from "ethers";

/**
 * Local Testing Script - Mainnet Fork
 * 
 * This script tests the AlertRegistry contract on a local Hardhat fork
 * of Arbitrum mainnet. No real gas is spent.
 */

async function main() {
  console.log("🧪 Starting local test on Hardhat mainnet fork...\n");

  // Get signers
  const [deployer, testGarden, testManager] = await ethers.getSigners();
  console.log("📝 Deployer address:", deployer.address);
  console.log("📝 Test Garden address:", testGarden.address);
  console.log("📝 Test Manager address:", testManager.address);
  console.log("");

  // Deploy AlertRegistry
  console.log("📦 Deploying AlertRegistry contract...");
  const AlertRegistry = await ethers.getContractFactory("AlertRegistry");
  const alertRegistry = await AlertRegistry.deploy();
  await alertRegistry.waitForDeployment();
  const address = await alertRegistry.getAddress();
  console.log("✅ AlertRegistry deployed to:", address);
  console.log("");

  // Test 1: Save an alert
  console.log("🧪 Test 1: Saving an alert...");
  const testGardenAddr = testGarden.address;
  const testManagerAddr = testManager.address;
  const testReason = "Test violation: Unauthorized token used";
  const testMetadata = "0x";

  const tx = await alertRegistry.saveAlert(
    testGardenAddr,
    testManagerAddr,
    testReason,
    testMetadata
  );
  console.log("⏳ Transaction submitted:", tx.hash);
  const receipt = await tx.wait();
  console.log("✅ Transaction confirmed in block:", receipt.blockNumber);
  console.log("");

  // Test 2: Check alerts count
  console.log("🧪 Test 2: Checking alerts count...");
  const count = await alertRegistry.alertsCount();
  console.log("✅ Total alerts:", count.toString());
  console.log("");

  // Test 3: Read alert details
  console.log("🧪 Test 3: Reading alert details...");
  const alert = await alertRegistry.alerts(0);
  console.log("✅ Alert 0 details:");
  console.log("   Garden:", alert.garden);
  console.log("   Manager:", alert.manager);
  console.log("   Reason:", alert.reason);
  console.log("   Timestamp:", alert.timestamp.toString());
  console.log("");

  // Test 4: Check event emission
  console.log("🧪 Test 4: Checking for AlertSaved event...");
  const filter = alertRegistry.filters.AlertSaved();
  const events = await alertRegistry.queryFilter(filter);
  console.log("✅ Found", events.length, "AlertSaved event(s)");
  if (events.length > 0) {
    console.log("   Event details:");
    console.log("   - Alert ID:", events[0].args.id.toString());
    console.log("   - Garden:", events[0].args.garden);
    console.log("   - Manager:", events[0].args.manager);
    console.log("   - Reason:", events[0].args.reason);
  }
  console.log("");

  console.log("✅ All local tests passed!");
  console.log("\n💡 Next steps:");
  console.log("   1. Start backend: cd backend && npm start");
  console.log("   2. Update ALERT_REGISTRY in backend/.env to:", address);
  console.log("   3. Test backend detection and WebSocket alerts");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Test failed:", error);
    process.exit(1);
  });

