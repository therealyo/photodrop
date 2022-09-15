import { Router } from 'express';
import userController from '../controllers/user.controller';

export const userRouter = Router();

userRouter.post('/signup', userController.registration);
userRouter.post('/login', userController.login);

// export default userRouter;
