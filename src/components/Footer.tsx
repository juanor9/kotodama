import React from 'react';
import MainMenu from '../components/UiComponents/MainMenu/MainMenu';

interface FooterProps {
  onNavigate: (screen: 'main' | 'summon' | 'characters' | 'battle') => void;
}
const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="footer">
      <MainMenu onNavigate={onNavigate} />
    </footer>
  );
};

export default Footer;