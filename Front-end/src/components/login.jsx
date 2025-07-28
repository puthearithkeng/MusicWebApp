import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth as firebaseAuthInstance } from '../firebase/firebase'; // Your firebase config

const LoginPage = ({ onAuthSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const navigate = useNavigate();

  const syncUserToBackend = async (firebaseUser) => {
    try {
      const idToken = await firebaseUser.getIdToken();
      const response = await fetch('http://localhost:3000/api/auth/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          firebaseUid: firebaseUser.uid,
          email: firebaseUser.email,
          username: firebaseUser.displayName || firebaseUser.email.split('@')[0],
          profile_image: firebaseUser.photoURL || null,
          sign_in_provider: firebaseUser.providerData[0]?.providerId || 'email_password',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Backend sync failed');
      }

      const data = await response.json();
      return data.user;
    } catch (err) {
      console.error('Backend sync error:', err);
      throw err;
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    if (!email || !password) {
      setError('Please enter both email and password.');
      setLoading(false);
      return;
    }

    try {
      // Firebase email/password sign-in
      const userCredential = await signInWithEmailAndPassword(firebaseAuthInstance, email, password);
      const firebaseUser = userCredential.user;

      // Sync user with backend using Firebase ID token
      const backendUser = await syncUserToBackend(firebaseUser);

      // Notify parent or global state
      onAuthSuccess?.(backendUser);

      setSuccessMessage('Logged in successfully!');
      setEmail('');
      setPassword('');
      navigate('/music');
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  // Optional: Google Sign-In
  const handleGoogleSignIn = async () => {
    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(firebaseAuthInstance, provider);
      const firebaseUser = result.user;

      const backendUser = await syncUserToBackend(firebaseUser);

      onAuthSuccess?.(backendUser);

      setSuccessMessage('Signed in with Google successfully!');
      navigate('/music');
    } catch (err) {
      console.error('Google sign-in error:', err);
      setError(err.message || 'Google sign-in failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl max-w-md w-full">
        <h2 className="text-3xl font-bold mb-6 text-center text-red-500">Login</h2>

        <form onSubmit={handleLogin} className="space-y-4" noValidate>
          <div>
            <label htmlFor="email" className="block text-gray-300 text-sm font-bold mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="shadow appearance-none border border-gray-700 rounded-md w-full py-3 px-4 text-gray-200 leading-tight focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-700"
              placeholder="your@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-gray-300 text-sm font-bold mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="shadow appearance-none border border-gray-700 rounded-md w-full py-3 px-4 text-gray-200 leading-tight focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-700"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm text-center" role="alert" aria-live="assertive">
              {error}
            </p>
          )}

          {successMessage && (
            <p className="text-green-400 text-sm text-center" role="alert" aria-live="assertive">
              {successMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-md focus:outline-none focus:shadow-outline transition duration-200"
          >
            {loading ? 'Logging In...' : 'Login'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <div className="relative flex py-5 items-center">
            <div className="flex-grow border-t border-gray-600"></div>
            <span className="flex-shrink mx-4 text-gray-400">OR</span>
            <div className="flex-grow border-t border-gray-600"></div>
          </div>

          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            type="button"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md flex items-center justify-center space-x-2 focus:outline-none focus:shadow-outline transition duration-200"
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M12.24 10.285V14.4h6.806c-.275 1.764-1.847 4.773-6.806 4.773-4.163 0-7.542-3.32-7.542-7.408s3.379-7.408 7.542-7.408c2.906 0 4.513 1.233 5.484 2.15l3.097-3.096c-1.775-1.65-4.014-2.83-8.581-2.83-7.035 0-12.72 5.618-12.72 12.5S5.205 22 12.24 22c7.218 0 12.15-5.093 12.15-12.292 0-.756-.07-1.486-.197-2.198H12.24z" />
            </svg>
            <span>Sign in with Google</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
