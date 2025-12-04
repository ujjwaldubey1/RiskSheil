# 🌱 Garden Management - Quick Start

## ✅ Feature Implemented!

You can now add Garden addresses to monitor in **3 ways**:

---

## Method 1: Environment Variables (Startup)

### Single Garden
Add to `backend/.env`:
```env
DEMO_GARDEN=0xYourGardenAddress
```

### Multiple Gardens
Add to `backend/.env`:
```env
GARDENS=0xGarden1,0xGarden2,0xGarden3
```

**Note**: Restart backend to apply changes.

---

## Method 2: REST API (Dynamic - No Restart Needed!)

### Add a Garden
```bash
# PowerShell
curl -X POST http://localhost:3000/api/gardens -H "Content-Type: application/json" -d '{\"address\": \"0xYourGardenAddress\"}'
```

### List All Gardens
```bash
curl http://localhost:3000/api/gardens
```

### Remove a Garden
```bash
curl -X DELETE http://localhost:3000/api/gardens/0xYourGardenAddress
```

---

## Method 3: Frontend UI (Easiest!)

1. Open the frontend: `cd frontend && npm run dev`
2. Go to "Gardens" screen
3. Click **"+ Add Garden"** button
4. Enter Garden address
5. Click **"Add Garden"**

The Garden will be added immediately and monitoring will start!

---

## Method 4: Garden Factory (Automatic)

If `GARDEN_FACTORY` is set, new Gardens are automatically detected and monitored:

```env
GARDEN_FACTORY=0xFactoryAddress
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/gardens` | List all monitored Gardens |
| `POST` | `/api/gardens` | Add a Garden (body: `{ "address": "0x..." }`) |
| `GET` | `/api/gardens/:address` | Check if Garden is monitored |
| `DELETE` | `/api/gardens/:address` | Stop monitoring a Garden |

---

## Example: Add Garden via API

```bash
# Add a Garden
curl -X POST http://localhost:3000/api/gardens \
  -H "Content-Type: application/json" \
  -d "{\"address\": \"0x1234567890123456789012345678901234567890\"}"

# Verify it's monitoring
curl http://localhost:3000/api/gardens
```

**Response:**
```json
{
  "gardens": [
    { "address": "0x1234...", "status": "monitoring" }
  ],
  "count": 1
}
```

---

## ✅ What Happens When You Add a Garden

1. ✅ Address is validated (must be valid Ethereum address)
2. ✅ Duplicate check (won't add if already monitoring)
3. ✅ Event listeners are set up
4. ✅ Monitoring starts immediately
5. ✅ Backend logs: `🔍 Monitoring Garden: 0x...`
6. ✅ Garden appears in `/api/gardens` list
7. ✅ Frontend updates automatically

---

## 🎉 Ready to Use!

The Garden management feature is **fully implemented and ready to use**!

Try it now:
1. Start backend: `cd backend && npm start`
2. Add a Garden via API or Frontend
3. Watch the logs - you'll see monitoring start!

