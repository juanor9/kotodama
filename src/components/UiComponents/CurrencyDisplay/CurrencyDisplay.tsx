import React from 'react';
import { Coins, Droplet } from 'lucide-react';
import './CurrencyDisplay.scss';
interface CurrencyProps {
  coins: number;
  essence: number;
}

const CurrencyDisplay: React.FC<CurrencyProps> = ({ coins, essence }) => {
  return (
      <section className="currency-display">
        <span className="currency-display__coins"> {coins}</span>
        <span className="currency-display__essence"> {essence}</span>
      </section>
      
  );
};

export default CurrencyDisplay;