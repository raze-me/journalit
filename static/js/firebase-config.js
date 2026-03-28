// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCp4swyn_Wx6Z9YiXz34d4nOkQPyBFK7Ro",
  authDomain: "journalit-84e95.firebaseapp.com",
  projectId: "journalit-84e95",
  storageBucket: "journalit-84e95.firebasestorage.app",
  messagingSenderId: "127432866050",
  appId: "1:127432866050:web:06ab97437935d2a4feaa1b",
  measurementId: "G-KM8EK45FD8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);