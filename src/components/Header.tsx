import React from 'react';
import { BookOpen, Coins, Droplet } from 'lucide-react';

interface HeaderProps {
  coins: number;
  essence: number;
  onNavigate: (screen: 'main' | 'summon' | 'characters' | 'battle') => void;
}

const Header: React.FC<HeaderProps> = ({ coins, essence, onNavigate }) => {
  return (
    <header className="header">
      <h1><BookOpen size={32} /> Kotodama Chronicles: Spirits of Language</h1>
      <p>Master the spirits of Japanese writing and unlock their power!</p>
      <div className="currency-display">
        <span className="coins"><Coins size={20} /> {coins}</span>
        <span className="essence"><Droplet size={20} /> {essence}</span>
      </div>
      <nav className="main-nav">
        <button onClick={() => onNavigate('main')}>Home</button>
        <button onClick={() => onNavigate('summon')}>Summon</button>
        <button onClick={() => onNavigate('characters')}>Characters</button>
        <button onClick={() => onNavigate('battle')}>Battle</button>
      </nav>
    </header>
  );
};

export default Header;