import spiritsData from "../data/spirits.json" assert { type: "json" };
import {
  Character,
  Ability,
  SummonResult,
  SpiritType,
  ElementType,
  Rarity,
} from "../types.ts";

interface Spirit {
  spirit_id: string;
  name: string;
  type: string;
  rarity: number;
  element: string;
  summon_probability: number;
  usage: string;
  abilities: { type: string; description: string }[];
  attacks?: { [key: string]: Ability };
}

function weightedRandomSelection<T>(
  items: T[],
  weightFn: (item: T) => number,
): T {
  if (items.some((item) => weightFn(item) < 0)) {
    throw new Error("Weights must be non-negative");
  }
  const totalWeight = items.reduce((sum, item) => sum + weightFn(item), 0);
  if (totalWeight === 0) {
    throw new Error("Total weight must be greater than 0");
  }
  const random = Math.random() * totalWeight;

  let accumulatedWeight = 0;
  const selectedItem = items.find((item) => {
    accumulatedWeight += weightFn(item);
    return accumulatedWeight >= random;
  });

  if (!selectedItem) {
    throw new Error("No item could be selected based on the given weights");
  }

  return selectedItem;
}

function createAbility(ability: {
  type: string;
  description: string;
}): Ability {
  return {
    ...ability,
    name: ability.type,
    effect: () => {},
  };
}

function createCharacterFromSpirit(spirit: Spirit): Character {
  return {
    id: parseInt(spirit.spirit_id, 10),
    name: spirit.name,
    type: spirit.type as SpiritType,
    element: spirit.element as ElementType,
    rarity: spirit.rarity as Rarity,
    shape: spirit.name,
    meaning:
      spirit.abilities
        .map(createAbility)
        .find((a: Ability) => a.name === "Meaning")?.description || "",
    reading:
      spirit.abilities
        .map(createAbility)
        .find((a: Ability) => a.name === "Reading")?.description || "",
    level: 1,
    experience: 0,
    abilities: spirit.abilities.map(createAbility),
    attacks: spirit.attacks
      ? {
          Form: spirit.attacks.Form,
          Meaning: spirit.attacks.Meaning,
          Reading: spirit.attacks.Reading,
        }
      : undefined,
    maxRarity: Math.max(spirit.rarity, 6),
    image: "",
  };
}

function getGuaranteedRareIndex(count: number): number {
  return count === 10 ? Math.floor(Math.random() * 10) : -1;
}

export function summonSpirit(playerInventory: Character[]): SummonResult {
  const availableSpirits: Spirit[] = spiritsData.filter(
    (s: Spirit) =>
      s.usage === "BattleAndFusion" ||
      s.usage === "SummonEligible" ||
      s.usage === "TrainingRanger",
  );
  if (availableSpirits.length === 0) {
    throw new Error("No available spirits for summoning");
  }
  const selectedSpirit = weightedRandomSelection(
    availableSpirits,
    (s) => s.summon_probability,
  );
  const character = createCharacterFromSpirit(selectedSpirit);
  const isNew = !playerInventory.some((c) => c.id === character.id);

  return { character, isNew };
}

export function summonMultipleSpirits(
  count: number,
  playerInventory: Character[],
): SummonResult[] {
  const results: SummonResult[] = [];
  const guaranteedRareIndex = getGuaranteedRareIndex(count);

  let cachedSummonResult: SummonResult | null = null;

  Array.from({ length: count }).forEach((_, i) => {
    if (i === guaranteedRareIndex) {
      const rareSpirits: Spirit[] = spiritsData.filter(
        (s: Spirit) =>
          (s.usage === "BattleAndFusion" || s.usage === "SummonEligible") &&
          s.rarity >= 4,
      );
      if (rareSpirits.length === 0) {
        cachedSummonResult =
          cachedSummonResult || summonSpirit(playerInventory);
        results.push(cachedSummonResult);
        return;
      }
      const selectedSpirit = weightedRandomSelection(
        rareSpirits,
        (s) => s.summon_probability,
      );
      const character = createCharacterFromSpirit(selectedSpirit);
      const isNew = !playerInventory.some((c) => c.id === character.id);
      results.push({ character, isNew });
    } else {
      if (!cachedSummonResult) {
        cachedSummonResult = summonSpirit(playerInventory);
      }
      results.push(cachedSummonResult);
    }
  });

  return results;
}
