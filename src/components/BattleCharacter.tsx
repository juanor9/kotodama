import { Character } from "../types.ts";

interface BattleCharacterProps {
  character: Character;
  isPlayer: boolean;
}

function BattleCharacter({ character, isPlayer }: BattleCharacterProps) {
  return (
    <div className={`battle-character ${isPlayer ? "player" : "enemy"}`}>
      <div className="character-symbol">{character.shape}</div>
      <div className="character-info">
        <h3>{character.name}</h3>
        <p>
          ★{character.rarity} Lv.{character.level}
        </p>
        <p>{character.element}</p>
      </div>
    </div>
  );
}

export default BattleCharacter;
