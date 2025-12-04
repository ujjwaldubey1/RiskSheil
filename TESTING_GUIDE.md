# 🧪 Testing Guide - Part F

## Overview

This guide covers local testing, testnet dry runs, and mainnet deployment for RiskShield.

---

## 1. Local Testing Using Hardhat Mainnet Fork

### Setup

1. **Install dependencies** (if not already installed):
   ```bash
   npm install --save-dev @nomicfoundation/hardhat-network-helpers
   ```

2. **Start Hardhat fork node**:
   ```bash
   npx hardhat node --fork https://arb-mainnet.g.alchemy.com/v2/YOUR_KEY
   ```
   
   Or if you have ALCHEMY_ARBITRUM_RPC in your .env:
   ```bash
   npx hardhat node --fork $env:ALCHEMY_ARBITRUM_RPC
   ```
   
   This will:
   - Fork Arbitrum mainnet
   - Create local test accounts with ETH
   - Run on `http://localhost:8545`

3. **In another terminal, run local tests**:
   ```bash
   npx hardhat run scripts/test-local-fork.js --network hardhat
   ```

### What Gets Tested

- ✅ AlertRegistry deployment
- ✅ Saving alerts
- ✅ Reading alerts
- ✅ Event emission
- ✅ Contract interactions

### Testing Backend Integration

1. **Deploy contract on fork**:
   ```bash
   npx hardhat run scripts/test-local-fork.js --network hardhat
   ```

2. **Update backend/.env**:
   ```env
   ALCHEMY_ARBITRUM_RPC=http://localhost:8545
   ALERT_REGISTRY=<deployed_address_from_step_1>
   ```

3. **Start backend**:
   ```bash
   cd backend
   npm start
   ```

4. **Test WebSocket**:
   - Start frontend: `cd frontend && npm run dev`
   - Or use test script: `node test-websocket.js`

### Benefits

- ✅ No real gas costs
- ✅ Fast iteration
- ✅ Full mainnet state
- ✅ Safe testing environment

---

## 2. Dry Run on Arbitrum Testnet

### Prerequisites

1. **Get testnet ETH**:
   - Visit: https://faucet.quicknode.com/arbitrum/sepolia
   - Or: https://faucet.chain.link/arbitrum-sepolia

2. **Add testnet RPC to .env**:
   ```env
   ALCHEMY_ARBITRUM_TESTNET_RPC=https://sepolia-rollup.arbitrum.io/rpc
   # Or use Alchemy testnet endpoint:
   # ALCHEMY_ARBITRUM_TESTNET_RPC=https://arb-sepolia.g.alchemy.com/v2/YOUR_KEY
   ```

### Deploy to Testnet

1. **Deploy AlertRegistry**:
   ```bash
   npx hardhat run scripts/deploy-testnet.js --network arbitrumTestnet
   ```

2. **Save the deployed address**:
   ```env
   ALERT_REGISTRY=<testnet_contract_address>
   ```

3. **Verify on Arbiscan Testnet**:
   ```bash
   npx hardhat verify --network arbitrumTestnet <contract_address>
   ```

### Configure Backend for Testnet

1. **Update backend/.env**:
   ```env
   ALCHEMY_ARBITRUM_RPC=https://sepolia-rollup.arbitrum.io/rpc
   ALERT_REGISTRY=<testnet_contract_address>
   PRIVATE_KEY=<your_testnet_wallet_key>
   ```

2. **Start backend**:
   ```bash
   cd backend
   npm start
   ```

3. **Test end-to-end**:
   - Backend should connect to testnet
   - Monitor a test Garden (if available)
   - Trigger test violations
   - Verify alerts appear in frontend

### Verify Testnet Deployment

- ✅ Contract deployed and verified
- ✅ Backend connects to testnet
- ✅ Events are detected
- ✅ Alerts saved on-chain
- ✅ WebSocket broadcasts work
- ✅ Frontend receives alerts

---

## 3. Deploy to Arbitrum Mainnet

### Prerequisites

- ✅ Local tests passed
- ✅ Testnet dry run successful
- ✅ Sufficient ETH for gas fees
- ✅ Private key secured

### Deployment Steps

1. **Deploy AlertRegistry**:
   ```bash
   npx hardhat run scripts/deployAlertRegistry.js --network arbitrum
   ```

2. **Save deployed address**:
   ```env
   ALERT_REGISTRY=<mainnet_contract_address>
   ```

3. **Verify on Arbiscan**:
   ```bash
   npx hardhat verify --network arbitrum <contract_address>
   ```

4. **Check on Arbiscan**:
   - Visit: https://arbiscan.io/address/<contract_address>
   - Verify contract code is visible
   - Check deployment transaction

---

## 4. Configure Backend for Mainnet

### Update Environment Variables

**For Render/Railway deployment:**

1. Go to your service dashboard
2. Navigate to Environment Variables
3. Update:
   ```env
   ALCHEMY_ARBITRUM_RPC=https://arb-mainnet.g.alchemy.com/v2/YOUR_KEY
   ALERT_REGISTRY=<mainnet_contract_address>
   PRIVATE_KEY=<your_mainnet_wallet_key>
   ```

4. **Restart the service** to apply changes

### For Local Testing

Update `backend/.env`:
```env
ALCHEMY_ARBITRUM_RPC=https://arb-mainnet.g.alchemy.com/v2/YOUR_KEY
ALERT_REGISTRY=<mainnet_contract_address>
PRIVATE_KEY=<your_mainnet_wallet_key>
GARDEN_FACTORY=<optional>
DEMO_GARDEN=<optional>
```

---

## 5. Final Production Test

### Verification Checklist

1. **Backend Status**:
   ```bash
   curl http://localhost:3000/health
   # Should return: {"status":"healthy"}
   ```

2. **Check Backend Logs**:
   ```
   ✅ Connected to Arbitrum mainnet
   ✅ AlertRegistry address: <your_contract>
   ✅ Monitoring Garden address(es)
   ```

3. **Test Alert Flow**:
   - Trigger a real or simulated violation
   - Verify backend detects it
   - Check on-chain transaction
   - Confirm WebSocket broadcast
   - Verify frontend receives alert

4. **Monitor Arbiscan**:
   - Check AlertRegistry contract
   - View recent transactions
   - Verify alert events

### Production Monitoring

- ✅ Backend logs show successful connections
- ✅ No errors in console
- ✅ WebSocket connections stable
- ✅ Alerts being saved on-chain
- ✅ Frontend receiving real-time updates

---

## 🎯 Testing Summary

| Stage | Network | Gas Cost | Risk | Purpose |
|-------|---------|----------|------|---------|
| **Local Fork** | Hardhat Fork | Free | None | Development & Testing |
| **Testnet** | Arbitrum Sepolia | Free (faucet) | Low | End-to-end validation |
| **Mainnet** | Arbitrum One | Real ETH | High | Production |

---

## 🚨 Important Notes

1. **Never commit private keys** to Git
2. **Use testnet first** before mainnet
3. **Verify contracts** on Arbiscan
4. **Monitor gas prices** before mainnet deployment
5. **Keep backup** of deployed contract addresses
6. **Test thoroughly** on testnet before mainnet

---

## ✅ Success Criteria

- ✅ Local tests pass
- ✅ Testnet deployment successful
- ✅ Backend connects to testnet/mainnet
- ✅ Events detected correctly
- ✅ Alerts saved on-chain
- ✅ WebSocket broadcasts work
- ✅ Frontend receives alerts
- ✅ Contract verified on Arbiscan

---

## 🎉 Ready for Production!

Once all tests pass, your RiskShield system is ready for mainnet deployment and production use!

