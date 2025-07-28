// music-app-backend/routes/radioRoutes.js
import express from 'express';
import {
  getAllRadios,
  getRadioById,
  createRadio,
  updateRadio,
  deleteRadio
} from '../controllers/radioController.js';

const router = express.Router();

router.get('/', getAllRadios);
router.get('/:id', getRadioById);
router.post('/', createRadio);
router.put('/:id', updateRadio);
router.delete('/:id', deleteRadio);

export default router;