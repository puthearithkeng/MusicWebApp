// music-app-backend/controllers/artistController.js
import models from '../models/index.js';

const { Artist, Song, Album } = models;

export const getAllArtists = async (req, res) => {
  try {
    const artists = await Artist.findAll({
      include: [
        { model: Song, attributes: ['song_id', 'title'] },
        { model: Album, attributes: ['album_id', 'name'] }
      ]
    });
    res.status(200).json(artists);
  } catch (error) {
    console.error('Error in getAllArtists:', error);
    res.status(500).json({ message: 'Failed to retrieve artists', error: error.message });
  }
};

export const getArtistById = async (req, res) => {
  try {
    const artist = await Artist.findByPk(req.params.id, {
      include: [
        { model: Song, attributes: ['song_id', 'title', 'duration', 'audio_url', 'cover_image'] },
        { model: Album, attributes: ['album_id', 'name', 'cover_image'] }
      ]
    });
    if (artist) {
      res.status(200).json(artist);
    } else {
      res.status(404).json({ message: 'Artist not found' });
    }
  } catch (error) {
    console.error('Error in getArtistById:', error);
    res.status(500).json({ message: 'Failed to retrieve artist', error: error.message });
  }
};

export const createArtist = async (req, res) => {
  try {
    const newArtist = await Artist.create(req.body);
    res.status(201).json(newArtist);
  } catch (error) {
    console.error('Error in createArtist:', error);
    res.status(400).json({ message: 'Failed to create artist', error: error.message });
  }
};

export const updateArtist = async (req, res) => {
  try {
    const [updatedRows] = await Artist.update(req.body, {
      where: { artist_id: req.params.id }
    });
    if (updatedRows > 0) {
      const updatedArtist = await Artist.findByPk(req.params.id);
      res.status(200).json(updatedArtist);
    } else {
      res.status(404).json({ message: 'Artist not found or no changes made' });
    }
  } catch (error) {
    console.error('Error in updateArtist:', error);
    res.status(400).json({ message: 'Failed to update artist', error: error.message });
  }
};

export const deleteArtist = async (req, res) => {
  try {
    const deleted = await Artist.destroy({
      where: { artist_id: req.params.id }
    });
    if (deleted > 0) {
      res.status(204).send(); // No Content
    } else {
      res.status(404).json({ message: 'Artist not found' });
    }
  } catch (error) {
    console.error('Error in deleteArtist:', error);
    res.status(500).json({ message: 'Failed to delete artist', error: error.message });
  }
};