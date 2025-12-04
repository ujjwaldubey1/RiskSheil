import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PanelContainer from '../components/PanelContainer';
import SpeechBubble from '../components/SpeechBubble';
import ChibiRobot from '../components/ChibiRobot';
import ActionLines from '../components/ActionLines';
import axios from 'axios';

const AlertsScreen = () => {
  const [alerts, setAlerts] = useState([]);
  const [hasNewAlert, setHasNewAlert] = useState(false);
  const wsUrl = import.meta.env.VITE_BACKEND_WS_URL || 'ws://localhost:8080/alerts';

  useEffect(() => {
    // WebSocket connection for real-time alerts
    let ws;
    
    try {
      ws = new WebSocket(wsUrl);
      
      ws.onopen = () => {
        console.log('WebSocket connected');
        toast.success('🔌 Connected to RiskShield backend', {
          position: 'top-right',
          theme: 'dark',
        });
      };

      ws.onmessage = (event) => {
        try {
          const alert = JSON.parse(event.data);
          
          // Show anime toast
          toast(`⚠️ ${alert.reason}`, {
            position: 'top-right',
            theme: 'dark',
            style: {
              border: '3px solid #ff0099',
              fontFamily: 'Bangers, sans-serif',
              fontSize: '22px',
              background: '#000',
              color: '#ff0099',
            },
          });

          // Add to alerts feed
          setAlerts((prev) => [alert, ...prev]);
          setHasNewAlert(true);
          
          setTimeout(() => setHasNewAlert(false), 2000);
        } catch (error) {
          console.error('Error parsing alert:', error);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        toast.error('Connection error - using mock data', {
          position: 'top-right',
          theme: 'dark',
        });
        
        // Fallback: Load mock alerts
        loadMockAlerts();
      };

      ws.onclose = () => {
        console.log('WebSocket disconnected');
      };
    } catch (error) {
      console.error('WebSocket connection failed:', error);
      loadMockAlerts();
    }

    // Load initial alerts from API
    loadAlerts();

    return () => {
      if (ws) ws.close();
    };
  }, [wsUrl]);

  const loadAlerts = async () => {
    try {
      // Replace with actual API endpoint
      // const response = await axios.get('/api/alerts');
      // setAlerts(response.data);
      
      // For now, use mock data
      loadMockAlerts();
    } catch (error) {
      console.error('Error loading alerts:', error);
      loadMockAlerts();
    }
  };

  const loadMockAlerts = () => {
    const mockAlerts = [
      {
        id: 1,
        garden: '0x1234...5678',
        manager: '0xabcd...efgh',
        reason: 'Unauthorized token used: 0x9999...8888',
        timestamp: Date.now() - 3600000,
        type: 'violation'
      },
      {
        id: 2,
        garden: '0x9876...5432',
        manager: '0x1111...2222',
        reason: 'Allocation limit exceeded',
        timestamp: Date.now() - 7200000,
        type: 'risk'
      },
    ];
    setAlerts(mockAlerts);
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const getVariant = (type) => {
    switch (type) {
      case 'violation': return 'violation';
      case 'risk': return 'risk';
      default: return 'alert';
    }
  };

  return (
    <div className="alerts-screen">
      <ActionLines intensity="medium" />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      
      <ChibiRobot hasAlert={hasNewAlert} />
      
      <div className="screen-container">
        <PanelContainer title="Chapter 02: Live Alerts">
          <div className="alerts-feed">
            {alerts.length === 0 ? (
              <div className="empty-state">
                <p className="sfx-text">No Alerts Yet</p>
                <p>Alerts will appear here when violations are detected</p>
              </div>
            ) : (
              <AnimatePresence>
                {alerts.map((alert, index) => (
                  <motion.div
                    key={alert.id || index}
                    initial={{ opacity: 0, y: 50, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8, x: -100 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <SpeechBubble variant={getVariant(alert.type)} delay={index * 0.1}>
                      <div className="alert-content">
                        <div className="alert-header">
                          <span className={`sfx-text sfx-${getVariant(alert.type)}`}>
                            {alert.type === 'violation' ? '💥 VIOLATION!' : 
                             alert.type === 'risk' ? '🔥 RISK!' : '⚡ ALERT!'}
                          </span>
                          <span className="alert-time">{formatTime(alert.timestamp)}</span>
                        </div>
                        <div className="alert-body">
                          <p className="alert-reason">{alert.reason}</p>
                          <div className="alert-details">
                            <div className="alert-detail-item">
                              <strong>Garden:</strong> {alert.garden}
                            </div>
                            <div className="alert-detail-item">
                              <strong>Manager:</strong> {alert.manager}
                            </div>
                          </div>
                        </div>
                      </div>
                    </SpeechBubble>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </PanelContainer>
      </div>
    </div>
  );
};

export default AlertsScreen;

