import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC5J7dQe1NPsUek9HrIsfnIp54Tnc-TA7k",
    authDomain: "wishes-app-2b4ae.firebaseapp.com",
    projectId: "wishes-app-2b4ae",
    storageBucket: "wishes-app-2b4ae.firebasestorage.app",
    messagingSenderId: "287255193242",
    appId: "1:287255193242:web:e6e968044ea2e1747ea123"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
