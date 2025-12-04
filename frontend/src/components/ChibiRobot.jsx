import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import './ChibiRobot.css';

const ChibiRobot = ({ hasAlert = false }) => {
  const [expression, setExpression] = useState('normal');

  useEffect(() => {
    if (hasAlert) {
      setExpression('alert');
      const timer = setTimeout(() => setExpression('normal'), 2000);
      return () => clearTimeout(timer);
    }
  }, [hasAlert]);

  return (
    <motion.div
      className={`chibi-robot expression-${expression}`}
      animate={hasAlert ? {
        scale: [1, 1.2, 1],
        rotate: [0, -10, 10, -10, 0]
      } : {}}
      transition={{ duration: 0.5 }}
    >
      <svg
        width="120"
        height="120"
        viewBox="0 0 120 120"
        className="robot-svg"
      >
        {/* Head */}
        <rect
          x="30"
          y="20"
          width="60"
          height="60"
          rx="10"
          fill="#ffffff"
          stroke="#000000"
          strokeWidth="3"
        />
        
        {/* Eyes */}
        <circle
          cx="45"
          cy="45"
          r={expression === 'alert' ? "8" : "5"}
          fill="#000000"
          className="eye-left"
        />
        <circle
          cx="75"
          cy="45"
          r={expression === 'alert' ? "8" : "5"}
          fill="#000000"
          className="eye-right"
        />
        
        {/* Mouth */}
        {expression === 'alert' ? (
          <ellipse
            cx="60"
            cy="60"
            rx="15"
            ry="10"
            fill="#000000"
          />
        ) : (
          <path
            d="M 50 60 Q 60 65 70 60"
            stroke="#000000"
            strokeWidth="3"
            fill="none"
          />
        )}
        
        {/* Antenna */}
        <circle
          cx="60"
          cy="15"
          r="5"
          fill="#ff0099"
          stroke="#000000"
          strokeWidth="2"
        />
        <line
          x1="60"
          y1="20"
          x2="60"
          y2="15"
          stroke="#000000"
          strokeWidth="3"
        />
        
        {/* Body */}
        <rect
          x="35"
          y="80"
          width="50"
          height="30"
          rx="5"
          fill="#ffffff"
          stroke="#000000"
          strokeWidth="3"
        />
        
        {/* Chest Panel */}
        <rect
          x="45"
          y="85"
          width="30"
          height="20"
          rx="3"
          fill="#00d9ff"
          stroke="#000000"
          strokeWidth="2"
        />
      </svg>
      
      {hasAlert && (
        <motion.div
          className="alert-indicator"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
        >
          ⚡
        </motion.div>
      )}
    </motion.div>
  );
};

export default ChibiRobot;

