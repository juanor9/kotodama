import MainMenu from "./UiComponents/MainMenu/MainMenu.tsx";

interface FooterProps {
  onNavigate: (screen: "main" | "summon" | "characters" | "battle") => void;
}

function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="footer">
      <MainMenu onNavigate={onNavigate} />
    </footer>
  );
}

export default Footer;
