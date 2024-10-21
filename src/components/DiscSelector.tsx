import React from 'react';
import { Character, DiscAction, AttackType } from '../types';

interface DiscSelectorProps {
  characters: Character[];
  onDiscSelect: (disc: DiscAction) => void;
  selectedDiscs: DiscAction[];
}

const DiscSelector: React.FC<DiscSelectorProps> = ({ characters, onDiscSelect, selectedDiscs }) => {
  const renderDisc = (character: Character, type: AttackType | 'Special' | 'Dopple') => {
    const isSelected = selectedDiscs.some(disc => disc.character.id === character.id && disc.type === type);
    return (
      <button
        key={`${character.id}-${type}`}
        className={`disc ${type.toLowerCase()} ${isSelected ? 'selected' : ''}`}
        onClick={() => onDiscSelect({ type, character })}
        disabled={isSelected || selectedDiscs.length >= 3}
      >
        {type}
      </button>
    );
  };

  return (
    <div className="disc-selector">
      {characters.map(character => (
        <div key={character.id} className="character-discs">
          {character.attacks && Object.keys(character.attacks).map(type => renderDisc(character, type as AttackType))}
          {character.specialAbility && renderDisc(character, 'Special')}
          {character.doppleAbility && renderDisc(character, 'Dopple')}
        </div>
      ))}
    </div>
  );
};

export default DiscSelector;