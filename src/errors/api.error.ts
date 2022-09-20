import { ValidationError } from 'express-validator';

export class ApiError extends Error {
    status;
    errors;

    constructor(status: number, message: string, errors: string[] = []) {
        super(message);
        this.status = status;
        this.errors = errors;
    }
    static WrongCredentials() {
        return new ApiError(401, 'Wrong login or password');
    }

    static UnauthorizedError() {
        return new ApiError(401, 'Not Authorized');
    }

    static BadRequest(message: string, errors: string[] = []) {
        return new ApiError(400, message, errors);
    }

    static VerificationError() {
        return new ApiError(401, 'Wrong token');
    }
}
