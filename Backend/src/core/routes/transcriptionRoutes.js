const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/authMiddleware');
const { rateLimiterPreAuth } = require("../middlewares/rateMiddleware");
const { fileUploadMiddleware } = require("../middlewares/fileUploadMiddleware");
const {
    login,
    uploadTranscription,
    getTranscriptions,
    getTranscriptionById
} = require('../controllers/transcriptionController');

//TODO: move thisd on over to auth route
router.post('/user/login', rateLimiterPreAuth, authenticate, login);
router.post('/transcription', rateLimiterPreAuth, authenticate, fileUploadMiddleware, uploadTranscription);
router.get('/transcriptions', rateLimiterPreAuth, authenticate, getTranscriptions);
router.get('/transcription/:transcriptionID',  rateLimiterPreAuth, authenticate, getTranscriptionById);

module.exports = router;
