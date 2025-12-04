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

// Middleware for JSON parsing
app.use(express.json());

// Track monitored Gardens
const monitoredGardens = new Map(); // gardenAddress -> { contract, listeners }

// Express routes
app.get("/", (req, res) => {
  res.json({
    status: "online",
    service: "RiskShield Backend",
    websocket: "/alerts",
    monitoredGardens: Array.from(monitoredGardens.keys())
  });
});

app.get("/health", (req, res) => {
  res.json({ status: "healthy" });
});

// API: Get all monitored Gardens
app.get("/api/gardens", (req, res) => {
  const gardens = Array.from(monitoredGardens.keys()).map(address => ({
    address,
    status: "monitoring"
  }));
  res.json({ gardens, count: gardens.length });
});

// API: Add a Garden to monitor
app.post("/api/gardens", async (req, res) => {
  try {
    const { address } = req.body;
    
    if (!address) {
      return res.status(400).json({ error: "Garden address is required" });
    }

    // Validate address format
    if (!ethers.isAddress(address)) {
      return res.status(400).json({ error: "Invalid Ethereum address format" });
    }

    const normalizedAddress = address.toLowerCase();

    // Check if already monitoring
    if (monitoredGardens.has(normalizedAddress)) {
      return res.status(400).json({ 
        error: "Garden is already being monitored",
        address: normalizedAddress
      });
    }

    // Start monitoring
    await watchGarden(normalizedAddress);
    
    res.json({ 
      success: true,
      message: `Started monitoring Garden: ${normalizedAddress}`,
      address: normalizedAddress
    });
  } catch (error) {
    console.error("❌ Error adding Garden:", error);
    res.status(500).json({ error: error.message });
  }
});

// API: Remove a Garden from monitoring
app.delete("/api/gardens/:address", (req, res) => {
  try {
    const address = req.params.address.toLowerCase();

    if (!monitoredGardens.has(address)) {
      return res.status(404).json({ 
        error: "Garden is not being monitored",
        address
      });
    }

    // Remove listeners (in a real implementation, you'd need to store and remove event listeners)
    monitoredGardens.delete(address);
    
    console.log(`🛑 Stopped monitoring Garden: ${address}`);
    
    res.json({ 
      success: true,
      message: `Stopped monitoring Garden: ${address}`,
      address
    });
  } catch (error) {
    console.error("❌ Error removing Garden:", error);
    res.status(500).json({ error: error.message });
  }
});

// API: Get Garden monitoring status
app.get("/api/gardens/:address", (req, res) => {
  const address = req.params.address.toLowerCase();
  const isMonitoring = monitoredGardens.has(address);
  
  res.json({
    address,
    monitoring: isMonitoring,
    status: isMonitoring ? "active" : "not monitoring"
  });
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

    // Load Gardens from environment variables
    const demoGarden = process.env.DEMO_GARDEN || "0x...";
    if (demoGarden !== "0x...") {
        console.log("🔍 Starting monitoring for Garden from DEMO_GARDEN:", demoGarden);
        await watchGarden(demoGarden);
    }

    // Support multiple Gardens via comma-separated list
    const gardensList = process.env.GARDENS || "";
    if (gardensList) {
        const gardens = gardensList.split(",").map(addr => addr.trim()).filter(addr => addr && addr !== "0x...");
        for (const gardenAddr of gardens) {
            console.log("🔍 Starting monitoring for Garden from GARDENS list:", gardenAddr);
            await watchGarden(gardenAddr);
        }
    }

    if (monitoredGardens.size === 0) {
        console.log("⚠️  No Gardens configured for monitoring");
        console.log("💡 Add Gardens via:");
        console.log("   - Environment: DEMO_GARDEN=0x... or GARDENS=0x...,0x...");
        console.log("   - API: POST /api/gardens with { address: '0x...' }");
    } else {
        console.log(`✅ Monitoring ${monitoredGardens.size} Garden(s)`);
    }
}

async function watchGarden(gardenAddress) {
    // Normalize address
    const normalizedAddress = gardenAddress.toLowerCase();
    
    // Check if already monitoring
    if (monitoredGardens.has(normalizedAddress)) {
        console.log("⚠️  Garden already being monitored:", normalizedAddress);
        return;
    }

    console.log("🔍 Monitoring Garden:", normalizedAddress);

    const garden = new ethers.Contract(normalizedAddress, GardenABI, provider);
    
    // Store in monitored Gardens map
    monitoredGardens.set(normalizedAddress, {
        contract: garden,
        startTime: Date.now()
    });

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
