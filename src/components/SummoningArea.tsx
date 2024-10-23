import { useState } from "react";
import { Coins, Droplet } from "lucide-react";
import SummoningCircle from "./SummoningCircle.tsx";
import Modal from "./Modal.tsx";
import { Character, SummonResult } from "../types.ts";
import { summonSpirit, summonMultipleSpirits } from "../utils/summonLogic.ts";

interface SummoningAreaProps {
  addCharacters: (characters: Character[]) => void;
  updateCurrency: (coinsSpent: number, essenceSpent: number) => void;
  coins: number;
  essence: number;
  playerInventory: Character[];
}

function SummoningArea({
  addCharacters,
  updateCurrency,
  coins,
  essence,
  playerInventory,
}: SummoningAreaProps) {
  const [showSummoning, setShowSummoning] = useState(false);
  const [summonCount, setSummonCount] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [summonResults, setSummonResults] = useState<SummonResult[]>([]);

  const handleSummon = (count: number, useEssence: boolean) => {
    let cost = 0;
    if (count === 1) {
      cost = useEssence ? 1 : 100;
    } else {
      cost = 50;
    }
    const currency = useEssence ? "essence" : "coins";

    if (
      (currency === "coins" && coins >= cost) ||
      (currency === "essence" && essence >= cost)
    ) {
      setShowSummoning(true);
      setSummonCount(count);
      updateCurrency(
        currency === "coins" ? cost : 0,
        currency === "essence" ? cost : 0,
      );

      const results =
        count === 1
          ? [summonSpirit(playerInventory)]
          : summonMultipleSpirits(count, playerInventory);
      setSummonResults(results);
    } else {
      setModalMessage(`Not enough ${currency} for summoning!`);
      setShowModal(true);
    }
  };

  const onSummonComplete = () => {
    addCharacters(summonResults.map((result) => result.character));
    setShowSummoning(false);
    setSummonResults([]);
  };

  return (
    <div className="summoning-area">
      <h2>Summon Spirits</h2>
      <div className="summon-buttons">
        <button
          type="button"
          className="btn summon-btn"
          onClick={() => handleSummon(1, false)}
        >
          Summon x1 <Coins size={16} /> 100
        </button>
        <button
          type="button"
          className="btn summon-btn"
          onClick={() => handleSummon(1, true)}
        >
          Summon x1 <Droplet size={16} /> 1
        </button>
        <button
          type="button"
          className="btn summon-btn bulk"
          onClick={() => handleSummon(10, true)}
        >
          Summon x10 <Droplet size={16} /> 50
        </button>
      </div>
      {showSummoning && summonResults.length > 0 && (
        <SummoningCircle
          count={summonCount}
          results={summonResults}
          onComplete={onSummonComplete}
          onClose={() => setShowSummoning(false)}
        />
      )}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        message={modalMessage}
      />
    </div>
  );
}

export default SummoningArea;
