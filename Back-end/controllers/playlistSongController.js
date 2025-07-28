// music-app-backend/controllers/playlistSongController.js
import models from '../models/index.js';

const { PlaylistSong, Playlist, Song, Artist } = models;

export const getAllPlaylistSongs = async (req, res) => {
  try {
    const playlistSongs = await PlaylistSong.findAll({
      include: [
        { model: Playlist, attributes: ['playlist_id', 'name'] },
        { 
          model: Song, 
          attributes: ['song_id', 'title', 'duration'], 
          include: [{ model: Artist, attributes: ['name'] }]
        }
      ]
    });
    res.status(200).json(playlistSongs);
  } catch (error) {
    console.error('Error in getAllPlaylistSongs:', error);
    res.status(500).json({ message: 'Failed to retrieve playlist songs', error: error.message });
  }
};

export const addSongToPlaylist = async (req, res) => {
  try {
    const { playlist_id, song_id } = req.body;
    if (!playlist_id || !song_id) {
      return res.status(400).json({ message: 'Both playlist_id and song_id are required' });
    }

    const existingEntry = await PlaylistSong.findOne({ where: { playlist_id, song_id } });
    if (existingEntry) {
      return res.status(409).json({ message: 'Song already exists in this playlist' });
    }

    const newPlaylistSong = await PlaylistSong.create({ playlist_id, song_id });
    res.status(201).json(newPlaylistSong);
  } catch (error) {
    console.error('Error in addSongToPlaylist:', error);
    res.status(400).json({ message: 'Failed to add song to playlist', error: error.message });
  }
};

export const removeSongFromPlaylist = async (req, res) => {
  try {
    const { playlist_id, song_id } = req.params;
    if (!playlist_id || !song_id) {
      return res.status(400).json({ message: 'Both playlist_id and song_id are required for deletion' });
    }

    const deleted = await PlaylistSong.destroy({
      where: { playlist_id, song_id }
    });

    if (deleted > 0) {
      res.status(204).send(); // No Content
    } else {
      res.status(404).json({ message: 'Song not found in this playlist' });
    }
  } catch (error) {
    console.error('Error in removeSongFromPlaylist:', error);
    res.status(500).json({ message: 'Failed to remove song from playlist', error: error.message });
  }
};
