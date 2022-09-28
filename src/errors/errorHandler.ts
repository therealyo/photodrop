import { ApiError } from './api.error';

export const handleError = (err) => {
    if (err instanceof ApiError) {
        throw err;
    } else {
        throw new ApiError(500, err.message);
    }
};
