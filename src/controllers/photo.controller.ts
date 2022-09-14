import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { ApiError } from '../errors/api.error';
import photoService from '../service/photo.service';

export class PhotoController {
    static async savePhotos(req: Request, res: Response, next: NextFunction) {
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
                amount,
                numbers,
                albumName
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
