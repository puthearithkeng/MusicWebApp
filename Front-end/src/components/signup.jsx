import './Allstyle.css';
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signInWithCustomToken,
    GoogleAuthProvider,
    signInWithPopup,
    fetchSignInMethodsForEmail,
    updateProfile
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

import { app as firebaseAppInstance, auth as firebaseAuthInstance } from '../firebase/firebase';

const SignupPage = ({ onAuthSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [username, setUsername] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [user, setUser] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const navigate = useNavigate();

    // 🔁 Function to sync user data to your backend MySQL database
    const syncUserToBackend = async (firebaseUser, formUsername = null) => {
        try {
            const token = await firebaseUser.getIdToken();
            const usernameToSync =
                formUsername ||
                firebaseUser.displayName ||
                firebaseUser.email?.split('@')[0] ||
                'unknown_user';

            let signInProvider = 'unknown';
            if (firebaseUser.providerData?.length > 0) {
                signInProvider = firebaseUser.providerData[0].providerId;
            } else if (firebaseUser.isAnonymous) {
                signInProvider = 'anonymous';
            } else if (token) {
                signInProvider = 'custom_token';
            }

            const response = await fetch('http://localhost:3000/api/auth/sync', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    firebaseUid: firebaseUser.uid,
                    email: firebaseUser.email,
                    username: usernameToSync,
                    profile_image: firebaseUser.photoURL,
                    sign_in_provider: signInProvider,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('❌ Backend sync failed:', errorData);
            } else {
                const data = await response.json();
                console.log('✅ User synced with backend:', data);
            }
        } catch (err) {
            console.error('❌ Error during backend sync:', err);
        }
    };

    // Set up onAuthStateChanged to sync if logged in already
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(firebaseAuthInstance, (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                onAuthSuccess?.(currentUser);
                syncUserToBackend(currentUser);
            }
        });
        return () => unsubscribe();
    }, [onAuthSuccess]);

    // Fullscreen style effect
    useEffect(() => {
        const styleTag = document.createElement('style');
        styleTag.innerHTML = `
            html, body, #root {
                width: 100% !important;
                height: 100% !important;
                margin: 0 !important;
                padding: 0 !important;
                box-sizing: border-box !important;
                overflow: hidden;
            }
        `;
        document.head.appendChild(styleTag);
        return () => {
            if (document.head.contains(styleTag)) {
                document.head.removeChild(styleTag);
            }
        };
    }, []);

    // 🔐 Handle Email/Password Signup
    const handleSignup = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);
        const authInstance = firebaseAuthInstance;
        const dbInstance = getFirestore(firebaseAppInstance);

        if (!authInstance || !dbInstance) {
            setError("Firebase services not initialized.");
            return;
        }

        if (!email || !password || !confirmPassword || !username) {
            setError("All fields are required.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (password.length < 6) {
            setError("Password is too weak. It must be at least 6 characters.");
            return;
        }

        setLoading(true);

        try {
            const signInMethods = await fetchSignInMethodsForEmail(authInstance, email);
            if (signInMethods.length > 0) {
                let msg = `This email is already registered. Please try logging in`;
                if (signInMethods.includes(GoogleAuthProvider.PROVIDER_ID)) {
                    msg += ` using Google Sign-in.`;
                } else if (signInMethods.includes('password')) {
                    msg += ` with your email and password.`;
                }
                setError(msg);
                return;
            }

            const userCredential = await createUserWithEmailAndPassword(authInstance, email, password);
            const firebaseUser = userCredential.user;

            await updateProfile(firebaseUser, { displayName: username });

            const signupPayload = {
                email,
                username,
                firebaseUid: firebaseUser.uid,
                sign_in_provider: 'email_password',
            };

            const response = await fetch('http://localhost:3000/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(signupPayload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Backend signup failed.');
            }

            const backendData = await response.json();
            const { token, user: backendUser } = backendData;

            localStorage.setItem('authToken', token);
            onAuthSuccess?.(backendUser);

            setEmail('');
            setPassword('');
            setConfirmPassword('');
            setUsername('');
            setSuccessMessage('Signed up with email/password successfully!');
            navigate('/music');
        } catch (err) {
            console.error('Signup error:', err.message);
            const message = err.code === 'auth/invalid-email' ? 'Invalid email address format.' :
                err.code === 'auth/email-already-in-use' ? 'This email is already in use. Try logging in.' :
                err.code === 'auth/weak-password' ? 'Password is too weak. It must be at least 6 characters.' :
                err.code === 'auth/network-request-failed' ? 'Network error. Please check your connection.' :
                `Signup failed: ${err.message}`;
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    // 🔐 Handle Google Sign-in
    const handleGoogleSignIn = async () => {
        setError(null);
        setSuccessMessage(null);
        const authInstance = firebaseAuthInstance;

        setGoogleLoading(true);

        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(authInstance, provider);
            const firebaseUser = result.user;

            await syncUserToBackend(firebaseUser);
            setSuccessMessage('Signed up with Google successfully!');
            navigate('/music');
        } catch (err) {
            console.error('Google Sign-in error:', err.message);
            const msg = err.code === 'auth/popup-closed-by-user' ? 'Google Sign-in popup closed.' :
                err.code === 'auth/cancelled-popup-request' ? 'Google Sign-in popup was cancelled.' :
                err.code === 'auth/operation-not-allowed' ? 'Google Sign-in is not enabled in your Firebase project.' :
                err.code === 'auth/network-request-failed' ? 'Network error during Google Sign-in.' :
                err.code === 'auth/account-exists-with-different-credential' ? 'This email is already registered with a different method.' :
                `Google Sign-in failed: ${err.message}`;
            setError(msg);
        } finally {
            setGoogleLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
            <div className="bg-gray-800 p-8 rounded-lg shadow-xl max-w-md w-full">
                <h2 className="text-3xl font-bold mb-6 text-center text-red-500">Sign Up</h2>
                <form onSubmit={handleSignup} className="space-y-4" autoComplete="off">
                    <div>
                        <label htmlFor="username" className="block text-gray-300 text-sm font-bold mb-2">Username</label>
                        <input
                            id="username"
                            type="text"
                            className="shadow appearance-none border border-gray-700 rounded-md w-full py-3 px-4 text-gray-200 leading-tight focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-700"
                            placeholder="johndoe123"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-gray-300 text-sm font-bold mb-2">Email</label>
                        <input
                            id="email"
                            type="email"
                            className="shadow appearance-none border border-gray-700 rounded-md w-full py-3 px-4 text-gray-200 leading-tight focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-700"
                            placeholder="your@example.com"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-gray-300 text-sm font-bold mb-2">Password</label>
                        <input
                            id="password"
                            type="password"
                            className="shadow appearance-none border border-gray-700 rounded-md w-full py-3 px-4 text-gray-200 leading-tight focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-700"
                            placeholder="********"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="confirmPassword" className="block text-gray-300 text-sm font-bold mb-2">Confirm Password</label>
                        <input
                            id="confirmPassword"
                            type="password"
                            className="shadow appearance-none border border-gray-700 rounded-md w-full py-3 px-4 text-gray-200 leading-tight focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-700"
                            placeholder="********"
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                    {successMessage && (
                        <p className="text-green-400 text-sm text-center" role="alert" aria-live="assertive">
                            {successMessage}
                        </p>
                    )}
                    <button
                        type="submit"
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-md focus:outline-none focus:shadow-outline transition duration-200"
                        disabled={loading}
                    >
                        {loading ? 'Signing Up...' : 'Sign Up'}
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
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md flex items-center justify-center space-x-2 focus:outline-none focus:shadow-outline transition duration-200"
                        disabled={googleLoading}
                        type="button"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                            <path d="M12.24 10.285V14.4h6.806c-.275 1.764-1.847 4.773-6.806 4.773-4.163 0-7.542-3.32-7.542-7.408s3.379-7.408 7.542-7.408c2.906 0 4.513 1.233 5.484 2.15l3.097-3.096c-1.775-1.65-4.014-2.83-8.581-2.83-7.035 0-12.72 5.618-12.72 12.5S5.205 22 12.24 22c7.218 0 12.15-5.093 12.15-12.292 0-.756-.07-1.486-.197-2.198H12.24z" />
                        </svg>
                        <span>Sign up with Google</span>
                    </button>
                </div>

                <div className="mt-6 text-center">
                    <p className="text-gray-400">
                        Already have an account?{' '}
                        <Link to="/login" className="text-red-400 hover:text-red-500 font-semibold transition duration-200">
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;
