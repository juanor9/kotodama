import React from 'react';
import { Character } from '../types';

interface BattleCharacterProps {
  character: Character;
  isPlayer: boolean;
}

const BattleCharacter: React.FC<BattleCharacterProps> = ({ character, isPlayer }) => {
  return (
    <div className={`battle-character ${isPlayer ? 'player' : 'enemy'}`}>
      <div className="character-symbol">{character.shape}</div>
      <div className="character-info">
        <h3>{character.name}</h3>
        <p>★{character.rarity} Lv.{character.level}</p>
        <p>{character.element}</p>
      </div>
    </div>
  );
};

export default BattleCharacter;