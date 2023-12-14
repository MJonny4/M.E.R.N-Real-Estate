import bcryptjs from 'bcryptjs';

import User from '../models/user.model.js';
import { errorHandler } from '../utils/error.js';

export const signup = async (req, res, next) => {
    const { username, email, password } = req.body;
    const hashedPassword = bcryptjs.hashSync(password, 12);

    const newUser = new User({
        username,
        email,
        password: hashedPassword,
    });

    try {
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (err) {
        next(errorHandler(500, err.message));
    }
};
