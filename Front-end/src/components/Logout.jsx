import React from 'react';
import { getAuth, signOut } from "firebase/auth";

export default function LogoutButton() {
  const handleSignOut = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        // Clear JWT token from localStorage
        localStorage.removeItem('token');

        // Redirect to home page
        window.location.href = '/';
      })
      .catch((error) => {
        console.error('Sign out error:', error);
      });
  };

  return <button onClick={handleSignOut}>Sign Out</button>;
}
