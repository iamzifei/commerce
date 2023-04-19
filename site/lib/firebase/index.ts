import { initializeApp, FirebaseApp } from 'firebase/app'
import { getStorage, FirebaseStorage } from 'firebase/storage'

import {
  initializeAppCheck,
  ReCaptchaEnterpriseProvider,
  AppCheck,
} from 'firebase/app-check'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

let app: FirebaseApp, storage: FirebaseStorage, analytics, appCheck: AppCheck

// Initialize Firebase

if (typeof window !== undefined) {
  app = initializeApp(firebaseConfig)
  storage = getStorage(app)
  if (app) {
    appCheck = initializeAppCheck(app, {
      provider: new ReCaptchaEnterpriseProvider(
        process.env.NEXT_PUBLIC_FIREBASE_RECAPTCHA_SITE_KEY as string
      ),
      isTokenAutoRefreshEnabled: true, // Set to true to allow auto-refresh.
    })
  }
}

export { app, storage, appCheck }
