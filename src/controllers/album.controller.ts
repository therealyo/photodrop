import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { ApiError } from '../errors/api.error';
import { User } from '../models/User';
// import { Album } from '../models/Album';
import AlbumService from '../service/album.service';

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
            const album = await AlbumService.createAlbum(
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
            await AlbumService.deleteAlbum(albumName, userName);
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
        } catch (err) {
            next(err);
        }
    }
}
