import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { ApiError } from '../errors/api.error';
import albumService from '../service/album.service';

export class AlbumController {
    static async createAlbum(req: Request, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(
                    ApiError.BadRequest(
                        'Request does not pass validation',
                        errors.array()
                    )
                );
            }
            const { name: albumName, location, date, user } = req.body;
            const album = await albumService.createAlbum(
                user,
                albumName,
                location,
                date
            );
            const message = await album.save();
            return res.status(200).json({
                status: 200,
                body: {
                    message
                }
            });
        } catch (err) {
            next(err);
        }
    }

    static async deleteAlbum(req: Request, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(
                    ApiError.BadRequest(
                        'Request does not pass validation',
                        errors.array()
                    )
                );
            }
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

    static async getAlbums(req: Request, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(
                    ApiError.BadRequest(
                        'Request does not pass validation',
                        errors.array()
                    )
                );
            }

            const { user } = req.body;
            const albums = await albumService.getAlbums(user.userId);
            return res.status(200).json({
                status: 200,
                body: albums
            });
        } catch (err) {
            next(err);
        }
    }

    static async getAlbum(req: Request, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(
                    ApiError.BadRequest(
                        'Request does not pass validation',
                        errors.array()
                    )
                );
            }
            const { albumName } = req.params;
            const { user } = req.body;
            const albumData = await albumService.getAlbum(
                user.userId,
                albumName
            );

            return res.status(200).json({
                status: 200,
                body: albumData
            });
        } catch (err) {
            next(err);
        }
    }
}
