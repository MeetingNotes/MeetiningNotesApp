module.exports = (sequelize, DataTypes) => {
    const DocumentType = sequelize.define('DocumentType', {
      doc_type_id: {
        type: DataTypes.INTEGER,
        primaryKey: true
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isIn: [['Uploaded', 'Generated']]
        }
      }
    }, {
      timestamps: false,
      schema: 'TranscriptionAppSchema',
      tableName: 'DocumentType'
    });
  
    DocumentType.associate = function(models) {
      DocumentType.hasMany(models.UploadedDocument, { foreignKey: 'doc_type_id' });
      DocumentType.hasMany(models.GeneratedDocument, { foreignKey: 'doc_type_id' });
    };
  
    return DocumentType;
  };
  