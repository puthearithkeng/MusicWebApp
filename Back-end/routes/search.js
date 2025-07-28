import express from 'express';
import { searchByName } from '../controllers/searchController.js';

const router = express.Router();

router.get('/', searchByName);

export default router;
