import cors from "cors";
import multer from "multer";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import type { Request, Response, NextFunction } from "express";
import { S3Client } from "@aws-sdk/client-s3";
import { KeyStore } from "./config";
import s3Storage from "multer-s3";
import * as parser from "webvtt-parser/parser";



type MiddlewareResponse = Response<any, Record<string, any>> | void
const SessionTokenHeader = "Session-Token";
const AuthTokenHeader = "Authorization"
const UploadEncoding = "Content-Transfer-Encoding";

class MulterS3 {
    private BucketName!: string;
    private Region!: string;
    constructor() {
        KeyStore.read("S3_REGION").then((value) => {
            this.Region = value;
        })
        KeyStore.read("S3_BUCKET_NAME").then((value) => {
            this.BucketName = value;
        })
    }
    
    public Middleware() {
        let S3client = new S3Client({ region: this.Region});
        return multer({
            storage: s3Storage({
                s3: S3client,
                bucket: this.BucketName,
                acl: "private",
                key: (_request: Request, _file: Express.Multer.File, callback) => {
                    callback(null, Date.now().toString());
                }
            })
        })
    }
}
const MulterS3Store = new MulterS3()


const Cors = cors({
    exposedHeaders: ['Content-Type', AuthTokenHeader, SessionTokenHeader, UploadEncoding],
    origin: []
});

const RateLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    standardHeaders: true,
    legacyHeaders: false,
})


// Validates If user session is valid
const ValidSession = function (_request: Request, _response: Response, next: NextFunction): MiddlewareResponse {
    next();
}

// Validates Session Init
const ValidSessionStart = function (_request: Request, _response: Response, next: NextFunction): MiddlewareResponse {
    next();
}

const MulterSizeEncoding = multer({
    limits: { fileSize: 1000000 },
    fileFilter: (request: Request, file: Express.Multer.File, callback) => {
        if (file.mimetype === "text/vtt" && request.get("Content-Transfer-Encoding") === "utf-8") {
            let parsedFile = parser.WebVTTParser().parse(file.buffer);
            if (parsedFile.errors.length > 0) callback(new Error("Invalid file"));
            else callback(null, true);
        } else {
            callback(new Error("Unsuported file type"))
        }
    }
})

const Helmet = helmet();
const MulterStore = MulterS3Store.Middleware();

export { Cors,  Helmet, MulterStore, MulterSizeEncoding,  RateLimit, ValidSession, ValidSessionStart, AuthTokenHeader, SessionTokenHeader };