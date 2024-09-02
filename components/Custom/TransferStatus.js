import React from 'react';

export const TransferStatus = ({ status }) => {
  const getBackgroundColor = () => {
    if (status === null) return '';

    switch (status.toLowerCase()) {
      case 'nierozliczone':
        return 'bg-[#ef4444] text-red-50';
      case 'rozliczone':
        return 'bg-[#d9fbe8] text-[#00a155]';
      default:
        return 'bg-white';
    }
  };

  return (
    <div className={`px-3 py-1 rounded-full ${getBackgroundColor()}`}>
      <span className="text-xs font-normal">{status ? status : "-"}</span>
    </div>
  );
};


