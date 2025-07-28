// music-app-backend/routes/favoriteRoutes.js
import express from 'express';
import {
  getAllFavorites,
  getFavoriteById,
  createFavorite,
  deleteFavorite
} from '../controllers/favoriteController.js';

const router = express.Router();

// ✅ GET all favorites
router.get('/', getAllFavorites);
// ✅ GET a favorite by ID
router.get('/:id', getFavoriteById);
// ✅ POST to create a new favorite
router.post('/', createFavorite);
// ✅ DELETE a favorite by ID
router.delete('/:id', deleteFavorite);

export default router;
