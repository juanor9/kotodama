import React from 'react';
import './MainMenu.scss'
interface HeaderProps {
  onNavigate: (screen: 'main' | 'summon' | 'characters' | 'battle') => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigate }) => {
  return (
    <nav className="main-menu">
      <button className="main-menu__button" onClick={() => onNavigate('main')}>
        <span className='main-menu__button-label'>Home</span>
      </button>
      <button className="main-menu__button" onClick={() => onNavigate('summon')}><span className='main-menu__button-label'>Summon</span></button>
      <button className="main-menu__button" onClick={() => onNavigate('characters')}><span className='main-menu__button-label'>Spirits</span></button>
      <button className="main-menu__button" onClick={() => onNavigate('battle')}><span className='main-menu__button-label'>Battle</span></button>
    </nav>
  );
};

export default Header;