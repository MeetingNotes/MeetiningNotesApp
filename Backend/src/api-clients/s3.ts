import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { ClientBase } from '../core/ClientBase';
import { KeyStore } from '../config';


type File = {
    name: string;
    size: number;
    type: string;
    extension: string;
    content: Buffer;
}

class S3FileClient extends ClientBase<S3Client> {

    private static BucketName: string;
    private static Region: string;
    constructor(backend: S3Client) {
        super(backend);
    }

    public override read(_options: any): Promise<any> {
        // TODO: Download FIle
        return new Promise((_resolve, reject) => {
            reject(new Error("Not Implemented"))
        })
    }
    public override async write(file: File): Promise<void> {
        await this._backend.send(new PutObjectCommand({
            Bucket: S3FileClient.BucketName,
            // Here, just using a unique UUID for the file upload name in S3, but you could customize this
            Key: file.name,
            Body: file.content
        }))
    }

    public static async create(): Promise<S3FileClient> {
        S3FileClient.Region = await KeyStore.read("S3_REGION");
        S3FileClient.BucketName = await KeyStore.read("S3_BUCKET_NAME");
        return new S3FileClient(new S3Client({ region: S3FileClient.Region }));
    }
}