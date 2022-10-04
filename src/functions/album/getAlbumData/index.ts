import { handlerPath } from './../../../libs/handler-resolver';
export const getAlbumData = {
    handler: `${handlerPath(__dirname)}/handler.getAlbumData`,
    events: [
        {
            http: {
                method: 'get',
                path: 'albums/{albumId}',
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
