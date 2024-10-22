import { Character, SummonResult, ElementType, SpiritType, Rarity } from '../types';
import spiritsData from '../data/spirits.json';

function weightedRandomSelection<T>(items: T[], weightFn: (item: T) => number): T {
  const totalWeight = items.reduce((sum, item) => sum + weightFn(item), 0);
  let random = Math.random() * totalWeight;
  
  for (const item of items) {
    random -= weightFn(item);
    if (random <= 0) {
      return item;
    }
  }
  
  return items[items.length - 1];
}

function createCharacterFromSpirit(spirit: any): Character {
  return {
    id: spirit.spirit_id,
    name: spirit.name,
    type: spirit.type as SpiritType,
    element: spirit.element as ElementType,
    rarity: spirit.rarity as Rarity,
    shape: spirit.name, // Using name as shape for now
    meaning: spirit.abilities.find((a: any) => a.type === "Meaning")?.description || "",
    reading: spirit.abilities.find((a: any) => a.type === "Reading")?.description,
    level: 1,
    experience: 0,
    abilities: spirit.abilities,
    attacks: spirit.attacks,
    specialAbility: spirit.abilities.find((a: any) => a.type === "Special"),
    doppleAbility: spirit.abilities.find((a: any) => a.type === "Dopple"),
    maxRarity: Math.max(...Object.keys(spirit.max_level_per_rarity).map(k => parseInt(k.split('_')[1]))),
    artUrl: spirit.art_variants.find((av: any) => av.rarity_level === spirit.rarity)?.art_url
  };
}

export function summonSpirit(playerInventory: Character[]): SummonResult {
  const availableSpirits = spiritsData.filter(s => s.usage === "BattleAndFusion");
  const selectedSpirit = weightedRandomSelection(availableSpirits, s => s.summon_probability);
  const character = createCharacterFromSpirit(selectedSpirit);
  const isNew = !playerInventory.some(c => c.id === character.id);
  
  return { character, isNew };
}

export function summonMultipleSpirits(count: number, playerInventory: Character[]): SummonResult[] {
  const results: SummonResult[] = [];
  let guaranteedRareIndex = count === 10 ? Math.floor(Math.random() * 10) : -1;

  for (let i = 0; i < count; i++) {
    if (i === guaranteedRareIndex) {
      const rareSpirits = spiritsData.filter(s => s.usage === "BattleAndFusion" && s.rarity >= 4);
      const selectedSpirit = weightedRandomSelection(rareSpirits, s => s.summon_probability);
      const character = createCharacterFromSpirit(selectedSpirit);
      const isNew = !playerInventory.some(c => c.id === character.id);
      results.push({ character, isNew });
    } else {
      results.push(summonSpirit(playerInventory));
    }
  }

  return results;
}

export function getMaterialsForRarityIncrease(character: Character): { material_id: string; quantity: number }[] | null {
  const spirit = spiritsData.find(s => s.spirit_id === character.id);
  if (!spirit || !spirit.required_items_for_rarity_increase) {
    return null;
  }

  const nextRarity = character.rarity + 1;
  const materialsForNextRarity = spirit.required_items_for_rarity_increase.find(
    item => item.rarity_level === nextRarity
  );

  return materialsForNextRarity ? materialsForNextRarity.materials : null;
}