import { handlerPath } from './../../../libs/handler-resolver';

export const verifyOtp = {
    handler: `${handlerPath(__dirname)}/handler.verifyOtp`,
    events: [
        {
            http: {
                method: 'post',
                path: 'client/verifyOtp',
                cors: true
            }
        }
    ]
};
