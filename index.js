import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import dotenv from 'dotenv';
import logger from './utils/logger.js';
import userRoutes from './routes/userRoutes.js';
import roleRoutes from './routes/roleRoutes.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan('dev'));

// Rutas
app.use('/api/users', userRoutes);
app.use('/api/roles', roleRoutes);


app.listen(port, () => {
    logger.info(`Server running on port ${port}`);
});
