import { handlerPath } from '../../../libs/handler-resolver';

export const login = {
    handler: `${handlerPath(__dirname)}/handler.login`,
    events: [
        {
            http: {
                method: 'post',
                path: 'login',
                cors: true
            }
        }
    ]
};
