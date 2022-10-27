import { handlerPath } from '../../../libs/handler-resolver';

export const setClientData = {
    handler: `${handlerPath(__dirname)}/handler.setClientData`,

    events: [
        {
            http: {
                method: 'patch',
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
