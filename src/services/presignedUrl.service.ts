import bucket from '../connectors/s3.connector';

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
            const params = await this.generateParams(path);

            const url = await bucket.getSignedUrlPromise('putObject', params);
            return {
                method: 'put',
                url,
                fields: {}
            };
        } catch (err) {
            console.log(err);
        }
    }
}

export default new PresignedUrlService();
