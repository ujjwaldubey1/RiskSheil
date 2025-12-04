import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import HomeScreen from './screens/HomeScreen';
import AlertsScreen from './screens/AlertsScreen';
import GardenDetailScreen from './screens/GardenDetailScreen';
import './App.css';

function App() {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [selectedGarden, setSelectedGarden] = useState(null);

  const handleSelectGarden = (garden) => {
    setSelectedGarden(garden);
    setCurrentScreen('detail');
  };

  const handleBack = () => {
    setCurrentScreen('home');
    setSelectedGarden(null);
  };

  return (
    <div className="app">
      <motion.nav className="manga-nav">
        <div className="nav-container">
          <h1 className="app-title">
            <span className="sfx-text sfx-alert">🛡️</span> RiskShield
          </h1>
          <div className="nav-buttons">
            <motion.button
              className={`nav-button ${currentScreen === 'home' ? 'active' : ''}`}
              onClick={() => setCurrentScreen('home')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Gardens
            </motion.button>
            <motion.button
              className={`nav-button ${currentScreen === 'alerts' ? 'active' : ''}`}
              onClick={() => setCurrentScreen('alerts')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Alerts
            </motion.button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence mode="wait">
        {currentScreen === 'home' && (
          <motion.div
            key="home"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.3 }}
          >
            <HomeScreen onSelectGarden={handleSelectGarden} />
          </motion.div>
        )}

        {currentScreen === 'alerts' && (
          <motion.div
            key="alerts"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
          >
            <AlertsScreen />
          </motion.div>
        )}

        {currentScreen === 'detail' && selectedGarden && (
          <motion.div
            key="detail"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <GardenDetailScreen garden={selectedGarden} onBack={handleBack} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;

