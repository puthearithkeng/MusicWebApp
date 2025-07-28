import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate, useOutletContext } from 'react-router-dom';
import { useData } from './datacontext'; // your context for data
// Removed: import { Play, Mic, Disc, ListMusic } from 'lucide-react'; // Icons for different content types


// --- Reusable UI Components (for a full file, these are included here) ---

/**
 * ContentCard component for displaying individual music items (song, album, artist, radio, playlist).
 * Enhanced with type-specific details and a hover overlay for play functionality.
 */
const ContentCard = ({ item, type, onClick, index = 0, showHoverOverlay = false }) => { // Kept showHoverOverlay default to false
  // Determine the image URL based on the item type, with robust fallbacks
  let imageUrl = item?.albumArt || item?.profileImage || item?.image || 'https://placehold.co/150x150/333333/FFFFFF?text=No+Art';
  // Determine the main title, with robust fallbacks
  let title = item?.title || item?.name || 'Unknown Title';
  let subtitle = '';
  // Determine any extra information to display (views, release date), with robust fallbacks
  let extraInfo = item?.views || item?.releaseDate; // Added extraInfo from Music.jsx

  switch (type) {
    case 'song':
      subtitle = item?.artist || '';
      break;
    case 'artist':
      subtitle = item?.genre || '';
      break;
    case 'album':
      subtitle = item?.artist || '';
      break;
    case 'playlist':
      subtitle = item?.creator || '';
      break;
    case 'radio': // Assuming radio has similar structure, adjust if needed
      subtitle = 'Radio Station';
      break;
    default:
      subtitle = '';
  }

  // Fallback image for broken links or missing images
  const handleError = (e) => {
    e.target.onerror = null; // Prevent infinite loop if fallback also fails
    e.target.src = 'https://placehold.co/150x150/333333/FFFFFF?text=No+Art';
  };

  const hoverOverlayClass = showHoverOverlay ? 'group-hover:opacity-100' : '';

  return (
    <div
      className={`group flex-shrink-0 w-40 sm:w-48 bg-gray-900 p-3 rounded-xl shadow-xl border border-gray-800
                  transform hover:scale-105 hover:-translate-y-2 hover:shadow-2xl hover:border-red-500
                  transition-all duration-300 cursor-pointer relative overflow-hidden`}
      onClick={() => onClick(item, type)}
      role="button"
      tabIndex={0}
      aria-label={`${title} by ${subtitle}`}
    >
      <div className="relative w-full h-40 sm:h-48 rounded-md overflow-hidden mb-3 shadow-lg">
        <img
          src={imageUrl}
          alt={title}
          onError={handleError}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {/* Play button overlay - only for song/radio types and if showHoverOverlay is true */}
        {showHoverOverlay && (type === 'song' || type === 'radio') && (
          <div className={`absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 transition-opacity duration-300 ${hoverOverlayClass}`}>
            <button className="p-3 bg-red-600 rounded-full text-white shadow-lg hover:bg-red-700 transition-colors duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.456A1 1 0 008 8.3v3.4a1 1 0 001.555.844l3.945-1.972a1 1 0 000-1.688L9.555 7.456z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}
      </div>
      <h3 className="text-base font-semibold text-white mb-0.5 truncate">{title}</h3>
      <p className="text-xs text-gray-400 truncate">{subtitle}</p>
      {extraInfo && <p className="text-xs text-gray-500 mt-1">{extraInfo}</p>} {/* Added extraInfo display */}
    </div>
  );
};


/**
 * HorizontalScrollContainer component for displaying horizontally scrollable content sections.
 * It includes a title and an optional "More" link.
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

// --- Main SearchPage Component ---

const SearchPage = () => {
  const location = useLocation();
  const navigate = useNavigate(); // Keep navigate for potential future external links or initial routing
  const { songs, artists, albums, radios, playlists, loading, error } = useData();
  const { setCurrentPlayingSong, allSongs } = useOutletContext();

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredSongs, setFilteredSongs] = useState([]);
  const [filteredArtists, setFilteredArtists] = useState([]);
  const [filteredAlbums, setFilteredAlbums] = useState([]);
  const [filteredRadios, setFilteredRadios] = useState([]);
  const [filteredPlaylists, setFilteredPlaylists] = useState([]);
  const [combinedResults, setCombinedResults] = useState([]); // To hold all top results for 'All' section

  // State for internal views
  const [currentView, setCurrentView] = useState('search-results'); // 'search-results', 'artist-profile', 'album-songs', 'playlist-songs'
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);

  // Extract search query from URL and reset view
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('q');
    setSearchQuery(query || '');
    setCurrentView('search-results'); // Always go back to search results when query changes
    setSelectedArtist(null);
    setSelectedAlbum(null);
    setSelectedPlaylist(null);
  }, [location.search]);

  // Filter data based on search query or set all data if no query
  useEffect(() => {
    if (loading || error) {
      setFilteredSongs([]);
      setFilteredArtists([]);
      setFilteredAlbums([]);
      setFilteredRadios([]);
      setFilteredPlaylists([]);
      setCombinedResults([]);
      return;
    }

    if (!searchQuery) {
        // If no search query, show all available content for "Explore" sections
        setFilteredSongs(songs);
        setFilteredArtists(artists);
        setFilteredAlbums(albums);
        setFilteredRadios(radios);
        setFilteredPlaylists(playlists);
        setCombinedResults([]); // No "Top Results" when no search query
        return;
    }

    // If there's a search query, filter the content
    const q = searchQuery.toLowerCase();

    const newFilteredSongs = songs.filter(
      (song) => song.title?.toLowerCase().includes(q) || artists.find(a => a.artistId === song.artistId)?.name?.toLowerCase().includes(q)
    );
    setFilteredSongs(newFilteredSongs);

    const newFilteredArtists = artists.filter(
      (artist) => artist.name?.toLowerCase().includes(q) || artist.genre?.toLowerCase().includes(q)
    );
    setFilteredArtists(newFilteredArtists);

    const newFilteredAlbums = albums.filter(
      (album) => album.name?.toLowerCase().includes(q) || album.Artist?.name?.toLowerCase().includes(q)
    );
    setFilteredAlbums(newFilteredAlbums);

    const newFilteredRadios = radios.filter(
      (radio) => radio.title?.toLowerCase().includes(q) || radio.description?.toLowerCase().includes(q)
    );
    setFilteredRadios(newFilteredRadios);

    const newFilteredPlaylists = playlists.filter(
      (pl) => pl.name?.toLowerCase().includes(q) || pl.creator?.toLowerCase().includes(q)
    );
    setFilteredPlaylists(newFilteredPlaylists);

    // Combine top results for the "Top Results" section (only for active search)
    const topCombined = [
      ...newFilteredSongs.slice(0, 3).map((item) => ({ ...item, _type: 'song' })),
      ...newFilteredArtists.slice(0, 3).map((item) => ({ ...item, _type: 'artist' })),
      ...newFilteredAlbums.slice(0, 3).map((item) => ({ ...item, _type: 'album' })),
      ...newFilteredPlaylists.slice(0, 3).map((item) => ({ ...item, _type: 'playlist' })),
      ...newFilteredRadios.slice(0, 3).map((item) => ({ ...item, _type: 'radio' })),
    ].sort(() => 0.5 - Math.random()); // Shuffle to mix types in 'All'

    setCombinedResults(topCombined);

  }, [searchQuery, songs, artists, albums, radios, playlists, loading, error]);


  // Play song handler
  const handlePlayTrack = useCallback((songItem) => {
    // Ensure 'allSongs' is passed to setCurrentPlayingSong if it's the global list
    // If filteredSongs is the current context for playback, use filteredSongs
    setCurrentPlayingSong(songItem, songs); // Assuming 'songs' from useData is the full list
  }, [setCurrentPlayingSong, songs]);


  const handleSelectArtist = useCallback((artistItem) => {
    setSelectedArtist(artistItem);
    setCurrentView('artist-profile');
  }, []);

  const handleSelectAlbum = useCallback((albumItem) => {
    setSelectedAlbum(albumItem);
    setCurrentView('album-songs');
  }, []);

  const handleSelectPlaylist = useCallback((playlistItem) => {
    setSelectedPlaylist(playlistItem);
    setCurrentView('playlist-songs');
  }, []);

  const handleBack = useCallback(() => {
    if (currentView === 'album-songs' || currentView === 'playlist-songs' || currentView === 'artist-profile') {
      setCurrentView('search-results'); // Always go back to search results
      setSelectedArtist(null);
      setSelectedAlbum(null);
      setSelectedPlaylist(null);
    }
  }, [currentView]);


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-500"></div>
        <p className="ml-4 text-xl">Loading content...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-red-500">
        <p>Error loading data: {error.message}</p>
      </div>
    );
  }

  // Determine if any results were found across all categories for an active search
  const hasSearchResults = searchQuery && (
    filteredSongs.length > 0 ||
    filteredArtists.length > 0 ||
    filteredAlbums.length > 0 ||
    filteredRadios.length > 0 ||
    filteredPlaylists.length > 0
  );

  return (
    <div className="min-h-screen bg-black font-inter py-8 px-4 md:px-8 lg:px-12 pt-20">

      {/* Conditional Back Button */}
      {(currentView === 'artist-profile' || currentView === 'album-songs' || currentView === 'playlist-songs') && (
        <button
            onClick={handleBack}
            className="text-gray-400 hover:text-red-500 transition-colors duration-200 flex items-center mb-6 p-2 rounded-lg hover:bg-gray-800 active:scale-95"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span className="ml-2 text-sm">Back to Search Results</span>
        </button>
      )}

      {/* --- Search Results / Explore Music View --- */}
      <div className={`${currentView === 'search-results' ? 'block' : 'hidden'} bg-black text-white rounded-xl shadow-2xl`}>
          {searchQuery ? (
            <>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-8">
                Search Results for "<span className="text-red-500">{searchQuery}</span>"
              </h1>

              {!hasSearchResults && (
                <p className="text-center text-gray-400 py-10">
                  No results found for "<span className="text-red-500">{searchQuery}</span>". Please try a different search term.
                </p>
              )}

              {/* Display 'Top Results' grid (only when searching) */}
              {combinedResults.length > 0 && (
                <section className="mb-8 md:mb-12">
                  <h2 className="text-2xl sm:text-3xl font-bold text-white pl-2 drop-shadow mb-6">Top Results</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                    {combinedResults.map((item, index) => (
                      <div
                        key={`${item._type}-${item.id || item.songId || item.artistId || index}`}
                        className="flex items-center space-x-4 bg-gray-800 p-3 rounded-lg cursor-pointer hover:bg-gray-700 transition"
                        onClick={() => {
                          if (item._type === 'song' || item._type === 'radio') handlePlayTrack(item);
                          else if (item._type === 'artist') handleSelectArtist(item);
                          else if (item._type === 'album') handleSelectAlbum(item);
                          else if (item._type === 'playlist') handleSelectPlaylist(item);
                        }}
                      >
                        <img
                          src={item?.albumArt || item?.profileImage || item?.image || 'https://placehold.co/60x60/333333/FFFFFF?text=No+Art'}
                          alt={item?.title || item?.name}
                          onError={(e) => e.target.src = 'https://placehold.co/60x60/333333/FFFFFF?text=No+Art'}
                          className="w-16 h-16 object-cover rounded-md flex-shrink-0"
                        />
                        <div className="flex flex-col flex-grow truncate">
                          <span className="text-white text-base font-medium truncate">{item?.title || item?.name || 'Unknown'}</span>
                          <span className="text-gray-400 text-sm truncate">
                            {item._type === 'song' && (artists.find(a => a.artistId === item.artistId)?.name || 'Song')}
                            {item._type === 'artist' && (item?.genre || 'Artist')}
                            {item._type === 'album' && (item.Artist?.name || 'Album')}
                            {item._type === 'playlist' && (item?.creator || 'Playlist')}
                            {item._type === 'radio' && 'Radio Station'}
                          </span>
                        </div>
                        {(item._type === 'song' || item._type === 'radio') && (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-400 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.456A1 1 0 008 8.3v3.4a1 1 0 001.555.844l3.945-1.972a1 1 0 000-1.688L9.555 7.456z" clipRule="evenodd" />
                            </svg>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Categorized Horizontal Scroll Sections for filtered search results */}
              {filteredSongs.length > 0 && (
                  <HorizontalScrollContainer title="Songs">
                      {filteredSongs.map((song, index) => (
                          <ContentCard key={song.songId || `song-${index}`} item={{...song, _type: 'song'}} type="song" onClick={handlePlayTrack} index={index} showHoverOverlay={true} />
                      ))}
                  </HorizontalScrollContainer>
              )}

              {filteredArtists.length > 0 && (
                  <HorizontalScrollContainer title="Artists">
                      {filteredArtists.map((artist, index) => (
                          <ContentCard key={artist.artistId || `artist-${index}`} item={{...artist, _type: 'artist'}} type="artist" onClick={handleSelectArtist} index={index} showHoverOverlay={false} />
                      ))}
                  </HorizontalScrollContainer>
              )}

              {filteredAlbums.length > 0 && (
                  <HorizontalScrollContainer title="Albums">
                      {filteredAlbums.map((album, index) => (
                          <ContentCard key={album.albumId || `album-${index}`} item={{...album, _type: 'album'}} type="album" onClick={handleSelectAlbum} index={index} showHoverOverlay={false} />
                  ))}
              </HorizontalScrollContainer>
          )}

          {filteredRadios.length > 0 && (
              <HorizontalScrollContainer title="Radios">
                  {filteredRadios.map((radio, index) => (
                      <ContentCard key={radio.id || `radio-${index}`} item={{...radio, _type: 'radio'}} type="radio" onClick={handlePlayTrack} index={index} showHoverOverlay={true} />
                  ))}
              </HorizontalScrollContainer>
          )}

          {filteredPlaylists.length > 0 && (
              <HorizontalScrollContainer title="Playlists">
                  {filteredPlaylists.map((playlist, index) => (
                      <ContentCard key={playlist.id || `playlist-${index}`} item={{...playlist, _type: 'playlist'}} type="playlist" onClick={handleSelectPlaylist} index={index} showHoverOverlay={false} />
                  ))}
              </HorizontalScrollContainer>
          )}

          {/* "You Might Also Like" / "Explore More" Sections when searching */}
          {(hasSearchResults || !hasSearchResults) && ( // Show this section always when search query is active
            <>
              <h2 className="text-2xl sm:text-3xl font-bold text-white pl-2 drop-shadow mb-8 mt-12">You Might Also Like</h2>

              {songs.length > 0 && ( // Use original 'songs' data, slice to limit
                  <HorizontalScrollContainer title="More Songs">
                      {songs.slice(0, 15).map((song, index) => (
                          <ContentCard key={`more-song-${song.songId || index}`} item={{...song, _type: 'song'}} type="song" onClick={handlePlayTrack} index={index} showHoverOverlay={true} />
                      ))}
                  </HorizontalScrollContainer>
              )}

              {artists.length > 0 && ( // Use original 'artists' data, slice to limit
                  <HorizontalScrollContainer title="Popular Artists">
                      {artists.slice(0, 15).map((artist, index) => (
                          <ContentCard key={`more-artist-${artist.artistId || index}`} item={{...artist, _type: 'artist'}} type="artist" onClick={handleSelectArtist} index={index} showHoverOverlay={false} />
                      ))}
                  </HorizontalScrollContainer>
              )}

              {albums.length > 0 && ( // Use original 'albums' data, slice to limit
                  <HorizontalScrollContainer title="More Albums">
                      {albums.slice(0, 15).map((album, index) => (
                          <ContentCard key={`more-album-${album.albumId || index}`} item={{...album, _type: 'album'}} type="album" onClick={handleSelectAlbum} index={index} showHoverOverlay={false} />
                      ))}
                  </HorizontalScrollContainer>
              )}

              {playlists.length > 0 && ( // Use original 'playlists' data, slice to limit
                  <HorizontalScrollContainer title="More Playlists">
                      {playlists.slice(0, 15).map((playlist, index) => (
                          <ContentCard key={`more-playlist-${playlist.id || index}`} item={{...playlist, _type: 'playlist'}} type="playlist" onClick={handleSelectPlaylist} index={index} showHoverOverlay={false} />
                      ))}
                  </HorizontalScrollContainer>
              )}
            </>
          )}
        </>
      ) : (
        // --- Display General Content / "Explore Music" Sections when no search query ---
        <>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-8">
                Explore Music
            </h1>
            <p className="text-gray-400 text-lg mb-8">Discover new songs, artists, albums, and more!</p>

            {/* These sections use unfiltered data because searchQuery is empty */}
            {filteredSongs.length > 0 && ( // filteredSongs will contain 'songs' array when no search
                <HorizontalScrollContainer title="All Songs">
                    {filteredSongs.map((song, index) => (
                        <ContentCard key={song.songId || `song-${index}`} item={{...song, _type: 'song'}} type="song" onClick={handlePlayTrack} index={index} showHoverOverlay={true} />
                    ))}
                </HorizontalScrollContainer>
            )}

            {filteredArtists.length > 0 && (
                <HorizontalScrollContainer title="Featured Artists">
                    {filteredArtists.map((artist, index) => (
                        <ContentCard key={artist.artistId || `artist-${index}`} item={{...artist, _type: 'artist'}} type="artist" onClick={handleSelectArtist} index={index} showHoverOverlay={false} />
                    ))}
                </HorizontalScrollContainer>
            )}

            {filteredAlbums.length > 0 && (
                <HorizontalScrollContainer title="New Albums">
                    {filteredAlbums.map((album, index) => (
                        <ContentCard key={album.albumId || `album-${index}`} item={{...album, _type: 'album'}} type="album" onClick={handleSelectAlbum} index={index} showHoverOverlay={false} />
                    ))}
                </HorizontalScrollContainer>
            )}

            {filteredRadios.length > 0 && (
                <HorizontalScrollContainer title="Popular Radios">
                    {filteredRadios.map((radio, index) => (
                        <ContentCard key={radio.id || `radio-${index}`} item={{...radio, _type: 'radio'}} type="radio" onClick={handlePlayTrack} index={index} showHoverOverlay={true} />
                    ))}
                </HorizontalScrollContainer>
            )}

            {filteredPlaylists.length > 0 && (
                <HorizontalScrollContainer title="Curated Playlists">
                    {filteredPlaylists.map((playlist, index) => (
                        <ContentCard key={playlist.id || `playlist-${index}`} item={{...playlist, _type: 'playlist'}} type="playlist" onClick={handleSelectPlaylist} index={index} showHoverOverlay={false} />
                    ))}
                </HorizontalScrollContainer>
            )}
        </>
      )}
      </div> {/* End of search-results / explore view div */}

      {/* --- Artist Profile View (Conditionally Rendered) --- */}
      <div className={`${currentView === 'artist-profile' ? 'block' : 'hidden'} bg-black p-4 md:p-8 rounded-xl shadow-2xl`}>
          {selectedArtist && (
              <>
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
                                  onClick={() => Array.isArray(songs) && songs.filter(song => song.artistId === selectedArtist.artistId).length > 0 && handlePlayTrack(songs.filter(song => song.artistId === selectedArtist.artistId)[0])}
                                  className="mt-4 bg-gradient-to-r from-red-600 to-pink-600 text-white px-8 py-3 rounded-full shadow-lg hover:from-red-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-500 focus:ring-opacity-50 text-md font-bold"
                              >
                                  PLAY ALL
                              </button>
                          </div>
                      </div>
                  </section>

                  <section className="py-12 px-4 md:px-8 lg:px-16">
                      <div className="flex justify-between items-center mb-8">
                          <h2 className="text-3xl md:text-4xl font-extrabold text-white drop-shadow">
                              Popular <span className="text-red-500">Tracks</span>
                          </h2>
                      </div>
                      <div className="flex overflow-x-auto space-x-6 pb-4 horizontal-scroll-container relative">
                          {Array.isArray(songs) && songs.filter(song => song.artistId === selectedArtist.artistId)
                              .sort((a, b) => parseInt(b.views || 0) - parseInt(a.views || 0)).slice(0, 6)
                              .map((track, index) => (
                                  <ContentCard key={track.songId} item={track} type="song" onClick={handlePlayTrack} index={index} showHoverOverlay={true} />
                              ))}
                      </div>
                  </section>

                  <section className="py-12 px-4 md:px-8 lg:px-16">
                      <h2 className="text-3xl md:text-4xl font-extrabold mb-8 text-white drop-shadow">
                          All <span className="text-red-500">Tracks</span> by {selectedArtist.name || 'Unknown Artist'}
                      </h2>
                      <div className="border-t border-gray-800 pt-6 mb-12 max-h-96 overflow-y-auto custom-scrollbar">
                          {Array.isArray(songs) && songs.filter(song => song.artistId === selectedArtist.artistId).length > 0 ? (
                              songs.filter(song => song.artistId === selectedArtist.artistId).map((track, index) => (
                                  <div
                                      key={track.songId}
                                      className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-800 transition-colors duration-200 cursor-pointer group hover:shadow-md hover:scale-[1.01]"
                                      onClick={() => handlePlayTrack(track)}
                                  >
                                      <div className="flex items-center space-x-4">
                                          <span className="text-gray-500 text-sm group-hover:text-red-400">{index + 1}.</span>
                                          <div className="flex flex-col text-left">
                                              <span className="text-white text-lg font-medium">{track.title || 'Unknown Title'}</span>
                                              <span className="text-gray-400 text-sm">{artists.find(a => a.artistId === track.artistId)?.name || 'Unknown Artist'}</span>
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

                  <section className="py-12 px-4 md:px-8 lg:px-16">
                      <h2 className="text-3xl md:text-4xl font-extrabold text-white drop-shadow mb-6">
                          Albums by <span className="text-purple-500">{selectedArtist.name || 'Unknown Artist'}</span>
                      </h2>
                      <div className="flex overflow-x-auto space-x-6 pb-4 horizontal-scroll-container">
                          {Array.isArray(albums) && albums.filter(album => album.artistId === selectedArtist.artistId).map((album, index) => (
                              <ContentCard key={album.albumId} item={album} type="album" onClick={handleSelectAlbum} index={index} showHoverOverlay={true} />
                          ))}
                      </div>
                  </section>

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

      {/* --- Album Songs View (Conditionally Rendered) --- */}
      <div className={`${currentView === 'album-songs' ? 'block' : 'hidden'} bg-black p-4 md:p-8 rounded-xl shadow-2xl`}>
          {selectedAlbum && (
              <>
                  <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
                      <img
                          src={selectedAlbum.coverImage || 'https://placehold.co/192x192/333333/FFFFFF?text=Album'}
                          alt={selectedAlbum.name || 'Album Art'}
                          className="w-48 h-48 object-cover rounded-lg shadow-xl border border-gray-700 flex-shrink-0"
                      />
                      <div className="text-center md:text-left">
                          <p className="text-sm text-gray-400 mb-1">ALBUM</p>
                          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-2">{selectedAlbum.name || 'Unknown Album'}</h2>
                          <p className="text-lg text-gray-300 mb-4">{selectedAlbum.Artist?.name || 'Unknown Artist'}</p>
                          <p className="text-sm text-gray-500">Release: {selectedAlbum.releaseDate || 'Unknown Date'}</p>
                      </div>
                  </div>

                  <div className="border-t border-gray-800 pt-6">
                      <h3 className="text-2xl font-bold text-white mb-4">Tracks</h3>
                      {selectedAlbum.Songs && selectedAlbum.Songs.length > 0 ? (
                          selectedAlbum.Songs.map((track, index) => (
                              <div
                                  key={track.song_id}
                                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-800 transition-colors duration-200 cursor-pointer group hover:shadow-md hover:scale-[1.01]"
                                  onClick={() => handlePlayTrack(track)}
                              >
                                  <div className="flex items-center space-x-4">
                                      <span className="text-gray-500 text-sm group-hover:text-red-400">{index + 1}.</span>
                                      <div className="flex flex-col text-left">
                                          <span className="text-white text-lg font-medium">{track.title || 'Unknown Title'}</span>
                                          <span className="text-gray-400 text-sm">{track.Artist?.name || 'Unknown Artist'}</span>
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

      {/* --- Playlist Songs View (Conditionally Rendered) --- */}
      <div className={`${currentView === 'playlist-songs' ? 'block' : 'hidden'} bg-black p-4 md:p-8 rounded-xl shadow-2xl`}>
          {selectedPlaylist && (
              <>
                  <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
                      <img
                          src={selectedPlaylist.image || 'https://placehold.co/192x192/333333/FFFFFF?text=Playlist'}
                          alt={selectedPlaylist.name || 'Playlist Art'}
                          className="w-48 h-48 object-cover rounded-lg shadow-xl border border-gray-700 flex-shrink-0"
                      />
                      <div className="text-center md:text-left">
                          <p className="text-sm text-gray-400 mb-1">PLAYLIST</p>
                          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-2">{selectedPlaylist.name || 'Unknown Playlist'}</h2>
                          <p className="text-lg text-gray-300 mb-4">{selectedPlaylist.creator || 'Unknown Creator'}</p>
                          <p className="text-sm text-gray-500">Total Songs: {selectedPlaylist.Songs ? selectedPlaylist.Songs.length : 0}</p>
                      </div>
                  </div>

                  <div className="border-t border-gray-800 pt-6">
                      <h3 className="text-2xl font-bold text-white mb-4">Songs in Playlist</h3>
                      {selectedPlaylist.Songs && selectedPlaylist.Songs.length > 0 ? (
                          selectedPlaylist.Songs.map((track, index) => (
                              <div
                                  key={track.song_id}
                                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-800 transition-colors duration-200 cursor-pointer group hover:shadow-md hover:scale-[1.01]"
                                  onClick={() => handlePlayTrack(track)} // Changed to handlePlayTrack for consistency
                              >
                                  <div className="flex items-center space-x-4">
                                      <span className="text-gray-500 text-sm group-hover:text-red-400">{index + 1}.</span>
                                      <div className="flex flex-col text-left">
                                          <span className="text-white text-lg font-medium">{track.title || 'Unknown Title'}</span>
                                          <span className="text-gray-400 text-sm">{track.Artist?.name || 'Unknown Artist'}</span>
                                      </div>
                                  </div>
                                  <span className="text-gray-500 text-sm">{track.views || '0'} views</span>
                              </div>
                          ))
                      ) : (
                          <p className="text-gray-500 text-center py-8">No songs found for this playlist.</p>
                      )}
                  </div>
              </>
          )}
      </div>

    </div>
  );
};

export default SearchPage;
