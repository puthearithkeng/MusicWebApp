import admin from 'firebase-admin'; // Assuming you're using Firebase Admin SDK for auth verification
import { v4 as uuidv4 } from 'uuid'; // For generating unique filenames
// path and fs/promises are no longer needed if not storing locally
// import path from 'path';
// import fs from 'fs/promises';

// IMPORTANT: Import your Sequelize models object here
// Adjust the path based on your project structure.
// Assuming index.js exports a default object containing your models (e.g., export default db;)
import models from '../models/index.js';
const { User } = models; // Destructure User from the imported models object

// If using Firebase Admin SDK's Storage, you might need to import getStorage
// import { getStorage } from 'firebase-admin/storage'; // Uncomment if using modular Firebase Admin SDK for Storage

// Removed local storage directory setup and ensureUploadsDir function
// const UPLOADS_DIR = path.join(process.cwd(), 'uploads');
// const ensureUploadsDir = async () => { /* ... */ };
// ensureUploadsDir();

export const getProfile = async (req, res) => {
  try {
    // The user object is attached by verifyFirebaseToken middleware
    const user = req.user;
    if (!user || !user.uid) {
      return res.status(401).json({ error: 'Unauthorized: User not found or invalid token.' });
    }

    // Fetch user data from your actual database using Sequelize
    const dbUser = await User.findOne({
      where: { firebaseUid: user.uid },
      attributes: ['username', 'email', 'profileImage', 'createdAt'] // Select specific fields
    });

    if (!dbUser) {
      // If user not found in DB, create a new entry (common for first-time login)
      // You might want to adjust this logic based on your user registration flow
      const newUser = await User.create({
        firebaseUid: user.uid,
        email: user.email || `${user.uid.substring(0, 6)}@example.com`, // Use Firebase email or generate
        username: user.name || `User-${user.uid.substring(0, 6)}`, // Use Firebase name or generate
        profileImage: 'https://placehold.co/150x150/333333/FFFFFF?text=Profile' // Default profile image
      });

      return res.status(200).json({
        username: newUser.username,
        email: newUser.email,
        profile_image: newUser.profileImage,
        created_at: newUser.createdAt.toISOString()
      });
    }

    // Send back the user data from the database
    res.status(200).json({
      username: dbUser.username,
      email: dbUser.email,
      profile_image: dbUser.profileImage, // This is the URL stored in your DB
      created_at: dbUser.createdAt.toISOString()
    });

  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Failed to fetch profile data' });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const user = req.user; // User object from verifyFirebaseToken middleware
    if (!user || !user.uid) {
      return res.status(401).json({ error: 'Unauthorized: User not found or invalid token.' });
    }

    const { username, profile_image: base64Image } = req.body;
    let newProfileImageUrl = null;

    // Handle profile image upload if base64Image is provided
    if (base64Image) {
      const matches = base64Image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);

      if (matches && matches.length === 3) {
        const mimeType = matches[1];
        const imageData = matches[2];
        const buffer = Buffer.from(imageData, 'base64');

        let ext = '';
        if (mimeType.includes('png')) ext = '.png';
        else if (mimeType.includes('jpeg') || mimeType.includes('jpg')) ext = '.jpg';
        else {
          return res.status(400).json({ error: 'Unsupported image format. Only PNG and JPG are allowed.' });
        }

        const filename = `${uuidv4()}${ext}`;
        // Removed local file saving
        // const filePath = path.join(UPLOADS_DIR, filename);
        // await fs.writeFile(filePath, buffer);
        // console.log(`Image saved locally: ${filePath}`);
        // newProfileImageUrl = `http://localhost:3000/uploads/${filename}`;


        // --- FOR PRODUCTION: Use Firebase Storage or other cloud storage ---
        // Ensure Firebase Admin SDK is initialized and Storage is available
        // If using modular Firebase Admin SDK for Storage, you might need getStorage()
        const bucket = admin.storage().bucket(); // Or specify your bucket name: admin.storage().bucket('your-bucket-name');
        const file = bucket.file(`profile_images/${user.uid}/${filename}`); // Organize by user UID
        await file.save(buffer, {
          metadata: { contentType: mimeType },
          public: true, // Make the file publicly accessible
          resumable: false // Recommended for smaller files
        });
        newProfileImageUrl = file.publicUrl(); // Get the public URL
        console.log(`Image uploaded to Firebase Storage: ${newProfileImageUrl}`);


      } else {
        return res.status(400).json({ error: 'Invalid image data format.' });
      }
    }

    // Prepare data for database update
    const updateData = {};
    if (username !== undefined) {
      updateData.username = username;
    }
    if (newProfileImageUrl !== null) {
      updateData.profileImage = newProfileImageUrl; // Use 'profileImage' for Sequelize model field
    }

    // Update user data in your actual database using Sequelize
    const [rowsAffected, [updatedDbUser]] = await User.update(updateData, {
      where: { firebaseUid: user.uid },
      returning: true // Return the updated row data
    });

    if (rowsAffected === 0) {
      // This means no user was found with that firebaseUid to update
      return res.status(404).json({ error: 'User profile not found for update.' });
    }

    // Send back the updated user data, including the new profile image URL
    res.status(200).json({
      message: 'Profile updated successfully',
      username: updatedDbUser.username,
      email: updatedDbUser.email,
      profile_image: updatedDbUser.profileImage, // Send back as 'profile_image' for frontend consistency
      created_at: updatedDbUser.createdAt.toISOString()
    });

  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: error.message || 'Failed to update profile' });
  }
};
