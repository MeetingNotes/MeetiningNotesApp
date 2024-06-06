const querystring = require("querystring");
const webvtt = require('node-webvtt');

const MAX_SIZE = 500 * 1024 * 1024;
const fileUploadMiddleware = (req, res, next) => {
    let fileContent = req.body.fileContent;
    try {
        let buffer = Buffer.from(fileContent, "base64");
        fileContent = buffer.toString("utf-8").trim();
        fileContent = querystring.escape(fileContent);
        if ((Buffer.from(fileContent, "utf-8").length * 1024 * 1024) > MAX_SIZE) throw new TypeError("");
        webvtt.parse(fileContent);
        req.body.fileContent = fileContent;
        req.body.fileName = `${Date.now()}.vtt`
        next()
    } catch(error) {
        if (error instanceof TypeError || error instanceof ParserError ) res.status(401).json({ message: "Invalid file upload"});
        else res.status(500).json({ message: "Something went wrong"})
    }
    
}

module.exports = { fileUploadMiddleware }