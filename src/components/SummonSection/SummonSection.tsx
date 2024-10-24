import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import SummoningArea from "../SummoningArea";
import MaterialStore from "../MaterialStore/MaterialStore";
import { Character } from "../../types";
import "./SummonSection.scss";

interface SummonSectionProps {
  addCharacters: (characters: Character[]) => void;
  updateCurrency: (coinsSpent: number, essenceSpent: number) => void;
  coins: number;
  essence: number;
  playerInventory: Character[];
}

function SummonSection({
  addCharacters,
  updateCurrency,
  coins,
  essence,
  playerInventory,
}: SummonSectionProps) {
  const [currentTab, setCurrentTab] = useState<"spirits" | "materials">("spirits");

  const tabs = [
    { id: "spirits", label: "Spirit Summoning" },
    { id: "materials", label: "Material Purchase" },
  ];

  const currentIndex = tabs.findIndex((tab) => tab.id === currentTab);

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
                await updateCurrency(
                  useEssence ? 0 : amount === 1 ? 100 : amount === 10 ? 900 : 4000,
                  useEssence ? amount === 1 ? 1 : amount === 10 ? 10 : 50 : 0
                );
              }}
            />
          )}
        </div>

        <button
          type="button"
          className="summon-section__arrow right"
          onClick={() => navigate("next")}
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
}

export default SummonSection;