# RiskShield Backend - Event Listener & Risk Engine

This backend service monitors BLOK Garden contracts on Arbitrum mainnet for risk violations and saves alerts to the AlertRegistry contract.

**✅ Render-Compatible**: The backend uses Express HTTP server with WebSocket attached, making it fully compatible with Render and other cloud platforms.

## Setup

1. **Install Dependencies**

   ```bash
   npm install
   ```

2. **Environment Variables**

   Add these to your root `.env` file (or create `backend/.env`):

   ```env
   ALCHEMY_ARBITRUM_RPC=https://arb-mainnet.g.alchemy.com/v2/YOUR_KEY
   PRIVATE_KEY=0xYOUR_PRIVATE_KEY_HERE
   ALERT_REGISTRY=0x...  # Address of deployed AlertRegistry contract
   GARDEN_FACTORY=0x...  # BLOK Garden Factory address (optional)
   DEMO_GARDEN=0x...     # Specific Garden address to monitor (optional)
   PORT=3000             # Server port (optional, defaults to 3000, Render sets automatically)
   ```

3. **Run the Backend**

   ```bash
   npm start
   # or
   node index.js
   ```

   The server will start on the port specified by the `PORT` environment variable (defaults to 3000).
   - HTTP server: `http://localhost:PORT`
   - WebSocket: `ws://localhost:PORT/alerts`

## Features

- **Garden Factory Listener**: Automatically detects new Gardens created via the factory
- **Swap Monitoring**: Watches for SwapExecuted events on monitored Gardens
- **Risk Detection**: 
  - Unauthorized token usage detection
  - (Extensible for additional checks: allocation limits, slippage, frequency, etc.)
- **On-Chain Alerts**: Saves detected violations to the AlertRegistry contract
- **WebSocket Server**: Broadcasts alerts in real-time to connected frontend clients

## Configuration

- Update `GARDEN_FACTORY` in `.env` with the actual BLOK Garden Factory address
- Set `DEMO_GARDEN` in `.env` to monitor a specific Garden
- Set `PORT` in `.env` to configure the server port (defaults to 3000, Render sets automatically)
- The service will automatically start monitoring once Gardens are detected or configured

## WebSocket Connection

The backend provides a WebSocket endpoint that broadcasts alerts to all connected clients. The frontend can connect to:

```
ws://localhost:PORT/alerts
```

For production (Render), use:
```
wss://your-service-name.onrender.com/alerts
```

Where `PORT` is the value from the `PORT` environment variable (default: 3000).

## HTTP Endpoints

- `GET /` - Service status
- `GET /health` - Health check endpoint
- `WS /alerts` - WebSocket connection for real-time alerts

## Render Deployment

See [RENDER_DEPLOYMENT.md](./RENDER_DEPLOYMENT.md) for detailed deployment instructions.
