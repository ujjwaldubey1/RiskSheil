import './ActionLines.css';

const ActionLines = ({ intensity = 'medium' }) => {
  const intensityClass = `intensity-${intensity}`;
  
  return (
    <div className={`action-lines ${intensityClass}`}>
      <div className="action-line line-1"></div>
      <div className="action-line line-2"></div>
      <div className="action-line line-3"></div>
      <div className="action-line line-4"></div>
      <div className="action-line line-5"></div>
    </div>
  );
};

export default ActionLines;

