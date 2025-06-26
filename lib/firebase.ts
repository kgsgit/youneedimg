import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC8TLZxkDPLQVFe-xLqHzVs0EZcIOhaZ2Y",
  authDomain: "youneedimg.firebaseapp.com",
  projectId: "youneedimg",
  storageBucket: "youneedimg.firebasestorage.app",
  messagingSenderId: "672498078028",
  appId: "1:672498078028:web:61f1783cba4bb9d83a7fe9"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
