// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyACuJux4yiBHDePC59-N3TGWjQ1AEitIAc",
  authDomain: "pantry-tracker-4d9be.firebaseapp.com",
  projectId: "pantry-tracker-4d9be",
  storageBucket: "pantry-tracker-4d9be.appspot.com",
  messagingSenderId: "753238117750",
  appId: "1:753238117750:web:a5f71ed26cd5ccf8913e57",
  measurementId: "G-RDMZ13E291"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export {db};