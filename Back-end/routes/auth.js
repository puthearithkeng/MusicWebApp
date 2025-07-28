import express from 'express';
import { signup} from '../controllers/signupController.js';
import { login } from '../controllers/loginController.js';
import { syncUser } from '../controllers/authController.js';
import { verifyFirebaseToken } from '../middlewares/verifyFirebaseToken.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/sync', verifyFirebaseToken, syncUser);

export default router;
