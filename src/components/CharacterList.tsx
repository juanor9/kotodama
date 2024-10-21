import React, { useState } from 'react';
import CharacterCard from './CharacterCard';
import { Character } from '../types';

interface CharacterListProps {
  characters: Character[];
  magicItems: { [key: string]: number };
  onUpgradeCharacter: (character: Character) => void;
}

const CharacterList: React.FC<CharacterListProps> = ({ characters, magicItems, onUpgradeCharacter }) => {
  const [filter, setFilter] = useState<'all' | 'Component' | 'Kanji' | 'Word'>('all');

  const filteredCharacters = characters.filter(char => 
    filter === 'all' || char.type === filter
  );

  return (
    <div className="character-list">
      <h2>Your Spirits</h2>
      <div className="filter-buttons">
        <button onClick={() => setFilter('all')}>All</button>
        <button onClick={() => setFilter('Component')}>Components</button>
        <button onClick={() => setFilter('Kanji')}>Kanji</button>
        <button onClick={() => setFilter('Word')}>Words</button>
      </div>
      {filteredCharacters.length === 0 ? (
        <p>You haven't summoned any spirits of this type yet. Start summoning to build your collection!</p>
      ) : (
        <div className="character-grid">
          {filteredCharacters.map((character) => (
            <CharacterCard 
              key={character.id} 
              character={character} 
              magicItems={magicItems}
              onUpgrade={() => onUpgradeCharacter(character)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CharacterList;