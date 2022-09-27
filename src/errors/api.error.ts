export class ApiError extends Error {
    statusCode: number;
    body;

    constructor(statusCode: number, message: string, errors: string[] = []) {
        super(message);
        this.statusCode = statusCode;
        this.body = JSON.stringify({
            message,
            errors
        });
    }
    static WrongCredentials(): ApiError {
        return new ApiError(401, 'Wrong login or password');
    }

    static UnauthorizedError(): ApiError {
        return new ApiError(401, 'Not Authorized');
    }

    static BadRequest(message: string, errors: string[] = []): ApiError {
        return new ApiError(400, message, errors);
    }

    static VerificationError(): ApiError {
        return new ApiError(401, 'Wrong token');
    }

    static NotFound(message: string): ApiError {
        return new ApiError(404, message);
    }
}
