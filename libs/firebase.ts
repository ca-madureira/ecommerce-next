import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDuTw-AiskirKrQ3h5XvxbXEXLcQ69hhsI",
  authDomain: "ecomme-18153.firebaseapp.com",
  projectId: "ecomme-18153",
  storageBucket: "ecomme-18153.appspot.com",
  messagingSenderId: "789428208076",
  appId: "1:789428208076:web:15f0b2051d403919ff1d69",
};

// Inicialize o Firebase
const firebaseApp = initializeApp(firebaseConfig);
const storage = getStorage(firebaseApp);

export { firebaseApp, storage };
