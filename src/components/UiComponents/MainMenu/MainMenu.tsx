import "./MainMenu.scss";

interface HeaderProps {
  onNavigate: (
    screen: "main" | "summon" | "characters" | "battle" | "profile",
  ) => void;
}

function Header({ onNavigate }: HeaderProps) {
  return (
    <nav className="main-menu">
      <button
        type="button"
        className="main-menu__button"
        onClick={() => onNavigate("summon")}
      >
        <span className="main-menu__button-label">Summon</span>
      </button>
      <button
        type="button"
        className="main-menu__button"
        onClick={() => onNavigate("characters")}
      >
        <span className="main-menu__button-label">Spirits</span>
      </button>
      <button
        type="button"
        className="main-menu__button"
        onClick={() => onNavigate("battle")}
      >
        <span className="main-menu__button-label">Battle</span>
      </button>
      <button
        type="button"
        className="main-menu__button"
        onClick={() => onNavigate("profile")}
      >
        <span className="main-menu__button-label">Profile</span>
      </button>
    </nav>
  );
}

export default Header;
