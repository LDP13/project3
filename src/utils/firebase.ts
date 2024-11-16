import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBKHez8V-2Orz1xF4_B0GEAzclsCXt65as",
  authDomain: "dactylofast.firebaseapp.com",
  projectId: "dactylofast",
  storageBucket: "dactylofast.firebasestorage.app",
  messagingSenderId: "1064079741861",
  appId: "1:1064079741861:web:2a2f7a5be648479e10ce4c",
  measurementId: "G-1X0WXVRZM4"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});
export const db = getFirestore(app);