import './Allstyle.css';
import React, { useState, useEffect, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useData } from './datacontext'; // Custom context for all music data
import { useAuth } from './AuthContext'; // For Firebase currentUser
import axios from 'axios'; // For API calls

const FavoritePage = () => {
  const { currentUser } = useAuth(); // Get current authenticated user
  const { songs = [] } = useData(); // Now 'songs' from useData should have 'songUrl'

  const { setCurrentPlayingSong } = useOutletContext(); // Function to set the globally playing song

  const [favoritesFromApi, setFavoritesFromApi] = useState([]); // Raw favorites from API
  const [favoriteSongs, setFavoriteSongs] = useState([]); // Detailed song objects for display
  const [error, setError] = useState(null);

  // Effect to fetch favorites from your backend API
  useEffect(() => {
    const fetchFavorites = async () => {
      setError(null);
      try {
        const idToken = await currentUser?.getIdToken?.(); 
        console.log('FavoritePage Debug: Fetching favorites. Auth token present:', !!idToken); // Debug Log
        const response = await axios.get('http://localhost:3000/api/favorites', {
          headers: {
            ...(idToken && { Authorization: `Bearer ${idToken}` }), 
          },
        });
        console.log('FavoritePage Debug: API Response data received:', response.data); // Debug Log
        setFavoritesFromApi(response.data); 
      } catch (err) {
        console.error('FavoritePage Error: Error fetching favorites:', err);
        setError(err);
      }
    };

    if (currentUser) {
      fetchFavorites();
    } else {
      setFavoritesFromApi([]);
      setFavoriteSongs([]);
      console.log('FavoritePage Debug: No current user, favorites state cleared.'); // Debug Log
    }
  }, [currentUser]);

  // Effect to process fetched favorites and map them to the desired song structure
  useEffect(() => {
    console.log('FavoritePage Debug: favoritesFromApi state updated:', favoritesFromApi); // Debug Log
    const currentFirebaseUid = currentUser?.uid; // Get the current user's Firebase UID
    console.log('FavoritePage Debug: Current Firebase User UID:', currentFirebaseUid); // Log Firebase UID

    if (favoritesFromApi.length > 0 && currentUser) { // Ensure a user is logged in
      // Filter favorites to show only those belonging to the specific backend userId: 1
      // This assumes the currently logged-in Firebase user is intended to see favorites for backend userId 1.
      // For a generic multi-user app, you would need a mapping from currentUser.uid to backend userId.
      const userFavorites = favoritesFromApi.filter(fav => {
        console.log(`FavoritePage Debug: Comparing fav.userId (${fav.userId}) with expected backend userId (1). Firebase UID present: ${!!currentFirebaseUid}`); // Log comparison values
        return fav.userId === 1; // Directly check if the favorite belongs to backend userId 1
      });

      console.log('FavoritePage Debug: Filtered userFavorites:', userFavorites); // Log filtered favorites

      const detailedFavoriteSongs = userFavorites
        .map(fav => {
          console.log('FavoritePage Debug: Processing raw favorite object:', fav); // Debug Log

          const songData = fav.Song;
          const artistData = fav.Song?.Artist;
          const albumData = fav.Song?.Album;

          if (!songData) {
            console.warn('FavoritePage Warning: Favorite entry missing Song data, skipping:', fav);
            return null; // Skip this favorite if songData is missing
          }

          // Ensure all properties are explicitly defined with fallbacks
          const songId = fav.songId || fav.favoriteId || `unknown-song-${Math.random()}`;
          const title = songData.title || 'Unknown Title';
          const artist = artistData?.name || 'Unknown Artist';
          const album = albumData?.name || 'Unknown Album'; 
          // This songUrl should now be correctly populated by DataContext
          const songUrl = songData.audioUrl || ''; 
          const coverImage = songData.coverImage || 'https://placehold.co/150x150/4a4a4a/e0e0e0?text=No+Image';

          console.log(`FavoritePage Debug: Extracted song details for "${title}": ID=${songId}, URL=${songUrl}, Cover=${coverImage}`); // Debug Log

          return {
            id: songId,
            title: title,
            artist: artist,
            album: album,
            songUrl: songUrl, 
            songArt: coverImage, 
            albumArt: coverImage, 
          };
        })
        .filter(Boolean); // Filter out any null entries (from missing songData)

      console.log('FavoritePage Debug: Processed favoriteSongs array:', detailedFavoriteSongs); // Debug Log
      setFavoriteSongs(detailedFavoriteSongs);
    } else {
      setFavoriteSongs([]);
      console.log('FavoritePage Debug: favoritesFromApi is empty or no user logged in, favoriteSongs cleared.'); // Debug Log
    }
  }, [favoritesFromApi, currentUser]); // Add currentUser to dependencies

  // Effect to inject global styles (animations, scrollbar) - unchanged
  useEffect(() => {
    const styleTag = document.createElement('style');
    styleTag.innerHTML = `
        html, body {
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            height: 100% !important;
            box-sizing: border-box !important;
            scroll-behavior: smooth;
        }
        #root {
            width: 100% !important;
            height: 100% !important;
        }
        /* Keyframe animation for elements fading and sliding up into view */
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        /* Keyframe animation for elements scaling in */
        @keyframes scaleIn {
            from { opacity: 0; transform: scale(0.9); }
            to { opacity: 1; transform: scale(1); }
        }
        /* Apply the fadeInUp animation */
        .animate-fadeInUp { animation: fadeInUp 0.6s ease-out forwards; }
        .animate-scaleIn { animation: scaleIn 0.6s ease-out forwards; }
        /* Staggered animation delays for a dynamic loading effect */
        .animation-delay-100 { animation-delay: 0.1s; }
        .animation-delay-200 { animation-delay: 0.2s; }
        .animation-delay-300 { animation-delay: 0.3s; }
        .animation-delay-400 { animation-delay: 0.4s; }
        .animation-delay-500 { animation-delay: 0.5s; }
        .animation-delay-600 { animation-delay: 0.6s; }
        .animation-delay-700 { animation-delay: 0.7s; }
        .animation-delay-800 { animation-delay: 0.8s; }
        .animation-delay-900 { animation-delay: 0.9s; }
        .animation-delay-1000 { animation-delay: 1.0s; }
        .animation-delay-1100 { animation-delay: 1.1s; }
        .animation-delay-1200 { animation-delay: 1.2s; }

        /* Custom Scrollbar Styles for Webkit browsers (Chrome, Safari, Edge) */
        .horizontal-scroll-container::-webkit-scrollbar {
            height: 8px; /* Height of the horizontal scrollbar */
        }

        .horizontal-scroll-container::-webkit-scrollbar-track {
            background: #2a2a2a; /* Dark background for the scrollbar track */
            border-radius: 10px;
        }

        .horizontal-scroll-container::-webkit-scrollbar-thumb {
            background-color: #ef4444; /* Red-500 for the scrollbar thumb */
            border-radius: 10px;
            border: 2px solid #2a2a2a; /* Padding around the thumb */
        }

        .horizontal-scroll-container::-webkit-scrollbar-thumb:hover {
            background-color: #dc2626; /* Red-600 on hover */
        }

        /* Custom Scrollbar Styles for Firefox */
        .horizontal-scroll-container {
            scrollbar-width: thin;
            scrollbar-color: #ef4444 #2a2a2a;
        }

        /* Vertical scrollbar for all-tracks-container (used in artist profile) */
        .custom-scrollbar::-webkit-scrollbar {
            width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
            background: #2a2a2a;
            border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #ef4444;
            border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #dc2626;
        }
        .custom-scrollbar {
            scrollbar-width: thin;
            scrollbar-color: #ef4444 #2a2a2a;
        }
    `;
    document.head.appendChild(styleTag);

    return () => {
        if (document.head.contains(styleTag)) {
            document.head.removeChild(styleTag);
        }
    };
  }, []);

  const handlePlayFavoriteSong = useCallback((song) => {
    console.log('FavoritePage Debug: Clicked song object:', song); // Debug Log
    console.log('FavoritePage Debug: Song URL to be sent to player:', song.songUrl); // Debug Log

    // Ensure song.songUrl is not empty before attempting to play
    if (song.songUrl) {
      setCurrentPlayingSong(song, favoriteSongs); 
      console.log('FavoritePage Debug: setCurrentPlayingSong called successfully.'); // Debug Log
    } else {
      console.warn('FavoritePage Warning: Cannot play song. songUrl is missing or empty for', song.title, song); // Debug Log
      // Optionally, you could show a user-friendly message here, e.g., using a state for a temporary message.
    }
  }, [setCurrentPlayingSong, favoriteSongs]);

  const handleError = (e) => {
    e.target.onerror = null;
    e.target.src = 'https://placehold.co/150x150/4a4a4a/e0e0e0?text=No+Image';
  };

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-red-500">
        <p className="text-xl mb-4">Error loading favorites.</p>
        <p className="text-sm text-gray-400">Please ensure your backend server is running at `http://localhost:3000` and returns favorite song objects with nested `Song`, `Artist`, and `Album` data, including `audioUrl` and `coverImage` for the `Song`.</p>
        <p className="text-sm text-gray-400">Error details: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-gray-100 py-8 px-4 md:px-8 lg:px-16 pb-8 font-sans pt-20">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-8 text-center sm:text-left opacity-0 animate-fadeInUp animation-delay-100">
          <i className="fa-solid fa-heart text-red-500 mr-3"></i>
          Your Favorites
        </h1>

        {favoriteSongs.length === 0 ? (
          <div className="text-center text-gray-400 text-lg py-12 opacity-0 animate-fadeInUp animation-delay-200">
            <p className="mb-4">No favorite songs added yet.</p>
            <p>Start exploring and add some tunes to your collection!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {favoriteSongs.map((song, index) => {
              // Fallback to empty object if song is undefined
              const safeSong = song || {};
              return (
                <div
                  key={safeSong.id || `favorite-song-${index}`}
                  className={`group flex-shrink-0 w-full bg-gray-900 p-3 rounded-xl shadow-xl border border-gray-800
                        transform hover:scale-105 hover:-translate-y-2 hover:shadow-2xl hover:border-red-500
                        transition-all duration-300 cursor-pointer relative overflow-hidden
                        opacity-0 animate-fadeInUp animation-delay-${(index + 1) * 100 + 200}`}
                  onClick={() => {
                    console.log('FavoritePage Debug: Card clicked. Raw song object from map:', safeSong); 
                    handlePlayFavoriteSong(safeSong);
                  }}
                >
                  <div className="relative w-full h-40 sm:h-48 rounded-md overflow-hidden mb-3 shadow-lg">
                      <img
                          src={safeSong.songArt || safeSong.albumArt || 'https://placehold.co/150x150/4a4a4a/e0e0e0?text=No+Image'}
                          alt={`${safeSong.title || 'Unknown Title'} Art`}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          onError={handleError}
                      />
                  </div>
                  <div className="text-center">
                    <h3 className="text-base font-semibold text-white mb-0.5 truncate w-full px-2">{safeSong.title || 'Unknown Title'}</h3>
                    <p className="text-xs text-gray-400 truncate w-full px-2">{safeSong.artist || 'Unknown Artist'}</p>
                    <p className="text-xs text-gray-500 mt-1 truncate w-full px-2">{safeSong.album || 'Unknown Album'}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
       <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
    </div>
  );
};

export default FavoritePage;
