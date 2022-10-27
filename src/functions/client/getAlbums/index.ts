import { handlerPath } from '../../../libs/handler-resolver';

export const getClientAlbums = {
    handler: `${handlerPath(__dirname)}/handler.getClientAlbums`,

    events: [
        {
            http: {
                method: 'get',
                path: 'client/albums',
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
