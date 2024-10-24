import { motion, AnimatePresence } from "framer-motion";
import { Material } from "../../types";
import "./MaterialPurchaseResult.scss";

interface MaterialPurchaseResultProps {
  materials: Material[];
  onClose: () => void;
}

function MaterialPurchaseResult({ materials, onClose }: MaterialPurchaseResultProps) {
  const getRarityColor = (rarity: number) => {
    switch (rarity) {
      case 1:
        return "#b0bec5"; // Common
      case 2:
        return "#8bc34a"; // Uncommon
      case 3:
        return "#03a9f4"; // Rare
      case 4:
        return "#9c27b0"; // Epic
      case 5:
        return "#ffc107"; // Legendary
      default:
        return "#ffffff";
    }
  };

  return (
    <AnimatePresence>
      <div className="material-result-overlay" onClick={(e) => e.stopPropagation()}>
        <motion.div
          className="material-result"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
        >
          <h2>Materials Acquired!</h2>
          <div className="material-result__grid">
            {materials.map((material, index) => (
              <motion.div
                key={`${material.material_id}-${index}`}
                className="material-result__item"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                style={{
                  backgroundColor: `${getRarityColor(material.rarity)}15`,
                  borderColor: getRarityColor(material.rarity),
                }}
              >
                <img
                  src={material.image_url}
                  alt={material.name}
                  className="material-result__image"
                />
                <div className="material-result__info">
                  <h3 style={{ color: getRarityColor(material.rarity) }}>
                    {material.name}
                  </h3>
                  <p className="material-result__japanese-name">
                    {material.japanese_name}
                  </p>
                  <div className="material-result__rarity">
                    {"★".repeat(material.rarity)}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="material-result__close"
          >
            Close
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default MaterialPurchaseResult;