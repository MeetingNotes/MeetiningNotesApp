const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const helmet = require("helmet");
const { rateLimiterPreAuth } = require("./middlewares/rateMiddleware")
const corsMiddleware = require('./middlewares/corsMiddleware');

dotenv.config();

const app = express();

app.use(corsMiddleware);

app.use(bodyParser.json());
app.use(helmet());

const transcriptionRoutes = require('./routes/transcriptionRoutes');

app.use('/api', transcriptionRoutes);

module.exports = app;
