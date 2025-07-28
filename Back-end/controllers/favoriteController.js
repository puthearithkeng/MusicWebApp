// music-app-backend/controllers/favoriteController.js
import models from '../models/index.js';

// Ensure Album is destructured from models, as we still might need Album.name
const { Favorite, User, Song, Artist, Album } = models;

export const getAllFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.findAll({
      include: [
        { model: User, attributes: ['username', 'email'] },
        {
          model: Song,
          // Include audioUrl and coverImage directly from the Song model
          attributes: ['title', 'artist_id', 'album_id', 'audioUrl', 'coverImage'], // <--- ADD 'coverImage' here
          include: [
            { model: Artist, attributes: ['name', 'profileImage'] },
            // Include Album to get its 'name' if needed, but 'coverImage' is now on Song itself
            { model: Album, attributes: ['name'] } // Removed 'albumArt' from here as it's on Song
          ]
        }
      ]
    });
    res.status(200).json(favorites);
  } catch (error) {
    console.error('Error in getAllFavorites:', error);
    res.status(500).json({ message: 'Failed to retrieve favorites', error: error.message });
  }
};

export const getFavoriteById = async (req, res) => {
  try {
    const favorite = await Favorite.findByPk(req.params.id, {
      include: [
        { model: User, attributes: ['username', 'email'] },
        {
          model: Song,
          // Include audioUrl and coverImage directly from the Song model
          attributes: ['title', 'artist_id', 'album_id', 'audioUrl', 'coverImage'], // <--- ADD 'coverImage' here
          include: [
            { model: Artist, attributes: ['name', 'profileImage'] },
            // Include Album to get its 'name' if needed, but 'coverImage' is now on Song itself
            { model: Album, attributes: ['name'] } // Removed 'albumArt' from here as it's on Song
          ]
        }
      ]
    });
    if (favorite) {
      res.status(200).json(favorite);
    } else {
      res.status(404).json({ message: 'Favorite not found' });
    }
  } catch (error) {
    console.error('Error in getFavoriteById:', error);
    res.status(500).json({ message: 'Failed to retrieve favorite', error: error.message });
  }
};

export const createFavorite = async (req, res) => {
  try {
    const newFavorite = await Favorite.create(req.body);
    res.status(201).json(newFavorite);
  } catch (error) {
    console.error('Error in createFavorite:', error);
    res.status(400).json({ message: 'Failed to create favorite', error: error.message });
  }
};

export const deleteFavorite = async (req, res) => {
  try {
    const deleted = await Favorite.destroy({
      where: { favorite_id: req.params.id }
    });
    if (deleted > 0) {
      res.status(204).send(); // No Content
    } else {
      res.status(404).json({ message: 'Favorite not found' });
    }
  } catch (error) {
    console.error('Error in deleteFavorite:', error);
    res.status(500).json({ message: 'Failed to delete favorite', error: error.message });
  }
};
  