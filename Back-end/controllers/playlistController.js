// music-app-backend/controllers/playlistController.js
import models from '../models/index.js';

const { Playlist, User, Song, Artist } = models; // Include Artist to show song details

export const getAllPlaylists = async (req, res) => {
  try {
    const playlists = await Playlist.findAll({
      include: [
        { model: User, attributes: ['username', 'email'] },
        {
          model: Song,
          attributes: ['song_id', 'title', 'duration', 'audio_url', 'cover_image'],
          through: { attributes: [] }, // Exclude join table attributes
          include: [{ model: Artist, attributes: ['name'] }] // Include artist for each song
        }
      ]
    });
    res.status(200).json(playlists);
  } catch (error) {
    console.error('Error in getAllPlaylists:', error);
    res.status(500).json({ message: 'Failed to retrieve playlists', error: error.message });
  }
};

export const getPlaylistById = async (req, res) => {
  try {
    const playlist = await Playlist.findByPk(req.params.id, {
      include: [
        { model: User, attributes: ['username', 'email'] },
        {
          model: Song,
          attributes: ['song_id', 'title', 'duration', 'audio_url', 'cover_image'],
          through: { attributes: [] }, // Exclude join table attributes
          include: [{ model: Artist, attributes: ['name'] }] // Include artist for each song
        }
      ]
    });
    if (playlist) {
      res.status(200).json(playlist);
    } else {
      res.status(404).json({ message: 'Playlist not found' });
    }
  } catch (error) {
    console.error('Error in getPlaylistById:', error);
    res.status(500).json({ message: 'Failed to retrieve playlist', error: error.message });
  }
};

export const createPlaylist = async (req, res) => {
  try {
    const newPlaylist = await Playlist.create(req.body);
    res.status(201).json(newPlaylist);
  } catch (error) {
    console.error('Error in createPlaylist:', error);
    res.status(400).json({ message: 'Failed to create playlist', error: error.message });
  }
};

export const updatePlaylist = async (req, res) => {
  try {
    const [updatedRows] = await Playlist.update(req.body, {
      where: { playlist_id: req.params.id }
    });
    if (updatedRows > 0) {
      const updatedPlaylist = await Playlist.findByPk(req.params.id);
      res.status(200).json(updatedPlaylist);
    } else {
      res.status(404).json({ message: 'Playlist not found or no changes made' });
    }
  } catch (error) {
    console.error('Error in updatePlaylist:', error);
    res.status(400).json({ message: 'Failed to update playlist', error: error.message });
  }
};

export const deletePlaylist = async (req, res) => {
  try {
    const deleted = await Playlist.destroy({
      where: { playlist_id: req.params.id }
    });
    if (deleted > 0) {
      res.status(204).send(); // No Content
    } else {
      res.status(404).json({ message: 'Playlist not found' });
    }
  } catch (error) {
    console.error('Error in deletePlaylist:', error);
    res.status(500).json({ message: 'Failed to delete playlist', error: error.message });
  }
};