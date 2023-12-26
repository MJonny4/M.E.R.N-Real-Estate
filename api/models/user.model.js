import { Schema, model } from 'mongoose';

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        avatar: {
            type: String,
            default: 'https://forum.modartt.com/img/avatars/no_avatar.jpg?39936303',
        },
    },
    {
        timestamps: true,
    }
);

export default model('User', userSchema);