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
const UploadEncoding = "Content-Transfer-Encoding";




let BucketName = "";
let Region = "";
{{
    (async function(){
        Region = await KeyStore.read("S3_REGION");
        BucketName = await KeyStore.read("S3_BUCKET_NAME")
    })()
}}

class MulterS3 {
    private region: string
    private bucket: string
    constructor () {
        this.bucket = BucketName
        this.region = Region
        console.log(this.region)
    }

    public storage() {
        let S3client = new S3Client();
        return multer({
            storage: s3Storage({
                s3: S3client,
                bucket: this.bucket,
                acl: "private",
                key: (_request: Request, _file: Express.Multer.File, callback) => {
                    callback(null, Date.now().toString());
                }
            })
        })
    }
}


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

// const ValidSubmissionType = function(request: Request, response: Response, next: NextFunction): MiddlewareResponse {

// }


const MulterSizeEncoding = multer({
    limits: { fileSize: 1000000, fields: 50 },
    storage: multer.diskStorage({
        destination: __dirname,
        filename: (_request: Request, _file: Express.Multer.File, callback) => {
            callback(null, `${Date.now().toString()}.vtt`);
        }
    }),
    fileFilter: (_request: Request, file: Express.Multer.File, callback) => {
        if (file.mimetype === "text/vtt") {
            callback(null, true);
        } else {
            callback(new Error("Unsuported file type"))
        }
    }
})

const Helmet = helmet();
const MulterStore = new MulterS3().storage()

export { Cors,  Helmet, MulterStore, MulterSizeEncoding,  RateLimit, ValidSession, ValidSessionStart, AuthTokenHeader, SessionTokenHeader };