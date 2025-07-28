import './Allstyle.css';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import ProfileModal from './profile';
import SearchBar from './Search'; // Adjust the path if needed

export default function Navbar({ isAuthenticated, currentUser, onSignOut, onAuthSuccess }) {
  const [open, setOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [searchData, setSearchData] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  const showLogo = !isAuthenticated && ["/", "/login", "/signup"].includes(location.pathname);

  const flattenData = useCallback((data) => {
    const results = [];

    if (data.artists) {
      data.artists.forEach((artist) => {
        results.push({
          title: artist.name,
          link: `/artist/${artist.artistId}`,
          type: 'artist',
        });

        artist.Albums?.forEach((album) => {
          results.push({
            title: album.name,
            link: `/album/${album.albumId}`,
            type: 'album',
          });

          album.Songs?.forEach((song) => {
            results.push({
              title: song.title,
              link: `/song/${song.songId}`,
              type: 'song',
            });
          });
        });
      });
    }

    return results;
  }, []);

  useEffect(() => {
    const fetchSearchData = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/search');
        setSearchData(flattenData(res.data));
      } catch (error) {
        console.error('Error fetching search data:', error);
      }
    };

    fetchSearchData();
  }, [flattenData]);

  const openProfileModal = () => setIsProfileModalOpen(true);
  const closeProfileModal = () => setIsProfileModalOpen(false);

  const handleSearchSelect = (item) => {
    if (item?.title) {
      navigate(`/search?q=${encodeURIComponent(item.title)}`);
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-gray-900 text-white shadow-lg z-20">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between px-4 py-3">
        {showLogo && (
          <div className="text-3xl font-bold tracking-wider mr-auto md:mr-0">
            <Link to="/" className="hover:text-red-500">
              MUSIC<span className="text-red-500 text-2xl">ALER</span>
            </Link>
          </div>
        )}

        <button
          className="md:hidden p-2 focus:outline-none"
          onClick={() => setOpen(!open)}
          aria-label="Toggle navigation"
        >
          {open ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>

        <ul className={`md:flex md:space-x-6 items-center ${open ? 'block mt-4 text-center w-full' : 'hidden'} md:flex-grow md:flex md:justify-end md:w-auto`}>
          {isAuthenticated ? (
            <>
              <div className="md:flex md:space-x-6 items-center flex-grow">
                <li>
                  <NavLink
                    to="/music"
                    className={({ isActive }) =>
                      isActive
                        ? 'block py-2 px-3 text-red-500 font-semibold md:inline-block'
                        : 'block py-2 px-3 hover:text-red-500 transition-colors md:inline-block'
                    }
                  >
                    Home
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/albums"
                    className={({ isActive }) =>
                      isActive
                        ? 'block py-2 px-3 text-red-500 font-semibold md:inline-block'
                        : 'block py-2 px-3 hover:text-red-500 transition-colors md:inline-block'
                    }
                  >
                    Albums
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/artist"
                    className={({ isActive }) =>
                      isActive
                        ? 'block py-2 px-3 text-red-500 font-semibold md:inline-block'
                        : 'block py-2 px-3 hover:text-red-500 transition-colors md:inline-block'
                    }
                  >
                    Artist
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/favorite"
                    className={({ isActive }) =>
                      isActive
                        ? 'block py-2 px-3 text-red-500 font-semibold md:inline-block'
                        : 'block py-2 px-3 hover:text-red-500 transition-colors md:inline-block'
                    }
                  >
                    Favorite
                  </NavLink>
                </li>

                {/* 🔍 SearchBar */}
                <li className="mt-4 md:mt-0 md:ml-4 w-full md:max-w-xs flex items-center justify-center">
                  <SearchBar placeholder="Search..." data={searchData} onSelect={handleSearchSelect} />
                </li>
              </div>

              <div className="md:flex md:space-x-4 items-center mt-4 md:mt-0 md:ml-auto">
                <li className="mt-4 md:mt-0">
                  <span
                    onClick={openProfileModal}
                    className="block py-2 px-3 text-gray-300 md:inline-block cursor-pointer hover:text-white transition-colors"
                  >
                    Hello, {currentUser?.email ? currentUser.email.split('@')[0] : currentUser?.uid?.substring(0, 8)}!
                  </span>
                </li>
                <li className="mt-2 md:mt-0">
                  <button
                    onClick={onSignOut}
                    className="inline-block bg-gradient-to-r from-gray-600 to-gray-800 hover:from-gray-700 hover:to-gray-900 text-white font-bold py-2 px-4 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out"
                  >
                    Sign Out
                  </button>
                </li>
              </div>
            </>
          ) : (
            <div className="md:flex md:space-x-6 items-center md:flex-grow md:justify-end">
              <li className="mt-4 md:mt-0">
                <Link
                  to="/login"
                  className="inline-block bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white font-bold py-2 px-4 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out"
                >
                  Login
                </Link>
              </li>
              <li className="mt-2 md:mt-0">
                <Link
                  to="/signup"
                  className="inline-block bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white font-bold py-2 px-4 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out"
                >
                  Sign Up
                </Link>
              </li>
            </div>
          )}
        </ul>
      </div>

      {/* Profile Modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={closeProfileModal}
        onAuthSuccess={onAuthSuccess}
      />
    </nav>
  );
}
