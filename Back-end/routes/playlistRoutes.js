// music-app-backend/routes/playlistRoutes.js
import express from 'express';
import {
  getAllPlaylists,
  getPlaylistById,
  createPlaylist,
  updatePlaylist,
  deletePlaylist
} from '../controllers/playlistController.js';

const router = express.Router();

router.get('/', getAllPlaylists);
router.get('/:id', getPlaylistById);
router.post('/', createPlaylist);
router.put('/:id', updatePlaylist);
router.delete('/:id', deletePlaylist);

export default router;