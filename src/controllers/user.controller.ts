import { hash } from 'bcrypt';
import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { ApiError } from '../errors/api.error';
import { UserService } from '../service/user.service';

export class UserController {
    static async registration(req: Request, res: Response, next: NextFunction) {
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
            const { login, password, email, fullName } = req.body;
            const userData = await UserService.registration(
                login,
                password,
                email,
                fullName
            );

            return res.status(200).json({
                status: 200,
                body: {
                    message: userData
                }
            });
        } catch (err) {
            next(err);
        }
    }
    static async login(req: Request, res: Response, next: NextFunction) {
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
            const { login, password } = req.body;
            const userData = await UserService.login(login, password);

            return res.status(200).json({
                status: 200,
                body: userData
            });
        } catch (err) {
            next(err);
        }
    }
}
