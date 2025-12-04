# 🎨 RiskShield Frontend - Manga/Anime Style UI

## ✅ What Has Been Built

### 1. **Project Structure**
- ✅ Vite + React setup with all dependencies
- ✅ Manga-style global CSS with custom fonts
- ✅ Component library for manga aesthetics
- ✅ Three main screens (Home, Alerts, Garden Detail)
- ✅ WebSocket integration for real-time alerts

### 2. **Manga-Style Components**

#### **PanelContainer**
- Thick black borders (6px)
- Inner shadows and halftone effects
- Panel corner decorations
- Framer Motion animations

#### **SpeechBubble**
- Comic-style speech bubbles
- Variants: default, alert, risk, violation
- Animated pop-in effects
- Curved border triangles

#### **ActionLines**
- Diagonal speed lines background
- Intensity levels (low, medium, high)
- Animated movement effects

#### **ChibiRobot**
- SVG-based robot mascot
- Expression changes (normal, alert)
- Reacts to new alerts
- Fixed position with animations

### 3. **Screens**

#### **Home Screen**
- Manga panel layout with "Chapter 01" styling
- Garden cards in grid layout
- Risk score badges
- Click to view details

#### **Alerts Screen**
- Real-time WebSocket connection
- Speech bubble alert feed
- Chibi robot mascot
- React Toastify for pop-up notifications
- Animated alert cards

#### **Garden Detail Screen**
- Risk score power meter (anime style)
- Allowed tokens grid
- Allocation pie chart (Recharts)
- Back navigation

### 4. **Styling Features**

- **Typography**: Bangers, Anton, Oswald, Noto Sans JP fonts
- **Colors**: Neon pink, blue, cyan accents on grayscale
- **Effects**: 
  - Thick black borders everywhere
  - Halftone shading
  - Glow effects on neon elements
  - Squash & stretch hover animations
- **SFX Text**: Stylized alert text (⚡ ALERT!, 🔥 RISK!, 💥 VIOLATION!)

### 5. **Backend Integration**

- WebSocket server on port 8080
- Real-time alert broadcasting
- Automatic connection to frontend
- Fallback to mock data if connection fails

## 🚀 How to Run

### Frontend:
```bash
cd frontend
npm install
npm run dev
```

### Backend (with WebSocket):
```bash
cd backend
node index.js
```

The backend will automatically start the WebSocket server on port 8080.

## 📝 Environment Variables

Create `frontend/.env`:
```
VITE_BACKEND_WS_URL=ws://localhost:8080/alerts
```

For production:
```
VITE_BACKEND_WS_URL=wss://your-backend-host/alerts
```

## 🎯 Design Philosophy

The entire UI is designed to feel like:
- **Manga fight sequences** - Dynamic panels and action lines
- **Anime power meters** - Risk score visualization
- **Comic SFX** - Explosive alert appearances
- **Chibi characters** - Cute robot mascot
- **Panel transitions** - Page-turning animations

## 📦 Dependencies

- **React 18** - UI framework
- **Vite** - Build tool
- **Framer Motion** - Animations
- **Recharts** - Charts
- **React Toastify** - Notifications
- **Axios** - HTTP client
- **Heroicons** - Icons

## 🎨 Custom CSS Features

- Manga panel borders
- Speech bubble styling
- Action line backgrounds
- Power meter animations
- SFX text effects
- Hover animations (squash & stretch)
- Custom scrollbar styling

## 🔄 Real-Time Features

1. **WebSocket Connection**: Connects to backend on startup
2. **Alert Broadcasting**: Backend sends alerts to all connected clients
3. **Toast Notifications**: Anime-style pop-ups for new alerts
4. **Robot Reactions**: Chibi robot animates when alerts arrive
5. **Live Feed**: Alerts appear in real-time speech bubbles

## 📱 Responsive Design

- Mobile-friendly layouts
- Grid systems that adapt
- Touch-friendly buttons
- Responsive typography

## 🚢 Deployment

### Build:
```bash
npm run build
```

### Deploy to Vercel:
1. Upload `dist` folder
2. Set `VITE_BACKEND_WS_URL` environment variable
3. Deploy!

The frontend is production-ready and fully functional!

