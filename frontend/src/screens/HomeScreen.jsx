import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PanelContainer from '../components/PanelContainer';
import ActionLines from '../components/ActionLines';
import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:3000';

const HomeScreen = ({ onSelectGarden }) => {
  const [gardens, setGardens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newGardenAddress, setNewGardenAddress] = useState('');
  const [adding, setAdding] = useState(false);

  const loadGardens = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/gardens`);
      const gardensData = response.data.gardens.map(g => ({
        address: g.address,
        name: `Garden ${g.address.slice(0, 8)}...`,
        riskScore: 0, // Can be calculated later
      }));
      setGardens(gardensData);
      setLoading(false);
    } catch (error) {
      console.error('Error loading gardens:', error);
      // Fallback to empty state
      setGardens([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGardens();
    // Refresh every 10 seconds
    const interval = setInterval(loadGardens, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleAddGarden = async (e) => {
    e.preventDefault();
    if (!newGardenAddress.trim()) return;

    setAdding(true);
    try {
      await axios.post(`${API_URL}/api/gardens`, {
        address: newGardenAddress.trim()
      });
      setNewGardenAddress('');
      setShowAddForm(false);
      await loadGardens(); // Refresh list
    } catch (error) {
      console.error('Error adding garden:', error);
      alert(error.response?.data?.error || 'Failed to add garden');
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="home-screen">
      <ActionLines intensity="low" />
      <div className="screen-container">
        <PanelContainer title="Chapter 01: Your Gardens">
          <div style={{ marginBottom: '2rem', textAlign: 'right' }}>
            <motion.button
              className="manga-button neon"
              onClick={() => setShowAddForm(!showAddForm)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {showAddForm ? 'Cancel' : '+ Add Garden'}
            </motion.button>
          </div>

          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="add-garden-form"
              style={{
                background: 'var(--manga-white)',
                border: '4px solid var(--manga-black)',
                padding: '1.5rem',
                marginBottom: '2rem',
                boxShadow: '4px 4px 0 var(--manga-black)'
              }}
            >
              <h3 style={{ marginBottom: '1rem', fontFamily: 'Bangers, cursive' }}>
                Add New Garden
              </h3>
              <form onSubmit={handleAddGarden}>
                <input
                  type="text"
                  value={newGardenAddress}
                  onChange={(e) => setNewGardenAddress(e.target.value)}
                  placeholder="0x..."
                  style={{
                    width: '100%',
                    padding: '1rem',
                    fontSize: '1rem',
                    border: '3px solid var(--manga-black)',
                    fontFamily: 'Courier New, monospace',
                    marginBottom: '1rem'
                  }}
                  required
                />
                <motion.button
                  type="submit"
                  className="manga-button"
                  disabled={adding}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {adding ? 'Adding...' : 'Add Garden'}
                </motion.button>
              </form>
            </motion.div>
          )}

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

