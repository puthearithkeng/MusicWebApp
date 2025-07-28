export default (sequelize, DataTypes) => {
  return sequelize.define('Song', {
    songId: {
      type: DataTypes.STRING(50),
      primaryKey: true,
      field: 'song_id',
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    artistId: {
      type: DataTypes.STRING(50),
      field: 'artist_id',
    },
    albumId: {
      type: DataTypes.STRING(50),
      field: 'album_id',
    },
    genre: DataTypes.STRING(50),
    duration: DataTypes.TIME,
    releaseDate: {
      type: DataTypes.DATE,
      field: 'release_date',
    },
    audioUrl: {
      type: DataTypes.TEXT,
      field: 'audio_url',
    },
    coverImage: {
      type: DataTypes.TEXT,
      field: 'cover_image',
    },
    views: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  }, {
    tableName: 'songs',
    timestamps: false,
    underscored: true,
  });
};