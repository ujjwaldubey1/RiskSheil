# ✅ Deployment Checklist

## Pre-Deployment

- [ ] Local tests pass (`npx hardhat run scripts/test-local-fork.js`)
- [ ] Testnet deployment successful
- [ ] Testnet end-to-end tests pass
- [ ] Contract code reviewed
- [ ] Environment variables prepared
- [ ] Private key secured (not in Git)
- [ ] Sufficient ETH for gas fees

## Mainnet Deployment

- [ ] Deploy AlertRegistry: `npx hardhat run scripts/deployAlertRegistry.js --network arbitrum`
- [ ] Save contract address
- [ ] Verify on Arbiscan: `npx hardhat verify --network arbitrum <address>`
- [ ] Check contract on Arbiscan
- [ ] Update backend environment variables
- [ ] Restart backend service
- [ ] Verify backend connects to mainnet
- [ ] Test alert flow end-to-end

## Post-Deployment

- [ ] Monitor backend logs
- [ ] Verify WebSocket connections
- [ ] Test frontend connection
- [ ] Monitor on-chain transactions
- [ ] Set up alerts/monitoring
- [ ] Document deployed addresses

## Production Readiness

- [ ] All tests passed
- [ ] Contract verified
- [ ] Backend running stable
- [ ] Frontend connected
- [ ] Monitoring in place
- [ ] Documentation updated

