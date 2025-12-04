require("dotenv").config();
const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const { ethers } = require("ethers");

// Express app
const app = express();

// Render requirement → Port must be dynamic (NO hardcoded ports)
const PORT = process.env.PORT || 3000;

// Create HTTP server
const server = http.createServer(app);

// Attach WebSocket to SAME server (Render requirement)
// WebSocket path: /alerts
const wss = new WebSocket.Server({ server, path: "/alerts" });

// WebSocket connection handler
wss.on("connection", (ws) => {
  console.log("🔗 WebSocket client connected");
  ws.send(JSON.stringify({ msg: "Client connected to RiskShield backend" }));

  ws.on("message", (message) => {
    console.log("📨 Received message:", message.toString());
  });

  ws.on("close", () => {
    console.log("❌ WebSocket client disconnected");
  });

  ws.on("error", (error) => {
    console.error("❌ WebSocket error:", error);
  });
});

// Function to broadcast alerts to all connected clients
function broadcastAlert(alert) {
  const message = JSON.stringify(alert);
  let clientCount = 0;
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
      clientCount++;
    }
  });
  console.log(`📢 Broadcasted alert to ${clientCount} clients`);
}

// Express routes
app.get("/", (req, res) => {
  res.json({
    status: "online",
    service: "RiskShield Backend",
    websocket: "/alerts"
  });
});

app.get("/health", (req, res) => {
  res.json({ status: "healthy" });
});

// ---- RiskShield Core ----
console.log("💻 Starting RiskShield backend listener...");

// Connect to Arbitrum RPC
const RPC = process.env.ALCHEMY_ARBITRUM_RPC;
if (!RPC) {
  console.error("❌ ALCHEMY_ARBITRUM_RPC is not set in .env file");
  process.exit(1);
}

const provider = new ethers.JsonRpcProvider(RPC);
console.log("📡 Connected to Arbitrum mainnet");

// BLOK Garden Factory and Garden ABIs (minimal needed for events)
const GardenFactoryAddress = process.env.GARDEN_FACTORY || "0x...";
const GardenFactoryABI = [ 
    "event GardenCreated(address indexed garden, address indexed creator)" 
];

const GardenABI = [
    "event SwapExecuted(address indexed manager, address tokenIn, address tokenOut, uint256 amount)",
    "function allowedTokens() view returns (address[])",
    "function maxAllocation(address token) view returns (uint256)"
];

// Load AlertRegistry
const alertRegistryAddress = process.env.ALERT_REGISTRY;
if (!alertRegistryAddress) {
  console.error("❌ ALERT_REGISTRY is not set in .env file");
  process.exit(1);
}
console.log("📝 AlertRegistry address:", alertRegistryAddress);

const AlertABI = [ 
    "function saveAlert(address garden, address manager, string reason, bytes metadata) external"
];

const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const alertRegistry = new ethers.Contract(alertRegistryAddress, AlertABI, signer);

async function start() {
    // Listen to Garden Factory for new Gardens
    if (GardenFactoryAddress !== "0x...") {
        const factory = new ethers.Contract(GardenFactoryAddress, GardenFactoryABI, provider);
        
        factory.on("GardenCreated", (garden, creator, event) => {
            console.log("🌱 New Garden detected:", garden);
            console.log("   Creator:", creator);
            watchGarden(garden);
        });

        console.log("👂 Listening for new Gardens from factory:", GardenFactoryAddress);
    } else {
        console.log("⚠️  GardenFactoryAddress not set, skipping factory listener");
    }

    // For demo: watch a specific Garden address
    const demoGarden = process.env.DEMO_GARDEN || "0x...";
    if (demoGarden !== "0x...") {
        console.log("🔍 Starting demo monitoring for Garden:", demoGarden);
        watchGarden(demoGarden);
    } else {
        console.log("⚠️  DEMO_GARDEN not set, skipping demo garden monitoring");
    }
}

async function watchGarden(gardenAddress) {
    console.log("🔍 Monitoring Garden:", gardenAddress);

    const garden = new ethers.Contract(gardenAddress, GardenABI, provider);

    garden.on("SwapExecuted", async (manager, tokenIn, tokenOut, amount, event) => {
        console.log("🔁 SwapExecuted detected:");
        console.log("   Manager:", manager);
        console.log("   TokenIn:", tokenIn);
        console.log("   TokenOut:", tokenOut);
        console.log("   Amount:", amount.toString());

        try {
            const allowed = await garden.allowedTokens();

            // Forbidden-token check (primary demo)
            const isAllowed = allowed.some(token => 
                token.toLowerCase() === tokenOut.toLowerCase()
            );

            if (!isAllowed) {
                const reason = `Unauthorized token used: ${tokenOut}`;
                console.log("🚨 RISK VIOLATION:", reason);

                // Write alert on-chain for transparency
                try {
                    const tx = await alertRegistry.saveAlert(
                        gardenAddress,
                        manager,
                        reason,
                        "0x"
                    );
                    console.log("⏳ Transaction submitted:", tx.hash);
                    const receipt = await tx.wait();
                    console.log("🟢 Alert saved on-chain!");
                    console.log("   Transaction hash:", receipt.hash);
                    console.log("   Block number:", receipt.blockNumber);
                    
                    // Broadcast alert via WebSocket
                    const alertData = {
                        id: Date.now(),
                        garden: gardenAddress,
                        manager: manager,
                        reason: reason,
                        timestamp: Date.now(),
                        type: 'violation',
                        txHash: receipt.hash,
                        blockNumber: receipt.blockNumber
                    };
                    broadcastAlert(alertData);
                } catch (error) {
                    console.error("❌ Error saving alert on-chain:", error.message);
                }
            } else {
                console.log("✅ Token is allowed, no violation detected");
            }

            // Additional checks can be added:
            // - Allocation limit breach
            // - Slippage violation
            // - Rapid trading frequency
            // - Position concentration

        } catch (error) {
            console.error("❌ Error processing swap event:", error.message);
        }
    });

    console.log("✅ Garden monitoring started for:", gardenAddress);
}

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log("\n🛑 Shutting down RiskShield backend...");
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log("\n🛑 Shutting down RiskShield backend...");
    process.exit(0);
});

// Start RiskShield monitoring
start().catch((error) => {
    console.error("❌ Fatal error:", error);
    process.exit(1);
});

// Start server (Render-compatible)
// Must listen ONLY on process.env.PORT
server.listen(PORT, () => {
  console.log(`🚀 Server running on PORT ${PORT}`);
  console.log(`🔌 WebSocket available at ws://<host>:${PORT}/alerts`);
});
