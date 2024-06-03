import cors from "cors";
import multer from "multer";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import type { Request, Response, NextFunction } from "express";
import JsonWebToken from "jsonwebtoken";

type MiddlewareResponse = Response<any, Record<string, any>> | void
const SessionTokenHeader = "Session-Token";
const AuthTokenHeader = "Authorization"


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


const ValidSession = function (request: Request, response: Response, next: NextFunction): MiddlewareResponse {
    let sessionToken = request.get(SessionTokenHeader);
    if (sessionToken === undefined) {
        return response.status(400).json({ message: "Unauthorized request" });
    }
    try {
        JsonWebToken.verify(sessionToken, "");
        next();
    } catch (errror) {
        response.removeHeader(SessionTokenHeader);
        return response.status(401).json({ message: "Expired Session" });
    }
}

const ValidSessionStart = function (request: Request, response: Response, next: NextFunction): MiddlewareResponse {
    let authToken = request.get(AuthTokenHeader);
    if (authToken === undefined) {
        return response.status(400).json({ message: "Unauthorized request" });
    }
    next();
}

const Helmet = helmet();
const Multer = multer({
    storage: multer.diskStorage({ destination: "/uploads" }),
    limits: { fileSize: 1000000 } // 1 MB
})

export { Cors, Multer, Helmet, RateLimit, ValidSession, ValidSessionStart, AuthTokenHeader, SessionTokenHeader };