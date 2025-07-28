// allsongdata.js
// This file serves as the centralized data source for all music-related content
// in your application, including albums, songs, artists, playlists, and user favorites.

// --- Albums Data ---
// Contains metadata for all albums.
export const albumsData = [
  { id: 'album-1', title: 'Echoes of Eternity', artist: 'Aurora Bloom', albumArt: 'https://placehold.co/150x150/1a1a1a/e0e0e0?text=Album+1', releaseDate: '2023-01-15' },
  { id: 'album-2', title: 'Starlight Serenade', artist: 'Lunar Drift', albumArt: 'https://placehold.co/150x150/2a2a2a/e0e0e0?text=Album+2', releaseDate: '2022-11-20' },
  { id: 'album-3', title: 'Crimson Horizon', artist: 'Solar Flare', albumArt: 'https://placehold.co/150x150/ff4500/ffffff?text=Album+3', releaseDate: '2024-04-01' },
  { id: 'album-4', title: 'Whispering Pines', artist: 'Forest Echoes', albumArt: 'https://placehold.co/150x150/228b22/ffffff?text=Album+4', releaseDate: '2023-09-10' },
  { id: 'album-5', title: 'Urban Rhythms', artist: 'City Beat', albumArt: 'https://placehold.co/150x150/4682b4/ffffff?text=Album+5', releaseDate: '2024-01-20' },
  { id: 'album-6', title: 'Crimson Tide', artist: 'Stellar Groove', albumArt: 'https://placehold.co/300x300/3a3a3a/e0e0e0?text=Album+3', releaseDate: '2024-03-01' },
  { id: 'album-7', title: 'Cybernetic Symphony', artist: 'Neon Circuit', albumArt: 'https://placehold.co/300x300/4a4a4a/e0e0e0?text=Album+4', releaseDate: '2023-07-05' },
  { id: 'album-8', title: 'Desert Echoes', artist: 'Whispering Sands', albumArt: 'https://placehold.co/300x300/5a5a5a/e0e0e0?text=Album+5', releaseDate: '2022-09-10' },
  { id: 'album-9', title: 'Cosmic Journey', artist: 'Galactic Dreams', albumArt: 'https://placehold.co/300x300/6a6a6a/e0e0e0?text=Album+6', releaseDate: '2024-01-28' },
  { id: 'album-10', title: 'Deep Ocean Blues', artist: 'Aqua Tones', albumArt: 'https://placehold.co/300x300/7a7a7a/e0e0e0?text=Album+7', releaseDate: '2023-04-12' },
  { id: 'album-11', title: 'Wildwood Melodies', artist: 'Verdant Sound', albumArt: 'https://placehold.co/300x300/8a8a8a/e0e0e0?text=Album+8', releaseDate: '2022-10-30' },
];

// --- Album Songs Data ---
// Links specific songs to their respective albums.
export const albumSongsData = [
  { id: 'song-101', albumId: 'album-1', title: 'Eternal Dawn', artist: 'Aurora Bloom', audio: 'https://res.cloudinary.com/db1go1uyh/video/upload/v1753443491/VANNDA_-_BABY_MAMA_OFFICIAL_MUSIC_VIDEO_xuykgc.mp3' },
  { id: 'song-102', albumId: 'album-1', title: 'Whispers in the Wind', artist: 'Aurora Bloom', audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { id: 'song-103', albumId: 'album-2', title: 'Lunar Glow', artist: 'Lunar Drift', audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
  { id: 'song-104', albumId: 'album-3', title: 'Solar Ascent', artist: 'Solar Flare', audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3' },
  { id: 'song-105', albumId: 'album-3', title: 'Dusty Trails', artist: 'Solar Flare', audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3' },
  { id: 'song-106', albumId: 'album-4', title: 'Ancient Trees', artist: 'Forest Echoes', audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3' },
  { id: 'song-107', albumId: 'album-5', title: 'Neon Streets', artist: 'City Beat', audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3' },
  { id: 'song-108', albumId: 'album-1', title: 'Crystal Tears', artist: 'Aurora Bloom', audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3' },
  { id: 'song-109', albumId: 'album-1', title: 'Silent Embrace', artist: 'Aurora Bloom', audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3' },
  { id: 'song-110', albumId: 'album-2', title: 'Nebula Dance', artist: 'Lunar Drift', audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3' },
  { id: 'song-111', albumId: 'album-2', title: 'Gravity\'s Pull', artist: 'Lunar Drift', audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3' },
  { id: 'song-112', albumId: 'album-6', title: 'Red River Flow', artist: 'Stellar Groove', audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3' },
  { id: 'song-113', albumId: 'album-6', title: 'Mountain Peak', artist: 'Stellar Groove', audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3' },
  { id: 'song-114', albumId: 'album-7', title: 'Digital Heartbeat', artist: 'Neon Circuit', audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3' },
  { id: 'song-115', albumId: 'album-7', title: 'Circuit Breaker', artist: 'Neon Circuit', audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3' },
  { id: 'song-116', albumId: 'album-8', title: 'Shifting Dunes', artist: 'Whispering Sands', audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3' },
];

// --- All Artists Data ---
// Comprehensive list of all artists with their details.
export const allArtistsData = [
  {
    id: 'artist-1',
    name: 'Aurora Bloom',
    genre: 'Electronic, Ambient',
    profileImage: 'https://placehold.co/200x200/1a1a1a/e0e0e0?text=Artist+1',
    bio: 'Aurora Bloom creates atmospheric electronic music that blends lush ambient textures with emotive melodies. Her work is celebrated for evoking vivid, dreamlike soundscapes.',
    coverImage: "https://placehold.co/1200x400/333333/FFFFFF?text=Aurora+Bloom+Banner",
  },
  {
    id: 'artist-2',
    name: 'Lunar Drift',
    genre: 'Synthwave',
    profileImage: 'https://placehold.co/200x200/2a2a2a/e0e0e0?text=Artist+2',
    bio: 'Lunar Drift is a synthwave duo known for their nostalgic sound inspired by retro-futurism, 80s synths, and cinematic storytelling through music.',
    coverImage: "https://placehold.co/1200x400/444444/DDDDDD?text=Lunar+Drift+Banner",
  },
  {
    id: 'artist-3',
    name: 'Solar Flare',
    genre: 'Rock, Alternative',
    profileImage: 'https://placehold.co/200x200/ff4500/e0e0e0?text=Artist+3',
    bio: 'Solar Flare delivers high-energy rock anthems with powerful vocals and driving guitar riffs, igniting stages with their explosive performances.',
    coverImage: "https://placehold.co/1200x400/ff4500/ffffff?text=Solar+Flare+Banner",
  },
  {
    id: 'artist-4',
    name: 'Forest Echoes',
    genre: 'Folk, Acoustic',
    profileImage: 'https://placehold.co/200x200/228b22/e0e0e0?text=Artist+4',
    bio: 'Forest Echoes weaves intricate acoustic melodies with heartfelt lyrics, drawing inspiration from nature and storytelling traditions.',
    coverImage: "https://placehold.co/1200x400/228b22/ffffff?text=Forest+Echoes+Banner",
  },
  {
    id: 'artist-5',
    name: 'City Beat',
    genre: 'Electronic, Hip-hop',
    profileImage: 'https://placehold.co/200x200/4682b4/e0e0e0?text=Artist+5',
    bio: 'City Beat captures the vibrant energy of urban landscapes through a fusion of electronic beats, soulful samples, and dynamic hip-hop rhythms.',
    coverImage: "https://placehold.co/1200x400/4682b4/ffffff?text=City+Beat+Banner",
  },
  {
    id: 'artist-6',
    name: 'Stellar Groove',
    genre: 'Funk, Soul',
    profileImage: 'https://placehold.co/200x200/3a3a3a/e0e0e0?text=Artist+6',
    bio: 'Stellar Groove is known for their infectious funk rhythms and soulful melodies that get everyone dancing.',
    coverImage: "https://placehold.co/1200x400/3a3a3a/e0e0e0?text=Stellar+Groove+Banner",
  },
  {
    id: 'artist-7',
    name: 'Neon Circuit',
    genre: 'Cyberpunk, Electronic',
    profileImage: 'https://placehold.co/200x200/4a4a4a/e0e0e0?text=Artist+7',
    bio: 'Neon Circuit creates futuristic electronic soundscapes, blending pulsating synths with gritty cyberpunk vibes.',
    coverImage: "https://placehold.co/1200x400/4a4a4a/e0e0e0?text=Neon+Circuit+Banner",
  },
  {
    id: 'artist-8',
    name: 'Whispering Sands',
    genre: 'World, Ambient',
    profileImage: 'https://placehold.co/200x200/5a5a5a/e0e0e0?text=Artist+8',
    bio: 'Whispering Sands draws inspiration from global sounds, creating expansive and meditative ambient music.',
    coverImage: "https://placehold.co/1200x400/5a5a5a/e0e0e0?text=Whispering+Sands+Banner",
  },
  {
    id: 'artist-9',
    name: 'Galactic Dreams',
    genre: 'Space Rock, Progressive',
    profileImage: 'https://placehold.co/200x200/6a6a6a/e0e0e0?text=Artist+9',
    bio: 'Galactic Dreams takes listeners on a cosmic journey with their blend of space rock and progressive elements.',
    coverImage: "https://placehold.co/1200x400/6a6a6a/e0e0e0?text=Galactic+Dreams+Banner",
  },
  {
    id: 'artist-10',
    name: 'Aqua Tones',
    genre: 'Blues, Jazz',
    profileImage: 'https://placehold.co/200x200/7a7a7a/e0e0e0?text=Artist+10',
    bio: 'Aqua Tones delivers smooth blues and jazz, reminiscent of late-night cityscapes and melancholic reflections.',
    coverImage: "https://placehold.co/1200x400/7a7a7a/e0e0e0?text=Aqua+Tones+Banner",
  },
  {
    id: 'artist-11',
    name: 'Verdant Sound',
    genre: 'Folk, Indie',
    profileImage: 'https://placehold.co/200x200/8a8a8a/e0e0e0?text=Artist+11',
    bio: 'Verdant Sound crafts organic folk and indie melodies, inspired by nature\'s beauty and quiet contemplation.',
    coverImage: "https://placehold.co/1200x400/8a8a8a/e0e0e0?text=Verdant+Sound+Banner",
  },
];

// --- All Songs Data ---
// A master list of all individual songs with their details.
export const initialAllSongs = [
  { id: 'song-101', title: 'Eternal Dawn', artist: 'Aurora Bloom', album: 'Echoes of Eternity', albumArt: 'https://placehold.co/150x150/1a1a1a/e0e0e0?text=Album+1', audio: 'https://res.cloudinary.com/db1go1uyh/video/upload/v1753443491/VANNDA_-_BABY_MAMA_OFFICIAL_MUSIC_VIDEO_xuykgc.mp3', views: '1.2M', songArt: 'https://placehold.co/150x150/1a1a1a/e0e0e0?text=Song+1' },
  { id: 'song-102', title: 'Whispers in the Wind', artist: 'Aurora Bloom', album: 'Echoes of Eternity', albumArt: 'https://placehold.co/150x150/1a1a1a/e0e0e0?text=Album+1', audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', views: '0.8M', songArt: 'https://placehold.co/150x150/1a1a1a/e0e0e0?text=Song+2' },
  { id: 'song-103', title: 'Lunar Glow', artist: 'Lunar Drift', album: 'Starlight Serenade', albumArt: 'https://placehold.co/150x150/2a2a2a/e0e0e0?text=Album+2', audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', views: '1.5M', songArt: 'https://placehold.co/150x150/2a2a2a/e0e0e0?text=Song+3' },
  { id: 'song-104', title: 'Solar Ascent', artist: 'Solar Flare', album: 'Crimson Horizon', albumArt: 'https://placehold.co/150x150/ff4500/ffffff?text=Album+3', audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', views: '0.9M', songArt: 'https://placehold.co/150x150/ff4500/ffffff?text=Song+4' },
  { id: 'song-105', title: 'Dusty Trails', artist: 'Solar Flare', album: 'Crimson Horizon', albumArt: 'https://placehold.co/150x150/ff4500/ffffff?text=Album+3', audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3', views: '0.7M', songArt: 'https://placehold.co/150x150/ff4500/ffffff?text=Song+5' },
  { id: 'song-106', title: 'Ancient Trees', artist: 'Forest Echoes', album: 'Whispering Pines', albumArt: 'https://placehold.co/150x150/228b22/ffffff?text=Album+4', audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3', views: '0.6M', songArt: 'https://placehold.co/150x150/228b22/ffffff?text=Song+6' },
  { id: 'song-107', title: 'Neon Streets', artist: 'City Beat', album: 'Urban Rhythms', albumArt: 'https://placehold.co/150x150/4682b4/ffffff?text=Album+5', audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3', views: '1.1M', songArt: 'https://placehold.co/150x150/4682b4/ffffff?text=Song+7' },
  { id: 'song-108', title: 'Crystal Tears', artist: 'Aurora Bloom', album: 'Echoes of Eternity', albumArt: 'https://placehold.co/150x150/1a1a1a/e0e0e0?text=Album+1', audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3', views: '0.5M', songArt: 'https://placehold.co/150x150/1a1a1a/e0e0e0?text=Song+8' },
  { id: 'song-109', title: 'Silent Embrace', artist: 'Aurora Bloom', album: 'Echoes of Eternity', albumArt: 'https://placehold.co/150x150/1a1a1a/e0e0e0?text=Album+1', audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3', views: '0.4M', songArt: 'https://placehold.co/150x150/1a1a1a/e0e0e0?text=Song+9' },
  { id: 'song-110', title: 'Nebula Dance', artist: 'Lunar Drift', album: 'Starlight Serenade', albumArt: 'https://placehold.co/150x150/2a2a2a/e0e0e0?text=Album+2', audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3', views: '1.0M', songArt: 'https://placehold.co/150x150/2a2a2a/e0e0e0?text=Song+10' },
  { id: 'song-111', title: 'Gravity\'s Pull', artist: 'Lunar Drift', album: 'Starlight Serenade', albumArt: 'https://placehold.co/150x150/2a2a2a/e0e0e0?text=Album+2', audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3', views: '0.6M', songArt: 'https://placehold.co/150x150/2a2a2a/e0e0e0?text=Song+11' },
  { id: 'song-112', title: 'Red River Flow', artist: 'Stellar Groove', album: 'Crimson Tide', albumArt: 'https://placehold.co/150x150/3a3a3a/e0e0e0?text=Album+3', audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3', views: '0.8M', songArt: 'https://placehold.co/150x150/3a3a3a/e0e0e0?text=Song+12' },
  { id: 'song-113', title: 'Mountain Peak', artist: 'Stellar Groove', album: 'Crimson Tide', albumArt: 'https://placehold.co/150x150/3a3a3a/e0e0e0?text=Album+3', audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3', views: '0.7M', songArt: 'https://placehold.co/150x150/3a3a3a/e0e0e0?text=Song+13' },
  { id: 'song-114', title: 'Digital Heartbeat', artist: 'Neon Circuit', album: 'Cybernetic Symphony', albumArt: 'https://placehold.co/150x150/4a4a4a/e0e0e0?text=Album+4', audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3', views: '0.9M', songArt: 'https://placehold.co/150x150/4a4a4a/e0e0e0?text=Song+14' },
  { id: 'song-115', title: 'Circuit Breaker', artist: 'Neon Circuit', album: 'Cybernetic Symphony', albumArt: 'https://placehold.co/150x150/4a4a4a/e0e0e0?text=Album+4', audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3', views: '0.5M', songArt: 'https://placehold.co/150x150/4a4a4a/e0e0e0?text=Song+15' },
  { id: 'song-116', title: 'Shifting Dunes', artist: 'Whispering Sands', album: 'Desert Echoes', albumArt: 'https://placehold.co/150x150/5a5a5a/e0e0e0?text=Album+5', audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3', views: '0.6M', songArt: 'https://placehold.co/150x150/5a5a5a/e0e0e0?text=Song+16' },
];

// --- Playlists Data ---
// Contains details for all available playlists.
// The previous 'playlists' array was removed to avoid duplication with 'initialPlaylists'.
// Please ensure your application now consistently uses 'initialPlaylists'.
export const initialPlaylists = [
  { id: 'playlist-1', title: 'Chill Vibes', description: 'Relaxing tunes for unwinding', cover: 'https://placehold.co/300x300/5a2d6e/FFFFFF?text=Playlist+1' },
  { id: 'playlist-2', title: 'Workout Mix', description: 'High-energy tracks for your routine', cover: 'https://placehold.co/300x300/8a3f2b/FFFFFF?text=Playlist+2' },
  { id: 'playlist-3', title: 'Morning Coffee', description: 'Smooth jazz and acoustic for your morning ritual', cover: 'https://placehold.co/300x300/a0522d/ffffff?text=Playlist+3' },
  { id: 'playlist-4', title: 'Study Beats', description: 'Instrumental and lo-fi to help you focus', cover: 'https://placehold.co/300x300/6a5acd/ffffff?text=Playlist+4' },
  { id: 'playlist-5', title: 'Party Starters', description: 'Upbeat tracks to get the party going', cover: 'https://placehold.co/300x300/dc143c/ffffff?text=Playlist+5' },
  { id: 'playlist-6', title: 'Focus Mode', description: 'Instrumental music for concentration', cover: 'https://placehold.co/300x300/2b6e5a/FFFFFF?text=Playlist+3' },
  { id: 'playlist-7', title: 'Road Trip Anthems', description: 'Sing along to these classics', cover: 'https://placehold.co/300x300/6e5a2d/FFFFFF?text=Playlist+4' },
  { id: 'playlist-8', title: 'Morning Jams', description: 'Start your day with good music', cover: 'https://placehold.co/300x300/2d6e6e/FFFFFF?text=Playlist+5' },
  { id: 'playlist-9', title: 'Evening Acoustic', description: 'Soft and soulful melodies', cover: 'https://placehold.co/300x300/6e2d4f/FFFFFF?text=Playlist+6' },
];

// --- Radio Stations Data ---
// List of pre-defined radio stations.
export const initialAllRadios = [
  { id: 'radio-1', title: 'Chill Radio', artist: 'Various Artists', image: 'https://placehold.co/150x150/333333/ffffff?text=Chill+Radio' },
  { id: 'radio-2', title: 'Energy Radio', artist: 'Various Artists', image: 'https://placehold.co/150x150/444444/ffffff?text=Energy+Radio' },
];

// --- Favorites Data ---
// Stores user-specific favorite song relationships.
// Each user can now only have one favorite song.
export const favoritesData = [
  { id: 'fav-1', userId: 'user-1', songId: 'song-101' }, // User-1 now only has song-101 as favorite
  { id: 'fav-2', userId: 'user-1', songId: 'song-102' },
];

// --- Playlist Songs Mapping ---
// Maps songs to playlists.
export const playlistSongs = [
  { id: 'ps-1', playlistId: 'playlist-1', songId: 'song-101' },
  { id: 'ps-2', playlistId: 'playlist-1', songId: 'song-102' },
  { id: 'ps-3', playlistId: 'playlist-2', songId: 'song-103' },
];