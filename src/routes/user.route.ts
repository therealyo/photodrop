import { Router } from 'express';
import { UserController } from '../controllers/user.controller';

export const userRouter = Router();

userRouter.post('/signup', UserController.registration);
userRouter.post('/login', UserController.login);

// export default userRouter;
