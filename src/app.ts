import express, { Express } from 'express';
import bodyParser from 'body-parser';
import { albumRouter } from './routes/album.route';
import { userRouter } from './routes/user.route';
import { photoRouter } from './routes/photo.route';
import { clientRouter } from './routes/client.route';
import { errorHandler } from './middleware/error.middleware';

const PORT = process.env.PORT || 3000;

const app = express();

app.use(bodyParser.text());
app.use(express.json());
app.use('/', userRouter);
app.use('/', clientRouter);
app.use('/albums', albumRouter);
app.use('/getPresignedUrl', photoRouter);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`listening on http://localhost:${PORT}/`);
});
