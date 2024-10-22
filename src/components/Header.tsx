import React from 'react';
import { User } from 'firebase/auth';
import CurrencyDisplay from './UiComponents/CurrencyDisplay/CurrencyDisplay';

interface HeaderProps {
  coins: number;
  essence: number;
  onNavigate: (screen: 'main' | 'summon' | 'characters' | 'battle' | 'profile') => void;
  user: User | null;
}

const Header: React.FC<HeaderProps> = ({ coins, essence, onNavigate, user }) => {
  return (
    <header className="header">
      <CurrencyDisplay coins={coins} essence={essence}/>
      {user && (
        <button className="profile-btn" onClick={() => onNavigate('profile')}>
          Profile
        </button>
      )}
    </header>
  );
};

export default Header;