import tokenService from '../../services/token.service';

export const auth = async (event: any) => {
    const authHeader =
        (event.headers &&
            (event.headers['X-Amz-Security-Token'] ||
                event.headers['x-amz-security-token'] ||
                event.headers.Authorization)) ||
        event.authorizationToken;
    try {
        const token = await tokenService.getBearerToken(authHeader);
        if (!token) {
            return generatePolicy({ allow: false });
        }

        const userData = await tokenService.validateToken(token);
        console.log('UserDataInAuth: ', userData);
        // event.body.user = userData;
        const policy = generatePolicy({ allow: true });
        console.log(policy);
        return policy;
    } catch (err) {
        return generatePolicy({ allow: false });
    }
};

const generatePolicy = (status: { allow: boolean }) => {
    return {
        principalId: 'user',
        policyDocument: {
            Version: '2012-10-17',
            Statement: {
                Action: 'execute-api:Invoke',
                Effect: status.allow ? 'Allow' : 'Deny',
                Resource: '*'
            }
        }
    };
};
