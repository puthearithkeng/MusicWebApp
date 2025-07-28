import models from '../models/index.js';
const { User } = models;

export const syncUser = async (req, res) => {
  let { firebaseUid, email, username, profile_image } = req.body;

  if (!firebaseUid || !email) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Fallback username if missing or empty
  if (!username || username.trim() === '') {
    username = email.split('@')[0] || 'user_' + Math.floor(Math.random() * 10000);
  }

  try {
    // Try to find existing user
    let user = await User.findOne({ where: { firebaseUid } });

    if (user) {
      // Update existing user
      await user.update({
        email,
        username,
        profileImage: profile_image || null,
      });
    } else {
      // Create new user
      user = await User.create({
        firebaseUid,
        email,
        username,
        profileImage: profile_image || null,
      });
    }

    res.json({ success: true, user, created: !user });
  } catch (error) {
    console.error('Sequelize error:', error);
    res.status(500).json({ error: 'Database error', details: error.message });
  }
};
