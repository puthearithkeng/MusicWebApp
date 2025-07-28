// firebase/firebaseadmin.js

import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname in ESM:
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Resolve path to your Firebase service account key JSON file
// IMPORTANT: Replace '../firebase_service_acc.json' with the actual path
// to your Firebase service account key JSON file.
// You can download this from Firebase Console -> Project settings -> Service accounts.
const serviceAccountPath = path.resolve(__dirname, '../firebase_service_acc.json');

let serviceAccount;
try {
  serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
} catch (error) {
  console.error('Failed to read or parse Firebase service account key:', error);
  console.error(`Expected service account key at: ${serviceAccountPath}`);
  process.exit(1); // Exit if service account key cannot be loaded
}

// Initialize Firebase Admin only once
if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount),
    // Optional: Specify your storage bucket URL if it's not the default
    // storageBucket: "your-project-id.appspot.com"
  });
  console.log('✅ Firebase Admin Initialized');
} else {
  console.log('Firebase Admin already initialized');
}

const auth = getAuth();

export { auth };
