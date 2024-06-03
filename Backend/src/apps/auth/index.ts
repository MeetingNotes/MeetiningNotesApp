import { AppBase, App, AppRoute } from "../../core/AppBase";
import { type Response, type Request } from "express";
import { AuthTokenHeader, ValidSessionStart } from "../../middleware";
import { CognitoClient, LoginCreds } from "../../api-clients/cognito";
import { KeyStore } from "../../config";
import JsonWebToken from "jsonwebtoken";


@App({ BaseUrl: "/Auth", Middlewares: [ValidSessionStart] })
class Auth extends AppBase {
    constructor() { super(); }


    @AppRoute({ Method: "post", Url: "/" })
    public GetTranscriptions(request: Request, response: Response) {
        this.SignSession(request.get(AuthTokenHeader) as string)
            .then((token: string) => {
                // Update session on DB
                response.setHeader(AuthTokenHeader, token);
                response.status(200).send();
            }).catch((_error) => {
                response.status(500).send()
            });
    }

    private SignSession(authToken: string): Promise<string> {
        return new Promise((resolve, reject) => {
            CognitoClient.read(authToken).then((creds: LoginCreds) => {
                KeyStore.read("JWT_SECRET").then(
                    (JWT_SECRET) => {
                        let token = JsonWebToken.sign({ AuthId: creds.id }, JWT_SECRET as string, { expiresIn: "5h" });
                        resolve(token)
                    }).catch((error) => {
                        reject(error)
                    })
            }).catch((error) => {
                reject(error);
            });
        })

    }
}

export { Auth }
