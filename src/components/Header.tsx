import React from 'react';
import CurrencyDisplay from './UiComponents/CurrencyDisplay/CurrencyDisplay';

interface HeaderProps {
  coins: number;
  essence: number;
  onNavigate: (screen: 'main' | 'summon' | 'characters' | 'battle') => void;
}

const Header: React.FC<HeaderProps> = ({ coins, essence, onNavigate }) => {
  return (
    <header className="header">
      <CurrencyDisplay coins={coins} essence={essence}/>
    </header>
  );
};

export default Header;