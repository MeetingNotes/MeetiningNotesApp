import { AppBase, App, AppRoute } from "../../core/AppBase";
import type { Response, Request } from "express";
import { Multer, ValidSession } from "../../middleware";


@App({ BaseUrl: "/transcriptions", Middlewares: [ValidSession] })
class Transcriptions extends AppBase {
    constructor() { super(); }


    @AppRoute({ Method: "get", Url: "/:id(\d+)/page/:pageno(\d+)" })
    public GetTranscript(_request: Request, response: Response) {
        response.status(200).send();
    }

    @AppRoute({ Method: "post", Url: "/", Middlewares: [Multer.single("transcript")] })
    public UploadTranscript(_request: Request, response: Response) {
        // Get File 
        response.status(200).send();
    }
}


export { Transcriptions };