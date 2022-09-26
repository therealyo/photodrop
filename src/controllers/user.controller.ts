import { ApiError } from './../errors/api.error';
import { NextFunction, Request, Response } from 'express';
import userService from '../service/user.service';

class UserController {
    async registration(req: Request, res: Response, next: NextFunction) {
        try {
            const { username, password, email, fullName } = req.body;
            const userData = await userService.registration(username, password, email, fullName);

            return res.status(200).json({
                status: 200,
                message: userData
            });
        } catch (err) {
            next(err);
        }
    }

    async username(req: Request, res: Response, next: NextFunction) {
        try {
            const { username, password } = req.body;
            const token = await userService.login(username, password);

            return res.status(200).json({
                status: 200,
                message: 'Successfully logged in',
                token: token
            });
        } catch (err) {
            next(err);
        }
    }

    async getAlbums(req: Request, res: Response, next: NextFunction) {
        try {
            const { user } = req.body;
            const albums = await userService.getAlbums(user);
            return res.status(200).json({
                status: 200,
                data: albums
            });
        } catch (err) {
            next(err);
        }
    }

    async searchClient(req: Request, res: Response, next: NextFunction) {
        try {
            const { contains } = req.query;
            const { user } = req.body;

            if (!contains) {
                throw new ApiError(400, 'Provide contains argument');
            }
            if (typeof contains !== 'string') {
                throw new ApiError(500, 'Invalid contains argument');
            }

            const clientNumber = await userService.searchClient(user, contains);

            return res.status(200).json({
                status: 200,
                data: clientNumber ? clientNumber : 'not found'
            });
        } catch (err) {
            next(err);
        }
    }
}

export default new UserController();
