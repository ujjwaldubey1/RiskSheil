import { motion } from 'framer-motion';
import './PanelContainer.css';

const PanelContainer = ({ children, title, className = '' }) => {
  return (
    <motion.div
      className={`manga-panel ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {title && (
        <div className="panel-title">
          <h2 className="manga-title">{title}</h2>
        </div>
      )}
      <div className="panel-content">
        {children}
      </div>
    </motion.div>
  );
};

export default PanelContainer;

