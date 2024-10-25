import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import SummoningArea from "../SummoningArea.tsx";
import MaterialStore from "../MaterialStore/MaterialStore.tsx";
import { Character } from "../../types.ts";
import "./SummonSection.scss";

interface SummonSectionProps {
  addCharacters: (characters: Character[]) => void;
  updateCurrency: (coinsSpent: number, essenceSpent: number) => void;
  coins: number;
  essence: number;
  playerInventory: Character[];
}

const tabs = [
  { id: "spirits", label: "Spirit Summoning" },
  { id: "materials", label: "Material Purchase" },
];

const coinCosts: Record<number, number> = {
  1: 100,
  10: 900,
  50: 4000,
};

const essenceCosts: Record<number, number> = {
  1: 1,
  10: 10,
  50: 50,
};

function SummonSection({
  addCharacters,
  updateCurrency,
  coins,
  essence,
  playerInventory,
}: SummonSectionProps) {
  const [currentTab, setCurrentTab] = useState<"spirits" | "materials">(
    "spirits",
  );

  const currentIndex = useMemo(
    () => tabs.findIndex((tab) => tab.id === currentTab),
    [currentTab],
  );

  const navigate = (direction: "prev" | "next") => {
    const newIndex =
      direction === "next"
        ? (currentIndex + 1) % tabs.length
        : (currentIndex - 1 + tabs.length) % tabs.length;
    setCurrentTab(tabs[newIndex].id as "spirits" | "materials");
  };

  return (
    <div className="summon-section">
      <div className="summon-section__navigation">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`summon-section__tab ${
              currentTab === tab.id ? "active" : ""
            }`}
            onClick={() => setCurrentTab(tab.id as "spirits" | "materials")}
            data-testid={`tab-${tab.id}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="summon-section__content">
        <button
          type="button"
          className="summon-section__arrow left"
          onClick={() => navigate("prev")}
          aria-label="Navigate to previous tab"
        >
          <ChevronLeft size={24} />
        </button>

        <div className="summon-section__panel">
          {currentTab === "spirits" ? (
            <SummoningArea
              addCharacters={addCharacters}
              updateCurrency={updateCurrency}
              coins={coins}
              essence={essence}
              playerInventory={playerInventory}
            />
          ) : (
            <MaterialStore
              coins={coins}
              essence={essence}
              onPurchase={async (amount, useEssence) => {
                const coinsSpent = useEssence
                  ? 0
                  : coinCosts[amount as keyof typeof coinCosts] || 0;
                const essenceSpent = useEssence
                  ? essenceCosts[amount as keyof typeof essenceCosts] || 0
                  : 0;
                await updateCurrency(coinsSpent, essenceSpent);
              }}
            />
          )}
        </div>

        <button
          type="button"
          className="summon-section__arrow right"
          onClick={() => navigate("next")}
          aria-label="Navigate to next tab"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
}

export default SummonSection;
