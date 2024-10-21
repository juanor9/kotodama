import React from 'react';
import CurrencyDisplay from './UiComponents/CurrencyDisplay/CurrencyDisplay';

interface HeaderProps {
  coins: number;
  essence: number;
}

const Header: React.FC<HeaderProps> = ({ coins, essence }) => {
  return (
    <header className="header">
      <CurrencyDisplay coins={coins} essence={essence}/>
    </header>
  );
};

export default Header;