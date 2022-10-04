import { handlerPath } from '../../../libs/handler-resolver';

export const getAlbums = {
    handler: `${handlerPath(__dirname)}/handler.getAlbums`,
    events: [
        {
            http: {
                method: 'get',
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
