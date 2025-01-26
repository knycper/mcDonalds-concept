import express from 'express';
import cors from 'cors';
import userRoutes from './userRouter.js';
import orderRoutes from './orderRouter.js';
import connectDB from '../database.js';

connectDB()

const app = express();
const port = 3001;

app.use(express.json());

app.use(cors())

app.use('/', userRoutes);
app.use('/orders', orderRoutes);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
