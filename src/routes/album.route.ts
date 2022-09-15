import { Router } from 'express';
import albumController from '../controllers/album.controller';
import { auth } from '../middleware/auth.middleware';

export const albumRouter = Router();

// api/albums routes
albumRouter.get('/', auth, albumController.getAlbums); //done
albumRouter.post('/', auth, albumController.createAlbum); //done
albumRouter.delete('/:albumName', albumController.deleteAlbum); //done
albumRouter.get('/:albumName', auth, albumController.getAlbum); //done

// export default albumRouter;
