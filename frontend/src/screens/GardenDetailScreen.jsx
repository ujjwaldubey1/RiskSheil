import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import PanelContainer from '../components/PanelContainer';
import ActionLines from '../components/ActionLines';
import axios from 'axios';

const GardenDetailScreen = ({ garden, onBack }) => {
  const [allowedTokens, setAllowedTokens] = useState([]);
  const [allocations, setAllocations] = useState([]);
  const [riskScore, setRiskScore] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - replace with actual API calls
    const mockTokens = [
      { address: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1', symbol: 'WETH', allocation: 40 },
      { address: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9', symbol: 'USDT', allocation: 30 },
      { address: '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8', symbol: 'USDC', allocation: 20 },
      { address: '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f', symbol: 'WBTC', allocation: 10 },
    ];

    setTimeout(() => {
      setAllowedTokens(mockTokens);
      setAllocations(mockTokens);
      setRiskScore(garden?.riskScore || 75);
      setLoading(false);
    }, 1000);
  }, [garden]);

  const COLORS = ['#ff0099', '#00d9ff', '#00ffcc', '#9d00ff', '#ffcc00'];

  const chartData = allocations.map((token, index) => ({
    name: token.symbol,
    value: token.allocation,
    color: COLORS[index % COLORS.length]
  }));

  return (
    <div className="garden-detail-screen">
      <ActionLines intensity="low" />
      <div className="screen-container">
        <motion.button
          className="manga-button back-button"
          onClick={onBack}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          ← Back to Gardens
        </motion.button>

        <PanelContainer title={`Chapter 03: ${garden?.name || 'Garden Details'}`}>
          {loading ? (
            <div className="loading-text">Loading Garden Data...</div>
          ) : (
            <div className="garden-detail-content">
              {/* Risk Score Meter */}
              <div className="risk-meter-section">
                <h3 className="manga-title">Risk Score</h3>
                <div className="power-meter-container">
                  <div className="power-meter">
                    <motion.div
                      className="power-meter-fill"
                      initial={{ width: 0 }}
                      animate={{ width: `${riskScore}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </div>
                  <div className="risk-score-text">
                    <span className="sfx-text sfx-risk">{riskScore}%</span>
                  </div>
                </div>
              </div>

              {/* Allowed Tokens */}
              <div className="tokens-section">
                <h3 className="manga-title">Allowed Tokens</h3>
                <div className="tokens-grid">
                  {allowedTokens.map((token, index) => (
                    <motion.div
                      key={token.address}
                      className="token-card"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="token-symbol">{token.symbol}</div>
                      <div className="token-address">{token.address.slice(0, 10)}...</div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Allocation Chart */}
              <div className="allocation-section">
                <h3 className="manga-title">Current Allocations</h3>
                <div className="chart-container">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}
        </PanelContainer>
      </div>
    </div>
  );
};

export default GardenDetailScreen;

