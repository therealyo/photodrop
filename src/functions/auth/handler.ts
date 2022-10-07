// import { ApiError } from './../../errors/api.error';
import tokenService from '../../services/token.service';
import { IUser } from '../../@types/interfaces/IUser';
import { IClient } from '../../@types/interfaces/IClient';

export const auth = async (event: any) => {
    const authHeader = event.headers.Authorization;
    try {
        const token = await tokenService.getBearerToken(authHeader);
        if (!token) {
            return generatePolicy({ allow: false });
        }

        const userData = await tokenService.validateToken(token);

        return generatePolicy({ allow: true }, userData);
    } catch (err) {
        return generatePolicy({ allow: false });
    }
};

const generatePolicy = (status: { allow: boolean }, userData?: IUser | IClient) => {
    return {
        principalId: 'user',
        policyDocument: {
            Version: '2012-10-17',
            Statement: [
                {
                    Action: 'execute-api:Invoke',
                    Effect: status.allow ? 'Allow' : 'Deny',
                    Resource: '*'
                }
            ]
        },
        context: {
            user: JSON.stringify(userData)
        }
    };
};
