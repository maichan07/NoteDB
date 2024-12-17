// FirebaseConfig.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, addDoc, updateDoc, getDoc, deleteDoc, doc } from 'firebase/firestore'; 
import { getStorage, ref, uploadBytes } from 'firebase/storage'; 

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAe78TGY4DxNSxziEZ9UIg50aizA9j9DJk",
  authDomain: "soulnote-10ed3.firebaseapp.com",
  projectId: "soulnote-10ed3",
  storageBucket: "soulnote-10ed3.appspot.com", 
  appId: "1:661159002985:android:effc9bf69af4614fd473f8",
  messagingSenderId: "661159002985",
};

// Initialize Firebase app
const FIREBASE_APP = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
const FIREBASE_AUTH = getAuth(FIREBASE_APP);

// Initialize Firestore
const FIREBASE_DB = getFirestore(FIREBASE_APP);

// Initialize Firebase Storage
const FIREBASE_STORAGE = getStorage(FIREBASE_APP);

// Export the initialized instances
export { 
  FIREBASE_APP, 
  FIREBASE_AUTH, 
  FIREBASE_DB, 
  FIREBASE_STORAGE, 
  collection, 
  addDoc, 
  getDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getStorage, 
  ref, 
  uploadBytes 
};
