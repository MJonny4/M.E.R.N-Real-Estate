import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import { errorHandler } from './error.js';

dotenv.config();

export const verifyToken = (req, res, next) => {
    const access_token = req.cookies.access_token;

    if (!access_token) return next(errorHandler(401, 'Unauthorized'));

    jwt.verify(access_token, process.env.JWT_SECRET, (err, user) => {
        if (err) return next(errorHandler(403, 'Forbidden'));
        req.user = user; // or just user
        return next();
    });
};
