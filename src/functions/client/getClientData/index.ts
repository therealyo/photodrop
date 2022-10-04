import { handlerPath } from './../../../libs/handler-resolver';
export const getClient = {
    handler: `${handlerPath(__dirname)}/handler.getClient`,
    events: [
        {
            http: {
                method: 'get',
                path: 'client',
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
