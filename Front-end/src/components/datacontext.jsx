import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext'; // Import useAuth to get current user ID

// Create a Context for the data
const DataContext = createContext();

/**
 * DataProvider component to fetch and provide application data to its children.
 * It manages states for songs, artists, albums, radios, playlists, and favorites.
 */
export const DataProvider = ({ children }) => {
    // State variables to hold the fetched data
    const [allSongs, setAllSongs] = useState([]);
    const [allArtists, setAllArtists] = useState([]);
    const [allAlbums, setAllAlbums] = useState([]);
    const [newAlbums, setNewAlbums] = useState([]); // For new album releases
    const [trendingAlbums, setTrendingAlbums] = useState([]); // For trending albums
    const [allRadios, setAllRadios] = useState([]);
    const [allPlaylists, setAllPlaylists] = useState([]);
    const [favorites, setFavorites] = useState([]); // For user's favorite songs

    // Get the current user from AuthContext to associate favorites
    const { currentUser } = useAuth();

    // Base URL for your backend API
    const BASE_URL = 'http://localhost:3000/api';

    /**
     * Helper function to map snake_case IDs to camelCase for frontend consistency.
     * This assumes your backend returns data directly from SQL table columns.
     * @param {Array} data - The array of objects fetched from the API.
     * @param {string} idKey - The snake_case ID key from the backend (e.g., 'song_id').
     * @param {Array<Object>} foreignKeys - An array of objects defining foreign key mappings
     * e.g., [{ from: 'artist_id', to: 'artistId' }]
     * @returns {Array} Mapped data with camelCase IDs.
     */
    const mapDataKeys = (data, idKey, foreignKeys = []) => {
        if (!Array.isArray(data)) return [];
        return data.map(item => {
            const newItem = { ...item };
            // Map primary ID
            if (idKey && newItem[idKey] !== undefined) {
                newItem.id = newItem[idKey];
                // Optionally remove the original snake_case key if not needed
                // delete newItem[idKey];
            }
            // Map foreign keys
            foreignKeys.forEach(fk => {
                if (newItem[fk.from] !== undefined) {
                    newItem[fk.to] = newItem[fk.from];
                    // Optionally remove the original snake_case key if not needed
                    // delete newItem[fk.from];
                }
            });
            return newItem;
        });
    };

    /**
     * Fetches all songs from the backend.
     * Memoized with useCallback to prevent unnecessary re-creations.
     */
    const fetchAllSongs = useCallback(async () => {
        try {
            const response = await fetch(`${BASE_URL}/songs`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            // Map song_id, artist_id, album_id to id, artistId, albumId
            // Use song.audioUrl directly as backend provides it in camelCase
            // Map coverImage to albumArt/songArt for consistency
            // Flatten nested Artist.name and Album.name
            const mappedData = data.map(song => ({
                ...song,
                id: song.song_id, // Assuming song_id from backend
                artistId: song.artist_id, // Assuming artist_id from backend
                albumId: song.album_id, // Assuming album_id from backend
                audio: song.audioUrl, // <--- CORRECTED: Use song.audioUrl directly
                albumArt: song.coverImage, // Assuming coverImage from backend
                songArt: song.coverImage, // Also map to songArt for flexibility
                artist: song.Artist ? song.Artist.name : 'Unknown Artist', // Flatten nested artist name
                album: song.Album ? song.Album.name : 'Unknown Album' // Flatten nested album name
            }));
            setAllSongs(mappedData);
        } catch (error) {
            console.error("Error fetching all songs:", error);
            setAllSongs([]); // Set to empty array on error
        }
    }, [BASE_URL]);

    /**
     * Fetches all artists from the backend.
     * Memoized with useCallback.
     */
    const fetchAllArtists = useCallback(async () => {
        try {
            const response = await fetch(`${BASE_URL}/artists`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            // Map artist_id to id
            const mappedData = mapDataKeys(data, 'artist_id');
            setAllArtists(mappedData);
        } catch (error) {
            console.error("Error fetching all artists:", error);
            setAllArtists([]);
        }
    }, [BASE_URL]);

    /**
     * Fetches all albums from the backend.
     * Memoized with useCallback.
     */
    const fetchAllAlbums = useCallback(async () => {
        try {
            const response = await fetch(`${BASE_URL}/albums`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            // Map album_id and artist_id to id and artistId
            // Also map coverImage to albumArt
            // Flatten nested Artist.name
            const mappedData = data.map(album => ({
                ...album,
                id: album.album_id, // Assuming album_id from backend
                artistId: album.artist_id, // Assuming artist_id from backend
                albumArt: album.cover_image, // Assuming cover_image from backend
                artist: album.Artist ? album.Artist.name : 'Unknown Artist' // Flatten nested artist name
            }));
            setAllAlbums(mappedData);
        } catch (error) {
            console.error("Error fetching all albums:", error);
            setAllAlbums([]);
        }
    }, [BASE_URL]);

    /**
     * Fetches all radios from the backend.
     * Memoized with useCallback.
     */
    const fetchAllRadios = useCallback(async () => {
        try {
            const response = await fetch(`${BASE_URL}/radios`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            // Map radio_id to id
            const mappedData = mapDataKeys(data, 'radio_id');
            setAllRadios(mappedData);
        } catch (error) {
            console.error("Error fetching all radios:", error);
            setAllRadios([]);
        }
    }, [BASE_URL]);

    /**
     * Fetches all playlists from the backend.
     * Memoized with useCallback.
     */
    const fetchAllPlaylists = useCallback(async () => {
        try {
            const response = await fetch(`${BASE_URL}/playlists`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            // Map playlist_id and user_id to id and userId
            const mappedData = mapDataKeys(data, 'playlist_id', [
                { from: 'user_id', to: 'userId' }
            ]);
            // Ensure songs array is correctly parsed if it's a string from backend (e.g., GROUP_CONCAT)
            const playlistsWithParsedSongs = mappedData.map(playlist => ({
                ...playlist,
                songs: typeof playlist.songs === 'string' ? playlist.songs.split(',').filter(Boolean) : playlist.songs || []
            }));
            setAllPlaylists(playlistsWithParsedSongs);
        } catch (error) {
            console.error("Error fetching all playlists:", error);
            setAllPlaylists([]);
        }
    }, [BASE_URL]);

    /**
     * Fetches all favorites from the backend.
     * Memoized with useCallback.
     */
    const fetchAllFavorites = useCallback(async () => {
        try {
            const response = await fetch(`${BASE_URL}/favorites`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            // Map favorite_id, user_id, song_id to id, userId, songId
            const mappedData = mapDataKeys(data, 'favorite_id', [
                { from: 'user_id', to: 'userId' },
                { from: 'song_id', to: 'songId' }
            ]);
            setFavorites(mappedData);
        } catch (error) {
            console.error("Error fetching all favorites:", error);
            setFavorites([]);
        }
    }, [BASE_URL]);

    /**
     * Fetches new albums from the backend.
     * Memoized with useCallback.
     */
    const fetchNewAlbums = useCallback(async () => {
        try {
            const response = await fetch(`${BASE_URL}/albums/new`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            const mappedData = data.map(album => ({
                ...album,
                id: album.album_id, // Assuming album_id from backend
                artistId: album.artist_id, // Assuming artist_id from backend
                albumArt: album.cover_image, // Assuming cover_image from backend
                artist: album.Artist ? album.Artist.name : 'Unknown Artist' // Flatten nested artist name
            }));
            setNewAlbums(mappedData);
        } catch (error) {
            console.error("Error fetching new albums:", error);
            setNewAlbums([]);
        }
    }, [BASE_URL]);

    /**
     * Fetches trending albums from the backend.
     * Memoized with useCallback.
     */
    const fetchTrendingAlbums = useCallback(async () => {
        try {
            const response = await fetch(`${BASE_URL}/albums/trending`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            const mappedData = data.map(album => ({
                ...album,
                id: album.album_id, // Assuming album_id from backend
                artistId: album.artist_id, // Assuming artist_id from backend
                albumArt: album.cover_image, // Assuming cover_image from backend
                artist: album.Artist ? album.Artist.name : 'Unknown Artist' // Flatten nested artist name
            }));
            setTrendingAlbums(mappedData);
        } catch (error) {
            console.error("Error fetching trending albums:", error);
            setTrendingAlbums([]);
        }
    }, [BASE_URL]);

    /**
     * Increments the view count for a specific song.
     * @param {string} songId - The ID of the song to increment views for.
     * Memoized with useCallback.
     */
    const incrementSongViews = useCallback(async (songId) => {
        try {
            const response = await fetch(`${BASE_URL}/songs/${songId}/increment-views`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            // Update the views for the specific song in the allSongs state
            setAllSongs(prevSongs => prevSongs.map(song =>
                // Assuming song objects have an 'id' property that matches songId after mapping
                song.id === songId ? { ...song, views: data.newViews } : song
            ));
        } catch (error) {
            console.error("Error incrementing song views:", error);
        }
    }, [BASE_URL]);

    /**
     * Toggles the favorite status of a song for the current user.
     * This function will add a song to favorites if not already favorited,
     * or remove it if it is.
     * @param {string} songId - The ID of the song to toggle favorite status for.
     */
    const toggleFavorite = useCallback(async (songId) => {
        if (!currentUser || !currentUser.uid) {
            console.warn("Cannot toggle favorite: User not authenticated.");
            // Optionally, show a message to the user to log in
            return;
        }

        const userId = currentUser.uid; // Use Firebase UID

        // Find the favorite entry for this user and song
        const existingFavorite = favorites.find(fav => fav.userId === userId && fav.songId === songId);

        try {
            let response;
            if (existingFavorite) {
                // Song is already favorited, so remove it
                response = await fetch(`${BASE_URL}/favorites/${existingFavorite.id}`, { // Assuming favorite.id is the primary key for the favorite entry
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                });
            } else {
                // Song is not favorited, so add it
                response = await fetch(`${BASE_URL}/favorites`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId, songId }), // Send userId and songId to backend
                });
            }

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // After successful API call, refetch all favorites to update the state
            // Alternatively, you can optimistically update the state or update based on response
            fetchAllFavorites();

        } catch (error) {
            console.error("Error toggling favorite:", error);
            // Handle error, e.g., show a toast notification to the user
        }
    }, [BASE_URL, currentUser, favorites, fetchAllFavorites]);


    // useEffect hook to fetch all initial data when the component mounts
    useEffect(() => {
        fetchAllSongs();
        fetchAllArtists();
        fetchAllAlbums();
        fetchAllRadios();
        fetchAllPlaylists();
        // Only fetch favorites if a user is available (or handle guest favorites if applicable)
        if (currentUser) {
            fetchAllFavorites();
        }
        fetchNewAlbums();
        fetchTrendingAlbums();
    }, [
        // Dependencies for useEffect to re-run fetches if any of these functions change (they are memoized)
        fetchAllSongs,
        fetchAllArtists,
        fetchAllAlbums,
        fetchAllRadios,
        fetchAllPlaylists,
        fetchAllFavorites, // This dependency is important for refetching after toggleFavorite
        fetchNewAlbums,
        fetchTrendingAlbums,
        currentUser // Add currentUser as a dependency to refetch favorites when auth state changes
    ]);

    // The value provided by the DataContext to its consumers
    const contextValue = {
        songs: allSongs,
        artists: allArtists,
        albums: allAlbums,
        newAlbums,
        trendingAlbums,
        radios: allRadios,
        playlists: allPlaylists,
        favorites,
        incrementSongViews,
        toggleFavorite, // Provide the toggleFavorite function
    };

    return (
        <DataContext.Provider value={contextValue}>
            {children}
        </DataContext.Provider>
    );
};

// Custom hook to easily consume the DataContext
export const useData = () => useContext(DataContext);
