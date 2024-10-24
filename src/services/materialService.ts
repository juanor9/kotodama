import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  runTransaction,
  setDoc,
} from "firebase/firestore";
import { auth, db } from "./firebase";
import { Material } from "../types";

const MATERIAL_PROBABILITIES = {
  1: 0.4, // Common: 40%
  2: 0.3, // Uncommon: 30%
  3: 0.2, // Rare: 20%
  4: 0.08, // Epic: 8%
  5: 0.02, // Legendary: 2%
};

function getRandomMaterial(materials: Material[], guaranteedMinRarity = 1): Material {
  const filteredMaterials = materials.filter(
    (material) => material.rarity >= guaranteedMinRarity
  );
  
  const random = Math.random();
  let probabilitySum = 0;
  
  for (let rarity = guaranteedMinRarity; rarity <= 5; rarity++) {
    probabilitySum += MATERIAL_PROBABILITIES[rarity as keyof typeof MATERIAL_PROBABILITIES];
    const materialsOfRarity = filteredMaterials.filter((m) => m.rarity === rarity);
    
    if (random <= probabilitySum && materialsOfRarity.length > 0) {
      return materialsOfRarity[Math.floor(Math.random() * materialsOfRarity.length)];
    }
  }
  
  return filteredMaterials[Math.floor(Math.random() * filteredMaterials.length)];
}

export async function purchaseMaterials(
  userId: string,
  amount: number,
  useEssence: boolean
): Promise<Material[]> {
  if (!auth.currentUser) {
    throw new Error("User not authenticated");
  }

  try {
    const materialsRef = collection(db, "materials");
    const materialsSnapshot = await getDocs(materialsRef);
    const materials = materialsSnapshot.docs.map((doc) => ({
      ...doc.data(),
      material_id: doc.id,
    })) as Material[];

    const userRef = doc(db, "users", auth.currentUser.uid);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      // Create user document if it doesn't exist
      await setDoc(userRef, {
        coins: 1000,
        essence: 50,
        materials: [],
      });
    }

    const result = await runTransaction(db, async (transaction) => {
      const userSnapshot = await transaction.get(userRef);
      const userData = userSnapshot.data() || { coins: 1000, essence: 50, materials: [] };

      const cost = amount === 1 ? 100 : amount === 10 ? 900 : 4000;
      const essenceCost = amount === 1 ? 1 : amount === 10 ? 10 : 50;

      if (useEssence && userData.essence < essenceCost) {
        throw new Error("Not enough essence");
      }

      if (!useEssence && userData.coins < cost) {
        throw new Error("Not enough coins");
      }

      const purchasedMaterials: Material[] = [];

      // Generate materials based on amount
      if (amount === 1) {
        purchasedMaterials.push(getRandomMaterial(materials));
      } else if (amount === 10) {
        // One guaranteed rare material
        purchasedMaterials.push(getRandomMaterial(materials, 3));
        // Nine regular materials
        for (let i = 0; i < 9; i++) {
          purchasedMaterials.push(getRandomMaterial(materials));
        }
      } else {
        // Fifty materials with increased chances
        for (let i = 0; i < 50; i++) {
          const guaranteedMinRarity = Math.random() < 0.2 ? 3 : 1;
          purchasedMaterials.push(getRandomMaterial(materials, guaranteedMinRarity));
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

export async function getUserMaterials(userId: string): Promise<Material[]> {
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