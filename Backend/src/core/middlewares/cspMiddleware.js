const helmet = require('helmet');

const cspMiddleware = helmet({
    contentSecurityPolicy: {
        useDefaults: true,
        directives: {
            "default-src": ["'self'"],
            "script-src": ["'self'", "https://apis.google.com"],
            "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "'self'",],
            "img-src": ["'self'", "data:"],
            "connect-src": [
                "'self'", 
                "https://cognito-idp.eu-west-1.amazonaws.com",
                "https://meeting-notes-gen.auth.eu-west-1.amazoncognito.com"
            ],
            "font-src": ["'self'"],
            "frame-src": ["'self'"]
        }
    }
});

module.exports = cspMiddleware;
