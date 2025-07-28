// scripts/cleanupOrphanFirebaseUsers.js

import admin from 'firebase-admin';
import models from '../models/index.js'; // Adjust relative path if needed

const { User } = models;

export async function cleanupOrphanedFirebaseUsers() {
  try {
    let nextPageToken = undefined;
    do {
      const listUsersResult = await admin.auth().listUsers(1000, nextPageToken);
      const users = listUsersResult.users;

      for (const firebaseUser of users) {
        const firebaseUid = firebaseUser.uid;
        const userInDb = await User.findOne({ where: { firebaseUid } });

        if (!userInDb) {
          console.log(`Deleting Firebase user not found in DB: ${firebaseUid} (${firebaseUser.email})`);
          await admin.auth().deleteUser(firebaseUid);
        }
      }
      nextPageToken = listUsersResult.pageToken;
    } while (nextPageToken);

    console.log('Cleanup completed.');
  } catch (error) {
    console.error('Error during cleanup:', error);
  }
}
