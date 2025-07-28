# 🎵 Music Web App

A full-stack music streaming platform built with **React**, **Firebase Authentication**, **Firebase Storage**, **Node.js**, **Sequelize**, and **MySQL**. The app allows users to stream music, explore artists and albums, and enjoy personalized content.

---

## 🚀 Features

- 🔐 **User Authentication** (Email/Password + Google Sign-In via Firebase)
- 🎵 **Stream Songs** and view album/artist info
- 🔍 **Dynamic Search** across songs, albums, and artists
- ☁️ **Firebase Storage** for music and image uploads
- 🌐 **Frontend-backend integration with REST API**

---

## 🛠️ Tech Stack

### Frontend
- React (Vite or CRA)
- Tailwind CSS
- React Router
- Axios

### Backend
- Node.js
- Express.js
- Sequelize ORM
- MySQL

### Firebase
- Firebase Authentication
- Firebase Storage
- Firebase Admin SDK (for backend verification)

---

## 📁 Project Structure
```
music-web-app/
├── Back-end/
│   ├── controllers/
│   ├── firebase/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── scripts/
│   └── uploads/
└── Front-end/
    ├── public/
    └── src/
        ├── assets/
        │   └── videos/
        ├── components/
        └── firebase/
```
---

## 🔧 Setup Instructions

### 1. Clone the repo

```bash
git clone https://github.com/your-username/music-web-app.git
cd music-web-app
```
### 2. Setup NPM for backend 
```
cd Back-end
npm install
cd ..
```
### 3. Setup NPM for frontend 
```
cd Back-end
npm install
```
---

## 🔥 Setup Firebase

1. **Create a Firebase Project**

- Go to the [Firebase Console](https://console.firebase.google.com/).
- Click **Add project** and follow the prompts to create a new project (e.g., `music-web-app`).

2. **Enable Authentication**

- In your Firebase project dashboard, go to **Authentication** > **Sign-in method**.
- Enable **Email/Password** and **Google** sign-in providers.

3. **Set up Firebase Web App**

- Go to **Project settings** > **General**.
- Under **Your apps**, click **Add app** and select **Web**.
- Register your app and copy the Firebase config object, which looks like this:

```js
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-app.firebaseapp.com",
  projectId: "your-app-id",
  storageBucket: "your-app-id.appspot.com",
  messagingSenderId: "your-msg-id",
  appId: "your-app-id",
  measurementId: "your-measurement-id"
};
```
4. **Location to put the file**
```
music-web-app/
└── Front-end/
    └── src/
        └── firebase/
            └── firebase.js   ← put the Firebase initialization code here
```
**Add this Firebase initialization code inside `firebase.js`:**

```js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
 // put the Firebase initialization code here
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-app.firebaseapp.com",
  projectId: "your-app-id",
  storageBucket: "your-app-id.appspot.com",
  messagingSenderId: "your-msg-id",
  appId: "your-app-id",
  measurementId: "your-measurement-id"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
```
### Firebase Service Account JSON Setup

1. **Get your Firebase Service Account JSON**

- In the [Firebase Console](https://console.firebase.google.com/), go to **Project settings** > **Service accounts**.
- Click **Generate new private key** and download the JSON file.
- It will look like this:

```json
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "private_key": "-----BEGIN PRIVATE KEY-----\\nMIIEvQIBADANBgkq...\\n-----END PRIVATE KEY-----\\n",
  "client_email": "firebase-adminsdk-xxxx@your-project-id.iam.gserviceaccount.com",
  "client_id": "123456789012345678901",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xxxx%40your-project-id.iam.gserviceaccount.com"
}
```
2. **Location to put the file**
```
music-web-app/
└── Back-end/
    └── firebase/
        └── serviceAccountKey.json   ← put the Firebase Service Account JSON here (keep it private!)
```

---
## 🎵 Database Setup for Music Web App 🔥
Follow these steps to create and populate your MySQL database using MySQL Workbench

1. **Create Database**

- Open **MySQL Workbench** and connect to your MySQL server.
- Copy and run this to create and select your database:

```sql
CREATE DATABASE IF NOT EXISTS musicplayer CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE musicplayer;
```
then 

```sql
CREATE TABLE IF NOT EXISTS users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  firebase_uid VARCHAR(128) NOT NULL UNIQUE,
  username VARCHAR(50),
  email VARCHAR(100) NOT NULL UNIQUE,
  profile_image TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS artists (
  artist_id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  genre VARCHAR(100),
  profile_image TEXT,
  bio TEXT,
  cover_image TEXT
);

-- (Add the rest of the CREATE TABLE statements here)
```
then 
```sql
INSERT INTO artists (artist_id, name, genre) VALUES
('artist-1', 'Aurora Bloom', 'Electronic'),
('artist-2', 'Lunar Drift', 'Synthwave');

INSERT INTO albums (album_id, name, artist_id) VALUES
('album-1', 'Echoes of Eternity', 'artist-1'),
('album-2', 'Starlight Serenade', 'artist-2');

INSERT INTO songs (song_id, title, artist_id, album_id, genre, duration) VALUES
('song-101', 'Eternal Dawn', 'artist-1', 'album-1', 'Electronic', '00:04:00'),
('song-102', 'Lunar Glow', 'artist-2', 'album-2', 'Synthwave', '00:04:00');
-- (All the insert)
```
## 🔑 Prerequisite (Important) ⚠️⚠️⚠️⚠️	

Before inserting any data, you **must** run the backend and frontend, and log in at least once via the frontend.

✅ This will automatically create a user in the `users` table using Firebase Authentication.

🔒 Some insert statements reference `user_id`, so the user must exist first.

---

## ✅ You're All Set!

If you've successfully inserted data into **all tables**, you're ready to use the 🎵 **Music Web App**!

🚀 Now you can:

- 🎧 Browse songs, albums, artists, and playlists
- 🔐 Log in securely with Firebase Authentication

---

🎉 Happy jamming!

