import { Request, Response, NextFunction } from 'express';
import clientService from '../service/client.service';
import phoneService from '../service/phoneNumber.service';

class ClientController {
    async sendOtp(req: Request, res: Response, next: NextFunction) {
        try {
            const { number, newNumber } = req.body;
            const result = await clientService.createClient(
                phoneService.concatNumber(number)!,
                phoneService.concatNumber(newNumber)
            );

            return res.status(200).json({
                status: 200,
                message: result
            });
        } catch (err) {
            next(err);
        }
    }

    async verifyOtp(req: Request, res: Response, next: NextFunction) {
        try {
            const { number, code, newNumber } = req.body;
            const token = await clientService.verifyClient(
                phoneService.concatNumber(number)!,
                code,
                phoneService.concatNumber(newNumber)
            );

            return res.status(200).json({
                status: 200,
                token: token
            });
        } catch (err) {
            next(err);
        }
    }

    async getClient(req: Request, res: Response, next: NextFunction) {
        try {
            const { user } = req.body;
            const userData = await clientService.getClient(user);

            return res.status(200).json({
                status: 200,
                userData
            });
        } catch (err) {
            next(err);
        }
    }

    async setSelfie() {}
}

export default new ClientController();
