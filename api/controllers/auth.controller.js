import bcryptjs from 'bcryptjs';

import User from '../models/user.model.js';
import { errorHandler } from '../utils/error.js';

export const signup = async (req, res, next) => {
    const { username, email, password } = req.body;

    // Check if any required fields are missing
    if (!username || !email || !password) {
        return next(errorHandler(400, 'Missing required fields!'));
    }

    const hashedPassword = bcryptjs.hashSync(password, 12);

    const newUser = new User({
        username,
        email,
        password: hashedPassword,
    });

    try {
        const savedUser = await newUser.save();
        return res.status(201).json({
            success: true,
            message: 'User created successfully!',
        });
    } catch (err) {
        next(errorHandler(500, err.message));
    }
};
