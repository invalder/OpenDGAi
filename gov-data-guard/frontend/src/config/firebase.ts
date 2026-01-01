import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';
import { getStorage, connectStorageEmulator } from 'firebase/storage';

// Helper to access env vars safely in both Vite and Jest
const getEnv = (key: string, defaultVal: string) => {
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env[key] || defaultVal;
  }
  // Fallback for Jest (if process is defined)
  if (typeof process !== 'undefined' && process.env) {
    return process.env[key] || defaultVal;
  }
  return defaultVal;
};

const isDev = () => {
    if (typeof import.meta !== 'undefined' && import.meta.env) {
        return import.meta.env.DEV;
    }
    return process.env.NODE_ENV !== 'production';
}

const firebaseConfig = {
  apiKey: getEnv("VITE_FIREBASE_API_KEY", "demo-key"),
  authDomain: getEnv("VITE_FIREBASE_AUTH_DOMAIN", "demo-project.firebaseapp.com"),
  projectId: getEnv("VITE_FIREBASE_PROJECT_ID", "demo-project"),
  storageBucket: getEnv("VITE_FIREBASE_STORAGE_BUCKET", "demo-project.appspot.com"),
  messagingSenderId: getEnv("VITE_FIREBASE_MESSAGING_SENDER_ID", "1234567890"),
  appId: getEnv("VITE_FIREBASE_APP_ID", "1:1234567890:web:123456"),
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app);
export const storage = getStorage(app);

// Use emulators in development
if (isDev()) {
    try {
        // Note: These ports should match firebase.json / emulator defaults
        connectAuthEmulator(auth, "http://127.0.0.1:9099");
        connectFirestoreEmulator(db, '127.0.0.1', 8080);
        connectFunctionsEmulator(functions, '127.0.0.1', 5001);
        connectStorageEmulator(storage, '127.0.0.1', 9199);
    } catch (e) {
        console.warn("Error connecting to emulators", e);
    }
}
