import { useState } from 'react';
import Header from './components/Header';
import SummoningArea from './components/SummoningArea';
import CharacterList from './components/CharacterList';
import BattleArea from './components/BattleArea';
import Footer from './components/Footer';
import { Character, GameState } from './types';

function App() {
  const [gameState, setGameState] = useState<GameState>({
    coins: 1000,
    essence: 10,
    characters: [],
    currentScreen: 'main',
  });

  const addCharacters = (newCharacters: Character[]) => {
    setGameState(prevState => ({
      ...prevState,
      characters: [...prevState.characters, ...newCharacters],
    }));
  };

  const updateCurrency = (coinsSpent: number, essenceSpent: number) => {
    setGameState(prevState => ({
      ...prevState,
      coins: prevState.coins - coinsSpent,
      essence: prevState.essence - essenceSpent,
    }));
  };

  const renderCurrentScreen = () => {
    switch (gameState.currentScreen) {
      case 'summon':
        return (
          <SummoningArea 
            addCharacters={addCharacters} 
            updateCurrency={updateCurrency}
            coins={gameState.coins}
            essence={gameState.essence}
            playerInventory={gameState.characters}
          />
        );
      case 'characters':
        return (
          <CharacterList 
            characters={gameState.characters} magicItems={{}} onUpgradeCharacter={function (character: Character): void {
              throw new Error('Function not implemented.');
            } }          />
        );
      case 'battle':
        return (
          <BattleArea 
            playerCharacters={gameState.characters} onBattleComplete={function (rewards: { coins: number; essence: number; experience: number[]; }): void {
              throw new Error('Function not implemented.');
            } }          />
        );
      default:
        return (
          <div className="main-screen">
            <h2>Welcome to Kotodama Chronicles</h2>
            <p>Choose an action from the navigation menu to get started!</p>
          </div>
        );
    }
  };

  return (
    <div className="app-container">
      <Header 
        coins={gameState.coins} 
        essence={gameState.essence}
        onNavigate={(screen) => setGameState(prev => ({ ...prev, currentScreen: screen }))}
      />
      <main>
        {renderCurrentScreen()}
      </main>
      <Footer />
    </div>
  );
}

export default App;