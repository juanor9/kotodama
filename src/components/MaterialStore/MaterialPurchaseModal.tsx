import { motion, AnimatePresence } from "framer-motion";
import "./MaterialPurchaseModal.scss";

interface MaterialPurchaseModalProps {
  amount: number;
  useEssence: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

function MaterialPurchaseModal({
  amount,
  useEssence,
  onClose,
  onConfirm,
}: MaterialPurchaseModalProps) {
  const cost = amount === 1 ? 100 : amount === 10 ? 900 : 4000;
  const essenceCost = amount === 1 ? 1 : amount === 10 ? 10 : 50;

  return (
    <AnimatePresence>
      <div className="modal-overlay">
        <motion.div
          className="material-purchase-modal"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
        >
          <h3>Confirm Purchase</h3>
          <p>
            Purchase {amount} material{amount > 1 ? "s" : ""} for{" "}
            {useEssence ? (
              <span className="essence-cost">{essenceCost} essence</span>
            ) : (
              <span className="coin-cost">{cost} coins</span>
            )}
            ?
          </p>
          {amount >= 10 && (
            <p className="bonus-info">
              {amount === 10
                ? "Includes one guaranteed rare material!"
                : "Higher chance of epic and legendary materials!"}
            </p>
          )}
          <div className="button-group">
            <button type="button" onClick={onConfirm} className="confirm-button">
              Confirm
            </button>
            <button type="button" onClick={onClose} className="cancel-button">
              Cancel
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default MaterialPurchaseModal;