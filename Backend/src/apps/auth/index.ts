import { AppBase, App, AppRoute } from "../../core/AppBase";
import { type Response, type Request } from "express";
import { ValidSessionStart } from "../../middleware";



@App({ BaseUrl: "/auth/user", Middlewares: [ValidSessionStart] })
class Auth extends AppBase {
    constructor() { super(); }


    @AppRoute({ Method: "post", Url: "/login" })
    public UserLogin(_request: Request, response: Response) {
        response.status(200).send({ message: "Logged in"})
    }
}

export { Auth }
