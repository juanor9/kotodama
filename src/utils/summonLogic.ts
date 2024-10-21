import { Character, SummonResult, ElementType, SpiritType, Rarity, AttackType } from '../types';
import spiritsData from '../data/spirits.json';

// ... (previous code remains the same)

export function summonSpirit(playerInventory: Character[]): SummonResult {
  // ... (previous code remains the same)
}

export function summonMultipleSpirits(count: number, playerInventory: Character[]): SummonResult[] {
  const results: SummonResult[] = [];
  for (let i = 0; i < count; i++) {
    results.push(summonSpirit(playerInventory));
  }

  // Ensure at least one 4★ or higher if summoning 10
  if (count === 10 && !results.some(result => result.character.rarity >= 4)) {
    const indexToReplace = Math.floor(Math.random() * 10);
    do {
      results[indexToReplace] = summonSpirit(playerInventory);
    } while (results[indexToReplace].character.rarity < 4);
  }

  return results;
}

export function getMaterialsForRarityIncrease(character: Character): { material_id: string; quantity: number }[] | null {
  const spirit = spiritsData.find(s => s.name === character.name);
  if (!spirit || !spirit.required_items_for_rarity_increase) {
    return null;
  }

  const nextRarity = character.rarity + 1;
  const materialsForNextRarity = spirit.required_items_for_rarity_increase.find(
    item => item.rarity_level === nextRarity
  );

  return materialsForNextRarity ? materialsForNextRarity.materials : null;
}