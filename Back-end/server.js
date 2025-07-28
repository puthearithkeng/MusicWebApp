// music-app-backend/app.js (or server.js)
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './models/index.js';
import cron from 'node-cron';

// Initialize Firebase Admin SDK (ensure this file sets up admin.initializeApp)
import './firebase/firebaseadmin.js';

// Import your authentication and profile route files (as provided by you)
import authRoutes from './routes/auth.js';
import firebaseUsersRoutes from './routes/firebaseUsers.js';
import profileRoutes from './routes/profile.js';
import searchController from './routes/search.js'; // Assuming you have a search route file
// Import all your API resource route files (newly generated routes)
import albumRoutes from './routes/albumRoutes.js';
import artistRoutes from './routes/artistRoutes.js'; 
import favoriteRoutes from './routes/favoriteRoutes.js';
import playlistRoutes from './routes/playlistRoutes.js';
import radioRoutes from './routes/radioRoutes.js';
import songRoutes from './routes/songRoutes.js';
import playlistSongRoutes from './routes/playlistSongRoutes.js';

// Import the cleanup script
import { cleanupOrphanedFirebaseUsers } from './scripts/cleanupOrphanFirebaseUsers.js'; // adjust path if needed

dotenv.config();

const app = express();

// CORS Configuration
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    // Allow localhost for development
    const localhostRegex = /^http:\/\/localhost(:\d+)?$/;
    if (localhostRegex.test(origin)) {
      callback(null, true);
    } else {
      // You can add more specific origins here for production, e.g.,
      // if (process.env.ALLOWED_ORIGINS.split(',').includes(origin)) {
      //   callback(null, true);
      // } else {
      callback(new Error('Not allowed by CORS'));
      // }
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// Middleware to parse JSON request bodies
app.use(express.json());

/**
 * Starts the Express server and connects to the database.
 * Also schedules the Firebase user cleanup cron job.
 */
async function startServer() {
  try {
    // Connect to the database and sync models
    await connectDB();

    // Use your routes
    // Authentication and Profile Routes (as per your existing setup)
    app.use('/api/auth', authRoutes);
    app.use('/api/firebase/users', firebaseUsersRoutes);
    app.use('/api/profile', profileRoutes);

    // API Resource Routes (newly integrated)
    app.use('/api/albums', albumRoutes);
    app.use('/api/artists', artistRoutes);
    app.use('/api/favorites', favoriteRoutes);
    app.use('/api/playlists', playlistRoutes);
    app.use('/api/radios', radioRoutes);
    app.use('/api/songs', songRoutes);
    app.use('/api/playlist-songs', playlistSongRoutes); // For managing songs within playlists
    app.use('/api/search', searchController); // Assuming you have a search controller

    // Define the port for the server
    const PORT = process.env.PORT || 3000;

    // Start listening for incoming requests
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);

      // Schedule cleanup job to run every 1 hour at minute 0
      // This will call the cleanupOrphanedFirebaseUsers function
      cron.schedule('0 * * * *', () => {
        console.log('Running orphan Firebase user cleanup (every 1 hour)...');
        cleanupOrphanedFirebaseUsers();
      });
    });
  } catch (err) {
    // Log any errors that occur during server startup
    console.error('❌ Failed to start server:', err);
    // Exit the process if the server fails to start
    process.exit(1);
  }
}

// Call the function to start the server
startServer();