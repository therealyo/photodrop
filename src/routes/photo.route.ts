import { Router } from 'express';
import { auth } from '../middleware/auth.middleware';
import photoController from '../controllers/photo.controller';
import { presignedUrlValidation } from '../validation/photo.validation';

export const photoRouter = Router();

photoRouter.post(
    '/:albumName',
    presignedUrlValidation,
    auth,
    photoController.savePhotos
);

// export default photoRouter;
