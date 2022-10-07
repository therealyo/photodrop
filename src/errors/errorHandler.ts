import { ApiError } from './api.error';

export const handleError = (err) => {
    if (err instanceof ApiError) {
        return err;
    } else {
        return new ApiError(500, err.message, err);
    }
};
