import { handlerPath } from '../../../libs/handler-resolver';

export const sendOtp = {
    handler: `${handlerPath(__dirname)}/handler.sendOtp`,
    events: [
        {
            http: {
                method: 'post',
                path: 'client/sendOtp',
                cors: true
            }
        }
    ]
};
