import { motion, AnimatePresence } from "framer-motion";
import { useMemo } from "react";
import { Material } from "../../../types.ts";
import "./MaterialPurchaseResult.scss";
import { getRarityColor } from "../../../utils/colorUtils.ts";

interface MaterialItemProps {
  material: Material;
}

function MaterialItem({ material }: MaterialItemProps) {
  return (
    <motion.div
      className="material-result__item"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 * Number(material.material_id) }}
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
  );
}

interface MaterialPurchaseResultProps {
  materials: Material[];
  onClose: () => void;
}

function MaterialPurchaseResult({
  materials,
  onClose,
}: MaterialPurchaseResultProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  const memoizedMaterials = useMemo(() => materials, [materials]);

  return (
    <AnimatePresence>
      <div
        className="material-result-overlay"
        onClick={(e) => e.stopPropagation()}
        role="presentation"
        onKeyDown={handleKeyDown}
      >
        <motion.div
          className="material-result"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
        >
          <h2>Materials Acquired!</h2>
          <div className="material-result__grid">
            {memoizedMaterials.map((material) => (
              <MaterialItem key={material.material_id} material={material} />
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
