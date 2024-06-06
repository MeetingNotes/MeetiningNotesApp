const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const corsMiddleware = require('./middlewares/corsMiddleware');
const cspMiddleware = require('./middlewares/cspMiddleware');
const rateLimitMiddleware = require('./middlewares/rateLimiterMiddleware');

dotenv.config();

const app = express();

app.use(corsMiddleware);
app.use(cspMiddleware);
app.use(bodyParser.json());

app.use(rateLimitMiddleware);

const transcriptionRoutes = require('./routes/transcriptionRoutes');

app.use('/api', transcriptionRoutes);

module.exports = app;
