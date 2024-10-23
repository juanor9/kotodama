import spiritsData from "../data/spirits.json";
import {
  Character,
  Ability,
  SummonResult,
  SpiritType,
  ElementType,
  Rarity,
} from "../types.ts";

interface RequiredItem {
  rarity_level: number;
  materials: { material_id: string; quantity: number }[];
}

function weightedRandomSelection<T>(
  items: T[],
  weightFn: (item: T) => number,
): T {
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
  return selectedItem || items[items.length - 1];
}

function createCharacterFromSpirit(spirit: {
  spirit_id: string;
  name: string;
  type: string;
  rarity: number;
  element: string;
  summon_probability: number;
  usage: string;
  abilities: { type: string; description: string }[];
  attacks?: { [key: string]: Ability };
}): Character {
  return {
    id: parseInt(spirit.spirit_id, 10),
    name: spirit.name,
    type: spirit.type as SpiritType,
    element: spirit.element as ElementType,
    rarity: spirit.rarity as Rarity,
    shape: spirit.name,
    meaning:
      spirit.abilities
        .map((a) => ({ ...a, name: a.type, effect: () => {} }))
        .find((a: Ability) => a.name === "Meaning")?.description || "",
    reading:
      spirit.abilities
        .map((a) => ({ ...a, name: a.type, effect: () => {} }))
        .find((a: Ability) => a.name === "Reading")?.description || "",
    level: 1,
    experience: 0,
    abilities: spirit.abilities.map((a) => ({
      type: a.type,
      description: a.description,
      name: a.type,
      effect: () => {},
    })),
    attacks: spirit.attacks
      ? {
          Form: spirit.attacks.Form,
          Meaning: spirit.attacks.Meaning,
          Reading: spirit.attacks.Reading,
        }
      : undefined,
    maxRarity: Math.max(spirit.rarity, 6), // Definir la rareza máxima permitida, considerando un crecimiento futuro
    image: "",
  };
}

export function summonSpirit(playerInventory: Character[]): SummonResult {
  const availableSpirits = spiritsData.filter(
    (s: {
      usage: string;
      rarity: number;
      summon_probability: number;
      spirit_id: string;
      required_items_for_rarity_increase?: RequiredItem[];
    }) =>
      s.usage === "BattleAndFusion" ||
      s.usage === "SummonEligible" ||
      s.usage === "TrainingRanger", // Incluir Training Rangers
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
  const guaranteedRareIndex =
    count === 10 ? Math.floor(Math.random() * 10) : -1;

  Array.from({ length: count }).forEach((_, i) => {
    if (i === guaranteedRareIndex) {
      const rareSpirits = spiritsData.filter(
        (s: {
          usage: string;
          rarity: number;
          summon_probability: number;
          spirit_id: string;
          required_items_for_rarity_increase?: RequiredItem[];
        }) =>
          (s.usage === "BattleAndFusion" || s.usage === "SummonEligible") &&
          s.rarity >= 4, // No incluir Training Rangers en la invocación garantizada de rareza
      );
      if (rareSpirits.length === 0) {
        // console.warn statement removed to comply with eslint no-console rule
        results.push(summonSpirit(playerInventory)); // Incluir Training Rangers en invocaciones normales
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
      results.push(summonSpirit(playerInventory)); // Incluir Training Rangers en invocaciones normales
    }
  });

  return results;
}
