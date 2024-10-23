import CurrencyDisplay from "./UiComponents/CurrencyDisplay/CurrencyDisplay.tsx";

interface HeaderProps {
  coins: number;
  essence: number;
  onNavigate: (
    screen: "main" | "summon" | "characters" | "battle" | "profile",
  ) => void;
}

function Header({ coins, essence, onNavigate }: HeaderProps) {
  return (
    <header className="header">
      <button
        type="button"
        className="profile-btn"
        onClick={() => onNavigate("main")}
      >
        Main
      </button>
      <CurrencyDisplay coins={coins} essence={essence} />
    </header>
  );
}

export default Header;
