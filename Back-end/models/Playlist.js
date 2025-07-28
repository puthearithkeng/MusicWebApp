export default (sequelize, DataTypes) => {
  return sequelize.define('Playlist', {
    playlistId: {
      type: DataTypes.STRING(50),
      primaryKey: true,
      field: 'playlist_id',
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    description: DataTypes.TEXT,
    coverImage: {
      type: DataTypes.TEXT,
      field: 'cover_image',
    },
    userId: {
      type: DataTypes.INTEGER,
      field: 'user_id',
    },
  }, {
    tableName: 'playlists',
    timestamps: false,
    underscored: true,
  });
};