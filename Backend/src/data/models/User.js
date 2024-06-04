module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
      user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      user_sub: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      }
    }, {
      timestamps: false,
      schema: 'TranscriptionAppSchema',
      tableName: 'User'
    });
  
    User.associate = function(models) {
      User.hasMany(models.UploadedDocument, { foreignKey: 'user_id' });
    };
  
    return User;
  };
  