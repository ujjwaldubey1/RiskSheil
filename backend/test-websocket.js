const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:3000/alerts');

ws.on('open', () => {
  console.log('✅ Connected to RiskShield WebSocket!');
  console.log('Waiting for alerts...\n');
});

ws.on('message', (data) => {
  const message = JSON.parse(data);
  console.log('📨 Received message:', message);
});

ws.on('error', (error) => {
  console.error('❌ WebSocket error:', error);
});

ws.on('close', () => {
  console.log('❌ WebSocket connection closed');
});

// Keep the script running
console.log('🔌 Connecting to ws://localhost:3000/alerts...');
console.log('Press Ctrl+C to exit\n');

