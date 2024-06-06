const { sequelize } = require('./src/data/models/index');
const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const corsMiddleware = require('./src/core/middlewares/corsMiddleware');
const cspMiddleware = require('./src/core/middlewares/cspMiddleware');
const rateLimitMiddleware = require('./src/core/middlewares/rateLimiterMiddleware');

dotenv.config();

const app = express();

app.use(corsMiddleware);
app.use(cspMiddleware);
app.use(bodyParser.json());

app.use(rateLimitMiddleware);

const transcriptionRoutes = require('./src/core/routes/transcriptionRoutes');

app.use('/api', transcriptionRoutes);

const port = process.env.PORT || 3500;


sequelize.sync().then(() => {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  });

module.exports = app;




