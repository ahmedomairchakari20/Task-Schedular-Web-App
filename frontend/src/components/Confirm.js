import React from 'react';

const Confirm = ({ message, onConfirm, onCancel }) => {
  const handleConfirm = () => {
    onConfirm();
    
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <div>
      <p>{message}</p>
      <button onClick={handleConfirm}>Confirm</button>
      <button onClick={handleCancel}>Cancel</button>
    </div>
  );
};

export default Confirm;