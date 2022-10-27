import { handlerPath } from '../../../libs/handler-resolver';

export const addClients = {
    handler: `${handlerPath(__dirname)}/handler.addClients`,

    events: [
        {
            http: {
                method: 'post',
                path: 'saveNumbers',
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
