// src/firebase.ts

import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getAuth, onAuthStateChanged } from "firebase/auth"

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  type: import.meta.env.VITE_TYPE,
  projectId: import.meta.env.VITE_PROJECT_ID,
  private_key_id: import.meta.env.PRIVATE_KEY_ID,
  private_key: import.meta.env.VITE_PRIVATE_KEY,
  client_email: import.meta.env.VITE_CLIENT_EMAIL,
  client_id: import.meta.env.VITE_CLIENT_ID,
  auth_uri: import.meta.env.VITE_AUTH_URI,
  token_uri: import.meta.env.VITE_TOKEN_URI,
  auth_provider_x509_cert_url: import.meta.env.VITE_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: import.meta.env.VITE_CLIENT_X509_CERT_URL,
  universe_domain: import.meta.env.VITE_UNIVERSE_DOMAIN,
}

const app = initializeApp(firebaseConfig as any)

const db = getFirestore(app, "skanuj-wygrywaj")
const auth = getAuth(app)

export { db, auth, onAuthStateChanged }
