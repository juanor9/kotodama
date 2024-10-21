import React, { useState, useEffect } from 'react';
import { SummonResult, Character } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface SummoningCircleProps {
  count: number;
  results: SummonResult[];
  onComplete: () => void;
  onClose: () => void;
  getMaterialsForRarityIncrease: (character: Character) => { material_id: string; quantity: number }[] | null;
}

const SummoningCircle: React.FC<SummoningCircleProps> = ({ count, results, onComplete, onClose, getMaterialsForRarityIncrease }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < count) {
      const timer = setTimeout(() => setCurrentIndex(prev => prev + 1), 1000);
      return () => clearTimeout(timer);
    } else {
      onComplete();
    }
  }, [currentIndex, count, onComplete]);

  const getColorByRarity = (rarity: number) => {
    switch (rarity) {
      case 1: return '#b0bec5';
      case 2: return '#8bc34a';
      case 3: return '#03a9f4';
      case 4: return '#9c27b0';
      case 5: return '#ffc107';
      case 6: return '#e91e63';
      default: return '#ffffff';
    }
  };

  const renderMaterials = (character: Character) => {
    const materials = getMaterialsForRarityIncrease(character);
    if (!materials) return null;

    return (
      <div className="rarity-increase-materials">
        <h4>Materials for Rarity Increase:</h4>
        <ul>
          {materials.map((material, index) => (
            <li key={index}>{material.material_id}: {material.quantity}</li>
          ))}
        </ul>
      </div>
    );
  };

  if (results.length === 0) {
    return (
      <div className="summoning-circle">
        <div className="summoning-error">No spirits summoned. Please try again.</div>
      </div>
    );
  }

  return (
    <div className="summoning-circle" onClick={onClose}>
      <AnimatePresence>
        {currentIndex < count ? (
          <motion.div
            key={currentIndex}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ duration: 0.5 }}
            className="circle"
            style={{ backgroundColor: getColorByRarity(results[currentIndex].character.rarity) }}
          >
            <div className="summoning-text">Summoning... {currentIndex + 1}/{count}</div>
            <div className="spirit-name">{results[currentIndex].character.name}</div>
            <div className="spirit-rarity">{'★'.repeat(results[currentIndex].character.rarity)}</div>
            {results[currentIndex].isNew && <div className="new-spirit">New!</div>}
            {renderMaterials(results[currentIndex].character)}
          </motion.div>
        ) : (
          <motion.div
            key="summary"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="summoning-summary"
          >
            <h3>Summoning Complete!</h3>
            <div className="summoned-spirits">
              {results.map((result, index) => (
                <div key={index} className="spirit-summary" style={{ color: getColorByRarity(result.character.rarity) }}>
                  {result.character.name} - {'★'.repeat(result.character.rarity)}
                  {result.isNew && <span className="new-tag">New!</span>}
                  {renderMaterials(result.character)}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SummoningCircle;