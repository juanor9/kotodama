import { Character } from "../types.ts";

interface Spirit extends Character {
  summon_probability: number;
  usage: string;
}

export function assertIsSpirit(object: unknown): asserts object is Spirit {
  if (
    !(object && typeof object === "object") ||
    !(
      "summon_probability" in object &&
      typeof (object as Record<string, unknown>).summon_probability === "number"
    ) ||
    !(
      "usage" in object &&
      typeof (object as Record<string, unknown>).usage === "string"
    ) ||
    !(
      "rarity" in object &&
      typeof (object as Record<string, unknown>).rarity === "number"
    )
  ) {
    throw new Error("Object is not a valid Spirit");
  }
}
