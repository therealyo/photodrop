import { handlerPath } from '../../../libs/handler-resolver';

export const registration = {
    handler: `${handlerPath(__dirname)}/handler.registration`,
    events: [
        {
            http: {
                method: 'post',
                path: 'signup',
                cors: true
            }
        }
    ]
};
