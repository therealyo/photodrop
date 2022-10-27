import { handlerPath } from '../../../libs/handler-resolver';

export const setClientSelfie = {
    handler: `${handlerPath(__dirname)}/handler.setClientSelfie`,

    events: [
        {
            http: {
                method: 'post',
                path: 'client/selfie',
                authorizer: {
                    name: 'auth',
                    type: 'request',
                    identitySource: 'method.request.header.Authorization'
                },
                cors: true
            }
        }
    ]
};
