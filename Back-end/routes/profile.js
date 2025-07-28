// routes/profile.js
import express from 'express';
import { getProfile, updateProfile } from '../controllers/profileController.js';
import { verifyFirebaseToken } from '../middlewares/verifyFirebaseToken.js';

const router = express.Router();

router.get('/', verifyFirebaseToken, getProfile);
router.put('/', verifyFirebaseToken, updateProfile); // add this

export default router;
