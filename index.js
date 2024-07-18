import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import dotenv from 'dotenv';
import logger from './utils/logger.js';
import usersRouter from './routes/users.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan('dev'));
app.use('/users', usersRouter);


app.listen(port, () => {
    logger.info(`Server running on port ${port}`);
});
