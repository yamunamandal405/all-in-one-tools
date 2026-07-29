import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDfCGZMGOJHR8Waw3nF-fHkDfNTW4GpAEU",
  authDomain: "all-in-one-tools-12464.firebaseapp.com",
  projectId: "all-in-one-tools-12464",
  storageBucket: "all-in-one-tools-12464.firebasestorage.app",
  messagingSenderId: "611250912537",
  appId: "1:611250912537:web:8e9c45edbf10351a9a9988",
  measurementId: "G-TVK42FE6CD"
};

// Initialize Firebase App
export const app = initializeApp(firebaseConfig);

// Initialize Analytics safely for web environments
export let analytics = null;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  }).catch((err) => {
    console.warn("Firebase Analytics not supported in current environment:", err);
  });
}

export default app;
