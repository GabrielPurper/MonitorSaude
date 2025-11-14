// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.24.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.24.0/firebase-auth.js";

import {
  getDatabase,
  ref,
  set,
  update,
  onValue
} from "https://www.gstatic.com/firebasejs/9.24.0/firebase-database.js";

// 🔥 COLE AQUI SUA CONFIG DO FIREBASE
 const firebaseConfig = {
  apiKey: "AIzaSyDCB4e8wCBDpKFTWRGTLAjBEgVUbcQHQno",
  authDomain: "monitorsaude-19ead.firebaseapp.com",
  databaseURL: "https://monitorsaude-19ead-default-rtdb.firebaseio.com",
  projectId: "monitorsaude-19ead",
  storageBucket: "monitorsaude-19ead.firebasestorage.app",
  messagingSenderId: "908296773636",
  appId: "1:908296773636:web:32b4cc9f847faf01c99551"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);

// Exportar Firebases
export {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  ref,
  set,
  update,
  onValue
};
