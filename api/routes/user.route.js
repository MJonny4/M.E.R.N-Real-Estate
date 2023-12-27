import { Router } from 'express';

import { test, updateUser } from '../controllers/user.controller.js';

const router = Router();

router.get('/test', test);
router.post('/update/:id', updateUser);

export default router;
