// src/components/Album.jsx
import './Allstyle.css'

import React, { useEffect, useState, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useData } from './datacontext';

// --- Reusable Components (Defined Inline for Album.jsx) ---

/**
 * HorizontalScrollContainer component for displaying horizontally scrollable content sections.
 * It includes a title and an optional "More" link.
 * Duplicated from Music.jsx for inline use.
 */
const HorizontalScrollContainer = ({ children, title, linkText, onLinkClick, id, className = '' }) => (
    <section className={`mb-8 md:mb-12 ${className}`} id={id}>
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-white pl-2 drop-shadow">{title}</h2>
            {linkText && (
                <button
                    onClick={onLinkClick}
                    className="text-red-400 hover:text-red-500 text-sm font-semibold transition-colors duration-200 pr-2"
                >
                    {linkText}
                </button>
            )}
        </div>
        <div className="flex overflow-x-auto space-x-4 md:space-x-6 pb-4 horizontal-scroll-container">
            {children}
        </div>
    </section>
);

/**
 * ContentCard component for displaying individual music items (song, album, artist, radio, playlist).
 * It shows an image, title, subtitle, and optional extra info, with a hover play overlay.
 */
const ContentCard = ({ item, type, onClick, index = 0, showHoverOverlay = true }) => {
    let imageUrl = item?.albumArt || item?.profileImage || item?.image || 'https://placehold.co/150x150/333333/FFFFFF?text=No+Art';
    let title = item?.title || item?.name || 'Unknown Title';
    let subtitle = item?.artist || item?.genre || item?.description || 'Unknown Artist/Genre'; // Added item?.description for playlists
    let extraInfo = item?.views || item?.releaseDate;

    const hoverOverlayClass = showHoverOverlay ? 'group-hover:opacity-100' : '';
    // Animation delay for staggered appearance
    const animationDelayClass = `animation-delay-${(index + 1) * 100}`;

    return (
        <div
            className={`group flex-shrink-0 w-40 sm:w-48 bg-gray-900 p-3 rounded-xl shadow-xl border border-gray-800
                        transform hover:scale-105 hover:-translate-y-2 hover:shadow-2xl hover:border-red-500
                        transition-all duration-300 cursor-pointer relative overflow-hidden opacity-0 animate-fadeInUp ${animationDelayClass}`}
            onClick={() => onClick(item, type)}
        >
            <div className="relative w-full h-40 sm:h-48 rounded-md overflow-hidden mb-3 shadow-lg">
                <img
                    src={imageUrl}
                    alt={title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/150x150/333333/FFFFFF?text=No+Art'; }}
                />
                {/* Play button overlay */}
                <div className={`absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 transition-opacity duration-300 ${hoverOverlayClass}`}>
                    <button className="p-3 bg-red-600 rounded-full text-white shadow-lg hover:bg-red-700 transition-colors duration-200">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.456A1 1 0 008 8.3v3.4a1 1 0 001.555.844l3.945-1.972a1 1 0 000-1.688L9.555 7.456z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
            </div>
            <h3 className="text-base font-semibold text-white mb-0.5 truncate">{title}</h3>
            <p className="text-xs text-gray-400 truncate">{subtitle}</p>
            {extraInfo && <p className="text-xs text-gray-500 mt-1">{extraInfo}</p>}
        </div>
    );
};


function AlbumsPage() {
    const [view, setView] = useState('albums');
    const [selectedAlbum, setSelectedAlbum] = useState(null);
    const [selectedPlaylist, setSelectedPlaylist] = useState(null); // New state for selected playlist

    // Include 'songs' and 'artists' in useData destructuring
    const { albums: albumsData, albumSongs: albumSongsData = [], playlists, songs = [], artists = [] } = useData(); // Added artists

    // Log the entire 'songs' array to the console for debugging
    useEffect(() => {
        console.log("Global 'songs' array from useData:", songs);
        console.log("Global 'artists' array from useData:", artists); // Log artists array too
        console.log("Global 'playlists' array from useData:", playlists); // Log playlists array too
    }, [songs, artists, playlists]);


    const { setCurrentPlayingSong } = useOutletContext();

    // useEffect to inject global styles for full-screen layout and animations.
    useEffect(() => {
        const styleTag = document.createElement('style');
        styleTag.innerHTML = `
            html, body {
                margin: 0 !important;
                padding: 0 !important;
                width: 100% !important;
                height: 100% !important;
                box-sizing: border-box !important;
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
            /* Apply the fadeInUp animation */
            .animate-fadeInUp { animation: fadeInUp 0.6s ease-out forwards; }
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
                background-color: #6b7280; /* Gray-700 for the scrollbar thumb */
                border-radius: 10px;
                border: 2px solid #2a2a2a; /* Padding around the thumb */
            }

            .horizontal-scroll-container::-webkit-scrollbar-thumb:hover {
                background-color: #ef4444; /* Red-500 on hover, matching theme */
            }

            /* Custom Scrollbar Styles for Firefox */
            .horizontal-scroll-container {
                scrollbar-width: thin; /* "auto" or "none" */
                scrollbar-color: #6b7280 #2a2a2a; /* thumb color track color */
            }
        `;
        document.head.appendChild(styleTag);

        return () => {
            if (document.head.contains(styleTag)) {
                document.head.removeChild(styleTag);
            }
        };
    }, []);

    const handleAlbumClick = useCallback((album) => {
        setSelectedAlbum(album);
        setView('songs');
        // Use the nested Songs array from the album object
        const firstSong = album?.Songs && album.Songs.length > 0 ? songs.find(s => s.songId === album.Songs[0].song_id) : null;
        if (firstSong) {
            // Pass the actual song objects from the global 'songs' array that match the IDs in album.Songs
            const playableSongs = album.Songs.map(s => songs.find(globalSong => globalSong.songId === s.song_id)).filter(Boolean);
            setCurrentPlayingSong(firstSong, playableSongs);
        } else {
            setCurrentPlayingSong(null, []);
        }
    }, [songs, setCurrentPlayingSong]);

    const handleSongClick = useCallback((song) => {
        // When playing a song from an album, the playable list should be the songs of that album
        const playableSongs = selectedAlbum?.Songs.map(s => songs.find(globalSong => globalSong.songId === s.song_id)).filter(Boolean) || [];
        setCurrentPlayingSong(song, playableSongs);
    }, [setCurrentPlayingSong, selectedAlbum, songs]);

    const handleBackToAlbums = useCallback(() => {
        setView('albums');
        setSelectedAlbum(null);
        setSelectedPlaylist(null); // Clear selected playlist when going back to albums
    }, []);

    // Handler for selecting a playlist, similar to Music.jsx
    const handleSelectPlaylist = useCallback((playlist) => {
        // When selecting a playlist, the 'playlist' object from ContentCard already contains the 'Songs' array
        setSelectedPlaylist(playlist); // Set the entire playlist object, which includes the 'Songs' array
        setView('playlist-songs'); // Set a new view for playlist songs
        console.log("Selected Playlist:", playlist); // Log the selected playlist
        console.log("Selected Playlist Songs (Full Objects):", playlist.Songs); // Log the full song objects in the playlist
    }, []);

    // Handler for playing a track from a playlist
    const handlePlayTrackFromPlaylist = useCallback((track) => {
        // The selectedPlaylist.Songs array already contains full song objects, so no need to find them again
        setCurrentPlayingSong(track, selectedPlaylist?.Songs || []); // Pass the current playlist's full song objects as the playable list
    }, [setCurrentPlayingSong, selectedPlaylist]);


    return (
        <div className={`bg-black text-white font-inter min-h-screen flex flex-col pt-16 pb-8`}>
            <header className="fixed top-0 left-0 w-full p-4 flex justify-between items-center z-10 bg-gradient-to-b from-black/70 to-transparent">
                <div className="text-red-500 text-3xl font-extrabold tracking-wider">
                    MUSIC<span className="text-white text-2xl">ALER</span> <span className="text-gray-400 text-lg">/ {view === 'albums' ? 'Albums' : selectedAlbum ? selectedAlbum.name : (selectedPlaylist ? selectedPlaylist.name : 'Music')}</span>
                </div>
            </header>

            <section className="flex-grow py-8 px-4 md:px-8 lg:px-16 mt-8">
                {view === 'albums' && ( // Show this block only if view is 'albums'
                    <>
                        <h2 className="text-4xl md:text-5xl font-extrabold mb-12 text-white text-center drop-shadow opacity-0 animate-fadeInUp animation-delay-100">
                            Trending <span className="text-red-500">Albums</span>
                        </h2>
                        {/* Use HorizontalScrollContainer for albums */}
                        <HorizontalScrollContainer>
                            {albumsData.length > 0 ? (
                                albumsData.map((album, index) => (
                                    <ContentCard
                                        key={album.id ? album.id : `trending-album-${index}`}
                                        item={album}
                                        type="album"
                                        onClick={handleAlbumClick}
                                        index={index}
                                    />
                                ))
                            ) : (
                                <p className="text-gray-500 text-center w-full">No trending albums available.</p>
                            )}
                        </HorizontalScrollContainer>

                        <h2 className="text-4xl md:text-5xl font-extrabold mt-16 mb-12 text-white text-center drop-shadow opacity-0 animate-fadeInUp animation-delay-200">
                            New <span className="text-purple-500">Albums</span>
                        </h2>
                        {/* Use HorizontalScrollContainer for new albums */}
                        <HorizontalScrollContainer>
                            {albumsData.slice(2).length > 0 ? (
                                albumsData.slice(2).map((album, index) => (
                                    <ContentCard
                                        key={album.id ? album.id : `new-album-${index}`}
                                        item={album}
                                        type="album"
                                        onClick={handleAlbumClick}
                                        index={index}
                                    />
                                ))
                            ) : (
                                <p className="text-gray-500 text-center w-full">No new albums available.</p>
                            )}
                        </HorizontalScrollContainer>

                        {/* Popular Playlists Section - Now using ContentCard and HorizontalScrollContainer */}
                        <h2 className="text-4xl md:text-5xl font-extrabold mt-16 mb-12 text-white text-center drop-shadow opacity-0 animate-fadeInUp animation-delay-300">
                            Popular <span className="text-orange-500">Playlists</span>
                        </h2>
                        <HorizontalScrollContainer>
                            {playlists.length > 0 ? (
                                playlists.map((playlist, index) => (
                                    <ContentCard
                                        key={playlist.id ? playlist.id : `playlist-${index}`}
                                        item={playlist}
                                        type="playlist"
                                        onClick={handleSelectPlaylist} // Use the new handler for playlists
                                        index={index}
                                    />
                                ))
                            ) : (
                                <p className="text-gray-500 text-center w-full">No popular playlists available.</p>
                            )}
                        </HorizontalScrollContainer>
                    </>
                )}

                {view === 'songs' && selectedAlbum && ( // Show album songs if view is 'songs' and album is selected
                    <div className="bg-gray-950 p-4 md:p-8 rounded-xl shadow-2xl animate-fadeInUp">
                        <button
                            onClick={handleBackToAlbums}
                            className="text-gray-400 hover:text-red-500 transition-colors duration-200 flex items-center mb-6 p-2 rounded-lg hover:bg-gray-800 active:scale-95"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Back to Albums
                        </button>
                        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
                            <img
                                src={selectedAlbum.albumArt || 'https://placehold.co/192x192/333333/FFFFFF?text=Album'}
                                alt={selectedAlbum.name || 'Album Art'}
                                className="w-48 h-48 object-cover rounded-lg shadow-xl border border-gray-700 flex-shrink-0"
                            />
                            <div className="text-center md:text-left">
                                <p className="text-sm text-gray-400 mb-1">ALBUM</p>
                                {/* Corrected: Use selectedAlbum.name for the album title */}
                                <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-2">{selectedAlbum.name || 'Unknown Album'}</h2>
                                <p className="text-lg text-gray-300 mb-4">{selectedAlbum.Artist?.name || 'Unknown Artist'}</p>
                                <p className="text-sm text-gray-500">Release: {selectedAlbum.releaseDate || 'Unknown Date'}</p>
                            </div>
                        </div>

                        <div className="border-t border-gray-800 pt-6">
                            <h3 className="text-2xl font-bold text-white mb-4">Tracks</h3>
                            {/* Iterate directly over selectedAlbum.Songs and find the full song object from the global 'songs' array */}
                            {selectedAlbum.Songs && selectedAlbum.Songs.length > 0 ? (
                                selectedAlbum.Songs.map((albumSong, index) => {
                                    // Changed s.id to s.songId to match the structure of your 'songs' array
                                    const track = songs.find(s => s.songId === albumSong.song_id);
                                    // Log the found track to the console for debugging
                                    console.log(`AlbumsPage - Found album track for song_id ${albumSong.song_id}:`, track);

                                    if (!track) return null; // If track not found, don't render it
                                    return (
                                        <div
                                            key={track.songId ? track.songId : `album-song-${index}`} // Changed track.id to track.songId
                                            className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-800 transition-colors duration-200 cursor-pointer group hover:shadow-md hover:scale-[1.01]"
                                            onClick={() => handleSongClick(track)}
                                        >
                                            <div className="flex items-center space-x-4">
                                                <span className="text-gray-500 text-sm group-hover:text-red-400">{index + 1}.</span>
                                                <div className="flex flex-col text-left">
                                                    <span className="text-white text-lg font-medium">{track.title || 'Unknown Title'}</span>
                                                    {/* Corrected: Look up artist name from the 'artists' array */}
                                                    <span className="text-gray-400 text-sm">
                                                        {artists.find(a => a.artistId === track.artistId)?.name || 'Unknown Artist'}
                                                    </span>
                                                </div>
                                            </div>
                                            <span className="text-gray-500 text-sm">{track.views || '0'} views</span>
                                        </div>
                                    );
                                })
                            ) : (
                                <p className="text-gray-500 text-center py-8">No songs found for this album.</p>
                            )}
                        </div>
                    </div>
                )}

                {view === 'playlist-songs' && selectedPlaylist && ( // New view for playlist songs
                    <div className="bg-gray-950 p-4 md:p-8 rounded-xl shadow-2xl animate-fadeInUp">
                        <button
                            onClick={handleBackToAlbums} // Going back to 'albums' view from playlist songs for now
                            className="text-gray-400 hover:text-red-500 transition-colors duration-200 flex items-center mb-6 p-2 rounded-lg hover:bg-gray-800 active:scale-95"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Back to Albums
                        </button>

                        {/* Playlist Header Section (copied from Music.jsx) */}
                        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
                            <img
                                src={selectedPlaylist.image || 'https://placehold.co/192x192/333333/FFFFFF?text=Playlist'}
                                alt={selectedPlaylist.name || 'Playlist Art'}
                                className="w-48 h-48 object-cover rounded-lg shadow-xl border border-gray-700 flex-shrink-0"
                            />
                            <div className="text-center md:text-left">
                                <p className="text-sm text-gray-400 mb-1">PLAYLIST</p>
                                {/* Corrected: Use selectedPlaylist.name for the playlist title */}
                                <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-2">{selectedPlaylist.name || 'Unknown Playlist'}</h2>
                                {/* Corrected: Use selectedPlaylist.creator for the playlist creator */}
                                <p className="text-lg text-gray-300 mb-4">{selectedPlaylist.creator || 'Unknown Creator'}</p>
                                <p className="text-sm text-gray-500">Total Songs: {selectedPlaylist.Songs ? selectedPlaylist.Songs.length : 0}</p> {/* Corrected to selectedPlaylist.Songs */}
                            </div>
                        </div>

                        {/* Tracks within the Playlist Section (copied from Music.jsx) */}
                        <div className="border-t border-gray-800 pt-6">
                            <h3 className="text-2xl font-bold text-white mb-4">Songs in Playlist</h3>
                            {selectedPlaylist.Songs && selectedPlaylist.Songs.length > 0 ? ( // Corrected to selectedPlaylist.Songs
                                selectedPlaylist.Songs.map((track, index) => { // Iterate directly over full song objects
                                    // Log the track being rendered for debugging
                                    console.log(`AlbumsPage - Rendering playlist track:`, track);

                                    return (
                                        <div
                                            key={track.song_id ? track.song_id : `playlist-track-${index}`} // Use track.song_id for key
                                            className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-800 transition-colors duration-200 cursor-pointer group hover:shadow-md hover:scale-[1.01]"
                                            onClick={() => handlePlayTrackFromPlaylist(track)}
                                        >
                                            <div className="flex items-center space-x-4">
                                                <span className="text-gray-500 text-sm group-hover:text-red-400">{index + 1}.</span>
                                                <div className="flex flex-col text-left">
                                                    <span className="text-white text-lg font-medium">{track.title || 'Unknown Title'}</span>
                                                    {/* Corrected: Access artist name directly from nested Artist object */}
                                                    <span className="text-gray-400 text-sm">{track.Artist?.name || 'Unknown Artist'}</span>
                                                </div>
                                            </div>
                                            <span className="text-gray-500 text-sm">{track.views || '0'} views</span>
                                        </div>
                                    );
                                })
                            ) : (
                                <p className="text-gray-500 text-center py-8">No songs found for this playlist.</p>
                            )}
                        </div>
                    </div>
                )}
            </section>
        </div>
    );
}

export default AlbumsPage;
