import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PanelContainer from '../components/PanelContainer';
import ActionLines from '../components/ActionLines';
import axios from 'axios';

const HomeScreen = ({ onSelectGarden }) => {
  const [gardens, setGardens] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data for now - replace with actual API call
    const mockGardens = [
      { address: '0x1234...5678', name: 'Garden Alpha', riskScore: 75 },
      { address: '0xabcd...efgh', name: 'Garden Beta', riskScore: 45 },
      { address: '0x9876...5432', name: 'Garden Gamma', riskScore: 90 },
    ];
    
    setTimeout(() => {
      setGardens(mockGardens);
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="home-screen">
      <ActionLines intensity="low" />
      <div className="screen-container">
        <PanelContainer title="Chapter 01: Your Gardens">
          <div className="gardens-grid">
            {loading ? (
              <div className="loading-text">Loading Gardens...</div>
            ) : gardens.length === 0 ? (
              <div className="empty-state">
                <p className="sfx-text sfx-alert">No Gardens Found</p>
                <p>Add a Garden address to start monitoring</p>
              </div>
            ) : (
              gardens.map((garden, index) => (
                <motion.div
                  key={garden.address}
                  className="garden-card"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => onSelectGarden(garden)}
                >
                  <div className="garden-card-header">
                    <h3>{garden.name}</h3>
                    <span className="garden-address">{garden.address}</span>
                  </div>
                  <div className="risk-score-badge">
                    Risk: {garden.riskScore}%
                  </div>
                  <button className="manga-button">View Details</button>
                </motion.div>
              ))
            )}
          </div>
        </PanelContainer>
      </div>
    </div>
  );
};

export default HomeScreen;

