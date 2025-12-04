import { motion } from 'framer-motion';
import './SpeechBubble.css';

const SpeechBubble = ({ children, variant = 'default', delay = 0 }) => {
  const variants = {
    default: { borderColor: 'var(--manga-black)' },
    alert: { borderColor: 'var(--neon-pink)' },
    risk: { borderColor: 'var(--neon-blue)' },
    violation: { borderColor: '#ff0000' }
  };

  return (
    <motion.div
      className={`speech-bubble speech-bubble-${variant}`}
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ 
        delay,
        duration: 0.4,
        type: "spring",
        stiffness: 200,
        damping: 15
      }}
      whileHover={{ scale: 1.05, rotate: 1 }}
    >
      {children}
    </motion.div>
  );
};

export default SpeechBubble;

