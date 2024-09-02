import React from 'react';

export const TransactionStatus = ({ status }) => {
  const getBackgroundColor = () => {
    switch (status.toLowerCase()) {
      case 'do rozliczenia':
        return 'bg-zinc-100 text-zinc-600';
      case 'pracownik-pracownik':
        return 'bg-zinc-100 text-zinc-600';
      case 'zakup szkolenia':
        return 'bg-zinc-100 text-zinc-600';
      case 'zasilono':
        return 'bg-zinc-100 text-zinc-600';
      case 'zakończono':
        return 'bg-[#d9fbe8] text-[#00a155]';
      default:
        return 'bg-white';
    }
  };

  return (
    <div className={`px-3 py-1 rounded-full ${getBackgroundColor()}`}>
      <span className="text-xs font-normal">{status}</span>
    </div>
  );
};


