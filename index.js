import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import dotenv from 'dotenv';
import connectDB from './config/mongoose.js';
import logger from './utils/logger.js';

// Importar rutas
import adminRoutes from './routes/usersRoutes/adminRoutes.js';
import supportRoutes from './routes/usersRoutes/supportRoutes.js';
import customerRoutes from './routes/usersRoutes/customerRoutes.js';
import deliveryRoutes from './routes/usersRoutes/deliveryRoutes.js';
import productRoutes from './routes/productsRoutes/productRoutes.js';
import storeRoutes from './routes/storesRoutes/storeRoutes.js';
import deliverieRoutes from './routes/deliveriesRoutes/deliverieRoutes.js';
import deliveryStatusRoutes from './routes/deliveriesRoutes/deliveryStatusRoutes.js';
import orderRoutes from './routes/orderRoutes/orderRoutes.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Conexión a MongoDB
connectDB();

// Middlewares
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan('dev'));

// Rutas
app.use('/api', adminRoutes);
app.use('/api', supportRoutes);
app.use('/api', customerRoutes);
app.use('/api', deliveryRoutes);
app.use('/api', productRoutes);
app.use('/api', storeRoutes);
app.use('/api', deliverieRoutes);
app.use('/api', deliveryStatusRoutes);
app.use('/api', orderRoutes);

app.listen(port, () => {
    logger.info(`Server running on port ${port}`);
});
