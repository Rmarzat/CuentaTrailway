import express from 'express';
import { AuthService } from '../services/auth.service';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await AuthService.login(email, password);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const result = await AuthService.register(name, email, password);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.post('/status/:userId', authMiddleware, async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { status } = req.body;
    const result = await AuthService.updateUserStatus(userId, status);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

export default router;