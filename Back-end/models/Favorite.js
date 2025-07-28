export default (sequelize, DataTypes) => {
  return sequelize.define('Favorite', {
    favoriteId: {
      type: DataTypes.STRING(50),
      primaryKey: true,
      field: 'favorite_id',
    },
    userId: {
      type: DataTypes.INTEGER,
      field: 'user_id',
    },
    songId: {
      type: DataTypes.STRING(50),
      field: 'song_id',
    },
  }, {
    tableName: 'favorites',
    timestamps: false,
    underscored: true,
  });
};