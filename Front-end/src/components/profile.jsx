import React, { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';

const fallbackProfileUrl = 'https://placehold.co/150x150/333333/FFFFFF?text=Profile';

const isValidUrl = (url) => {
  if (!url) return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const ProfileModal = ({ isOpen, onClose }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [profileImage, setProfileImage] = useState(fallbackProfileUrl);
  const [loadingImage, setLoadingImage] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setUsername('');
      setEmail('');
      setProfileImage(fallbackProfileUrl);
      setLoadingImage(false);
      return;
    }

    const fetchUserProfile = async () => {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        setUsername('');
        setEmail('');
        setProfileImage(fallbackProfileUrl);
        setLoadingImage(false);
        return;
      }

      // Refresh the user to get latest photoURL
      await user.reload();
      const refreshedUser = auth.currentUser;

      console.log('Refreshed Firebase user:', refreshedUser);
      console.log('photoURL:', refreshedUser.photoURL);

      setUsername(refreshedUser.displayName || (refreshedUser.email ? refreshedUser.email.split('@')[0] : 'User'));
      setEmail(refreshedUser.email || '');

      if (isValidUrl(refreshedUser.photoURL)) {
        setProfileImage(refreshedUser.photoURL);
        setLoadingImage(true); // wait for image to load
      } else {
        setProfileImage(fallbackProfileUrl);
        setLoadingImage(false);
      }
    };

    fetchUserProfile();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 font-inter">
      <div className="bg-gray-900 p-8 rounded-xl shadow-2xl max-w-md w-full border border-gray-700 text-white">
        <h2 className="text-2xl font-bold mb-6 text-center text-white">Your Profile</h2>

        <div className="flex flex-col items-center justify-center mb-6">
          {loadingImage ? (
            <div className="w-28 h-28 rounded-full border-4 border-gray-600 animate-pulse bg-gray-800" />
          ) : null}

          <img
            src={profileImage}
            alt="Profile"
            className="w-28 h-28 rounded-full object-cover border-4 border-red-500 shadow-lg transition-transform duration-300 hover:scale-105"
            style={{ display: loadingImage ? 'none' : 'block' }}
            onLoad={() => setLoadingImage(false)}
            onError={(e) => {
              setTimeout(() => {
                e.target.onerror = null;
                e.target.src = fallbackProfileUrl;
                setLoadingImage(false);
              }, 1000); // Delay fallback
            }}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-1">Username</label>
          <p className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white">
            {username}
          </p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
          <p className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-gray-400">
            {email}
          </p>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-full bg-gray-700 text-gray-200 shadow-md hover:bg-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
