import { sendOtpValidation, verifyOtpValidation, personalDataValidation } from './../validation/client.validation';
import { Router } from 'express';
import clientController from '../controllers/client.controller';
import { auth } from '../middleware/auth.middleware';

export const clientRouter = Router();

clientRouter.post('/sendOtp', sendOtpValidation, clientController.sendOtp);
clientRouter.post('/verifyOtp', verifyOtpValidation, clientController.verifyOtp);

clientRouter.get('/client', auth, clientController.getClient);
clientRouter.get('/getPresignedUrl', auth, clientController.setSelfie);

clientRouter.put('/client', personalDataValidation, auth, clientController.setPersonalData);
