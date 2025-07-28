// models/index.js
import { Sequelize, DataTypes } from 'sequelize';
import dotenv from 'dotenv';

import UserModel from './user.js';
import ArtistModel from './Artist.js';
import AlbumModel from './Album.js';
import SongModel from './Song.js';
import RadioModel from './Radio.js';
import FavoriteModel from './Favorite.js';
import PlaylistModel from './Playlist.js';
import PlaylistSongModel from './PlaylistSong.js';

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    logging: false, // Change to console.log if you want SQL logging
    define: {
      underscored: true, // Use snake_case for columns in DB
      timestamps: true,  // Automatically add created_at and updated_at
    },
  }
);

// Initialize models
const User = UserModel(sequelize, DataTypes);
const Artist = ArtistModel(sequelize, DataTypes);
const Album = AlbumModel(sequelize, DataTypes);
const Song = SongModel(sequelize, DataTypes);
const Radio = RadioModel(sequelize, DataTypes);
const Favorite = FavoriteModel(sequelize, DataTypes);
const Playlist = PlaylistModel(sequelize, DataTypes);
const PlaylistSong = PlaylistSongModel(sequelize, DataTypes);

// Define associations

// User - Playlist (1:M)
User.hasMany(Playlist, { foreignKey: 'user_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Playlist.belongsTo(User, { foreignKey: 'user_id' });

// User - Favorite (1:M)
User.hasMany(Favorite, { foreignKey: 'user_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Favorite.belongsTo(User, { foreignKey: 'user_id' });

// Artist - Album (1:M)
Artist.hasMany(Album, { foreignKey: 'artist_id', onDelete: 'SET NULL', onUpdate: 'CASCADE' });
Album.belongsTo(Artist, { foreignKey: 'artist_id' });

// Artist - Song (1:M)
Artist.hasMany(Song, { foreignKey: 'artist_id', onDelete: 'SET NULL', onUpdate: 'CASCADE' });
Song.belongsTo(Artist, { foreignKey: 'artist_id' });

// Album - Song (1:M)
Album.hasMany(Song, { foreignKey: 'album_id', onDelete: 'SET NULL', onUpdate: 'CASCADE' });
Song.belongsTo(Album, { foreignKey: 'album_id' });

// Song - Favorite (1:M)
Song.hasMany(Favorite, { foreignKey: 'song_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Favorite.belongsTo(Song, { foreignKey: 'song_id' });

// Playlist - Song (M:N) through PlaylistSong
Playlist.belongsToMany(Song, {
  through: PlaylistSong,
  foreignKey: 'playlist_id',
  otherKey: 'song_id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
Song.belongsToMany(Playlist, {
  through: PlaylistSong,
  foreignKey: 'song_id',
  otherKey: 'playlist_id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

// Add explicit relations for PlaylistSong to enable eager loading
PlaylistSong.belongsTo(Playlist, { foreignKey: 'playlist_id' });
PlaylistSong.belongsTo(Song, { foreignKey: 'song_id' });
Playlist.hasMany(PlaylistSong, { foreignKey: 'playlist_id' });
Song.hasMany(PlaylistSong, { foreignKey: 'song_id' });

// Connect and sync database
export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established.');

    if (process.env.NODE_ENV === 'development') {
      if (process.env.DB_SYNC_FORCE === 'true') {
        console.log('Syncing DB with force: true (dropping tables)...');
        await sequelize.sync({ force: true });
      } else if (process.env.DB_SYNC_ALTER === 'true') {
        console.log('Syncing DB with alter: true (modifying tables)...');
        await sequelize.sync({ alter: true });
      } else {
        console.log('Skipping DB sync, no sync env vars set.');
      }
    } else {
      console.log('Production mode: skipping sequelize.sync(), use migrations.');
    }
  } catch (error) {
    console.error('❌ DB connection or sync failed:', error);
    throw error;
  }
};

// Export all models and sequelize instance
export {
  sequelize,
  User,
  Artist,
  Album,
  Song,
  Radio,
  Favorite,
  Playlist,
  PlaylistSong,
};

export default {
  sequelize,
  User,
  Artist,
  Album,
  Song,
  Radio,
  Favorite,
  Playlist,
  PlaylistSong,
};
