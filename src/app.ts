import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { albumRouter } from './routes/album.route';
import { userRouter } from './routes/user.route';
import { photoRouter } from './routes/photo.route';
import { clientRouter } from './routes/client.route';
import { errorHandler } from './middleware/error.middleware';
import { auth } from './middleware/auth.middleware';

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(
    cors({
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Authorization', 'Content-Type']
    })
);

app.use('/', userRouter);
app.use('/', clientRouter);
app.use('/', photoRouter);
app.use('/albums', albumRouter);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`listening on http://localhost:${PORT}/`);
});
