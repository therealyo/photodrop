import { Request, Response, NextFunction } from 'express';
import albumService from '../service/album.service';

class AlbumController {
    async createAlbum(req: Request, res: Response, next: NextFunction) {
        try {
            const { name: albumName, location, date, user } = req.body;
            const message = await albumService.createAlbum(user, albumName, location, date);
            return res.status(200).json({
                status: 200,
                message: message
            });
        } catch (err) {
            next(err);
        }
    }

    async deleteAlbum(req: Request, res: Response, next: NextFunction) {
        try {
            const { albumName } = req.params;
            const { userName } = req.body;
            await albumService.deleteAlbum(albumName, userName);
            return res.status(200).json({
                status: 200,
                message: `Deleted ${albumName}`
            });
        } catch (err) {
            next(err);
        }
    }

    async getAlbum(req: Request, res: Response, next: NextFunction) {
        try {
            const { albumName } = req.params;
            const { user } = req.body;
            const albumData = await albumService.getAlbum(user.userId, albumName);

            return res.status(200).json({
                status: 200,
                data: albumData
            });
        } catch (err) {
            next(err);
        }
    }
}

export default new AlbumController();
