import { User } from "firebase/auth";
import { GameState } from "../types.ts";

interface UserProfileProps {
  user: User | null;
  gameState: GameState;
}

function UserProfile({ user, gameState }: UserProfileProps) {
  if (!user) return null;

  const spiritsByRarity = gameState.characters.reduce(
    (acc, spirit) => {
      acc[spirit.rarity] = (acc[spirit.rarity] || 0) + 1;
      return acc;
    },
    {} as Record<number, number>,
  );

  return (
    <div className="user-profile">
      <h2>User Profile</h2>
      <p>Username: {user.displayName || "N/A"}</p>
      <p>Email: {user.email}</p>
      <h3>Game Progress</h3>
      <p>Total Spirits: {gameState.characters.length}</p>
      <h4>Spirits by Rarity:</h4>
      <ul>
        {Object.entries(spiritsByRarity).map(([rarity, count]) => (
          <li key={rarity}>
            ★{rarity}: {count}
          </li>
        ))}
      </ul>
      <h4>Last 10 Summons:</h4>
      <ul>
        {gameState.characters
          .slice(-10)
          .reverse()
          .map((spirit) => (
            <li key={spirit.id}>
              {spirit.name} (★{spirit.rarity})
            </li>
          ))}
      </ul>
    </div>
  );
}

export default UserProfile;
