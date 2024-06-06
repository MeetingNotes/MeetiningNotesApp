const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const corsMiddleware = require('./middlewares/corsMiddleware');
const cspMiddleware = require('./middlewares/cspMiddleware');

dotenv.config();

const app = express();

app.use(cspMiddleware);

app.use(corsMiddleware);

app.use(bodyParser.json());

const transcriptionRoutes = require('./routes/transcriptionRoutes');

app.use('/api', transcriptionRoutes);

module.exports = app;
