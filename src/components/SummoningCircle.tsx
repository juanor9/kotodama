import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SummonResult, Character } from "../types.ts";

interface SummoningCircleProps {
  count: number;
  results: SummonResult[];
  onComplete: () => void;
  onClose: () => void;
}

function SummoningCircle({
  count,
  results,
  onComplete,
  onClose,
}: SummoningCircleProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < count) {
      const timer = setTimeout(() => setCurrentIndex((prev) => prev + 1), 1000);
      return () => {
        clearTimeout(timer);
      };
    }
    onComplete();
    return undefined;
  }, [currentIndex, count, onComplete]);

  const getColorByRarity = (rarity: number) => {
    switch (rarity) {
      case 1:
        return "#b0bec5";
      case 2:
        return "#8bc34a";
      case 3:
        return "#03a9f4";
      case 4:
        return "#9c27b0";
      case 5:
        return "#ffc107";
      case 6:
        return "#e91e63";
      default:
        return "#ffffff";
    }
  };

  if (results.length === 0) {
    return (
      <div className="summoning-circle">
        <div className="summoning-error" role="alert">
          No spirits summoned. Please try again.
        </div>
      </div>
    );
  }

  return (
    <div
      className="summoning-circle"
      onClick={onClose}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onClose();
      }}
    >
      <AnimatePresence>
        {currentIndex < count ? (
          <motion.div
            key={currentIndex}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ duration: 0.5 }}
            className="circle"
            style={{
              backgroundColor: getColorByRarity(
                (results[currentIndex].character as Character).rarity,
              ),
            }}
          >
            <div className="summoning-text">
              Summoning... {currentIndex + 1}/{count}
            </div>
            <motion.img
              src={(results[currentIndex].character as Character).image}
              alt={results[currentIndex].character.name}
              className="spirit-image"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            />
            <div className="spirit-name">
              {results[currentIndex].character.name}
            </div>
            <div className="spirit-rarity">
              {"★".repeat(results[currentIndex].character.rarity)}
            </div>
            {results[currentIndex].isNew && (
              <div className="new-spirit">New!</div>
            )}
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
              {results.map((result) => (
                <div
                  key={result.character.id}
                  className="spirit-summary"
                  style={{
                    color: getColorByRarity(
                      (result.character as Character).rarity,
                    ),
                  }}
                >
                  <img
                    src={(result.character as Character).image}
                    alt={result.character.name}
                    className="spirit-thumbnail"
                  />
                  <div>
                    {result.character.name} -{" "}
                    {"★".repeat(result.character.rarity)}
                    {result.isNew && <span className="new-tag">New!</span>}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default SummoningCircle;
