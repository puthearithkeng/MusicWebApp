export default (sequelize, DataTypes) => {
  return sequelize.define('Album', {
    albumId: {
      type: DataTypes.STRING(50),
      primaryKey: true,
      field: 'album_id',
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    artistId: {
      type: DataTypes.STRING(50),
      field: 'artist_id',
    },
    coverImage: {
      type: DataTypes.TEXT,
      field: 'cover_image',
    },
    releaseDate: {
      type: DataTypes.DATE,
      field: 'release_date',
    },
    genre: DataTypes.STRING(50),
    description: DataTypes.TEXT,
  }, {
    tableName: 'albums',
    timestamps: false,
    underscored: true,
  });
};
