/* eslint-disable no-console */
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  arrayUnion,
  increment,
} from "firebase/firestore";
import { auth, db } from "./firebase.ts";
import { Character, GameState } from "../types.ts";

export async function registerUser(
  email: string,
  password: string,
  username: string,
) {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const { user } = userCredential;
    await setDoc(doc(db, "users", user.uid), {
      username,
      coins: 1000,
      essence: 50,
      characters: [],
    });
    return user;
  } catch (error: unknown) {
    console.error(
      "Error registering user: ",
      error instanceof Error ? error.message : error,
    );
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("An unknown error occurred while registering user.");
    }
  }
}

export async function loginUser(email: string, password: string) {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );
    return userCredential.user;
  } catch (error: unknown) {
    console.error(
      "Error logging in: ",
      error instanceof Error ? error.message : error,
    );
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("An unknown error occurred while logging in.");
    }
  }
}

export async function resetPassword(email: string) {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error: unknown) {
    console.error(
      "Error sending password reset email: ",
      error instanceof Error ? error.message : error,
    );
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(
        "An unknown error occurred while sending password reset email.",
      );
    }
  }
}

export async function getUserData(userId: string): Promise<GameState | null> {
  try {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as GameState;
    }
    return null; // Usuario no encontrado
  } catch (error: unknown) {
    console.error(
      "Error fetching user data: ",
      error instanceof Error ? error.message : error,
    );
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("An unknown error occurred while fetching user data.");
    }
  }
}

export async function updateUserData(userId: string, data: Partial<GameState>) {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, data);
  } catch (error: unknown) {
    console.error(
      "Error updating user data: ",
      error instanceof Error ? error.message : error,
    );
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("An unknown error occurred while updating user data.");
    }
  }
}

export async function addCharacterToInventory(
  userId: string,
  character: Character,
) {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      characters: arrayUnion(character),
    });
  } catch (error: unknown) {
    console.error(
      "Error adding character to inventory: ",
      error instanceof Error ? error.message : error,
    );
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(
        "An unknown error occurred while adding character to inventory.",
      );
    }
  }
}

export async function updateCurrency(
  userId: string,
  coins: number,
  essence: number,
) {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      coins: increment(coins),
      essence: increment(essence),
    });
  } catch (error: unknown) {
    console.error(
      "Error updating currency: ",
      error instanceof Error ? error.message : error,
    );
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("An unknown error occurred while updating currency.");
    }
  }
}
