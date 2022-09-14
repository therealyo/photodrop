import { Router } from 'express';
import { auth } from '../middleware/auth.middleware';
import { PhotoController } from '../controllers/photo.controller';

export const photoRouter = Router();

photoRouter.post('/:albumName', auth, PhotoController.savePhotos);

// export default photoRouter;
