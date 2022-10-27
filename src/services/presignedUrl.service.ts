// import { BucketParams } from './../@types/BucketParams';
import * as dotenv from "dotenv"
import { PutObjectRequest } from 'aws-sdk/clients/s3';

import bucket from '../connectors/s3.connector';

dotenv.config()
class PresignedUrlService {
    
    async generateParams(path: string) {
        return {
            Bucket: process.env.BUCKET_NAME,
            Key: path,
            // ACL: 'public-read'
        };
    }

    async getPresignedUrlUpload(path: string) {
        const params = await this.generateParams(path);

        const url = await bucket.getSignedUrlPromise('putObject', params);
        return {
            method: 'put',
            url,
            fields: {}
        }
    }

    async getPresignedUrlRead(path: string) {
        const params = await this.generateParams(path)
        return await bucket.getSignedUrlPromise("getObject", params)

    }

    async upload(params: PutObjectRequest) {
        await bucket.putObject(params).promise()
    }
}

export default new PresignedUrlService();
