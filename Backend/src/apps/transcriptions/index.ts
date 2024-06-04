import { AppBase, App, AppRoute } from "../../core/AppBase";
import type { Response, Request } from "express";
import { MulterSizeEncoding } from "../../middleware";


@App({ BaseUrl: "/transcriptions" })
class Transcriptions extends AppBase {
    constructor() { super(); }


    @AppRoute({ Method: "get", Url: "/:id" })
    public GetTranscript(_request: Request, response: Response) {
        // Get DB file
        response.status(200).send();
    }

    @AppRoute({ Method: "post", Url: "/", Middlewares: [MulterSizeEncoding.single("transcript")] })
    public UploadTranscript(_request: Request, response: Response) {
        //Catch upload errors
        
        // Post File to DB
        response.status(200).send({ message: "Successful file upload"});
    }
}


export { Transcriptions };