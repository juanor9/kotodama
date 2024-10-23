import { useState } from "react";
import { Character, DiscAction, BattleState } from "../types.ts";
import BattleCharacter from "./BattleCharacter.tsx";
import DiscSelector from "./DiscSelector.tsx";

function generateEnemyTeam(): Character[] {
  // Implement enemy team generation logic here
  return [];
}

interface BattleAreaProps {
  playerCharacters: Character[];
  onBattleComplete?: (rewards: {
    coins: number;
    essence: number;
    experience: number[];
  }) => void;
}

function BattleArea({ playerCharacters, onBattleComplete }: BattleAreaProps) {
  const [battleState, setBattleState] = useState<BattleState>({
    playerTeam: playerCharacters.slice(0, 3),
    enemyTeam: generateEnemyTeam(),
    currentTurn: "player",
    selectedDiscs: [],
    magicPoints: 100,
  });

  const handleDiscSelection = (disc: DiscAction) => {
    if (battleState.selectedDiscs.length < 3) {
      setBattleState((prev) => ({
        ...prev,
        selectedDiscs: [...prev.selectedDiscs, disc],
      }));
    }
  };

  const handleAttack = () => {
    // Implement attack logic here
    // Update battleState based on the attack results
    // Check for battle completion and call onBattleComplete if necessary
    if (onBattleComplete) {
      // Example usage, replace with actual battle result logic
      onBattleComplete({ coins: 100, essence: 50, experience: [10, 20, 30] });
    }
  };

  return (
    <div className="battle-area">
      <h2>Battle Arena</h2>
      <div className="battle-field">
        <div className="player-team">
          {battleState.playerTeam.map((character) => (
            <BattleCharacter
              key={character.id}
              character={character}
              isPlayer
            />
          ))}
        </div>
        <div className="enemy-team">
          {battleState.enemyTeam.map((character) => (
            <BattleCharacter
              key={character.id}
              character={character}
              isPlayer={false}
            />
          ))}
        </div>
      </div>
      <DiscSelector
        characters={battleState.playerTeam}
        onDiscSelect={handleDiscSelection}
        selectedDiscs={battleState.selectedDiscs}
      />
      <button
        type="button"
        className="btn attack-btn"
        onClick={handleAttack}
        disabled={battleState.selectedDiscs.length < 3}
      >
        Attack
      </button>
    </div>
  );
}

BattleArea.defaultProps = {
  onBattleComplete: () => {},
};

export default BattleArea;
