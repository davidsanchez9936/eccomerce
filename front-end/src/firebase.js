import {
  getAuth
} from 'firebase/auth';
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
/* const firebaseConfig = {
  apiKey: "AIzaSyAQoDC2FkL3B9R5hp900SyfD10CF1ZKOYA",
  authDomain: "eccomerce-e2b86.firebaseapp.com",
  projectId: "eccomerce-e2b86",
  storageBucket: "eccomerce-e2b86.appspot.com",
  messagingSenderId: "908384704213",
  appId: "1:908384704213:web:4a6bf73988403c9aaa345c"
}; */


// Initialize Firebase
const app = initializeApp(import.meta.env.VITE_APP_FIREBASECONFIG);
export const auth = getAuth(app);