import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import User from '../models/user.model.js';
import { errorHandler } from '../utils/error.js';

dotenv.config();

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

export const signin = async (req, res, next) => {
    const { email, password } = req.body;

    // Check if any required fields are missing
    if (!email || !password) {
        return next(errorHandler(400, 'Missing required fields!'));
    }

    try {
        const validUser = await User.findOne({ email });
        if (!validUser) return next(errorHandler(404, 'User not found!') );

        const validPassword = bcryptjs.compareSync(
            password,
            validUser.password
        );
        if (!validPassword)
            return next(errorHandler(401, 'Wrong credentials!'));

        const token = jwt.sign(
            {
                id: validUser._id,
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        const { password: hashedPassword, ...user } = validUser._doc;

        res.cookie('access_token', token, { httpOnly: true }).status(200).json({
            success: true,
            message: 'User logged in successfully!',
            user,
        });
    } catch (err) {
        next(errorHandler(500, err.message));
    }
};
