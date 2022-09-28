import { handlerPath } from '../../../libs/handler-resolver';

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
