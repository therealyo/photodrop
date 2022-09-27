import { handlerPath } from '../../libs/handler-resolver';

export const registration = {
    handler: `${handlerPath(__dirname)}/handler.registration`,
    events: [
        {
            http: {
                method: 'post',
                path: 'signup'
            }
        }
    ]
};

export const login = {
    handler: `${handlerPath(__dirname)}/handler.login`,
    events: [
        {
            http: {
                method: 'post',
                path: 'login'
            }
        }
    ]
};

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
                    identitySource: 'method.request.header.authorizationToken'
                }
            }
        }
    ]
};

export const searchClient = {
    handler: `${handlerPath(__dirname)}/handler.searchClient`,
    events: [
        {
            http: {
                method: 'get',
                path: 'searchClient'
            }
        }
    ]
};
