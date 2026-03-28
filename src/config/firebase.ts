import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCcTTvU3MLLB85A-VP5T03gXG3X906IXEs",
  authDomain: "loan-assistant-daf0b.firebaseapp.com",
  projectId: "loan-assistant-daf0b",
  storageBucket: "loan-assistant-daf0b.firebasestorage.app",
  messagingSenderId: "842536025713",
  appId: "1:842536025713:web:d10cd93270f567975d65d0",
  measurementId: "G-Y4VJ1PH83H"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
// export const analytics = getAnalytics(app);
