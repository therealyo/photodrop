import { handlerPath } from './../../../libs/handler-resolver';
export const addNumbers = {
    handler: `${handlerPath(__dirname)}/handler.addNumbers`,
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
