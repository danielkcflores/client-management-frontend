// Alert.tsx
import React from 'react';
import './alert.css';

interface AlertProps {
  message: string;
  onClose: () => void;
}

const Alert: React.FC<AlertProps> = ({ message, onClose }) => {
  return (
    <div className="alert-container">
      <div className="alert">
        <span className="alert-message">{message}</span>
        <button className="alert-close-btn" onClick={onClose}>
          &times;
        </button>
      </div>
    </div>
  );
};

export default Alert;
