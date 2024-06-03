import cors from "cors";
import multer from "multer";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import type { Request, Response, NextFunction } from "express";
import { S3Client } from "@aws-sdk/client-s3";
import { KeyStore } from "./config";
import s3Storage from "multer-s3";


type MiddlewareResponse = Response<any, Record<string, any>> | void
const SessionTokenHeader = "Session-Token";
const AuthTokenHeader = "Authorization"

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
            limits: { fileSize: 1000000 },
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
const MulterS3Store = new MulterS3();


const Cors = cors({
    exposedHeaders: ['Content-Type', AuthTokenHeader, SessionTokenHeader],
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



const Helmet = helmet();
const Multer = MulterS3Store.Middleware();

export { Cors,  Helmet, Multer,  RateLimit, ValidSession, ValidSessionStart, AuthTokenHeader, SessionTokenHeader };