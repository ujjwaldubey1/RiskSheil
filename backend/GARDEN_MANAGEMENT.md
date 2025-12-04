# 🌱 Garden Management Guide

## Overview

RiskShield backend supports multiple ways to add and manage Garden addresses for monitoring.

---

## Method 1: Environment Variables (Static)

### Single Garden
Add to `backend/.env`:
```env
DEMO_GARDEN=0xYourGardenAddressHere
```

### Multiple Gardens
Add to `backend/.env`:
```env
GARDENS=0xGarden1,0xGarden2,0xGarden3
```

**Note**: Gardens are loaded on startup. Restart backend to apply changes.

---

## Method 2: REST API (Dynamic)

### Add a Garden
```bash
curl -X POST http://localhost:3000/api/gardens \
  -H "Content-Type: application/json" \
  -d '{"address": "0xYourGardenAddress"}'
```

**Response:**
```json
{
  "success": true,
  "message": "Started monitoring Garden: 0x...",
  "address": "0x..."
}
```

### List All Monitored Gardens
```bash
curl http://localhost:3000/api/gardens
```

**Response:**
```json
{
  "gardens": [
    { "address": "0x...", "status": "monitoring" }
  ],
  "count": 1
}
```

### Check Garden Status
```bash
curl http://localhost:3000/api/gardens/0xYourGardenAddress
```

**Response:**
```json
{
  "address": "0x...",
  "monitoring": true,
  "status": "active"
}
```

### Remove a Garden
```bash
curl -X DELETE http://localhost:3000/api/gardens/0xYourGardenAddress
```

**Response:**
```json
{
  "success": true,
  "message": "Stopped monitoring Garden: 0x...",
  "address": "0x..."
}
```

---

## Method 3: Garden Factory (Automatic)

If `GARDEN_FACTORY` is set in `.env`, the backend automatically:
- Listens for `GardenCreated` events
- Automatically starts monitoring new Gardens
- No manual action needed

```env
GARDEN_FACTORY=0xFactoryAddress
```

---

## API Endpoints Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/gardens` | List all monitored Gardens |
| `POST` | `/api/gardens` | Add a Garden to monitor |
| `GET` | `/api/gardens/:address` | Check Garden status |
| `DELETE` | `/api/gardens/:address` | Stop monitoring a Garden |

---

## Example Workflow

1. **Start backend:**
   ```bash
   cd backend
   npm start
   ```

2. **Add a Garden via API:**
   ```bash
   curl -X POST http://localhost:3000/api/gardens \
     -H "Content-Type: application/json" \
     -d '{"address": "0x1234567890123456789012345678901234567890"}'
   ```

3. **Verify it's monitoring:**
   ```bash
   curl http://localhost:3000/api/gardens
   ```

4. **Check backend logs** - You should see:
   ```
   🔍 Monitoring Garden: 0x1234...
   ✅ Garden monitoring started for: 0x1234...
   ```

---

## Frontend Integration

The frontend can use these APIs to:
- Display list of monitored Gardens
- Add new Gardens dynamically
- Remove Gardens from monitoring
- Show monitoring status

---

## Notes

- Gardens are stored in memory (lost on restart)
- For persistence, use environment variables or implement database storage
- Address validation ensures only valid Ethereum addresses are accepted
- Duplicate addresses are prevented
- All addresses are normalized to lowercase

