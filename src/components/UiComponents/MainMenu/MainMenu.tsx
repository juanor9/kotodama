import React from 'react';

interface HeaderProps {
  onNavigate: (screen: 'main' | 'summon' | 'characters' | 'battle') => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigate }) => {
  return (
      <nav className="main-nav">
        <button onClick={() => onNavigate('main')}>Home</button>
        <button onClick={() => onNavigate('summon')}>Summon</button>
        <button onClick={() => onNavigate('characters')}>Characters</button>
        <button onClick={() => onNavigate('battle')}>Battle</button>
      </nav>
  );
};

export default Header;