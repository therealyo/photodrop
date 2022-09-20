import { Router } from 'express';
import clientController from '../controllers/client.controller';
import { auth } from '../middleware/auth.middleware';

export const clientRouter = Router();

clientRouter.post('/sendOtp', clientController.sendOtp);
clientRouter.post('/verifyOtp', clientController.verifyOtp);

clientRouter.get('/client', auth, clientController.getClient);
clientRouter.get('/getPresignedUrl', auth, clientController.setSelfie);
