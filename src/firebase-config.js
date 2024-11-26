// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"
import {getAuth, GoogleAuthProvider} from 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD3LGCiS2bP8lIzj7fREBt8ra0kYKvTTFw",
  authDomain: "blog-project-a8ec7.firebaseapp.com",
  projectId: "blog-project-a8ec7",
  storageBucket: "blog-project-a8ec7.firebasestorage.app",
  messagingSenderId: "231138174660",
  appId: "1:231138174660:web:ea4e94afda606f16e6cb91"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app)
export const provider = new GoogleAuthProvider();