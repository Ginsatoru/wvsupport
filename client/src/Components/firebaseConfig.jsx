// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDI_zq39W_mngFJ7EwdYC-_UaHQ8LOncBU",
  authDomain: "wv-support-services-cambodia.firebaseapp.com",
  projectId: "wv-support-services-cambodia",
  storageBucket: "wv-support-services-cambodia.firebasestorage.app",
  messagingSenderId: "1054336743567",
  appId: "1:1054336743567:web:b11d27e1136a582915d8fa",
  measurementId: "G-59ZK9YL221"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
