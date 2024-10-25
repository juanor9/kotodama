import { motion, AnimatePresence } from "framer-motion";
import "./MaterialPurchaseModal.scss";

interface MaterialPurchaseModalProps {
  amount: number;
  useEssence: boolean;
  onClose: () => void;
  onConfirm: () => void;
  show: boolean;
}

const animationConfigInitial = { scale: 0.8, opacity: 0 };
const animationConfigAnimate = { scale: 1, opacity: 1 };
const animationConfigExit = { scale: 0.8, opacity: 0 };

function getPluralSuffix(amount: number): string {
  return amount > 1 ? "s" : "";
}

function MaterialPurchaseModal({
  amount,
  useEssence,
  onClose,
  onConfirm,
  show,
}: MaterialPurchaseModalProps) {
  const costLookup: Record<number, number> = {
    1: 100,
    10: 900,
    50: 4000,
  };
  const cost = costLookup[amount] ?? 4000;

  const essenceCostLookup: Record<number, number> = {
    1: 1,
    10: 10,
    50: 50,
  };
  const essenceCost = essenceCostLookup[amount] ?? 50;

  if (!show) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        className="modal-overlay"
        initial={animationConfigInitial}
        animate={animationConfigAnimate}
        exit={animationConfigExit}
      >
        <motion.div
          className="material-purchase-modal"
          initial={animationConfigInitial}
          animate={animationConfigAnimate}
          exit={animationConfigExit}
        >
          <h3>Confirm Purchase</h3>
          <p>
            Purchase {amount} material{getPluralSuffix(amount)} for{" "}
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
            <button
              type="button"
              onClick={onConfirm}
              className="confirm-button"
            >
              Confirm
            </button>
            <button type="button" onClick={onClose} className="cancel-button">
              Cancel
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default MaterialPurchaseModal;
