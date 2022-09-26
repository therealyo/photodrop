import { Router } from 'express';
import albumController from '../controllers/album.controller';
import { auth } from '../middleware/auth.middleware';
import { createAlbumValidation, deleteAlbumValidation } from '../validation/album.validation';

export const albumRouter = Router();

// api/albums routess
albumRouter.get('/:name', auth, albumController.getAlbum); //done

albumRouter.post('/', createAlbumValidation, auth, albumController.createAlbum); //done

albumRouter.delete('/:name', deleteAlbumValidation, albumController.deleteAlbum); //done

// export default albumRouter;
