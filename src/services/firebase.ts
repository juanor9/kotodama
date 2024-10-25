import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Create a notification element if it doesn't exist
const createNotificationElement = () => {
  const existingElement = document.getElementById("notification");
  if (!existingElement) {
    const element = document.createElement("div");
    element.id = "notification";
    element.style.display = "none";
    element.style.position = "fixed";
    element.style.top = "20px";
    element.style.right = "20px";
    element.style.padding = "10px";
    element.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
    element.style.color = "white";
    element.style.borderRadius = "5px";
    element.style.zIndex = "1000";
    document.body.appendChild(element);
  }
};

// Initialize notification element
createNotificationElement();

function displayNotification(message: string) {
  const notificationElement = document.getElementById("notification");
  if (notificationElement) {
    notificationElement.innerText = message;
    notificationElement.style.display = "block";
    setTimeout(() => {
      notificationElement.style.display = "none";
    }, 3000);
  }
}

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Set up auth state observer
auth.onAuthStateChanged(
  (user) => {
    if (user) {
      displayNotification(`Signed in as ${user.email}`);
    } else {
      displayNotification("Signed out");
    }
  },
  (error) => {
    displayNotification(`Auth error: ${error.message}`);
  },
);

// Export Firebase instances and utilities
export { app, analytics, displayNotification };
