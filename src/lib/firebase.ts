
import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  projectId: "conectazap-fzf9v",
  appId: "1:724526126513:web:30fc7d7da531148f73d990",
  storageBucket: "conectazap-fzf9v.firebasestorage.app",
  apiKey: "AIzaSyAHjFZwbxR56GEol8VnY-YagLO2DrJHLJY",
  authDomain: "conectazap-fzf9v.firebaseapp.com",
  messagingSenderId: "724526126513"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
