// src/firebase/auth.js
import { signOut } from 'firebase/auth';
import { auth } from './firebase';

export function logOut() {
  return signOut(auth)
    .then(() => {
      console.log("User successfully logged out.");
    })
    .catch((error) => {
      console.error("Logout error:", error);
      throw error;
    });
}
