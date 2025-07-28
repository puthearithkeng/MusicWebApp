// routes/playlistSongRoutes.js
import express from 'express';
import { getAllPlaylistSongs, addSongToPlaylist, removeSongFromPlaylist } from '../controllers/playlistSongController.js';

const router = express.Router();

router.get('/', getAllPlaylistSongs);
router.post('/', addSongToPlaylist);
// DELETE with params for playlist_id and song_id
router.delete('/:playlist_id/:song_id', removeSongFromPlaylist);

export default router;
