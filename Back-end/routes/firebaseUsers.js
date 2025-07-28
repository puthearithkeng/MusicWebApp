import express from 'express';
import { verifyFirebaseToken } from '../middlewares/verifyFirebaseToken.js';

const router = express.Router();

router.get('/', verifyFirebaseToken, (req, res) => {
  res.json({ message: 'Secure Firebase user data', user: req.user });
});

export default router;

