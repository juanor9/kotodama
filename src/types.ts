/* eslint-disable no-use-before-define */
import { LucideIcon } from "lucide-react";

export type ElementType =
  | "Air"
  | "Water"
  | "Fire"
  | "Earth"
  | "Metal"
  | "Wood"
  | "Light"
  | "Darkness"
  | "Healing";
export type SpiritType = "Component" | "Kanji" | "Word";
export type Rarity = 1 | 2 | 3 | 4 | 5 | 6;
export type AttackType = "Form" | "Meaning" | "Reading";

export interface Material {
  material_id: string;
  name: string;
  japanese_name: string;
  description: string;
  rarity: number;
  element_types: ElementType[];
  obtainable_from: string[];
  image_url: string;
}

export interface Character {
  id: number;
  name: string;
  type: SpiritType;
  element: ElementType;
  rarity: Rarity;
  shape: string;
  meaning: string;
  reading?: string;
  level: number;
  experience: number;
  abilities: Ability[];
  attacks?: { [key in AttackType]?: Ability };
  specialAbility?: Ability;
  doppleAbility?: Ability;
  maxRarity: number;
  image: string;
}

export interface Ability {
  name: string;
  description: string;
  effect: (target: Character) => void;
}

export interface GameState {
  coins: number;
  essence: number;
  characters: Character[];
  materials?: Material[];
  currentScreen: "main" | "summon" | "characters" | "battle" | "profile";
}

export interface SummonResult {
  character: Character;
  isNew: boolean;
}

export interface CurrencyDisplay {
  icon: LucideIcon;
  value: number;
  name: string;
}

export interface DiscAction {
  type: AttackType | "Special" | "Dopple";
  character: Character;
}

export interface BattleState {
  playerTeam: Character[];
  enemyTeam: Character[];
  currentTurn: "player" | "enemy";
  selectedDiscs: DiscAction[];
  magicPoints: number;
}