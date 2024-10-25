import { useState } from "react";
import { Coins, Droplet } from "lucide-react";
import MaterialPurchaseModal from "./MaterialPurchaseModal/MaterialPurchaseModal.tsx";
import MaterialPurchaseResult from "./MaterialPurchaseResult/MaterialPurchaseResult.tsx";
import { Material } from "../../types.ts";
import { purchaseMaterials } from "../../services/materialService.ts";
import { auth } from "../../services/firebase.ts";
import "./MaterialStore.scss";

interface MaterialStoreProps {
  coins: number;
  essence: number;
  onPurchase: (amount: number, useEssence: boolean) => Promise<void>;
}

function MaterialStore({ coins, essence, onPurchase }: MaterialStoreProps) {
  const [showModal, setShowModal] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [purchaseAmount, setPurchaseAmount] = useState(0);
  const [useEssence, setUseEssence] = useState(false);
  const [error, setError] = useState("");
  const [purchasedMaterials, setPurchasedMaterials] = useState<Material[]>([]);

  const costLookup: Record<number, number> = {
    1: 100,
    10: 900,
    50: 4000,
  };

  const essenceCostLookup: Record<number, number> = {
    1: 1,
    10: 10,
    50: 50,
  };

  const handlePurchase = (amount: number, withEssence: boolean) => {
    if (!auth.currentUser) {
      setError("Please log in to make purchases");
      return;
    }

    const cost = costLookup[amount] || 4000;
    const essenceCost = essenceCostLookup[amount] || 50;

    if (withEssence && essence < essenceCost) {
      setError("Not enough essence!");
      return;
    }

    if (!withEssence && coins < cost) {
      setError("Not enough coins!");
      return;
    }

    setError("");
    setPurchaseAmount(amount);
    setUseEssence(withEssence);
    setShowModal(true);
  };

  const handleConfirmPurchase = async () => {
    try {
      if (!auth.currentUser) {
        throw new Error("User not authenticated");
      }
      const materials = await purchaseMaterials(purchaseAmount, useEssence);
      await onPurchase(purchaseAmount, useEssence);
      setPurchasedMaterials(materials);
      setShowModal(false);
      setShowResult(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Purchase failed");
      setShowModal(false);
    }
  };

  return (
    <div className="material-store">
      <h2>Material Store</h2>
      <div className="material-store__description">
        <p>Purchase materials to enhance your spirits&apos; power!</p>
        <p>Higher quantities provide better chances for rare materials.</p>
      </div>

      <div className="material-store__options">
        <div className="material-store__option">
          <h3>Single Purchase</h3>
          <div className="material-store__buttons">
            <button
              type="button"
              onClick={() => handlePurchase(1, false)}
              className="material-store__button"
            >
              <Coins size={16} /> 100
            </button>
            <button
              type="button"
              onClick={() => handlePurchase(1, true)}
              className="material-store__button"
            >
              <Droplet size={16} /> 1
            </button>
          </div>
        </div>

        <div className="material-store__option">
          <h3>Bulk Purchase (10)</h3>
          <p className="material-store__bonus">
            Includes one guaranteed rare material!
          </p>
          <div className="material-store__buttons">
            <button
              type="button"
              onClick={() => handlePurchase(10, false)}
              className="material-store__button"
            >
              <Coins size={16} /> 900
            </button>
            <button
              type="button"
              onClick={() => handlePurchase(10, true)}
              className="material-store__button"
            >
              <Droplet size={16} /> 10
            </button>
          </div>
        </div>

        <div className="material-store__option">
          <h3>Mega Purchase (50)</h3>
          <p className="material-store__bonus">
            Higher chance of epic and legendary materials!
          </p>
          <div className="material-store__buttons">
            <button
              type="button"
              onClick={() => handlePurchase(50, false)}
              className="material-store__button"
            >
              <Coins size={16} /> 4000
            </button>
            <button
              type="button"
              onClick={() => handlePurchase(50, true)}
              className="material-store__button"
            >
              <Droplet size={16} /> 50
            </button>
          </div>
        </div>
      </div>

      {error && <p className="material-store__error">{error}</p>}

      {showModal && (
        <MaterialPurchaseModal
          amount={purchaseAmount}
          useEssence={useEssence}
          onClose={() => setShowModal(false)}
          onConfirm={handleConfirmPurchase}
          show={showModal}
        />
      )}

      {showResult && purchasedMaterials.length > 0 && (
        <MaterialPurchaseResult
          materials={purchasedMaterials}
          onClose={() => setShowResult(false)}
        />
      )}
    </div>
  );
}

export default MaterialStore;
