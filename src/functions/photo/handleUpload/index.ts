import { handlerPath } from '../../../libs/handler-resolver';

export const handleUpload = {
    handler: `${handlerPath(__dirname)}/handler.upload`,
    events: [
        {
            s3: {
                bucket: 'therealyo-photopass',
                event: 's3:ObjectCreated:*',
                existing: true
            }
        }
    ]
};
