// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDWCPH8WdS5YEPa27k0INK1eQT2smC5-0c",
  authDomain: "job-tracker-74.firebaseapp.com",
  projectId: "job-tracker-74",
  storageBucket: "job-tracker-74.firebasestorage.app",
  messagingSenderId: "15392080888",
  appId: "1:15392080888:web:adc54de54503b6aab80c0d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);