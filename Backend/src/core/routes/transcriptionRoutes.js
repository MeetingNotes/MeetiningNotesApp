const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/authMiddleware');
const {
    login,
    uploadTranscription,
    getTranscriptions,
    getTranscriptionById
} = require('../controllers/transcriptionController');

//TODO: move thisd on over to auth route
router.post('/user/login', authenticate, login);
router.post('/transcription', authenticate, uploadTranscription);
router.get('/transcriptions', authenticate, getTranscriptions);
router.get('/transcription/:transcriptionID', authenticate, getTranscriptionById);

module.exports = router;
