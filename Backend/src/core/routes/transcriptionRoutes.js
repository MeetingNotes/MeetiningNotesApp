const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/authMiddleware');
const {
    login,
    uploadTranscription,
    getTranscriptions,
    getTranscriptionById
} = require('../controllers/transcriptionController');

const {
    fileUploadValidator,
    paginationValidator,
    transcriptionIdValidator,
    validate
} = require('../validators/transcriptionValidators');


router.post('/user/login', authenticate, login);


router.post('/transcription', authenticate, fileUploadValidator, validate, uploadTranscription);


router.get('/transcriptions', authenticate, paginationValidator, validate, getTranscriptions);


router.get('/transcription/:transcriptionID', authenticate, transcriptionIdValidator, validate, getTranscriptionById);

module.exports = router;
