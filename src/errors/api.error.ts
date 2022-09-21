export class ApiError extends Error {
    status;
    errors;

    constructor(status: number, message: string, errors: string[] = []) {
        super(message);
        this.status = status;
        this.errors = errors;
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
}
