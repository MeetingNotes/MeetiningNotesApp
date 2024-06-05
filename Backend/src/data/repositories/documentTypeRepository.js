const { DocumentType } = require('../models');

const findDocumentTypeById = async (doc_type_id) => {
  return await DocumentType.findByPk(doc_type_id);
};

module.exports = { findDocumentTypeById };
