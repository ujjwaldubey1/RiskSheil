# 🚀 Render Deployment Guide for RiskShield Backend

## ✅ Render Compatibility

The backend has been refactored to be fully Render-compatible:

- ✅ Uses **Express HTTP server** (required by Render)
- ✅ WebSocket attached to **SAME HTTP server** (not separate port)
- ✅ Listens **ONLY on process.env.PORT** (no hardcoded ports)
- ✅ No localhost references

## 📋 Prerequisites

1. **Render Account**: Sign up at [render.com](https://render.com)
2. **GitHub Repository**: Push your code to GitHub
3. **Environment Variables**: Prepare your keys

## 🔧 Step 1: Install Dependencies

The backend now requires `express`:

```bash
cd backend
npm install express
```

## 🔧 Step 2: Environment Variables in Render

In your Render dashboard → Environment section, add:

```env
ALCHEMY_ARBITRUM_RPC=https://arb-mainnet.g.alchemy.com/v2/YOUR_KEY
PRIVATE_KEY=0xYOUR_PRIVATE_KEY_HERE
ALERT_REGISTRY=0xAf06f425F4dD5eCBEFe0Efb565006B64ad29c430
GARDEN_FACTORY=0x...  # Optional
DEMO_GARDEN=0x...     # Optional
PORT=10000            # Render sets this automatically, but you can specify
```

**Note**: Render automatically sets `PORT`, but you can override it if needed.

## 🚀 Step 3: Deploy to Render

### Option A: New Web Service

1. Go to Render Dashboard → **New** → **Web Service**
2. Connect your GitHub repository
3. Configure:
   - **Name**: `riskshield-backend`
   - **Environment**: `Node`
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Root Directory**: Leave empty (or set to `backend` if deploying from root)

### Option B: From Existing Service

1. Go to your service → **Settings**
2. Update **Start Command**: `cd backend && npm start`
3. Add all environment variables
4. Click **Save Changes**
5. Click **Manual Deploy** → **Deploy latest commit**

## ✅ Step 4: Verify Deployment

After deployment, check the logs. You should see:

```
🚀 Server running on PORT 10000
💻 Starting RiskShield backend listener...
📡 Connected to Arbitrum mainnet
📝 AlertRegistry address: 0xAf06f425F4dD5eCBEFe0Efb565006B64ad29c430
🔌 WebSocket available at ws://<host>:10000/alerts
```

### ✅ Success Indicators:
- ✅ Server starts without errors
- ✅ No "Detected a new open port" warnings
- ✅ WebSocket connection works
- ✅ Health check endpoint responds

### ❌ Common Issues:

**Issue**: "Detected a new open port HTTP:8080"
- **Fix**: Make sure you're using the new `index.js` (Express + WebSocket on same server)

**Issue**: "Port already in use"
- **Fix**: Render sets PORT automatically, don't hardcode it

**Issue**: WebSocket connection fails
- **Fix**: Use `wss://` (secure) for production, `ws://` for local dev

## 🔗 Frontend Connection

Update your frontend `.env` to use Render's URL:

```env
VITE_BACKEND_WS_URL=wss://your-service-name.onrender.com/alerts
```

Or for local development:
```env
VITE_BACKEND_WS_URL=ws://localhost:3000/alerts
```

## 📊 Health Check

Render can monitor your service health:

- **Health Check Path**: `/health`
- **Expected Response**: `{"status":"healthy"}`

## 🔄 Continuous Deployment

Render automatically deploys on every push to your main branch.

To deploy manually:
1. Go to your service
2. Click **Manual Deploy**
3. Select **Deploy latest commit**

## 🎉 Done!

Your backend is now running on Render and will:
- ✅ Stay online 24/7
- ✅ Auto-restart on crashes
- ✅ Scale automatically
- ✅ No port conflicts
- ✅ WebSocket working correctly

## 📝 Notes

- Render provides a free tier with some limitations
- WebSocket connections may timeout after 55 seconds of inactivity (Render limitation)
- Consider implementing WebSocket ping/pong for long-lived connections
- For production, consider upgrading to a paid plan for better performance

