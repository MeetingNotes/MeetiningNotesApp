const { GeneratedDocument, UploadedDocument } = require('../models');

const createGeneratedDocument = async (documentData) => {
  return await GeneratedDocument.create(documentData);
};

const findGeneratedDocumentById = async (generated_doc_id) => {
  return await GeneratedDocument.findByPk(generated_doc_id);
};

const findGeneratedDocumentByUploadedId = async (uploaded_doc_id) => {
    return await GeneratedDocument.findOne({ where: { uploaded_doc_id } });
};

const findAllGeneratedDocumentsByUserId = async (user_id, limit, offset) => {
    return await GeneratedDocument.findAll({
        include: [
            {
                model: UploadedDocument,
                where: { user_id },
                required: true
            }
        ],
        limit,
        order: [
            ['created_at', 'DESC']
        ]
    });
};

module.exports = { createGeneratedDocument, findGeneratedDocumentById,  findGeneratedDocumentByUploadedId, findAllGeneratedDocumentsByUserId };
