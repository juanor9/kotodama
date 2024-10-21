import React, { useState } from 'react';
import { Coins, Droplet } from 'lucide-react';
import SummoningCircle from './SummoningCircle';
import Modal from './Modal';
import { Character, SummonResult } from '../types';
import { summonSpirit, summonMultipleSpirits, getMaterialsForRarityIncrease } from '../utils/summonLogic';

interface SummoningAreaProps {
  addCharacters: (characters: Character[]) => void;
  updateCurrency: (coinsSpent: number, essenceSpent: number) => void;
  coins: number;
  essence: number;
  playerInventory: Character[];
}

const SummoningArea: React.FC<SummoningAreaProps> = ({
  addCharacters,
  updateCurrency,
  coins,
  essence,
  playerInventory,
}) => {
  const [showSummoning, setShowSummoning] = useState(false);
  const [summonCount, setSummonCount] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [summonResults, setSummonResults] = useState<SummonResult[]>([]);

  const handleSummon = (count: number, useEssence: boolean) => {
    const cost = count === 1 ? (useEssence ? 1 : 100) : 50;
    const currency = useEssence ? 'essence' : 'coins';

    if (
      (currency === 'coins' && coins >= cost) ||
      (currency === 'essence' && essence >= cost)
    ) {
      setShowSummoning(true);
      setSummonCount(count);
      updateCurrency(
        currency === 'coins' ? cost : 0,
        currency === 'essence' ? cost : 0
      );

      const results =
        count === 1 ? [summonSpirit(playerInventory)] : summonMultipleSpirits(count, playerInventory);
      console.log(results);
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
          className="btn summon-btn"
          onClick={() => handleSummon(1, false)}
        >
          Summon x1 <Coins size={16} /> 100
        </button>
        <button
          className="btn summon-btn"
          onClick={() => handleSummon(1, true)}
        >
          Summon x1 <Droplet size={16} /> 1
        </button>
        <button
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
          getMaterialsForRarityIncrease={getMaterialsForRarityIncrease}
        />
      )}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        message={modalMessage}
      />
    </div>
  );
};

export default SummoningArea;