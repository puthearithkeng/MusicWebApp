export default (sequelize, DataTypes) => {
  return sequelize.define('Artist', {
    artistId: {
      type: DataTypes.STRING(50),
      primaryKey: true,
      field: 'artist_id',
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    genre: DataTypes.STRING(100),
    profileImage: {
      type: DataTypes.TEXT,
      field: 'profile_image',
    },
    bio: DataTypes.TEXT,
    coverImage: {
      type: DataTypes.TEXT,
      field: 'cover_image',
    },
  }, {
    tableName: 'artists',
    timestamps: false,
    underscored: true,
  });
};