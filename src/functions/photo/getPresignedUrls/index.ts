import { handlerPath } from './../../../libs/handler-resolver';

export const getPresignedUrl = {
    handler: `${handlerPath(__dirname)}/handler.getPresignedUrl`,
    iamRoleStatements: [
        {
            "Effect": "Allow",
            "Action": [
                "s3:PutObject"
            ],
            "Resource": "arn:aws:s3:::${self:custom.bucket}/*"
        }
    ],

    events: [
        {
            http: {
                method: 'post',
                path: 'upload/{albumId}',
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
