// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDpGiXCfDnBFUdbd-IDMZOcaSfyJAdd0No",
  authDomain: "freshcartdb.firebaseapp.com",
  projectId: "freshcartdb",
  storageBucket: "freshcartdb.firebasestorage.app",
  messagingSenderId: "618235065957",
  appId: "1:618235065957:web:150eda679e3cd12a11b88c",
  measurementId: "G-6FKN56DSJZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);