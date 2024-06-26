// src/firebase.ts

import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getAuth, onAuthStateChanged } from "firebase/auth"

// const firebaseConfig = {
//   apiKey: import.meta.env.VITE_APIKEY,
//   authDomain: import.meta.env.VITE_AUTHDOMAIN,
//   projectId: import.meta.env.VITE_PROJECTID,
//   storageBucket: import.meta.env.VITE_STORAGEBUCKET,
//   messagingSenderId: import.meta.env.VITE_MESSAGINGSENDERID,
//   appId: import.meta.env.VITE_APPID,
//   measurementId: import.meta.env.VITE_MEASUREMENTID,
//   databaseURL: import.meta.env.VITE_DATABASE_URL,
// };

const firebaseConfig = {
  type: import.meta.env.TYPE,
  project_id: import.meta.env.FIREBASE_PROJECT_ID,
  private_key_id: import.meta.env.PRIVATE_KEY_ID,
  private_key: import.meta.env.FIREBASE_PRIVATE_KEY
    ? import.meta.env.FIREBASE_PRIVATE_KEY.replace(/\\n/gm, "\n")
    : undefined,
  client_email: import.meta.env.CLIENT_EMAIL,
  client_id: import.meta.env.CLIENT_ID,
  auth_uri: import.meta.env.AUTH_URI,
  token_uri: import.meta.env.TOKEN_URI,
  auth_provider_x509_cert_url: import.meta.env.AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: import.meta.env.CLIENT_X509_CERT_URL,
  universe_domain: import.meta.env.UNIVERSE_DOMAIN,
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)
export { db, auth, onAuthStateChanged }
