/* eslint-disable no-console */
import {
  collection,
  doc,
  getDoc,
  getDocs,
  runTransaction,
  query,
  where,
} from "firebase/firestore";
import { auth, db } from "./firebase.ts";
import { Material } from "../types.ts";

const MATERIAL_PROBABILITIES = {
  1: 0.4, // Common: 40%
  2: 0.3, // Uncommon: 30%
  3: 0.2, // Rare: 20%
  4: 0.08, // Epic: 8%
  5: 0.02, // Legendary: 2%
};

const cachedFilteredMaterials: { [key: number]: Material[] } = {};

function getRandomMaterial(
  materials: Material[],
  guaranteedMinRarity = 1,
): Material {
  if (!cachedFilteredMaterials[guaranteedMinRarity]) {
    cachedFilteredMaterials[guaranteedMinRarity] = materials.filter(
      (material) => material.rarity >= guaranteedMinRarity,
    );
  }
  const filteredMaterials = cachedFilteredMaterials[guaranteedMinRarity];

  const random = Math.random();
  let probabilitySum = 0;

  for (let rarity = guaranteedMinRarity; rarity <= 5; rarity += 1) {
    probabilitySum +=
      MATERIAL_PROBABILITIES[rarity as keyof typeof MATERIAL_PROBABILITIES];
    const materialsOfRarity = filteredMaterials.filter(
      (m) => m.rarity === rarity,
    );

    if (random <= probabilitySum && materialsOfRarity.length > 0) {
      return materialsOfRarity[
        Math.floor(Math.random() * materialsOfRarity.length)
      ];
    }
  }

  return filteredMaterials[
    Math.floor(Math.random() * filteredMaterials.length)
  ];
}

function getGuaranteedMinRarity(): number {
  return Math.random() < 0.2 ? 3 : 1;
}

export async function purchaseMaterials(
  amount: number,
  useEssence: boolean,
): Promise<Material[]> {
  if (!auth.currentUser) {
    throw new Error("User not authenticated");
  }

  try {
    const materialsRef = collection(db, "materials");
    const q = query(materialsRef, where("available", "==", true));
    const materialsSnapshot = await getDocs(q);
    const materials = materialsSnapshot.docs.map((materialDoc) => ({
      ...materialDoc.data(),
      material_id: materialDoc.id,
    })) as Material[];

    const userRef = doc(db, "users", auth.currentUser.uid);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      throw new Error(
        "User document does not exist. Please register the user first.",
      );
    }

    const result = await runTransaction(db, async (transaction) => {
      const userSnapshot = await transaction.get(userRef);
      const userData = userSnapshot.data() || {
        coins: 1000,
        essence: 50,
        materials: [],
      };

      const costMap: { [key: number]: number } = { 1: 100, 10: 900, 50: 4000 };
      const essenceCostMap: { [key: number]: number } = {
        1: 1,
        10: 10,
        50: 50,
      };

      const cost = costMap[amount] || 0;
      const essenceCost = essenceCostMap[amount] || 0;

      if (useEssence && userData.essence < essenceCost) {
        throw new Error("Not enough essence");
      }

      if (!useEssence && userData.coins < cost) {
        throw new Error("Not enough coins");
      }

      if (cost < 0 || essenceCost < 0) {
        throw new Error("Invalid cost or essence cost");
      }

      const purchasedMaterials: Material[] = [];

      // Generate materials based on amount
      if (amount === 1) {
        purchasedMaterials.push(getRandomMaterial(materials));
      } else if (amount === 10) {
        // One guaranteed rare material
        purchasedMaterials.push(getRandomMaterial(materials, 3));
        // Nine regular materials
        for (let i = 0; i < 9; i += 1) {
          purchasedMaterials.push(getRandomMaterial(materials));
        }
      } else {
        // Fifty materials with increased chances
        for (let i = 0; i < 50; i += 1) {
          const guaranteedMinRarity = getGuaranteedMinRarity();
          purchasedMaterials.push(
            getRandomMaterial(materials, guaranteedMinRarity),
          );
        }
      }

      // Update user's currency and materials
      transaction.update(userRef, {
        coins: useEssence ? userData.coins : userData.coins - cost,
        essence: useEssence ? userData.essence - essenceCost : userData.essence,
        materials: [...(userData.materials || []), ...purchasedMaterials],
      });

      return purchasedMaterials;
    });

    return result;
  } catch (error) {
    console.error("Purchase error:", error);
    throw error;
  }
}

export async function getUserMaterials(): Promise<Material[]> {
  if (!auth.currentUser) {
    throw new Error("User not authenticated");
  }

  const userRef = doc(db, "users", auth.currentUser.uid);
  const userDoc = await getDoc(userRef);

  if (!userDoc.exists()) {
    return [];
  }

  return userDoc.data().materials || [];
}
