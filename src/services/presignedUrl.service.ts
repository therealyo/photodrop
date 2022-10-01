import bucket from '../connectors/s3.connector';

// import { S3 } from 'aws-sdk';

class PresignedUrlService {
    async generateParams(path: string) {
        return {
            Bucket: 'therealyo-photopass',
            Key: path,
            ACL: 'public-read'
        };
    }

    async getPresignedUrl(path: string) {
        try {
            // console.log(path);;
            const params = await this.generateParams(path);
            // console.log(params);

            // console.log(bucket);
            const url = await bucket.getSignedUrlPromise('putObject', params);
            // console.log(url);
            return {
                method: 'put',
                url,
                fields: {}
            };
        } catch (err) {
            console.log('here');
            console.log(err);
        }
    }
}

export default new PresignedUrlService();
