import './Allstyle.css';
import React, { useState, useEffect, useCallback } from 'react'; // Added useCallback for memoization
import { useOutletContext } from 'react-router-dom';
import { useData } from './datacontext';
// import Loading from './Loading';

// Reusable Components (Re-defining for self-containment, ideally these would be imported)
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

const ContentCard = ({ item, type, onClick, index = 0, showHoverOverlay = true }) => {
    let imageUrl = item?.albumArt || item?.profileImage || item?.image || 'https://placehold.co/150x150/333333/FFFFFF?text=No+Art';
    let title = item?.title || item?.name || 'Unknown Title';
    let subtitle = item?.artist || item?.genre || 'Unknown Artist/Genre';
    let extraInfo = item?.views || item?.releaseDate;

    const hoverOverlayClass = showHoverOverlay ? 'group-hover:opacity-100' : '';

    return (
        <div
            className={`group flex-shrink-0 w-40 sm:w-48 bg-gray-900 p-3 rounded-xl shadow-xl border border-gray-800
                        transform hover:scale-105 hover:-translate-y-2 hover:shadow-2xl hover:border-red-500
                        transition-all duration-300 cursor-pointer relative overflow-hidden`}
            onClick={() => onClick(item, type)}
        >
            <div className="relative w-full h-40 sm:h-48 rounded-md overflow-hidden mb-3 shadow-lg">
                <img
                    src={imageUrl}
                    alt={title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/150x150/333333/FFFFFF?text=No+Art'; }}
                />
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

const ArtistPage = () => {
    const [currentView, setCurrentView] = useState('all-artists');
    const [selectedArtist, setSelectedArtist] = useState(null);
    const [selectedAlbum, setSelectedAlbum] = useState(null);

    const { songs, artists, albums } = useData();
    const { setCurrentPlayingSong } = useOutletContext();

    useEffect(() => {
        const styleTag = document.createElement('style');
        styleTag.innerHTML = `
            html, body {
                margin-top: 0 !important;
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

    const handlePlayTrack = useCallback((track) => {
        setCurrentPlayingSong(track, songs);
    }, [setCurrentPlayingSong, songs]);

    const handleSelectArtist = useCallback((artist) => {
        setSelectedArtist(artist);
        setCurrentView('artist-profile');
    }, []);

    const handleSelectAlbum = useCallback((album) => {
        setSelectedAlbum(album);
        setCurrentView('album-songs');
        const albumSongs = songs.filter(song => song.album === album.title && song.artist === album.artist);
        if (albumSongs.length > 0) {
            setCurrentPlayingSong(albumSongs[0], albumSongs);
        } else {
            setCurrentPlayingSong(null, []);
        }
    }, [setCurrentPlayingSong, songs]);

    const handleBack = useCallback(() => {
        if (currentView === 'album-songs') {
            if (selectedArtist) {
                setCurrentView('artist-profile');
            } else {
                setCurrentView('all-artists');
            }
            setSelectedAlbum(null);
            // DO NOT clear the song here. Keep the current song playing.
            // setCurrentPlayingSong(null, songs); // REMOVE OR COMMENT THIS LINE
        } else if (currentView === 'artist-profile') {
            setCurrentView('all-artists');
            setSelectedArtist(null);
            // DO NOT clear the song here. Keep the current song playing.
            // setCurrentPlayingSong(null, songs); // REMOVE OR COMMENT THIS LINE
        }
    }, [currentView, selectedArtist, setCurrentPlayingSong, songs]); // Removed `songs` from dependencies if not needed for setting player.

    if (!songs || songs.length === 0 || !artists || artists.length === 0 || !albums || albums.length === 0) {
        return <Loading />;
    }

    return (
        <div className={`min-h-screen bg-black font-inter py-8 px-4 md:px-8 lg:px-16 pb-8`}>
            {/* All Artists View */}
            <div className={`${currentView === 'all-artists' ? 'block' : 'hidden'} bg-black text-white rounded-xl shadow-2xl`}>
                <h2 className="text-4xl md:text-5xl font-extrabold mb-12 text-white text-center drop-shadow">
                    All <span className="text-red-500">Artists</span>
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 relative">
                    {artists.map((artist, index) => (
                        <ContentCard key={artist.id} item={artist} type="artist" onClick={handleSelectArtist} index={index} showHoverOverlay={false} />
                    ))}
                </div>
            </div>

            {/* Artist Profile View */}
            <div className={`${currentView === 'artist-profile' ? 'block' : 'hidden'} bg-black p-4 md:p-8 rounded-xl shadow-2xl`}>
                {selectedArtist && (
                    <>
                        <button
                            onClick={handleBack}
                            className="text-gray-400 hover:text-red-500 transition-colors duration-200 flex items-center mb-6 p-2 rounded-lg hover:bg-gray-800 active:scale-95"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <span className="ml-2 text-sm">Back to All Artists</span>
                        </button>

                        <section
                            className="relative w-full h-80 flex items-end p-8 bg-cover bg-center rounded-b-xl shadow-2xl"
                            style={{ backgroundImage: `url(${selectedArtist.coverImage || 'https://placehold.co/1200x320/333333/FFFFFF?text=Artist+Cover'})` }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-0 rounded-b-xl"></div>
                            <div className="relative z-10 flex items-center gap-6">
                                <img
                                    src={selectedArtist.profileImage || 'https://placehold.co/128x128/333333/FFFFFF?text=Artist'}
                                    alt={selectedArtist.name || 'Artist Image'}
                                    className="w-32 h-32 rounded-full object-cover border-4 border-red-500 shadow-lg"
                                />
                                <div>
                                    <h1 className="text-5xl font-extrabold text-white leading-tight drop-shadow-lg">
                                        {selectedArtist.name || 'Unknown Artist'}
                                    </h1>
                                    <p className="text-lg text-gray-300">
                                        {selectedArtist.genre || 'Unknown Genre'}
                                    </p>
                                    <button
                                        onClick={() => {
                                            const artistSongs = songs.filter(song => song.artist === selectedArtist.name);
                                            if (artistSongs.length > 0) handlePlayTrack(artistSongs[0]);
                                        }}
                                        className="mt-4 bg-gradient-to-r from-red-600 to-pink-600 text-white px-8 py-3 rounded-full shadow-lg hover:from-red-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-500 focus:ring-opacity-50 text-md font-bold"
                                    >
                                        PLAY ALL
                                    </button>
                                </div>
                            </div>
                        </section>

                        <HorizontalScrollContainer title="Popular Tracks">
                            {songs.filter(song => song.artist === selectedArtist.name)
                                .sort((a, b) => parseInt(b.views || 0) - parseInt(a.views || 0))
                                .slice(0, 6)
                                .map((track, index) => (
                                    <ContentCard key={track.id} item={track} type="track" onClick={handlePlayTrack} index={index} showHoverOverlay={true} />
                                ))}
                        </HorizontalScrollContainer>

                        <section className="py-12 px-4 md:px-8 lg:px-16">
                            <h2 className="text-3xl md:text-4xl font-extrabold mb-8 text-white drop-shadow">
                                All <span className="text-red-500">Tracks</span> by {selectedArtist.name || 'Unknown Artist'}
                            </h2>
                            <div className="border-t border-gray-800 pt-6 mb-12 max-h-96 overflow-y-auto custom-scrollbar">
                                {songs.filter(song => song.artist === selectedArtist.name).length > 0 ? (
                                    songs.filter(song => song.artist === selectedArtist.name).map((track, index) => (
                                        <div
                                            key={track.id}
                                            className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-800 transition-colors duration-200 cursor-pointer group hover:shadow-md hover:scale-[1.01]"
                                            onClick={() => handlePlayTrack(track)}
                                        >
                                            <div className="flex items-center space-x-4">
                                                <span className="text-gray-500 text-sm group-hover:text-red-400">{index + 1}.</span>
                                                <div className="flex flex-col text-left">
                                                    <span className="text-white text-lg font-medium">{track.title || 'Unknown Title'}</span>
                                                    <span className="text-gray-400 text-sm">{track.artist || 'Unknown Artist'}</span>
                                                </div>
                                            </div>
                                            <span className="text-gray-500 text-sm">{track.views || '0'} views</span>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500 text-center py-8">No tracks found for this artist.</p>
                                )}
                            </div>
                        </section>

                        <HorizontalScrollContainer title={`Albums by ${selectedArtist.name || 'Unknown Artist'}`}>
                            {albums.filter(album => album.artist === selectedArtist.name).map((album, index) => (
                                <ContentCard key={album.id} item={album} type="album" onClick={handleSelectAlbum} index={index} showHoverOverlay={true} />
                            ))}
                        </HorizontalScrollContainer>

                        <section className="py-12 px-4 md:px-8 lg:px-16">
                            <h2 className="text-3xl md:text-4xl font-extrabold text-white drop-shadow mb-6">
                                About <span className="text-orange-500">{selectedArtist.name || 'Unknown Artist'}</span>
                            </h2>
                            <div className="bg-gray-900 p-8 rounded-xl shadow-xl border border-gray-700">
                                <p className="text-lg text-gray-300 leading-relaxed">{selectedArtist.bio || 'No biography available.'}</p>
                            </div>
                        </section>
                    </>
                )}
            </div>

            {/* Album Songs View */}
            <div className={`${currentView === 'album-songs' ? 'block' : 'hidden'} bg-black p-4 md:p-8 rounded-xl shadow-2xl`}>
                <button
                    onClick={handleBack}
                    className="text-gray-400 hover:text-red-500 transition-colors duration-200 flex items-center mb-6 p-2 rounded-lg hover:bg-gray-800 active:scale-95"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="ml-2 text-sm">Back to {selectedArtist ? 'Artist Profile' : 'All Artists'}</span>
                </button>

                {selectedAlbum && (
                    <>
                        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
                            <img
                                src={selectedAlbum.albumArt || 'https://placehold.co/192x192/333333/FFFFFF?text=Album'}
                                alt={selectedAlbum.title || 'Album Art'}
                                className="w-48 h-48 object-cover rounded-lg shadow-xl border border-gray-700 flex-shrink-0"
                            />
                            <div className="text-center md:text-left">
                                <p className="text-sm text-gray-400 mb-1">ALBUM</p>
                                <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-2">{selectedAlbum.title || 'Unknown Album'}</h2>
                                <p className="text-lg text-gray-300 mb-4">{selectedAlbum.artist || 'Unknown Artist'}</p>
                                <p className="text-sm text-gray-500">Release: {selectedAlbum.releaseDate || 'Unknown Date'}</p>
                            </div>
                        </div>

                        <div className="border-t border-gray-800 pt-6">
                            <h3 className="text-2xl font-bold text-white mb-4">Tracks</h3>
                            {songs.filter(song => song.album === selectedAlbum.title && song.artist === selectedAlbum.artist).length > 0 ? (
                                songs.filter(song => song.album === selectedAlbum.title && song.artist === selectedAlbum.artist).map((track, index) => (
                                    <div
                                        key={track.id}
                                        className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-800 transition-colors duration-200 cursor-pointer group hover:shadow-md hover:scale-[1.01]"
                                        onClick={() => handlePlayTrack(track)}
                                    >
                                        <div className="flex items-center space-x-4">
                                            <span className="text-gray-500 text-sm group-hover:text-red-400">{index + 1}.</span>
                                            <div className="flex flex-col text-left">
                                                <span className="text-white text-lg font-medium">{track.title || 'Unknown Title'}</span>
                                                <span className="text-gray-400 text-sm">{track.artist || 'Unknown Artist'}</span>
                                            </div>
                                        </div>
                                        <span className="text-gray-500 text-sm">{track.views || '0'} views</span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 text-center py-8">No songs found for this album.</p>
                            )}
                        </div>
                    </>
                )}
            </div>

            <script src="https://cdn.tailwindcss.com"></script>
        </div>
    );
};

export default ArtistPage; 