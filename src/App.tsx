import { useState, useEffect } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "./services/firebase.ts";
import Header from "./components/Header.tsx";
import SummoningArea from "./components/SummoningArea.tsx";
import CharacterList from "./components/CharacterList.tsx";
import BattleArea from "./components/BattleArea.tsx";
import Footer from "./components/Footer.tsx";
import UserProfile from "./components/UserProfile.tsx";
import Login from "./components/Login.tsx";
import Register from "./components/Register.tsx";
import { Character, GameState } from "./types.ts";
import {
  getUserData,
  updateUserData,
  addCharacterToInventory,
  updateCurrency,
} from "./services/userService.ts";

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [gameState, setGameState] = useState<GameState>({
    coins: 1000,
    essence: 50,
    characters: [],
    currentScreen: "main",
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      setUser(authUser);
      if (authUser) {
        const userData = await getUserData(authUser.uid);
        setGameState(userData);
      }
    });

    return () => unsubscribe();
  }, []);

  const addCharacters = async (newCharacters: Character[]) => {
    if (user) {
      const updatedCharacters = [...gameState.characters, ...newCharacters];
      setGameState((prevState) => ({
        ...prevState,
        characters: updatedCharacters,
      }));
      await updateUserData(user.uid, { characters: updatedCharacters });

      // Use Promise.all to handle multiple async operations in parallel
      await Promise.all(
        newCharacters.map((character) =>
          addCharacterToInventory(user.uid, character),
        ),
      );
    }
  };

  const updateCurrencyState = async (
    coinsSpent: number,
    essenceSpent: number,
  ) => {
    if (user) {
      const newCoins = gameState.coins - coinsSpent;
      const newEssence = gameState.essence - essenceSpent;
      setGameState((prevState) => ({
        ...prevState,
        coins: newCoins,
        essence: newEssence,
      }));
      await updateCurrency(user.uid, newCoins, newEssence);
    }
  };

  const renderCurrentScreen = () => {
    switch (gameState.currentScreen) {
      case "summon":
        return (
          <SummoningArea
            addCharacters={addCharacters}
            updateCurrency={updateCurrencyState}
            coins={gameState.coins}
            essence={gameState.essence}
            playerInventory={gameState.characters}
          />
        );
      case "characters":
        return (
          <CharacterList
            characters={gameState.characters}
            magicItems={{}}
            onUpgradeCharacter={(character: Character) => {
              console.log("Upgrading character:", character);
            }}
          />
        );
      case "battle":
        return (
          <BattleArea
            playerCharacters={gameState.characters}
            onBattleComplete={(rewards: {
              coins: number;
              essence: number;
              experience: number[];
            }) => {
              console.log("Battle complete, rewards:", rewards);
            }}
          />
        );
      case "profile":
        return <UserProfile user={user} gameState={gameState} />;
      default:
        return (
          <div className="main-screen">
            <h2>Welcome to Kotodama Chronicles</h2>
            <p>Choose an action from the navigation menu to get started!</p>
          </div>
        );
    }
  };

  if (!user) {
    return (
      <div className="auth-container">
        <Login />
        <Register />
      </div>
    );
  }

  return (
    <div className="app-container">
      <Header
        coins={gameState.coins}
        essence={gameState.essence}
        onNavigate={(screen) =>
          setGameState((prev) => ({ ...prev, currentScreen: screen }))
        }
        user={user}
      />
      <main>{renderCurrentScreen()}</main>
      <Footer
        onNavigate={(screen) =>
          setGameState((prev) => ({ ...prev, currentScreen: screen }))
        }
      />
    </div>
  );
}

export default App;
