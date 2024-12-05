import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBFCwH_ybv0ksXZlqmWgOGyhECNux14Vxg",
  authDomain: "bloxuifigma.firebaseapp.com",
  projectId: "bloxuifigma",
  storageBucket: "bloxuifigma.firebasestorage.app",
  messagingSenderId: "697855583686",
  appId: "1:697855583686:web:23ed2d3d084e3df1287ec7",
  measurementId: "G-C4PV2G7N0P"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
