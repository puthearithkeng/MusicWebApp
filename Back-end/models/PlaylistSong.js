export default (sequelize, DataTypes) => {
  return sequelize.define('PlaylistSong', {
    playlistId: {
      type: DataTypes.STRING(50),
      primaryKey: true,
      field: 'playlist_id',
    },
    songId: {
      type: DataTypes.STRING(50),
      primaryKey: true,
      field: 'song_id',
    },
  }, {
    tableName: 'playlist_songs',
    timestamps: false,
    underscored: true,
  });
};