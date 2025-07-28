import admin from 'firebase-admin';
import models from '../models/index.js'; // Adjust path if needed

const { User } = models;

export const signup = async (req, res) => {
  try {
    const { email, username, firebaseUid, sign_in_provider } = req.body;

    if (!firebaseUid || !email || !username) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Optional: Check if Firebase user exists
    const userRecord = await admin.auth().getUser(firebaseUid);

    // Sync to MySQL using Sequelize
    const [user, created] = await User.findOrCreate({
      where: { firebase_uid: firebaseUid },
      defaults: {
        email,
        username,
        sign_in_provider,
        profile_image: userRecord.photoURL || null,
      }
    });

    return res.status(201).json({
      message: created ? 'User created successfully' : 'User already exists',
      user,
    });

  } catch (error) {
    console.error('[SIGNUP] Internal server error:', error);
    return res.status(500).json({ message: error.message || 'Internal server error' });
  }
};
