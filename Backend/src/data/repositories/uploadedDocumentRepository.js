const { UploadedDocument, GeneratedDocument } = require('../models');

const createUploadedDocument = async (documentData) => {
  return await UploadedDocument.create(documentData);
};

const findUploadedDocumentById = async (doc_id) => {
  return await UploadedDocument.findByPk(doc_id);
};

const findAllUploadedDocumentsByUserId = async (user_id, limit, offset) => {
    return await UploadedDocument.findAll({
        where: { user_id },
        include: [
            {
                model: GeneratedDocument,
                required: false
            }
        ],
        limit,
        offset
    });
};

module.exports = { createUploadedDocument, findUploadedDocumentById, findAllUploadedDocumentsByUserId };
