import { NextFunction, Request, Response } from 'express';
import userService from '../service/user.service';

class UserController {
    async registration(req: Request, res: Response, next: NextFunction) {
        try {
            const { login, password, email, fullName } = req.body;
            const userData = await userService.registration(
                login,
                password,
                email,
                fullName
            );

            return res.status(200).json({
                status: 200,
                message: userData
            });
        } catch (err) {
            next(err);
        }
    }

    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const { login, password } = req.body;
            const userData = await userService.login(login, password);

            return res.status(200).json({
                status: 200,
                data: userData
            });
        } catch (err) {
            next(err);
        }
    }

    async searchClient(req: Request, res: Response, next: NextFunction) {
        try {
            const { contains } = req.params;
        } catch (err) {
            next(err);
        }
    }
}

export default new UserController();
