// music-app-backend/controllers/radioController.js
import models from '../models/index.js';

const { Radio } = models;

export const getAllRadios = async (req, res) => {
  try {
    const radios = await Radio.findAll();
    res.status(200).json(radios);
  } catch (error) {
    console.error('Error in getAllRadios:', error);
    res.status(500).json({ message: 'Failed to retrieve radios', error: error.message });
  }
};

export const getRadioById = async (req, res) => {
  try {
    const radio = await Radio.findByPk(req.params.id);
    if (radio) {
      res.status(200).json(radio);
    } else {
      res.status(404).json({ message: 'Radio not found' });
    }
  } catch (error) {
    console.error('Error in getRadioById:', error);
    res.status(500).json({ message: 'Failed to retrieve radio', error: error.message });
  }
};

export const createRadio = async (req, res) => {
  try {
    const newRadio = await Radio.create(req.body);
    res.status(201).json(newRadio);
  } catch (error) {
    console.error('Error in createRadio:', error);
    res.status(400).json({ message: 'Failed to create radio', error: error.message });
  }
};

export const updateRadio = async (req, res) => {
  try {
    const [updatedRows] = await Radio.update(req.body, {
      where: { radio_id: req.params.id }
    });
    if (updatedRows > 0) {
      const updatedRadio = await Radio.findByPk(req.params.id);
      res.status(200).json(updatedRadio);
    } else {
      res.status(404).json({ message: 'Radio not found or no changes made' });
    }
  } catch (error) {
    console.error('Error in updateRadio:', error);
    res.status(400).json({ message: 'Failed to update radio', error: error.message });
  }
};

export const deleteRadio = async (req, res) => {
  try {
    const deleted = await Radio.destroy({
      where: { radio_id: req.params.id }
    });
    if (deleted > 0) {
      res.status(204).send(); // No Content
    } else {
      res.status(404).json({ message: 'Radio not found' });
    }
  } catch (error) {
    console.error('Error in deleteRadio:', error);
    res.status(500).json({ message: 'Failed to delete radio', error: error.message });
  }
};