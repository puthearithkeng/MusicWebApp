// src/App.jsx
import React, { useState, useEffect } from 'react';
import {
  Routes,
  Route,
  Outlet,
  Navigate,
  useNavigate,
  useLocation,
} from 'react-router-dom';

import Navbar from './components/navbar.jsx';
import Homepage from './components/Home.jsx';
import Musicpage from './components/Music.jsx';
import AlbumsPage from './components/Album.jsx';
import ArtistsPage from './components/Artist.jsx';
import MusicPlayer from './components/Musicplayer.jsx';
import FavoritePage from './components/favorite.jsx';
import Login from './components/login.jsx';
import Signup from './components/signup.jsx';
import SearchPage from './components/Searchpage.jsx'; // <--- NEW: Import SearchPage
import './App.css'; // Import your global styles
import { DataProvider, useData } from './components/datacontext.jsx';
import { AuthProvider, useAuth } from './components/AuthContext.jsx';
import ErrorBoundary from './components/ErrorBoundary'; // Import the ErrorBoundary component

/**
 * Layout component that includes the Navbar and MusicPlayer.
 * It provides context for setting the current playing song.
 */
function LayoutWithNavbarAndPlayer({
  currentPlayingSong,
  setCurrentPlayingSong,
  allSongs,
  isAuthenticated,
  currentUser,
  onSignOut,
  onAuthSuccess
}) {
  return (
    <>
      <Navbar
        isAuthenticated={isAuthenticated}
        currentUser={currentUser}
        onSignOut={onSignOut}
        onAuthSuccess={onAuthSuccess}
      />
      {/* Added padding-top and padding-bottom to ensure content is visible */}
      <main className="pt-16 pb-24"> {/* Adjust pt- and pb- values as needed based on your Navbar/MusicPlayer height */}
        {/* Outlet renders the matched child route component, providing context */}
        <Outlet context={{ setCurrentPlayingSong, allSongs }} />
      </main>
      <MusicPlayer
        initialSong={currentPlayingSong}
        allSongs={allSongs}
        setCurrentPlayingSong={setCurrentPlayingSong}
      />
    </>
  );
}

/**
 * Layout component that only includes the Navbar.
 * Used for routes that don't require the music player (e.g., Login, Signup).
 */
function LayoutWithNavbar({ isAuthenticated, currentUser, onSignOut, onAuthSuccess }) {
  return (
    <>
      <Navbar
        isAuthenticated={isAuthenticated}
        currentUser={currentUser}
        onSignOut={onSignOut}
        onAuthSuccess={onAuthSuccess}
      />
      {/* Added padding-top to ensure content is visible */}
      <main className="pt-16"> {/* Adjust pt- value as needed based on your Navbar height */}
        {/* Outlet renders the matched child route component */}
        <Outlet />
      </main>
    </>
  );
}

/**
 * PrivateRoute component to protect routes that require authentication.
 * Redirects to /login if the user is not authenticated.
 */
function PrivateRoute({ children }) {
  const { currentUser, loading } = useAuth();
  if (loading) {
    // Show a loading indicator while authentication state is being determined
    return <div className="min-h-screen flex items-center justify-center text-white bg-black">Loading user...</div>;
  }
  // If user is authenticated, render children; otherwise, redirect to login
  return currentUser ? children : <Navigate to="/login" />;
}

/**
 * PublicOnlyRoute component to restrict access to authenticated users.
 * Redirects to /music if the user is already authenticated.
 */
function PublicOnlyRoute({ children }) {
  const { currentUser, loading } = useAuth();
  if (loading) {
    // Show a loading indicator while authentication state is being determined
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-black">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500 mb-4"></div>
        <p className="text-xl md:text-2xl font-semibold text-purple-300">Loading...</p>
      </div>
    );
  }
  // If user is authenticated, redirect to music; otherwise, render children
  return currentUser ? <Navigate to="/music" /> : children;
}

/**
 * Main App component that sets up authentication, data providers, and routing.
 */
export default function App() {
  // State for the currently playing song and the list of all available songs
  const [currentPlayingSong, setCurrentPlayingSong] = useState(null);
  const [allSongs, setAllSongs] = useState([]);

  return (
    // Wrap the entire application with AuthProvider and DataProvider
    <AuthProvider>
      <DataProvider>
        {/* Wrap AppContent with ErrorBoundary to catch rendering errors within the main app */}
        <ErrorBoundary>
          <AppContent
            currentPlayingSong={currentPlayingSong}
            setCurrentPlayingSong={setCurrentPlayingSong}
            allSongs={allSongs}
            setAllSongs={setAllSongs}
          />
        </ErrorBoundary>
      </DataProvider>
    </AuthProvider>
  );
}

/**
 * AppContent component handles authentication, data loading, and routing logic.
 * Separated from App to allow App to manage context providers.
 */
function AppContent({
  currentPlayingSong,
  setCurrentPlayingSong,
  allSongs,
  setAllSongs,
}) {
  // Access authentication and data context
  const { currentUser, logOut, loading: authLoading, login: onAuthSuccess } = useAuth();
  const { songs: contextSongs, loading: dataLoading } = useData();
  const navigate = useNavigate();
  const location = useLocation();

  // Determine if the user is authenticated
  const isAuthenticated = !!currentUser;

  // Effect to update allSongs state when contextSongs change
  useEffect(() => {
    if (!dataLoading && contextSongs?.length > 0) {
      setAllSongs(contextSongs);
    }
  }, [contextSongs, dataLoading, setAllSongs]);

  // Effect to handle initial redirects based on authentication status and current path
  useEffect(() => {
    // If user is authenticated and on the root path, redirect to /music
    if (!authLoading && currentUser && location.pathname === '/') {
      navigate('/music', { replace: true });
    }
  }, [authLoading, currentUser, location.pathname, navigate]);

  /**
   * Handles user sign-out and redirects to the homepage.
   */
  const handleSignOutAndRedirect = async () => {
    try {
      await logOut();
      navigate('/'); // Redirect to homepage after logout
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  // Show a global loading screen if authentication or data is still loading
  if (authLoading || dataLoading) {
    return (
      <div
        className="flex flex-col items-center justify-center w-full h-screen bg-gradient-to-br from-gray-900 to-purple-900 text-white font-inter"
      >
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500 mb-4"></div>
        <p className="text-xl md:text-2xl font-semibold text-purple-300">Initializing Musicaler...</p>
        <p className="text-sm text-gray-400 mt-2">Please wait while we load your experience.</p>
      </div>
    );
  }

  // Main routing setup for the application
  return (
    <Routes>
      {/* Routes that use LayoutWithNavbar (e.g., login, signup, homepage) */}
      <Route
        element={
          <LayoutWithNavbar
            isAuthenticated={isAuthenticated}
            currentUser={currentUser}
            onSignOut={handleSignOutAndRedirect}
            onAuthSuccess={onAuthSuccess}
          />
        }
      >
        <Route
          path="/"
          element={<Homepage isAuthenticated={isAuthenticated} authLoading={authLoading} />}
        />
        <Route path="/login" element={<PublicOnlyRoute><Login onAuthSuccess={onAuthSuccess} /></PublicOnlyRoute>} />
        <Route path="/signup" element={<PublicOnlyRoute><Signup onAuthSuccess={onAuthSuccess} /></PublicOnlyRoute>} />
      </Route>

      {/* Routes that use LayoutWithNavbarAndPlayer (e.g., music, albums, artist, favorite) */}
      <Route
        element={
          <LayoutWithNavbarAndPlayer
            currentPlayingSong={currentPlayingSong}
            setCurrentPlayingSong={setCurrentPlayingSong}
            allSongs={allSongs}
            isAuthenticated={isAuthenticated}
            currentUser={currentUser}
            onSignOut={handleSignOutAndRedirect}
            onAuthSuccess={onAuthSuccess}
          />
        }
      >
        {/* Added PrivateRoute wrapper to ensure these are only accessible when authenticated */}
        <Route path="/music" element={<PrivateRoute><Musicpage /></PrivateRoute>} />
        <Route path="/albums" element={<PrivateRoute><AlbumsPage /></PrivateRoute>} />
        <Route path="/artist" element={<PrivateRoute><ArtistsPage /></PrivateRoute>} />
        <Route path="/favorite" element={<PrivateRoute><FavoritePage /></PrivateRoute>} />
        <Route path="/search" element={<PrivateRoute><SearchPage /></PrivateRoute>} /> {/* <-- NEW: SearchPage Route */}
      </Route>

      {/* Fallback route for any unmatched paths */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}