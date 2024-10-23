import "./CurrencyDisplay.scss";

interface CurrencyProps {
  coins: number;
  essence: number;
}

function CurrencyDisplay({ coins, essence }: CurrencyProps) {
  return (
    <section className="currency-display">
      <span className="currency-display__coins"> {coins}</span>
      <span className="currency-display__essence"> {essence}</span>
    </section>
  );
}

export default CurrencyDisplay;
