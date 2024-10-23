import { User } from "firebase/auth";
import CurrencyDisplay from "./UiComponents/CurrencyDisplay/CurrencyDisplay.tsx";

interface HeaderProps {
  coins: number;
  essence: number;
  onNavigate: (
    screen: "main" | "summon" | "characters" | "battle" | "profile",
  ) => void;
  user: User | null;
}

function Header({ coins, essence, onNavigate, user }: HeaderProps) {
  return (
    <header className="header">
      <CurrencyDisplay coins={coins} essence={essence} />
      {user && (
        <button
          type="button"
          className="profile-btn"
          onClick={() => onNavigate("profile")}
        >
          Profile
        </button>
      )}
    </header>
  );
}

export default Header;
