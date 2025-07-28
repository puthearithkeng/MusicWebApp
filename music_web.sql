CREATE DATABASE IF NOT EXISTS musicplayer CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE musicplayer;

-- Database: music_app_db

CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    firebase_uid VARCHAR(128) NOT NULL UNIQUE,
    username VARCHAR(50),
    email VARCHAR(100) NOT NULL UNIQUE,
    profile_image TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS artists (
    artist_id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    genre VARCHAR(100),
    profile_image TEXT,
    bio TEXT,
    cover_image TEXT
);

CREATE TABLE IF NOT EXISTS albums (
    album_id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    artist_id VARCHAR(50),
    cover_image TEXT,
    release_date DATE,
    genre VARCHAR(50),
    description TEXT,
    CONSTRAINT fk_albums_artist FOREIGN KEY (artist_id) REFERENCES artists(artist_id)
);

CREATE TABLE IF NOT EXISTS songs (
    song_id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    artist_id VARCHAR(50),
    album_id VARCHAR(50),
    genre VARCHAR(50),
    duration TIME,
    release_date DATE,
    audio_url TEXT,
    cover_image TEXT,
    views INT DEFAULT 0,
    CONSTRAINT fk_songs_artist FOREIGN KEY (artist_id) REFERENCES artists(artist_id),
    CONSTRAINT fk_songs_album FOREIGN KEY (album_id) REFERENCES albums(album_id)
);

CREATE TABLE IF NOT EXISTS radios (
    radio_id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100),
    description TEXT,
    cover_image TEXT,
    stream_url TEXT
);

CREATE TABLE IF NOT EXISTS favorites (
    favorite_id VARCHAR(50) PRIMARY KEY,
    user_id INT,
    song_id VARCHAR(50),
    CONSTRAINT fk_favorites_user FOREIGN KEY (user_id) REFERENCES users(user_id),
    CONSTRAINT fk_favorites_song FOREIGN KEY (song_id) REFERENCES songs(song_id)
);

CREATE TABLE IF NOT EXISTS playlists (
    playlist_id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    cover_image TEXT,
    user_id INT,
    CONSTRAINT fk_playlists_user FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS playlist_songs (
    playlist_id VARCHAR(50),
    song_id VARCHAR(50),
    PRIMARY KEY (playlist_id, song_id),
    CONSTRAINT fk_playlist_songs_playlist FOREIGN KEY (playlist_id) REFERENCES playlists(playlist_id),
    CONSTRAINT fk_playlist_songs_song FOREIGN KEY (song_id) REFERENCES songs(song_id)
);



-- ---------------------------insert data---------------------------------------------
-- Insert artists
INSERT INTO artists (artist_id, name, genre, profile_image, bio, cover_image) VALUES
('artist-1', 'Aurora Bloom', 'Electronic, Ambient', 'https://placehold.co/200x200/1a1a1a/e0e0e0?text=Artist+1', 'Aurora Bloom creates atmospheric electronic music that blends lush ambient textures with emotive melodies. Her work is celebrated for evoking vivid, dreamlike soundscapes.', 'https://placehold.co/1200x400/333333/FFFFFF?text=Aurora+Bloom+Banner'),
('artist-2', 'Lunar Drift', 'Synthwave', 'https://placehold.co/200x200/2a2a2a/e0e0e0?text=Artist+2', 'Lunar Drift is a synthwave duo known for their nostalgic sound inspired by retro-futurism, 80s synths, and cinematic storytelling through music.', 'https://placehold.co/1200x400/444444/DDDDDD?text=Lunar+Drift+Banner'),
('artist-3', 'Solar Flare', 'Rock, Alternative', 'https://placehold.co/200x200/ff4500/e0e0e0?text=Artist+3', 'Solar Flare delivers high-energy rock anthems with powerful vocals and driving guitar riffs, igniting stages with their explosive performances.', 'https://placehold.co/1200x400/ff4500/ffffff?text=Solar+Flare+Banner'),
('artist-4', 'Forest Echoes', 'Folk, Acoustic', 'https://placehold.co/200x200/228b22/e0e0e0?text=Artist+4', 'Forest Echoes weaves intricate acoustic melodies with heartfelt lyrics, drawing inspiration from nature and storytelling traditions.', 'https://placehold.co/1200x400/228b22/ffffff?text=Forest+Echoes+Banner'),
('artist-5', 'City Beat', 'Electronic, Hip-hop', 'https://placehold.co/200x200/4682b4/e0e0e0?text=Artist+5', 'City Beat captures the vibrant energy of urban landscapes through a fusion of electronic beats, soulful samples, and dynamic hip-hop rhythms.', 'https://placehold.co/1200x400/4682b4/ffffff?text=City+Beat+Banner'),
('artist-6', 'Stellar Groove', 'Funk, Soul', 'https://placehold.co/200x200/3a3a3a/e0e0e0?text=Artist+6', 'Stellar Groove is known for their infectious funk rhythms and soulful melodies that get everyone dancing.', 'https://placehold.co/1200x400/3a3a3a/e0e0e0?text=Stellar+Groove+Banner'),
('artist-7', 'Neon Circuit', 'Cyberpunk, Electronic', 'https://placehold.co/200x200/4a4a4a/e0e0e0?text=Artist+7', 'Neon Circuit creates futuristic electronic soundscapes, blending pulsating synths with gritty cyberpunk vibes.', 'https://placehold.co/1200x400/4a4a4a/e0e0e0?text=Neon+Circuit+Banner'),
('artist-8', 'Whispering Sands', 'World, Ambient', 'https://placehold.co/200x200/5a5a5a/e0e0e0?text=Artist+8', 'Whispering Sands draws inspiration from global sounds, creating expansive and meditative ambient music.', 'https://placehold.co/1200x400/5a5a5a/e0e0e0?text=Whispering+Sands+Banner'),
('artist-9', 'Galactic Dreams', 'Space Rock, Progressive', 'https://placehold.co/200x200/6a6a6a/e0e0e0?text=Artist+9', 'Galactic Dreams takes listeners on a cosmic journey with their blend of space rock and progressive elements.', 'https://placehold.co/1200x400/6a6a6a/e0e0e0?text=Galactic+Dreams+Banner'),
('artist-10', 'Aqua Tones', 'Blues, Jazz', 'https://placehold.co/200x200/7a7a7a/e0e0e0?text=Artist+10', 'Aqua Tones delivers smooth blues and jazz, reminiscent of late-night cityscapes and melancholic reflections.', 'https://placehold.co/1200x400/7a7a7a/e0e0e0?text=Aqua+Tones+Banner'),
('artist-11', 'Verdant Sound', 'Folk, Indie', 'https://placehold.co/200x200/8a8a8a/e0e0e0?text=Artist+11', 'Verdant Sound crafts organic folk and indie melodies, inspired by nature\'s beauty and quiet contemplation.', 'https://placehold.co/1200x400/8a8a8a/e0e0e0?text=Verdant+Sound+Banner');

-- Insert albums
INSERT INTO albums (album_id, name, artist_id, cover_image, release_date, genre, description) VALUES
('album-1', 'Echoes of Eternity', 'artist-1', 'https://placehold.co/150x150/1a1a1a/e0e0e0?text=Album+1', '2023-01-15', 'Electronic', NULL),
('album-2', 'Starlight Serenade', 'artist-2', 'https://placehold.co/150x150/2a2a2a/e0e0e0?text=Album+2', '2022-11-20', 'Synthwave', NULL),
('album-3', 'Crimson Horizon', 'artist-3', 'https://placehold.co/150x150/ff4500/ffffff?text=Album+3', '2024-04-01', 'Rock', NULL),
('album-4', 'Whispering Pines', 'artist-4', 'https://placehold.co/150x150/228b22/ffffff?text=Album+4', '2023-09-10', 'Folk', NULL),
('album-5', 'Urban Rhythms', 'artist-5', 'https://placehold.co/150x150/4682b4/ffffff?text=Album+5', '2024-01-20', 'Electronic', NULL),
('album-6', 'Crimson Tide', 'artist-6', 'https://placehold.co/300x300/3a3a3a/e0e0e0?text=Album+3', '2024-03-01', 'Funk', NULL),
('album-7', 'Cybernetic Symphony', 'artist-7', 'https://placehold.co/300x300/4a4a4a/e0e0e0?text=Album+4', '2023-07-05', 'Electronic', NULL),
('album-8', 'Desert Echoes', 'artist-8', 'https://placehold.co/300x300/5a5a5a/e0e0e0?text=Album+5', '2022-09-10', 'World', NULL),
('album-9', 'Cosmic Journey', 'artist-9', 'https://placehold.co/300x300/6a6a6a/e0e0e0?text=Album+6', '2024-01-28', 'Space Rock', NULL),
('album-10', 'Deep Ocean Blues', 'artist-10', 'https://placehold.co/300x300/7a7a7a/e0e0e0?text=Album+7', '2023-04-12', 'Blues', NULL),
('album-11', 'Wildwood Melodies', 'artist-11', 'https://placehold.co/300x300/8a8a8a/e0e0e0?text=Album+8', '2022-10-30', 'Folk', NULL);

-- Insert songs (duration set to 4 minutes as placeholder)
INSERT INTO songs (song_id, title, artist_id, album_id, genre, duration, release_date, audio_url, cover_image, views) VALUES

('song-101', 'Eternal Dawn', 'artist-1', 'album-1', 'Electronic', '00:04:00', '2023-01-15', 'https://res.cloudinary.com/db1go1uyh/video/upload/v1753443491/VANNDA_-_BABY_MAMA_OFFICIAL_MUSIC_VIDEO_xuykgc.mp3', 'https://placehold.co/150x150/1a1a1a/e0e0e0?text=Album+1', 1200000),
('song-102', 'Whispers in the Wind', 'artist-1', 'album-1', 'Electronic', '00:04:00', '2023-01-15', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', 'https://placehold.co/150x150/1a1a1a/e0e0e0?text=Album+1', 800000),
('song-103', 'Lunar Glow', 'artist-2', 'album-2', 'Synthwave', '00:04:00', '2022-11-20', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', 'https://placehold.co/150x150/2a2a2a/e0e0e0?text=Album+2', 1500000),
('song-104', 'Solar Ascent', 'artist-3', 'album-3', 'Rock', '00:04:00', '2024-04-01', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', 'https://placehold.co/150x150/ff4500/ffffff?text=Album+3', 900000),
('song-105', 'Dusty Trails', 'artist-3', 'album-3', 'Rock', '00:04:00', '2024-04-01', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3', 'https://placehold.co/150x150/ff4500/ffffff?text=Album+3', 700000),
('song-106', 'Ancient Trees', 'artist-4', 'album-4', 'Folk', '00:04:00', '2023-09-10', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3', 'https://placehold.co/150x150/228b22/ffffff?text=Album+4', 600000),
('song-107', 'Neon Streets', 'artist-5', 'album-5', 'Electronic', '00:04:00', '2024-01-20', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3', 'https://placehold.co/150x150/4682b4/ffffff?text=Album+5', 1100000),
('song-108', 'Crystal Tears', 'artist-1', 'album-1', 'Electronic', '00:04:00', '2023-01-15', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3', 'https://placehold.co/150x150/1a1a1a/e0e0e0?text=Album+1', 500000),
('song-109', 'Silent Embrace', 'artist-1', 'album-1', 'Electronic', '00:04:00', '2023-01-15', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3', 'https://placehold.co/150x150/1a1a1a/e0e0e0?text=Album+1', 400000),
('song-110', 'Nebula Dance', 'artist-2', 'album-2', 'Synthwave', '00:04:00', '2022-11-20', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3', 'https://placehold.co/150x150/2a2a2a/e0e0e0?text=Album+2', 1000000),
('song-111', 'Gravity\'s Pull', 'artist-2', 'album-2', 'Synthwave', '00:04:00', '2022-11-20', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3', 'https://placehold.co/150x150/2a2a2a/e0e0e0?text=Album+2', 600000),
('song-112', 'Red River Flow', 'artist-6', 'album-6', 'Funk', '00:04:00', '2024-03-01', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3', 'https://placehold.co/150x150/3a3a3a/e0e0e0?text=Album+3', 800000),
('song-113', 'Mountain Peak', 'artist-6', 'album-6', 'Funk', '00:04:00', '2024-03-01', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3', 'https://placehold.co/150x150/3a3a3a/e0e0e0?text=Album+3', 700000),
('song-114', 'Digital Heartbeat', 'artist-7', 'album-7', 'Electronic', '00:04:00', '2023-07-05', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3', 'https://placehold.co/150x150/4a4a4a/e0e0e0?text=Album+4', 900000),
('song-115', 'Circuit Breaker', 'artist-7', 'album-7', 'Electronic', '00:04:00', '2023-07-05', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3', 'https://placehold.co/150x150/4a4a4a/e0e0e0?text=Album+4', 500000),
('song-116', 'Shifting Dunes', 'artist-8', 'album-8', 'World', '00:04:00', '2022-09-10', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3', 'https://placehold.co/150x150/5a5a5a/e0e0e0?text=Album+5', 600000),
('song-117', 'dude', 'artist-9', 'album-8', 'World', '00:04:00', '2022-09-10', 'https://res.cloudinary.com/dcpodvjy8/video/upload/v1753696461/MAGIC_-_Rude_Official_Video_fimqvg.mp3', 'https://placehold.co/150x150/5a5a5a/e0e0e0?text=Album+5', 600000);

-- Insert playlists (example with user_id = 1 and 2)
REPLACE INTO playlists (playlist_id, name, description, cover_image, user_id) VALUES
('playlist-1', 'Chill Vibes', 'Relaxing tunes for unwinding', 'https://placehold.co/300x300/5a2d6e/FFFFFF?text=Playlist+1', 1),
('playlist-2', 'Workout Mix', 'High-energy tracks for your routine', 'https://placehold.co/300x300/8a3f2b/FFFFFF?text=Playlist+2', 1);


INSERT INTO radios (radio_id, name, description, cover_image, stream_url) VALUES
('radio-1', 'Chillwave FM', 'Smooth chillwave and lo-fi beats to relax and study.', 'https://placehold.co/300x300/7b68ee/ffffff?text=Chillwave+FM', 'https://streaming.example.com/chillwavefm'),
('radio-2', 'Rock Nation', '24/7 classic and modern rock anthems.', 'https://placehold.co/300x300/b22222/ffffff?text=Rock+Nation', 'https://streaming.example.com/rocknation'),
('radio-3', 'Jazz Vibes', 'All-day jazz tunes from smooth to bebop.', 'https://placehold.co/300x300/8b4513/ffffff?text=Jazz+Vibes', 'https://streaming.example.com/jazzvibes'),
('radio-4', 'Electro Pulse', 'High-energy electronic and dance music.', 'https://placehold.co/300x300/1e90ff/ffffff?text=Electro+Pulse', 'https://streaming.example.com/electropulse'),
('radio-5', 'Acoustic Lounge', 'Unplugged and acoustic songs to unwind.', 'https://placehold.co/300x300/228b22/ffffff?text=Acoustic+Lounge', 'https://streaming.example.com/acousticlounge');

-- Insert playlist_songs
INSERT INTO playlist_songs (playlist_id, song_id) VALUES
('playlist-1', 'song-101'),
('playlist-1', 'song-102'),
('playlist-2', 'song-103');

-- Insert favorites (example with user_id = 1)
INSERT INTO favorites (favorite_id, user_id, song_id) VALUES
('fav-1', 1, 'song-101'),
('fav-2', 1, 'song-102');

-- --------------------------delete Users--------------------------------------------
DELETE FROM users WHERE user_id = 1;

-- drop database musicplayer;
-- DROP TABLE IF EXISTS users;
