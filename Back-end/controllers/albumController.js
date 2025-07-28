// music-app-backend/controllers/albumController.js
import models from '../models/index.js';

const { Album, Artist, Song } = models;

export const getAllAlbums = async (req, res) => {
  try {
    const albums = await Album.findAll({
      include: [
        { model: Artist, attributes: ['name'] },
        { model: Song, attributes: ['song_id', 'title'] }
      ]
    });
    res.status(200).json(albums);
  } catch (error) {
    console.error('Error in getAllAlbums:', error);
    res.status(500).json({ message: 'Failed to retrieve albums', error: error.message });
  }
};

export const getAlbumById = async (req, res) => {
  try {
    const album = await Album.findByPk(req.params.id, {
      include: [
        { model: Artist, attributes: ['name'] },
        { model: Song, attributes: ['song_id', 'title', 'duration', 'audio_url', 'cover_image'] }
      ]
    });
    if (album) {
      res.status(200).json(album);
    } else {
      res.status(404).json({ message: 'Album not found' });
    }
  } catch (error) {
    console.error('Error in getAlbumById:', error);
    res.status(500).json({ message: 'Failed to retrieve album', error: error.message });
  }
};

export const createAlbum = async (req, res) => {
  try {
    const newAlbum = await Album.create(req.body);
    res.status(201).json(newAlbum);
  } catch (error) {
    console.error('Error in createAlbum:', error);
    res.status(400).json({ message: 'Failed to create album', error: error.message });
  }
};

export const updateAlbum = async (req, res) => {
  try {
    const [updatedRows] = await Album.update(req.body, {
      where: { album_id: req.params.id }
    });
    if (updatedRows > 0) {
      const updatedAlbum = await Album.findByPk(req.params.id);
      res.status(200).json(updatedAlbum);
    } else {
      res.status(404).json({ message: 'Album not found or no changes made' });
    }
  } catch (error) {
    console.error('Error in updateAlbum:', error);
    res.status(400).json({ message: 'Failed to update album', error: error.message });
  }
};

export const deleteAlbum = async (req, res) => {
  try {
    const deleted = await Album.destroy({
      where: { album_id: req.params.id }
    });
    if (deleted > 0) {
      res.status(204).send(); // No Content
    } else {
      res.status(404).json({ message: 'Album not found' });
    }
  } catch (error) {
    console.error('Error in deleteAlbum:', error);
    res.status(500).json({ message: 'Failed to delete album', error: error.message });
  }
};