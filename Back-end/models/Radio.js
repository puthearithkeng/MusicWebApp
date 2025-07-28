export default (sequelize, DataTypes) => {
  return sequelize.define('Radio', {
    radioId: {
      type: DataTypes.STRING(50),
      primaryKey: true,
      field: 'radio_id',
    },
    name: DataTypes.STRING(100),
    description: DataTypes.TEXT,
    coverImage: {
      type: DataTypes.TEXT,
      field: 'cover_image',
    },
    streamUrl: {
      type: DataTypes.TEXT,
      field: 'stream_url',
    },
  }, {
    tableName: 'radios',
    timestamps: false,
    underscored: true,
  });
};