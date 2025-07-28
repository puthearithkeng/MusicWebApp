import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  onAuthStateChanged,
  signInAnonymously,
  signInWithCustomToken,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import { auth as firebaseAuthInstance } from '../firebase/firebase';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // This will hold the backend user info (overrides firebaseUser on signup/login)
  const [backendUser, setBackendUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuthInstance, (user) => {
      console.log('AuthContext - onAuthStateChanged:', user);
      if (user) {
        // On Firebase auth change, clear backendUser and set firebase user for now
        setBackendUser(null);
        setCurrentUser(user);
      } else {
        // User signed out, clear all
        setBackendUser(null);
        setCurrentUser(null);
      }
      setLoading(false);
    });

    // Initial anonymous or custom token sign-in logic here...
    const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

    if (initialAuthToken) {
      signInWithCustomToken(firebaseAuthInstance, initialAuthToken).catch((err) => {
        console.error('Error signing in with custom token:', err);
        signInAnonymously(firebaseAuthInstance).catch((anonErr) => {
          console.error('Error signing in anonymously:', anonErr);
        });
      });
    } else {
      signInAnonymously(firebaseAuthInstance).catch((anonErr) => {
        console.error('Error signing in anonymously:', anonErr);
      });
    }

    return () => unsubscribe();
  }, []);

  // This is called after signup or login with backend user object
  // It replaces currentUser with backend user (which may have different UID or extra info)
  const login = (userFromBackend) => {
    console.log('AuthContext: login called with backend user:', userFromBackend);
    setBackendUser(userFromBackend); // Set backend user
    setCurrentUser(null);            // Clear Firebase user to avoid confusion
  };

  // Logout clears both states
  const logOut = async () => {
    try {
      localStorage.removeItem('authToken');
      await firebaseSignOut(firebaseAuthInstance);
      setCurrentUser(null);
      setBackendUser(null);
      console.log('AuthContext: logged out');
    } catch (error) {
      console.error('AuthContext: error during logout:', error);
      throw error;
    }
  };

  // Expose the backendUser if set, else fallback to Firebase user
  const effectiveUser = backendUser || currentUser;

  const value = {
    currentUser: effectiveUser,
    isAuthenticated: !!effectiveUser,
    loading,
    login,
    logOut,
  };

  console.log('AuthContext: Rendered with effectiveUser:', effectiveUser);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
