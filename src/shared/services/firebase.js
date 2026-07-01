// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBBN0OXF3obiyvkUijf4n0KohTtw42EUB4",
  authDomain: "carimakan-3b393.firebaseapp.com",
  projectId: "carimakan-3b393",
  storageBucket: "carimakan-3b393.firebasestorage.app",
  messagingSenderId: "273407304317",
  appId: "1:273407304317:web:fc7c66d3d6338421214714",
  measurementId: "G-748SVJG2Y1"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
