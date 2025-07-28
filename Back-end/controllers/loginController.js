import admin from 'firebase-admin';
import models from '../models/index.js';

const { User } = models;

export const login = async (req, res) => {
  try {
    const idToken = req.headers.authorization?.split('Bearer ')[1];
    if (!idToken) {
      return res.status(401).json({ error: 'No ID token provided' });
    }

    // Verify Firebase ID token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const firebaseUid = decodedToken.uid;

    // Find or create user in your DB
    const [user, created] = await User.findOrCreate({
      where: { firebase_uid: firebaseUid },
      defaults: {
        email: decodedToken.email,
        username: decodedToken.name || decodedToken.email,
        sign_in_provider: decodedToken.firebase?.sign_in_provider || 'firebase',
        profile_image: decodedToken.picture || null,
      },
    });

    // Convert user instance to plain object
    const userData = user.toJSON();

    res.json({ success: true, user: userData });
  } catch (error) {
    console.error('[LOGIN] Error verifying ID token:', error);
    res.status(401).json({ error: 'Invalid or expired ID token' });
  }
};
