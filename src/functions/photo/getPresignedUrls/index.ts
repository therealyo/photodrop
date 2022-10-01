import { handlerPath } from './../../../libs/handler-resolver';

export const getPresignedUrl = {
    handler: `${handlerPath(__dirname)}/handler.getPresignedUrl`,
    events: [
        {
            http: {
                method: 'post',
                path: 'upload/{albumName}',
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
