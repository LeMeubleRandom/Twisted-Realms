import express from 'express';
import UserController from '../controller/UserController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/login', UserController.login);
router.post('/register', UserController.register);

router.get('/me', verifyToken, UserController.getMe);
router.get('/:userId', UserController.getUserById);

export default router;