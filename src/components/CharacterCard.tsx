import React from 'react';
import { Character } from '../types';

interface CharacterCardProps {
  character: Character;
  magicItems: { [key: string]: number };
  onUpgrade: () => void;
}

const CharacterCard: React.FC<CharacterCardProps> = ({ character, magicItems, onUpgrade }) => {
  const canUpgrade = character.rarity < character.maxRarity && magicItems[character.name] > 0;

  return (
    <div className={`character-card rarity-${character.rarity}`}>
      <img src={character.artUrl} alt={character.name} className="character-image" />
      <div className="character-symbol">{character.shape}</div>
      <h3>{character.name}</h3>
      <p className="rarity">★{character.rarity}/{character.maxRarity}</p>
      <p>{character.type}</p>
      <p>Element: {character.element}</p>
      <p>Level: {character.level}</p>
      <p>Meaning: {character.meaning}</p>
      {character.reading && <p>Reading: {character.reading}</p>}
      {character.specialAbility && <p>Special: {character.specialAbility.name}</p>}
      {character.doppleAbility && <p>Dopple: {character.doppleAbility.name}</p>}
      {canUpgrade && (
        <button className="btn upgrade-btn" onClick={onUpgrade}>
          Upgrade (Magic Items: {magicItems[character.name]})
        </button>
      )}
    </div>
  );
};

export default CharacterCard;