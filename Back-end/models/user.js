export default (sequelize, DataTypes) => {
  return sequelize.define('User', {
    userId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: 'user_id',
    },
    firebaseUid: {
      type: DataTypes.STRING(128),
      allowNull: false,
      unique: true,
      field: 'firebase_uid',
    },
    username: {
      type: DataTypes.STRING(50),
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    profileImage: {
      type: DataTypes.TEXT,
      field: 'profile_image',
    },
  }, {
    tableName: 'users',
    timestamps: true,
    underscored: true,
  });
};