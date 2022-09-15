import { Router } from 'express';
import { auth } from '../middleware/auth.middleware';
import photoController from '../controllers/photo.controller';

export const photoRouter = Router();

photoRouter.post('/:albumName', auth, photoController.savePhotos);

// export default photoRouter;
