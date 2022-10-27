import { handlerPath } from '../../../libs/handler-resolver';

export const purchaseAlbum = {
    handler: `${handlerPath(__dirname)}/handler.purchaseAlbum`,

    events: [
        {
            http: {
                method: 'post',
                path: 'client/purchase/{albumId}',
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
