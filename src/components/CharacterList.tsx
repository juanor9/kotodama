import { useState } from "react";
import CharacterCard from "./CharacterCard.tsx";
import { Character } from "../types.ts";

interface CharacterListProps {
  characters: Character[];
  magicItems: { [key: string]: number };
  onUpgradeCharacter: (character: Character) => void;
}

function CharacterList({
  characters,
  magicItems,
  onUpgradeCharacter,
}: CharacterListProps) {
  const [filter, setFilter] = useState<"all" | "Component" | "Kanji" | "Word">(
    "all",
  );

  const filteredCharacters = characters.filter(
    (char) => filter === "all" || char.type === filter,
  );

  return (
    <div className="character-list">
      <h2>Your Spirits</h2>
      <div className="filter-buttons">
        <button type="button" onClick={() => setFilter("all")}>
          All
        </button>
        <button type="button" onClick={() => setFilter("Component")}>
          Components
        </button>
        <button type="button" onClick={() => setFilter("Kanji")}>
          Kanji
        </button>
        <button type="button" onClick={() => setFilter("Word")}>
          Words
        </button>
      </div>
      {filteredCharacters.length === 0 ? (
        <p>
          You haven&apos;t summoned any spirits of this type yet. Start
          summoning to build your collection!
        </p>
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
}

export default CharacterList;
