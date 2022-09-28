import { handlerPath } from '../../../libs/handler-resolver';

export const createAlbum = {
    handler: `${handlerPath(__dirname)}/handler.createAlbum`,
    events: [
        {
            http: {
                method: 'post',
                path: 'albums',
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
