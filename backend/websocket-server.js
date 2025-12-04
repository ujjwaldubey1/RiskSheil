const WebSocket = require('ws');

// Create WebSocket server
const createWebSocketServer = (port = 8080) => {
  const wss = new WebSocket.Server({ port });

  console.log(`🔌 WebSocket server started on ws://localhost:${port}/alerts`);

  wss.on('connection', (ws) => {
    console.log('✅ New WebSocket client connected');

    ws.on('message', (message) => {
      console.log('📨 Received message:', message.toString());
    });

    ws.on('close', () => {
      console.log('❌ WebSocket client disconnected');
    });

    ws.on('error', (error) => {
      console.error('❌ WebSocket error:', error);
    });
  });

  // Function to broadcast alerts to all connected clients
  const broadcastAlert = (alert) => {
    const message = JSON.stringify(alert);
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
    console.log(`📢 Broadcasted alert to ${wss.clients.size} clients`);
  };

  return { wss, broadcastAlert };
};

module.exports = { createWebSocketServer };

