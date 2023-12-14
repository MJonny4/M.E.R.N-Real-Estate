import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import userRouter from './routes/user.route.js';

dotenv.config();

mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB!');
    })
    .catch((err) => {
        console.error('Error connecting to mongoDB', err);
    });

const app = express();


app.listen(3000, () => {
    console.log('Server is running 3000!');
});

app.use('/', userRouter);