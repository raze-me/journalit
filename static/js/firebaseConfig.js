import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCp4swyn_Wx6Z9YiXz34d4nOkQpYBFK7Ro",
  authDomain: "journalit-84e95.firebaseapp.com",
  projectId: "journalit-84e95",
  storageBucket: "journalit-84e95.firebasestorage.app",
  messagingSenderId: "127432866050",
  appId: "1:127432866050:web:c5e0a092443f8340feaa1b",
  measurementId: "G-07365RVFHB"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app };