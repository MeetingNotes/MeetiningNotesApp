import { CognitoIdentityClient, GetCredentialsForIdentityCommand, GetIdCommand, ResourceNotFoundException } from "@aws-sdk/client-cognito-identity";
import { ReadonlyClientBase } from "../core/ClientBase";
import { KeyStore } from "../config";


const _Errors = [ResourceNotFoundException]

type LoginCreds = {
    id: string,
    expiresOn: Date
}

class CognitoClient extends ReadonlyClientBase<CognitoIdentityClient> {
    private static AccoundId: string;
    private static PoolId: string;
    constructor() {
        super(new CognitoIdentityClient());
    }

    public override async read(key: string): Promise<LoginCreds> {
        return new Promise(async (resolve, reject) => {
            try {
                CognitoClient.AccoundId = CognitoClient.AccoundId || await KeyStore.read("ACCOUNT_ID");
                CognitoClient.PoolId = CognitoClient.PoolId || await KeyStore.read("POOL_ID");
                let getIdResponse = await this._backend.send(new GetIdCommand({
                    AccountId: CognitoClient.AccoundId,
                    IdentityPoolId: CognitoClient.PoolId,
                    Logins: {
                        'accounts.google.com': key
                    }
                }))
                let getCredResponse = await this._backend.send(new GetCredentialsForIdentityCommand({
                    IdentityId: getIdResponse.IdentityId
                }))
                if (getCredResponse.IdentityId === undefined || getCredResponse.Credentials?.Expiration === undefined) reject(new Error("Resource info incomplete"));
                resolve({ id: getCredResponse.IdentityId as string, expiresOn: getCredResponse.Credentials?.Expiration as Date });
            } catch (error) {
                if (_Errors.find((_Error) => { return error instanceof _Error })) {
                    reject(new Error("Resource not found"))
                } else {
                    reject(error);
                }
            }
        })
    }
}

const CognitoClientObject = new CognitoClient();
export { CognitoClientObject as CognitoClient }
export type { LoginCreds }