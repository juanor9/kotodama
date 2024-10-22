import { auth, db } from './firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, User } from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { Character, GameState } from '../types';

export async function registerUser(email: string, password: string, username: string) {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  await setDoc(doc(db, 'users', user.uid), {
    username,
    coins: 1000,
    essence: 50,
    characters: [],
  });
  return user;
}

export async function loginUser(email: string, password: string) {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
}

export async function resetPassword(email: string) {
  await sendPasswordResetEmail(auth, email);
}

export async function getUserData(userId: string): Promise<GameState> {
  const docRef = doc(db, 'users', userId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data() as GameState;
  } else {
    throw new Error('User data not found');
  }
}

export async function updateUserData(userId: string, data: Partial<GameState>) {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, data);
}

export async function addCharacterToInventory(userId: string, character: Character) {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, {
    characters: firebase.firestore.FieldValue.arrayUnion(character)
  });
}

export async function updateCurrency(userId: string, coins: number, essence: number) {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, { coins, essence });
}