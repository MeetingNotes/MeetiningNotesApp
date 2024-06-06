const { body, query, param, validationResult } = require('express-validator');
const { parseVTT } = require('../utils/vttParserUtils');

const fileUploadValidator = [
    body('fileName').notEmpty().withMessage('Filename is required.'),
    body('fileContent').custom((value, { req }) => {
        console.log('Decoding base64 content...');
        const buffer = Buffer.from(value, 'base64');
        const content = buffer.toString('utf-8').trim();
        console.log('Decoded content:', content);

        console.log('Validating VTT content...');
        if (!parseVTT(content)) {
            throw new Error('Invalid VTT file content.');
        }
        
        req.body.decodedFileContent = content;
        return true;
    })
];



const paginationValidator = [
    query('page').isInt({ min: 1 }).withMessage('Page must be a positive integer')
];

const transcriptionIdValidator = [
    param('transcriptionID').isInt().withMessage('Transcription ID must be a valid integer')
];

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};
module.exports = {
    fileUploadValidator,
    paginationValidator,
    transcriptionIdValidator,
    validate
};
