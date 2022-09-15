import { Router } from 'express';
import { auth } from '../middleware/auth.middleware';

export const clientRouter = Router();

clientRouter.get('/searchClient', auth);

// export default clientRouter;
