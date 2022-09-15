import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { ApiError } from '../errors/api.error';
import { Album } from '../models/Album';
import photoService from '../service/photo.service';

class PhotoController {
    async savePhotos(req: Request, res: Response, next: NextFunction) {
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
            const { amount, numbers, user } = req.body;

            const links = await photoService.savePhotos(
                user,
                albumName,
                amount,
                numbers
            );

            return res.status(200).json({
                status: 200,
                body: links
            });
        } catch (err) {
            next(err);
        }
    }
}

export default new PhotoController();
