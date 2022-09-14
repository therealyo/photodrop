import { Router } from 'express';
import { AlbumController } from '../controllers/album.controller';
import { auth } from '../middleware/auth.middleware';

export const albumRouter = Router();

// api/albums routes
albumRouter.get('/', auth, AlbumController.getAlbums);
albumRouter.post('/', auth, AlbumController.createAlbum); //done
albumRouter.delete('/:albumName', AlbumController.deleteAlbum); //done
albumRouter.get('/:albumName', auth, AlbumController.getAlbum);

// export default albumRouter;
