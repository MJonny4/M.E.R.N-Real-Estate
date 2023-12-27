import bcryptjs from 'bcryptjs';

import { errorHandler } from '../utils/error.js';
import User from '../models/user.model.js';

export const test = (req, res) => {
    res.send('Hello World!');
};

export const updateUser = async (req, res, next) => {
    if (req.user.id !== req.params.id)
        return next(errorHandler(401, 'Unauthorized to update this user'));

    try {
        if (req.body.password) {
            req.body.password = bcryptjs.hashSync(req.body.password, 12);
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            {
                $set: {
                    username: req.body.username,
                    email: req.body.email,
                    password: req.body.password,
                    avatar: req.body.avatar,
                },
            },
            {
                new: true,
            }
        );

        const { password, ...user } = updatedUser._doc;
        res.status(200).json({
            success: true,
            user,
        });
    } catch (err) {
        return next(errorHandler(500, 'Error updating user'));
    }
};
