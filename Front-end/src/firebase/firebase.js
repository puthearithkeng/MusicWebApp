import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-app.firebaseapp.com",
  projectId: "your-app-id",
  storageBucket: "your-app-id.appspot.com",
  messagingSenderId: "your-msg-id",
  appId: "your-app-id",
  measurementId: "your-measurement-id"
};

export const app = initializeApp(firebaseConfig);

const signin=document.getElementById('signin'); 

export const auth = getAuth(app);
