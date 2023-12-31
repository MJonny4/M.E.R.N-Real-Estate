import { Router } from 'express';

import {
    test,
    updateUser,
    deleteUser,
    getUserListings,
} from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';
import { get } from 'mongoose';

const router = Router();

router.get('/test', test);
router.post('/update/:id', verifyToken, updateUser);
router.delete('/delete/:id', verifyToken, deleteUser);
router.get('/listings/:id', verifyToken, getUserListings);

export default router;
