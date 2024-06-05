const { uploadToS3 } = require('../services/s3Service');
const { transcribeFile } = require('../services/transcriptionService');
const { createUploadedDocument, findUploadedDocumentById, findAllUploadedDocumentsByUserId } = require('../../data/repositories/uploadedDocumentRepository');
const { findGeneratedDocumentByUploadedId, findAllGeneratedDocumentsByUserId } = require('../../data/repositories/generatedDocumentRepository')
const { createGeneratedDocument } = require('../../data/repositories/generatedDocumentRepository');
const { encrypt, decrypt } = require('../utils/cryptoUtils');

//TODO: Move this into a authController instead
const login = async (req, res) => {
    res.status(200).json({ message: 'User authenticated successfully.', userDetails: req.user });
};

const uploadTranscription = async (req, res) => {
    try {
        const { fileName, fileContent } = req.body;
        const user = req.user;

        const encryptedFileName = encrypt(fileName);
        const encryptedFileContent = encrypt(fileContent);
        console.log('ekse: ' +  decrypt(encryptedFileContent) + ' ' + decrypt(encryptedFileName));

        const originalS3Response = await uploadToS3(encryptedFileName, encryptedFileContent);

        const { title, description, notes } = await transcribeFile(fileContent);

        const uploadedDoc = await createUploadedDocument({
            user_id: user.user_id,
            filename: fileName,
            file_url: originalS3Response.Location,
            doc_type_id: 1,
        });

        if (!uploadedDoc) {
            throw new Error('Failed to create uploaded document.');
        }

        const generatedDoc = await createGeneratedDocument({
            uploaded_doc_id: uploadedDoc.doc_id,
            doc_type_id: 2,
            title,
            description,
            notes,
        });

        res.status(200).json({ message: 'File uploaded successfully', transcription: { description, notes }, uploadedDoc, generatedDoc });
    } catch (error) {
        console.error('Error uploading transcription:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}

const getTranscriptions = async (req, res) => {
    try {
        const user = req.user;
        const { page = 1 } = req.query;
        const limit = 6;  // Set the limit to 6 items per page

        const offset = (page - 1) * limit;
        const transcriptions = await findAllGeneratedDocumentsByUserId(user.user_id, limit, offset);

        console.log(`HERE :${transcriptions}`)
        const formattedTranscriptions = transcriptions.map((transcription) => {
            console.log(JSON.stringify(transcription))
            return {
                id: transcription.generated_doc_id,
                title: transcription.title,
                timestamp: transcription.created_at,
                description: transcription.description,
            };
        });

        res.status(200).json({
            page: parseInt(page),
            limit,
            total: transcriptions.length,
            data: formattedTranscriptions,
        });
    } catch (error) {
        console.error('Error fetching transcriptions:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};


const getTranscriptionById = async (req, res) => {
    try {
        const { transcriptionID } = req.params;
        const transcription = await findUploadedDocumentById(transcriptionID);
        if (!transcription) {
            return res.status(404).json({ message: 'Transcription not found' });
        }

        const generatedDoc = await findGeneratedDocumentByUploadedId(transcription.doc_id);
        if (!generatedDoc) {
            return res.status(404).json({ message: 'Generated document not found' });
        }

        // Split the notes into an array of sentences
        const notesArray = generatedDoc.notes.split('\n').filter(note => note.trim() !== '');

        res.status(200).json({
            id: generatedDoc.generated_doc_id,
            timestamp: generatedDoc.created_at,
            title: generatedDoc.title,
            description: generatedDoc.description,
            notes: notesArray
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};


  module.exports = { login, uploadTranscription, getTranscriptions, getTranscriptionById };