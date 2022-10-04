import { handlerPath } from './../../../libs/handler-resolver';

export const getClientAlbumPhoto = {
    handler: `${handlerPath(__dirname)}/handler.getAlbumPhotos`,
    events: [
        {
            http: {
                method: 'get',
                path: 'client/albums/{albumId}',
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
