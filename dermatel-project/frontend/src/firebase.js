// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyAS6gFYrJI9UmgKAo773B3O5NXCiFs-sgg",
    authDomain: "dermatel-app.firebaseapp.com",
    projectId: "dermatel-app",
    storageBucket: "dermatel-app.appspot.com",
    messagingSenderId: "785740951030",
    appId: "1:785740951030:web:0f0227a50dfe898e276bd7",
    measurementId: "G-PYNRV5CTT3"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };