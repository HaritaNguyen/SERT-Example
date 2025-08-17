import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import cookieParser from 'cookie-parser';

import userRouter from './routes/mainRoutes';
import { errorHandler, notFound } from './middleware/error';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 2308;

app.use(cookieParser())
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1', userRouter);

app.get('/', (req: Request, res: Response) => {
    res.send('Hello Backends');
});

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server run at port ${PORT}`));
