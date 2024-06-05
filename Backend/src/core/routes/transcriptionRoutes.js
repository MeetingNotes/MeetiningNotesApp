const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/authMiddleware');
const { rateLimiterPreAuth } = require("../middlewares/rateMiddleware");
const {
    login,
    uploadTranscription,
    getTranscriptions,
    getTranscriptionById
} = require('../controllers/transcriptionController');

//TODO: move thisd on over to auth route
router.post('/user/login', rateLimiterPreAuth, authenticate, login);
router.post('/transcription', rateLimiterPreAuth, authenticate, uploadTranscription);
router.get('/transcriptions', rateLimiterPreAuth, authenticate, getTranscriptions);
router.get('/transcription/:transcriptionID', authenticate, getTranscriptionById);

module.exports = router;
