module.exports = (sequelize, DataTypes) => {
    const UploadedDocument = sequelize.define('UploadedDocument', {
      doc_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'User',
          key: 'user_id'
        }
      },
      filename: {
        type: DataTypes.STRING,
        allowNull: false
      },
      file_url: {
        type: DataTypes.STRING,
        allowNull: false
      },
      doc_type_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'DocumentType',
          key: 'doc_type_id'
        }
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      }
    }, {
      timestamps: false,
      schema: 'TranscriptionAppSchema',
      tableName: 'UploadedDocument'
    });
  
    UploadedDocument.associate = function(models) {
      UploadedDocument.belongsTo(models.User, { foreignKey: 'user_id' });
      UploadedDocument.belongsTo(models.DocumentType, { foreignKey: 'doc_type_id' });
      UploadedDocument.hasMany(models.GeneratedDocument, { foreignKey: 'uploaded_doc_id' });
    };
  
    return UploadedDocument;
  };
  