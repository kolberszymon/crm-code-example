import React from 'react';

const toTitleCase = (str) => 
  str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());

export const TransactionStatus = ({ status }) => {
  const getBackgroundColor = () => {
    switch (status.toLowerCase()) {
      case 'do_rozliczenia':
        return 'bg-zinc-100 text-zinc-600';
      case 'pracownik_pracownik':
        return 'bg-zinc-100 text-zinc-600';
      case 'zakup_szkolenia':
        return 'bg-zinc-100 text-zinc-600';
      case 'zasilono':
        return 'bg-zinc-100 text-zinc-600';
      case 'zakonczono':
        return 'bg-[#d9fbe8] text-[#00a155]';
      default:
        return 'bg-white';
    }
  };

  const getText = () => {
    switch (status.toLowerCase()) {
      case 'do_rozliczenia':
        return 'Do rozliczenia';
      case 'pracownik_pracownik':
        return 'Pracownik-pracownik';
      case 'zakup_szkolenia':
        return 'Zakup szkolenia';
      case 'zakonczono':
        return 'Zakończono';
      case 'zasilono':
        return 'Zasilono';
      default:
        return '-';
    }
  };

  return (
    <div className={`px-3 py-1 rounded-full ${getBackgroundColor()}`}>
      <span className="text-xs font-normal">{getText()}</span>
    </div>
  );
};


