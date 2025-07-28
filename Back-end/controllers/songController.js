// music-app-backend/controllers/songController.js
import models from '../models/index.js';

const { Song, Artist, Album } = models;

export const getAllSongs = async (req, res) => {
  try {
    const songs = await Song.findAll({
      include: [
        { model: Artist, attributes: ['name'] },
        { model: Album, attributes: ['name'] }
      ]
    });
    res.status(200).json(songs);
  } catch (error) {
    console.error('Error in getAllSongs:', error);
    res.status(500).json({ message: 'Failed to retrieve songs', error: error.message });
  }
};

export const getSongById = async (req, res) => {
  try {
    const song = await Song.findByPk(req.params.id, {
      include: [
        { model: Artist, attributes: ['name'] },
        { model: Album, attributes: ['name'] }
      ]
    });
    if (song) {
      res.status(200).json(song);
    } else {
      res.status(404).json({ message: 'Song not found' });
    }
  } catch (error) {
    console.error('Error in getSongById:', error);
    res.status(500).json({ message: 'Failed to retrieve song', error: error.message });
  }
};

export const createSong = async (req, res) => {
  try {
    const newSong = await Song.create(req.body);
    res.status(201).json(newSong);
  } catch (error) {
    console.error('Error in createSong:', error);
    res.status(400).json({ message: 'Failed to create song', error: error.message });
  }
};

export const updateSong = async (req, res) => {
  try {
    const [updatedRows] = await Song.update(req.body, {
      where: { song_id: req.params.id }
    });
    if (updatedRows > 0) {
      const updatedSong = await Song.findByPk(req.params.id);
      res.status(200).json(updatedSong);
    } else {
      res.status(404).json({ message: 'Song not found or no changes made' });
    }
  } catch (error) {
    console.error('Error in updateSong:', error);
    res.status(400).json({ message: 'Failed to update song', error: error.message });
  }
};

export const deleteSong = async (req, res) => {
  try {
    const deleted = await Song.destroy({
      where: { song_id: req.params.id }
    });
    if (deleted > 0) {
      res.status(204).send(); // No Content
    } else {
      res.status(404).json({ message: 'Song not found' });
    }
  } catch (error) {
    console.error('Error in deleteSong:', error);
    res.status(500).json({ message: 'Failed to delete song', error: error.message });
  }
};