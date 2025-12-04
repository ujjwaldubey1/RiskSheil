# RiskShield Frontend - Manga/Anime Style UI

A comic-style frontend for RiskShield built with React, Vite, and Framer Motion.

## Features

- 🎨 Manga/Anime-inspired design with bold outlines and neon accents
- ⚡ Real-time alerts via WebSocket
- 📊 Interactive charts and risk meters
- 🤖 Chibi robot mascot that reacts to alerts
- 🎭 Speech bubble alerts with anime-style animations

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Update `.env` with your backend WebSocket URL:
```
VITE_BACKEND_WS_URL=ws://localhost:8080/alerts
```

4. Start development server:
```bash
npm run dev
```

## Build for Production

```bash
npm run build
```

The `dist` folder can be deployed to Vercel, Netlify, or any static hosting service.

## Deployment on Vercel

1. Build the project: `npm run build`
2. Upload the `dist` folder to Vercel
3. Set environment variable: `VITE_BACKEND_WS_URL=wss://your-backend-host/alerts`

## Design Features

- **Manga Panels**: Thick black borders with inner shadows
- **Speech Bubbles**: Comic-style alert containers
- **Action Lines**: Diagonal speed lines for dynamic effects
- **Power Meters**: Anime-style risk score indicators
- **Chibi Robot**: Animated mascot that reacts to alerts
- **SFX Text**: Stylized text effects (⚡ ALERT!, 🔥 RISK!, 💥 VIOLATION!)

## Screens

1. **Home Screen**: List of Gardens with manga panel layout
2. **Alerts Screen**: Real-time alert feed with speech bubbles
3. **Garden Detail**: Token allocations, risk score, and charts

