import dotenv from "dotenv";
import { ReadonlyClientBase } from "./core/ClientBase";
import { GetSecretValueCommand, SecretsManagerClient, ResourceNotFoundException } from "@aws-sdk/client-secrets-manager";

dotenv.config()
const _Errors = [ResourceNotFoundException];

class SecretsKeyStore extends ReadonlyClientBase<SecretsManagerClient> {
    private static _keyStoreCache: { [key: string]: string };
    private static _instance: SecretsKeyStore;
    constructor() {
        if (SecretsKeyStore._instance != undefined) {
            super(new SecretsManagerClient());
            SecretsKeyStore._keyStoreCache = {};
            SecretsKeyStore._instance = this;
        }
        return SecretsKeyStore._instance;
    }

    override async read(key: string): Promise<string> {
        return new Promise(async (resolve, reject) => {
            if (SecretsKeyStore._keyStoreCache[key]) resolve(SecretsKeyStore._keyStoreCache[key]);

            try {
                let response = await this._backend.send(new GetSecretValueCommand({ "SecretId": key }));
                if (response.SecretString == undefined) reject(new Error(`${key} returned undefined`))
                else {
                    SecretsKeyStore._keyStoreCache[key] = response.SecretString;
                    resolve(SecretsKeyStore._keyStoreCache[key]);
                }
            } catch (error) {
                if (_Errors.find((_Error) => { return error instanceof _Error })) {
                    reject(new Error("Resource not found"));
                } else {
                    reject(error);
                }
            }
        })
    }
}

class EnvKeyStore extends ReadonlyClientBase<NodeJS.ProcessEnv> {
    constructor() {
        super(process.env);
    }

    override async read(key: string): Promise<string> {
        return new Promise((resolve, reject) => {
            let value = process.env[key];
            if (value == undefined) reject(new Error(`${key} returned undefined`))
            else resolve(value)
        })
    }
}

class KeyStore extends ReadonlyClientBase<SecretsKeyStore | EnvKeyStore> {
    private static instance: KeyStore | undefined = new KeyStore();

    constructor() {
        if (KeyStore.instance === undefined) {
            if (process.env["NODE_ENV"] === "prod") {
                super(new SecretsKeyStore());
            } else {
                super(new EnvKeyStore());
            }
        }
        return KeyStore.instance as KeyStore;
    }

    override async read(key: string): Promise<string> {
        return await this._backend.read(key);
    }
}

const _KeyStore = new KeyStore();

export { _KeyStore as KeyStore };