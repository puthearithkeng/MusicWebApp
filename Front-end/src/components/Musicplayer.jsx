import './Allstyle.css'; // Assuming Allstyle.css is available

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useData } from './datacontext'; // Import useData to access favorites and toggleFavorite

const MusicPlayer = ({ initialSong = null, allSongs, setCurrentPlayingSong }) => {
  // Music Player States
  const [currentPlaying, setCurrentPlayingInternal] = useState(initialSong);
  // MODIFIED: Initialize isPlaying to false to prevent autoplay on load
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isPlayerVisible, setIsPlayerVisible] = useState(initialSong !== null);
  const [currentAudioTime, setCurrentAudioTime] = useState(0);
  const [totalAudioDuration, setTotalAudioDuration] = useState(0);
  const [isAudioReady, setIsAudioReady] = useState(true);

  const audioRef = useRef(new Audio());

  // Access favorites and toggleFavorite from DataContext
  const { favorites, toggleFavorite } = useData();

  // Effect to handle initial song changes and loading
  useEffect(() => {
    if (initialSong) {
      setCurrentPlayingInternal(initialSong);
      setIsPlayerVisible(true);
      const audio = audioRef.current;
      // Support both audio and songUrl properties
      const src = initialSong.songUrl || initialSong.audio || '';
      if (audio.src !== src || audio.src === '') {
        audio.src = src;
        audio.load();
        setCurrentAudioTime(0);
        setProgress(0);
        setIsAudioReady(false);
        // REMOVED: Automatic audio.play() here. Playback will now be user-initiated.
        // The `isPlaying` state will control whether it plays via `onCanPlayThrough`
        // or the `togglePlayPause` function.
      }
    } else {
      // If no initial song, reset player state
      setCurrentPlayingInternal(null);
      setIsPlayerVisible(false);
      setIsPlaying(false); // Ensure it's paused if no song
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = ''; // Clear audio source
      }
    }
  }, [initialSong, currentPlaying]); // Removed isPlaying from dependencies as it's now controlled by user interaction

  // Helper function to format time (e.g., 3:45)
  const formatTime = (time) => {
    if (isNaN(time) || time < 0) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Callback for when audio time updates
  const handleTimeUpdate = useCallback(() => {
    const audio = audioRef.current;
    if (audio && !isNaN(audio.duration) && isFinite(audio.duration) && audio.duration > 0) {
      setCurrentAudioTime(audio.currentTime);
      setProgress((audio.currentTime / audio.duration) * 100);
    }
  }, []);

  // Callback for when audio data is loaded
  const handleLoadedData = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      const duration = !isNaN(audio.duration) && isFinite(audio.duration) && audio.duration > 0
                                 ? audio.duration
                                 : 1; // Default to 1 to avoid division by zero
      setTotalAudioDuration(duration);
      setIsAudioReady(true); // Audio is now ready to play
    } else {
      setTotalAudioDuration(0);
      setIsAudioReady(false);
    }
  }, []);

  // Callback to play the next song in the playlist
  const playNextSong = useCallback(() => {
    // 'allSongs' prop now represents the *current contextual list* of playable songs
    if (!allSongs || allSongs.length === 0) {
      console.warn("Cannot play next song: 'allSongs' prop is missing or empty.");
      return;
    }
    // Ensure there's a current song to find its index
    if (currentPlaying) {
      // Find the index of the current song within the *current contextual list*
      const currentIndex = allSongs.findIndex(song => song.id === currentPlaying.id);
      // If the current song is not found (index is -1), or it's the last song,
      // loop back to the beginning (index 0). Otherwise, go to the next index.
      const nextIndex = (currentIndex + 1) % allSongs.length;
      const nextSong = allSongs[nextIndex];
      // Update internal state to the next song
      setCurrentPlayingInternal(nextSong);
      // Notify parent component, passing the next song AND the current contextual list
      if (setCurrentPlayingSong) {
        setCurrentPlayingSong(nextSong, allSongs);
      }
      // Support both audio and songUrl properties
      if (audioRef.current) {
        audioRef.current.src = nextSong.songUrl || nextSong.audio || '';
        audioRef.current.load();
      }
      setIsPlaying(true);
    } else {
      // If no song is currently playing, start with the first song if available
      if (allSongs.length > 0) {
        setCurrentPlayingInternal(allSongs[0]);
        if (setCurrentPlayingSong) {
          setCurrentPlayingSong(allSongs[0], allSongs);
        }
        setIsPlaying(true);
      } else {
        console.warn("No current song and no songs in 'allSongs' to play next.");
      }
    }
  }, [currentPlaying, allSongs, setCurrentPlayingSong]);

  // Callback to play the previous song in the playlist
  const playPreviousSong = useCallback(() => {
    // 'allSongs' prop now represents the *current contextual list* of playable songs
    if (!allSongs || allSongs.length === 0) {
      console.warn("Cannot play previous song: 'allSongs' prop is missing or empty.");
      return;
    }
    // Ensure there's a current song to find its index
    if (currentPlaying) {
      // Find the index of the current song within the *current contextual list*
      const currentIndex = allSongs.findIndex(song => song.id === currentPlaying.id);
      // Calculate the previous index, looping to the end of the list if at the beginning (index 0)
      const prevIndex = (currentIndex - 1 + allSongs.length) % allSongs.length;
      const prevSong = allSongs[prevIndex];
      // Update internal state to the previous song
      setCurrentPlayingInternal(prevSong);
      // Notify parent component, passing the previous song AND the current contextual list
      if (setCurrentPlayingSong) {
        setCurrentPlayingSong(prevSong, allSongs);
      }
      // Support both audio and songUrl properties
      if (audioRef.current) {
        audioRef.current.src = prevSong.songUrl || prevSong.audio || '';
        audioRef.current.load();
      }
      setIsPlaying(true);
    } else {
      // If no song is currently playing, start with the last song if available
      if (allSongs.length > 0) {
        setCurrentPlayingInternal(allSongs[allSongs.length - 1]);
        if (setCurrentPlayingSong) {
          setCurrentPlayingSong(allSongs[allSongs.length - 1], allSongs);
        }
        setIsPlaying(true);
      } else {
        console.warn("No current song and no songs in 'allSongs' to play previous.");
      }
    }
  }, [currentPlaying, allSongs, setCurrentPlayingSong]);

  // Callback for when audio playback ends
  const handleAudioEnded = useCallback(() => {
    playNextSong(); // Automatically play the next song
  }, [playNextSong]);

  // Effect to attach and clean up audio event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Define event handler functions
    const onLoadedData = () => {
      const duration = !isNaN(audio.duration) && isFinite(audio.duration) && audio.duration > 0 ? audio.duration : 1;
      setTotalAudioDuration(duration);
      setIsAudioReady(true);
    };

    const onTimeUpdate = () => {
      setCurrentAudioTime(audio.currentTime);
      setProgress((audio.currentTime / audio.duration) * 100 || 0);
    };

    const onEnded = () => {
      playNextSong();
    };

    const onCanPlayThrough = () => {
      setIsAudioReady(true);
      // This condition ensures play only happens if isPlaying is true (user clicked play)
      if (isPlaying && audio.paused) {
        audio.play().catch(e => {
          console.error("Autoplay prevented on canplaythrough:", e);
          setIsPlaying(false); // If autoplay fails, update state
        });
      }
    };

    const onError = (e) => {
      console.error("Audio Error:", e);
      setIsPlaying(false); // If there's an error, stop playing
    };

    // Add event listeners
    audio.addEventListener('loadeddata', onLoadedData);
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('canplaythrough', onCanPlayThrough);
    audio.addEventListener('error', onError);

    // Clean up event listeners on component unmount or dependencies change
    return () => {
      audio.removeEventListener('loadeddata', onLoadedData);
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('canplaythrough', onCanPlayThrough);
      audio.removeEventListener('error', onError);
    };
  }, [isPlaying, playNextSong]); // isPlaying is a dependency because onCanPlayThrough uses it

  // Effect to update audio volume when the volume state changes
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = volume;
    }
  }, [volume]);

  // Function to toggle play/pause state
  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      // Optimistically set isPlaying to true for immediate UI feedback
      setIsPlaying(true);
      audio.play().catch(e => {
        console.error("Playback error on toggle:", e);
        // If play fails (e.g., autoplay prevented), revert state
        setIsPlaying(false);
      });
    }
  };

  // Function to handle seeking (scrubbing) through the audio
  const handleSeek = (e) => {
    const audio = audioRef.current;
    const newTime = parseFloat(e.target.value);
    if (audio && !isNaN(totalAudioDuration) && totalAudioDuration > 0) {
      audio.currentTime = newTime;
      setCurrentAudioTime(newTime);
      setProgress((newTime / totalAudioDuration) * 100);
    }
  };

  // Function to handle volume changes
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };

  // Function to toggle player visibility
  const togglePlayerVisibility = () => {
    setIsPlayerVisible(!isPlayerVisible);
  };

  // Handler to toggle favorite status of the current playing song
  const handleToggleFavorite = () => {
    if (currentPlaying) {
      toggleFavorite(currentPlaying.id);
    }
  };

  // Helper function to get the appropriate volume icon based on current volume
  const getVolumeIcon = (currentVolume) => {
    if (currentVolume === 0) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.383 3.067A1 1 0 0110 3.998v12a1 1 0 01-1.707.708L4 12.414H2a1 1 0 01-1-1v-2a1 1 0 011-1h2L8.293 3.293a1 1 0 011.09-.226zM14.75 7.25a.75.75 0 00-1.5 0v5.5a.75.75 0 001.5 0V7.25z" clipRule="evenodd" />
        </svg>
      );
    } else if (currentVolume < 0.5) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.383 3.067A1 1 0 0110 3.998v12a1 1 0 01-1.707.708L4 12.414H2a1 1 0 01-1-1v-2a1 1 0 011-1h2L8.293 3.293a1 1 0 011.09-.226zM15.586 10l.707-.707a1 1 0 00-1.414-1.414L14 8.586l-.707-.707a1 1 0 00-1.414 1.414L12.586 10l-.707.707a1 1 0 001.414 1.414L14 11.414l.707.707a1 1 0 001.414-1.414L15.586 10z" clipRule="evenodd" />
        </svg>
      );
    } else {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.383 3.067A1 1 0 0110 3.998v12a1 1 0 01-1.707.708L4 12.414H2a1 1 0 01-1-1v-2a1 1 0 011-1h2L8.293 3.293a1 1 0 011.09-.226zM16 8a1 1 0 011 1v2a1 1 0 01-1 1h-.01a1 1 0 01-.707-.293l-.707-.707a1 1 0 010-1.414l.707-.707A1 1 0 0115 8h1zM14 6a1 1 0 011 1v6a1 1 0 01-2 0V7a1 1 0 011-1z" clipRule="evenodd" />
        </svg>
      );
    }
  };

  return (
    // Render the player only if a current song is set
    currentPlaying && (
      <div className={`fixed bottom-0 left-0 w-full bg-gray-900 border-t border-gray-700 py-3 px-4 flex flex-col md:flex-row items-center justify-center shadow-2xl z-50 transition-transform duration-300 transform ${isPlayerVisible ? 'translate-y-0' : 'translate-y-full'} rounded-t-xl`}>
        {/* The actual HTML5 audio element */}
        <audio ref={audioRef} preload="auto" />

        {/* Song Info Section (Album Art, Title, Artist) */}
        <div className="flex items-center space-x-3 mb-2 md:mb-0 md:w-1/4 flex-shrink-0">
          <div className="relative group w-16 h-16 flex-shrink-0">
            {/* Album art, with a placeholder if not available */}
            <img
              src={currentPlaying.albumArt || "https://placehold.co/100x100/333333/FFFFFF?text=Music"}
              alt={currentPlaying.title}
              className="w-full h-full object-cover rounded-md shadow-md border border-gray-700 transition-transform duration-300 group-hover:scale-110"
            />
          </div>
          <div className="flex flex-col justify-center overflow-hidden">
            <h4 className="text-lg font-bold text-white truncate">{currentPlaying.title}</h4>
            <p className="text-sm text-gray-300 truncate">{currentPlaying.artist}</p>
          </div>
        </div>

        {/* Playback Controls Section (Prev, Play/Pause, Next, Seek Bar) */}
        <div className="flex flex-col items-center flex-grow mx-4 w-full md:w-1/2">
          <div className="flex items-center space-x-3 mb-2">
            {/* Previous Song Button */}
            <button onClick={playPreviousSong} className="text-gray-300 hover:text-red-500 transition-colors duration-200 p-1.5 rounded-full hover:bg-gray-800 active:scale-90">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14V5" />
              </svg>
            </button>
            {/* Play/Pause Button */}
            <button
              onClick={togglePlayPause}
              className="bg-gradient-to-r from-red-600 to-pink-600 text-white p-3 rounded-full shadow-lg hover:from-red-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 active:scale-90 focus:outline-none focus:ring-4 focus:ring-red-500 focus:ring-opacity-50"
            >
              {isPlaying ? (
                // Pause icon
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              ) : (
                // Play icon
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.456A1 1 0 008 8.3v3.4a1 1 0 001.555.844l3.945-1.972a1 1 0 000-1.688L9.555 7.456z" clipRule="evenodd" />
                </svg>
              )}
            </button>
            {/* Next Song Button */}
            <button onClick={playNextSong} className="text-gray-300 hover:text-red-500 transition-colors duration-200 p-1.5 rounded-full hover:bg-gray-800 active:scale-90">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7m6 0V5" />
              </svg>
            </button>
          </div>
          {/* Progress Bar (Seeker) */}
          <input
            type="range"
            min="0"
            max={totalAudioDuration} // Max value is the total duration
            value={currentAudioTime} // Current position in the song
            onChange={handleSeek} // Handle seeking when user interacts
            className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer range-lg accent-red-500"
          />
          {/* Current Time and Total Duration Display */}
          <div className="flex justify-between text-xs text-gray-400 mt-1 w-full">
            <span>{formatTime(currentAudioTime)}</span>
            <span>{formatTime(totalAudioDuration)}</span>
          </div>
        </div>

        {/* Volume Control Section and Favorite Button */}
        <div className="flex items-center space-x-2 md:ml-4 mt-4 md:mt-0 md:w-1/4 justify-end flex-shrink-0">
          {/* Favorite Button */}
          {currentPlaying && (
            <button
              onClick={handleToggleFavorite}
              className="text-gray-400 hover:text-red-500 transition-colors duration-200 p-1 rounded-full hover:bg-gray-700 focus:outline-none"
              title={favorites.includes(currentPlaying.id) ? "Remove from favorites" : "Add to favorites"}
            >
              {favorites.includes(currentPlaying.id) ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              )}
            </button>
          )}

          <span className="text-gray-400">
            {getVolumeIcon(volume)} {/* Display volume icon based on current volume */}
          </span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume} // Current volume level
            onChange={handleVolumeChange} // Handle volume changes
            className="w-20 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer range-sm accent-red-500"
          />
        </div>

        {/* Player Visibility Toggle Button */}
        <button
          onClick={togglePlayerVisibility}
          className="absolute -top-6 right-4 bg-gray-900 text-gray-400 p-1 rounded-t-lg hover:text-red-500 hover:bg-gray-800 transition-colors duration-200 focus:outline-none z-50"
        >
          {isPlayerVisible ? (
            // Icon to hide player
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
          ) : (
            // Icon to show player
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          )}
        </button>
      </div>
    )
  );
};

export default MusicPlayer;
