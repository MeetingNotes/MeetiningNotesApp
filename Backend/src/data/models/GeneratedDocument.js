module.exports = (sequelize, DataTypes) => {
    const GeneratedDocument = sequelize.define('GeneratedDocument', {
      generated_doc_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      uploaded_doc_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'UploadedDocument',
          key: 'doc_id'
        }
      },
      doc_type_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'DocumentType',
          key: 'doc_type_id'
        }
      },
      title: {
        type: DataTypes.STRING,
        allowNull: true
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      }
    }, {
      timestamps: false,
      schema: 'TranscriptionAppSchema',
      tableName: 'GeneratedDocument'
    });
  
    GeneratedDocument.associate = function(models) {
      GeneratedDocument.belongsTo(models.UploadedDocument, { foreignKey: 'uploaded_doc_id' });
      GeneratedDocument.belongsTo(models.DocumentType, { foreignKey: 'doc_type_id' });
    };
  
    return GeneratedDocument;
  };
  