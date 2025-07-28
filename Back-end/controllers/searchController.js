// controllers/allDataController.js
import { Artist, Album, Song, Playlist } from '../models/index.js';

export async function searchByName(req, res) {
  try {
    const artists = await Artist.findAll({
      include: [{ model: Album, include: [Song] }],
    });
    const albums = await Album.findAll({
      include: [Artist, Song],
    });
    const playlists = await Playlist.findAll({
      include: [{ model: Song, through: { attributes: [] }, include: [Artist, Album] }],
    });
    const songs = await Song.findAll({
      include: [Artist, Album],
    });

    res.json({ artists, albums, playlists, songs });
  } catch (err) {
    console.error('[getAllData] Error:', err);
    res.status(500).json({ error: 'Failed to fetch all data' });
  }
}
