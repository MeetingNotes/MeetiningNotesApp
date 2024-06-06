const cors = require('cors');

const allowedOrigins = process.env.ALLOWED_ORIGINS.split(',');

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204
};

const corsMiddleware = cors(corsOptions);

module.exports = corsMiddleware;
