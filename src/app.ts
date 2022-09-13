import express, { Express } from 'express';
import { albumRouter } from './routes/album.route';
import { clientRouter } from './routes/client.route';
import { userRouter } from './routes/user.route';
import { photoRouter } from './routes/photo.route';
import { errorHandler } from './middleware/error.middleware';

const PORT = process.env.PORT || 3000;

const app: Express = express();

app.use(express.json());
app.use('/', userRouter);
app.use('/', clientRouter);
app.use('/albums', albumRouter);
app.use('/getPresignedUrl', photoRouter);
app.use(errorHandler);

// app.post("/signup", signupValidator, signup)

app.listen(PORT, () => {
    // if (err) => console.log(err);
    console.log(`listening on http://localhost:${PORT}/`);
});
