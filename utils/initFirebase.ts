import firebase from 'firebase/app'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

const initFirebase = () => {
  if (firebase.apps.length === 0) {
    firebase.initializeApp(firebaseConfig)
  }

  if (process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === 'true') {
    firebase.functions().useEmulator('127.0.0.1', 5001)
    firebase.firestore().useEmulator('127.0.0.1', 8080)
  }
}

export default initFirebase
