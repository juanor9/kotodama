import { BrowserRouter } from "react-router-dom";
import { onAuthStateChanged, User } from "firebase/auth";
import { useState, useEffect } from "react";
import {
  getUserData,
  updateUserData,
  addCharacterToInventory,
  updateCurrency,
} from "./services/userService.ts";
import { auth } from "./services/firebase.ts";
import { Character, GameState } from "./types.ts";
import BattleArea from "./components/BattleArea.tsx";
import CharacterList from "./components/CharacterList.tsx";
import Footer from "./components/Footer.tsx";
import Header from "./components/Header.tsx";
import SummoningArea from "./components/SummoningArea.tsx";
import UserProfile from "./components/UserProfile.tsx";
import Auth from "./components/Screens/Auth.tsx";

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      setUser(authUser);
      if (authUser) {
        try {
          const userData = await getUserData(authUser.uid);
          if (userData) {
            setGameState(userData);
          }
        } catch (error) {
          console.error("Failed to get user data", error);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const addCharacters = async (newCharacters: Character[]) => {
    if (user && gameState) {
      const updatedCharacters = [...gameState.characters, ...newCharacters];
      setGameState((prevState) =>
        prevState ? { ...prevState, characters: updatedCharacters } : null,
      );
      try {
        await updateUserData(user.uid, { characters: updatedCharacters });
        // Use Promise.all to handle multiple async operations in parallel
        await Promise.all(
          newCharacters.map((character) =>
            addCharacterToInventory(user.uid, character),
          ),
        );
      } catch (error) {
        console.error("Failed to update user data or add characters", error);
      }
    }
  };

  const updateCurrencyState = async (
    coinsSpent: number,
    essenceSpent: number,
  ) => {
    if (user && gameState) {
      const newCoins = gameState.coins - coinsSpent;
      const newEssence = gameState.essence - essenceSpent;
      setGameState((prevState) =>
        prevState
          ? { ...prevState, coins: newCoins, essence: newEssence }
          : null,
      );
      try {
        await updateCurrency(user.uid, newCoins, newEssence);
      } catch (error) {
        console.error("Failed to update currency", error);
      }
    }
  };

  const renderCurrentScreen = () => {
    if (!gameState) return null;

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
              setGameState((prevState) =>
                prevState
                  ? {
                      ...prevState,
                      coins: prevState.coins + rewards.coins,
                      essence: prevState.essence + rewards.essence,
                    }
                  : null,
              );
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

  return (
    <BrowserRouter>
      {!user ? (
        <Auth />
      ) : (
        <div className="app-container">
          <Header
            coins={gameState?.coins || 0}
            essence={gameState?.essence || 0}
            onNavigate={(screen) =>
              setGameState((prev) =>
                prev ? { ...prev, currentScreen: screen } : null,
              )
            }
            user={user}
          />
          <main>{renderCurrentScreen()}</main>
          <Footer
            onNavigate={(screen) =>
              setGameState((prev) =>
                prev ? { ...prev, currentScreen: screen } : null,
              )
            }
          />
        </div>
      )}
    </BrowserRouter>
  );
}

export default App;
