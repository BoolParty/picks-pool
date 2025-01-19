// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyAphfs0gPfrrmpGBsKRHavL-GCuC3P2wk4",
    authDomain: "picks-pool.firebaseapp.com",
    projectId: "picks-pool",
    storageBucket: "picks-pool.firebasestorage.app",
    messagingSenderId: "644311403174",
    appId: "1:644311403174:web:7b9e98e12080c619b40267",
    measurementId: "G-7X74VK0CB2"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);