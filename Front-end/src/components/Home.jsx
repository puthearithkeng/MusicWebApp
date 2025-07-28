import './Allstyle.css'

  import React, { useEffect, useState } from 'react'; // Import useState
  import Videobackground from '../assets/videos/16381071-hd_1920_1080_25fps.mp4'; // Import your video file
  // Dummy data for albums and artists to simulate multiple pages
  const allAlbums = [
    { id: 1, title: "Album Title 1", description: "A captivating description of this album, exploring its unique genre, themes, and significant impact on the music scene.", cover: "https://placehold.co/300x300/333333/FFFFFF?text=Album+Cover+1" },
    { id: 2, title: "Album Title 2", description: "A captivating description of this album, exploring its unique genre, themes, and significant impact on the music scene.", cover: "https://placehold.co/300x300/444444/FFFFFF?text=Album+Cover+2" },
    { id: 3, title: "Album Title 3", description: "A captivating description of this album, exploring its unique genre, themes, and significant impact on the music scene.", cover: "https://placehold.co/300x300/555553/FFFFFF?text=Album+Cover+3" },
    { id: 4, title: "Album Title 4", description: "Another fascinating album, delving deeper into experimental sounds and lyrical narratives.", cover: "https://placehold.co/300x300/666666/FFFFFF?text=Album+Cover+4" },
    { id: 5, title: "Album Title 5", description: "An immersive journey through diverse musical landscapes, showcasing artistic evolution.", cover: "https://placehold.co/300x300/777777/FFFFFF?text=Album+Cover+5" },
    { id: 6, title: "Album Title 6", description: "A powerful collection of tracks, delivering profound messages and evocative melodies.", cover: "https://placehold.co/300x300/888888/FFFFFF?text=Album+Cover+6" },
  ];

  const allArtists = [
    { id: 1, name: "Artist Name 1", role: "Lead Vocalist", bio: "Dedicated to pushing musical boundaries, this artist brings unique flair and expertise to every track, enriching our sound.", avatar: "https://placehold.co/150x150/666666/FFFFFF?text=Artist+1" },
    { id: 2, name: "Artist Name 2", role: "Guitarist", bio: "With shredding solos and intricate riffs, this guitarist adds a fiery passion to our band's dynamic sound.", avatar: "https://placehold.co/150x150/777777/FFFFFF?text=Artist+2" },
    { id: 3, name: "Artist Name 3", role: "Drummer", bio: "The rhythmic backbone of the group, this drummer provides explosive beats and a solid foundation.", avatar: "https://placehold.co/150x150/888888/FFFFFF?text=Artist+3" },
    { id: 4, name: "Artist Name 4", role: "Bassist", bio: "Laying down groovy lines and powerful rhythms, the bassist brings depth and energy to our live performances.", avatar: "https://placehold.co/150x150/999999/FFFFFF?text=Artist+4" },
    { id: 5, name: "Artist Name 5", role: "Keyboardist", bio: "Weaving lush textures and captivating melodies, the keyboardist creates atmospheric soundscapes.", avatar: "https://placehold.co/150x150/AAAAAA/FFFFFF?text=Artist+5" },
    { id: 6, name: "Artist Name 6", role: "Composer", bio: "The visionary behind our unique sound, this composer crafts intricate arrangements and memorable tunes.", avatar: "https://placehold.co/150x150/BBBBBB/FFFFFF?text=Artist+6" },
  ];


  // Main App component
  function Homepage() {
    // State for discography carousel
    const [currentAlbumIndex, setCurrentAlbumIndex] = useState(0);
    const albumsPerPage = 1; // Changed to 1 to show one album at a time

    // State for artists carousel
    const [currentArtistIndex, setCurrentArtistIndex] = useState(0);
    const artistsPerPage = 1; // Changed to 1 to show one artist at a time

    // Functions to navigate albums
    const nextAlbums = () => {
      setCurrentAlbumIndex((prevIndex) => (prevIndex + 1) % allAlbums.length); // Adjusted for single item
    };

    const prevAlbums = () => {
      setCurrentAlbumIndex((prevIndex) => (prevIndex - 1 + allAlbums.length) % allAlbums.length); // Adjusted for single item
    };

    // Functions to navigate artists
    const nextArtists = () => {
      setCurrentArtistIndex((prevIndex) => (prevIndex + 1) % allArtists.length); // Adjusted for single item
    };

    const prevArtists = () => {
      setCurrentArtistIndex((prevIndex) => (prevIndex - 1 + allArtists.length) % allArtists.length); // Adjusted for single item
    };

    // Calculate visible albums and artists
    const visibleAlbums = allAlbums.slice(
      currentAlbumIndex * albumsPerPage,
      (currentAlbumIndex + 1) * albumsPerPage
    );

    const visibleArtists = allArtists.slice(
      currentArtistIndex * artistsPerPage,
      (currentArtistIndex + 1) * artistsPerPage
    );

    useEffect(() => {
      // Dynamically inject a style tag into the head of the document
      // to reset default margins and paddings for html and body elements
      // within the iframe. This is crucial for truly full-screen behavior.
      const styleTag = document.createElement('style');
      styleTag.innerHTML = `
        html, body {
          margin: 0 !important;
          padding: 0 !important;
          width: 100% !important;
          height: 100% !important;
          box-sizing: border-box !important; /* Ensures padding/border are included in element's total width/height */
          scroll-behavior: smooth; /* Smooth scrolling for navigation */
        }
        #root { /* Assuming React app is mounted to a div with id="root" */
          width: 100% !important;
          height: 100% !important;
        }

        /* Custom Animations */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
        }
        .animate-scaleIn {
          animation: scaleIn 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; /* Bounce effect */
        }
        /* Staggered animation delays */
        .animation-delay-100 { animation-delay: 0.1s; }
        .animation-delay-200 { animation-delay: 0.2s; }
        .animation-delay-300 { animation-delay: 0.3s; }
        .animation-delay-400 { animation-delay: 0.4s; }
        .animation-delay-500 { animation-delay: 0.5s; }
        .animation-delay-600 { animation-delay: 0.6s; }
        .animation-delay-700 { animation-delay: 0.7s; }
        .animation-delay-800 { animation-delay: 0.8s; }
        .animation-delay-900 { animation-delay: 0.9s; }
      `;
      document.head.appendChild(styleTag);

      // Dynamically inject Tailwind CSS CDN script
      const tailwindScript = document.createElement('script');
      tailwindScript.src = 'https://cdn.tailwindcss.com';
      tailwindScript.id = 'tailwind-cdn-script'; // Add an ID to easily find and remove it
      document.head.appendChild(tailwindScript);


      // Cleanup function to remove the style tag and script when the component unmounts
      return () => {
        if (document.head.contains(styleTag)) {
          document.head.removeChild(styleTag);
        }
        const existingTailwindScript = document.getElementById('tailwind-cdn-script');
        if (existingTailwindScript) {
          document.head.removeChild(existingTailwindScript);
        }
      };
    }, []); // Empty dependency array means this effect runs once on mount

    return (
      // 'absolute inset-0' forces the div to span the entire parent.
      // 'flex flex-col' enables vertical layout.
      // 'overflow-y-auto' allows vertical scrolling for content exceeding height.
      // 'overflow-x-hidden' explicitly prevents horizontal scrollbars and eliminates the grey bar.
      <div className="bg-black text-white font-inter flex flex-col overflow-y-auto overflow-x-hidden absolute inset-0">
        {/* Hero Section (Page 1) - min-h-screen ensures it takes full viewport height */}
        <header id="home" className="relative flex items-center justify-center min-h-screen w-full overflow-hidden">
          {/* Background Video */}
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover z-0"
          >
            <source src={Videobackground} type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {/* Overlay with subtle gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10"></div>

          {/* Central content with improved styling */}
          <div className="relative z-20 text-center flex flex-col items-center justify-center p-4">
            <div className="relative z-30 flex flex-col items-center justify-center">
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-extrabold mb-4 text-red-500 tracking-wider drop-shadow-2xl opacity-0 animate-fadeInUp transform-gpu">
                MUSIC<span className="text-white text-5xl md:text-6xl lg:text-7xl">ALER</span>
              </h1>
              <p className="text-lg md:text-xl mb-10 max-w-lg text-gray-200 leading-relaxed opacity-0 animate-fadeInUp animation-delay-200 transform-gpu">
                Welcome to our music world where every beat tells your story, igniting your soul with vibrant rhythms and unforgettable melodies.
              </p>
              <button className="bg-gradient-to-r from-red-600 to-pink-600 text-white px-10 py-4 rounded-full shadow-lg hover:from-red-700 hover:to-pink-700 transition-all duration-300 flex items-center transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-500 focus:ring-opacity-50 text-xl font-bold opacity-0 animate-fadeInUp animation-delay-400 transform-gpu">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-3"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.456A1 1 0 008 8.3v3.4a1 1 0 001.555.844l3.945-1.972a1 1 0 000-1.688L9.555 7.456z"
                    clipRule="evenodd"
                  />
                </svg>
                PLAY NOW
              </button>
            </div>
          </div>
        </header>

        {/* Purple bar with slant below hero section - fixed height and width for consistent separator */}
        <div
          className="relative w-full h-32 bg-gradient-to-r from-purple-950 to-purple-700"
          style={{
            clipPath: 'polygon(0% 100%, 100% 75%, 100% 0%, 0% 25%)',
          }}
        ></div>

        {/* MY DISCOGRAPHY Section (Page 2) - min-h-screen ensures full viewport height */}
        <section id="discography" className="bg-gradient-to-b from-gray-950 to-black py-20 px-4 md:px-8 lg:px-16 text-center min-h-screen w-full flex flex-col justify-center items-center">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-12 text-red-500 drop-shadow opacity-0 animate-fadeInUp transform-gpu">
            MY <span className="text-white">DISCOGRAPHY</span>
          </h2>
          {/* Carousel container: w-full and relative for absolute positioning of arrows */}
          <div className="relative flex items-center justify-center w-full mb-10">
            {/* Left Arrow Button */}
            <button
              onClick={prevAlbums}
              className="absolute left-0 text-white text-4xl p-3 rounded-full bg-gray-800/50 hover:bg-gray-700/70 transition-colors duration-300 z-10 shadow-lg active:scale-95"
            >
              &lt;
            </button>
            {/* Dynamic Album Cards: Now takes up full width and adds internal padding */}
            <div className="grid grid-cols-1 gap-10 w-full px-4 sm:px-8 lg:px-16 mx-auto" key={currentAlbumIndex}>
              {visibleAlbums.map((album, index) => (
                <div key={album.id} className={`bg-gray-900 p-4 sm:p-6 rounded-xl shadow-2xl border border-gray-700 transform hover:scale-105 transition-all duration-300 flex flex-col items-center text-center opacity-0 animate-fadeInUp transform-gpu animation-delay-${index * 100}`}>
                  <img
                    src={album.cover}
                    alt={album.title}
                    className="w-full h-64 object-cover rounded-lg mb-6 shadow-xl border border-gray-600"
                  />
                  <h3 className="text-2xl font-bold mb-3 text-white">{album.title}</h3>
                  <p className="text-gray-400 text-base leading-relaxed">{album.description}</p>
                  <button className="mt-6 bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700 transition-colors duration-300 transform hover:scale-105 shadow-md font-semibold active:scale-95">
                    Listen Now
                  </button>
                </div>
              ))}
            </div>
            {/* Right Arrow Button */}
            <button
              onClick={nextAlbums}
              className="absolute right-0 text-white text-4xl p-3 rounded-full bg-gray-800/50 hover:bg-gray-700/70 transition-colors duration-300 z-10 shadow-lg active:scale-95"
            >
              &gt;
            </button>
          </div>
          <button className="bg-red-600 text-white px-10 py-4 rounded-full hover:bg-red-700 transition-colors duration-300 mt-12 transform hover:scale-105 shadow-xl font-bold text-xl opacity-0 animate-fadeInUp animation-delay-600 transform-gpu">
            VIEW ALL ALBUMS
          </button>
        </section>

        {/* ARTISTS TEAM Section (Page 3) - min-h-screen ensures full viewport height */}
        <section
          id="artists"
          className="bg-gradient-to-b from-purple-950 to-black pt-24 pb-20 px-4 md:px-8 lg:px-16 text-center relative min-h-screen w-full flex flex-col justify-center items-center"
          style={{
            clipPath: 'polygon(0% 10%, 100% 0%, 100% 100%, 0% 100%)',
          }}
        >
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-red-500 drop-shadow opacity-0 animate-fadeInUp transform-gpu">
            ARTISTS <span className="text-white">TEAM</span>
          </h2>
          <p className="text-gray-300 mb-12 text-lg max-w-2xl leading-relaxed opacity-0 animate-fadeInUp animation-delay-200 transform-gpu">Meet our talented and dedicated artists who craft the magic, pouring their passion into every note and performance.</p>
          {/* Carousel container: w-full and relative for absolute positioning of arrows */}
          <div className="relative flex items-center justify-center w-full mb-10">
            {/* Left Arrow Button */}
            <button
              onClick={prevArtists}
              className="absolute left-0 text-white text-4xl p-3 rounded-full bg-gray-800/50 hover:bg-gray-700/70 transition-colors duration-300 z-10 shadow-lg active:scale-95"
            >
              &lt;
            </button>
            {/* Dynamic Artist Cards: Now takes up full width and adds internal padding */}
            <div className="grid grid-cols-1 gap-10 w-full px-4 sm:px-8 lg:px-16 mx-auto" key={currentArtistIndex}>
              {visibleArtists.map((artist, index) => (
                <div key={artist.id} className={`bg-gray-900 p-4 sm:p-6 rounded-xl shadow-2xl border border-gray-700 transform hover:scale-105 transition-all duration-300 flex flex-col items-center text-center opacity-0 animate-fadeInUp transform-gpu animation-delay-${index * 100}`}>
                  <img
                    src={artist.avatar}
                    alt={artist.name}
                    className="w-36 h-36 object-cover rounded-full mx-auto mb-6 shadow-xl border-4 border-red-500"
                  />
                  <h3 className="text-2xl font-bold mb-2 text-white">{artist.name}</h3>
                  <p className="text-red-400 text-lg font-semibold mb-3">{artist.role}</p>
                  <p className="text-gray-400 text-base leading-relaxed">{artist.bio}</p>
                </div>
              ))}
            </div>
            {/* Right Arrow Button */}
            <button
              onClick={nextArtists}
              className="absolute right-0 text-white text-4xl p-3 rounded-full bg-gray-800/50 hover:bg-gray-700/70 transition-colors duration-300 z-10 shadow-lg active:scale-95"
            >
              &gt;
            </button>
          </div>
        </section>
            {/*​​ gallary section  */}
              <section id="gallery" className="bg-black py-20 px-4 md:px-8 lg:px-16 text-center min-h-screen w-full flex flex-col justify-center items-center">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-12 text-red-500 drop-shadow opacity-0 animate-fadeInUp transform-gpu">
              <span className="text-white">GALLERY</span>
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 max-w-screen-xl mx-auto auto-rows-min">
              {/* Item 1: Wide & Tall */}
              <div className="col-span-2 row-span-2 rounded-xl overflow-hidden shadow-2xl border border-gray-700 transform hover:scale-105 transition-all duration-300 opacity-0 animate-fadeInUp transform-gpu animation-delay-100">
              <img
                  src="https://placehold.co/800x600/222222/FFFFFF?text=Gallery+1"
                  alt="Gallery 1"
                  className="w-full h-full object-cover"
              />
              </div>
              {/* Item 2: Standard */}
              <div className="col-span-1 rounded-xl overflow-hidden shadow-2xl border border-gray-700 transform hover:scale-105 transition-all duration-300 opacity-0 animate-fadeInUp transform-gpu animation-delay-200">
              <img
                  src="https://placehold.co/400x300/333333/FFFFFF?text=Gallery+2"
                  alt="Gallery 2"
                  className="w-full h-full object-cover"
              />
              </div>
              {/* Item 3: Standard */}
              <div className="col-span-1 rounded-xl overflow-hidden shadow-2xl border border-gray-700 transform hover:scale-105 transition-all duration-300 opacity-0 animate-fadeInUp transform-gpu animation-delay-300">
              <img
                  src="https://placehold.co/400x300/444444/FFFFFF?text=Gallery+3"
                  alt="Gallery 3"
                  className="w-full h-full object-cover"
              />
              </div>
              {/* Item 4: Standard */}
              <div className="col-span-1 rounded-xl overflow-hidden shadow-2xl border border-gray-700 transform hover:scale-105 transition-all duration-300 opacity-0 animate-fadeInUp transform-gpu animation-delay-400">
              <img
                  src="https://placehold.co/400x300/555555/FFFFFF?text=Gallery+4"
                  alt="Gallery 4"
                  className="w-full h-full object-cover"
              />
              </div>
              {/* Item 5: Standard */}
              <div className="col-span-1 rounded-xl overflow-hidden shadow-2xl border border-gray-700 transform hover:scale-105 transition-all duration-300 opacity-0 animate-fadeInUp transform-gpu animation-delay-500">
              <img
                  src="https://placehold.co/400x300/666666/FFFFFF?text=Gallery+5"
                  alt="Gallery 5"
                  className="w-full h-full object-cover"
              />
              </div>
          </div>
  </section>


        {/* TRADING ALBUM Section (Page 5) - Full-width diagonal background */}
        <section
          id="trading"
          className="relative py-20 px-4 md:px-8 lg:px-16 flex flex-col lg:flex-row items-center justify-center gap-16 min-h-screen w-full opacity-0 animate-scaleIn transform-gpu" // Added animation classes
          style={{
            backgroundImage: `linear-gradient(to bottom right, #FFFFFF 50%, #390396 50%)`, // Using hex codes directly
            backgroundSize: '100% 100%',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <h2 className="text-6xl md:text-7xl lg:text-8xl font-extrabold text-orange-500 text-center lg:text-left tracking-wide leading-tight drop-shadow-2xl">
            TRADING <br /> ALBUM
          </h2>
          <div className="bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-700 flex flex-col md:flex-row items-center gap-8 max-w-2xl w-full transform hover:scale-105 transition-all duration-300 active:scale-95"> {/* Added active:scale-95 */}
            <img
              src="https://placehold.co/200x200/B8860B/FFFFFF?text=Album+Art"
              alt="Trading Album Cover"
              className="w-48 h-48 md:w-64 md:h-64 object-cover rounded-lg shadow-xl border border-gray-600"
            />
            <div className="text-white text-center md:text-left flex-1">
              <h3 className="text-3xl font-bold mb-3">The Golden Hour</h3>
              <p className="text-gray-300 text-lg mb-2">Artist: Electric Dreams</p>
              <p className="text-gray-300 text-lg mb-4">Genre: Synthwave | Release: 2023</p>
              <ul className="text-gray-400 text-base mt-4 space-y-2 list-disc list-inside text-left">
                  <li>Neon Nights <span className="text-gray-500">- 3:45</span></li>
                  <li>Starlight Drive <span className="text-gray-500">- 4:10</span></li>
                  <li>Retrograde <span className="text-gray-500">- 3:15</span></li>
                  <li>Echoes <span className="text-gray-500">- 5:00</span></li>
              </ul>
            </div>
          </div>
        </section>

        {/* Footer Section (Page 6) - min-h-screen ensures full viewport height */}
        <footer
          id="contact"
          className="relative bg-gradient-to-t from-purple-950 to-purple-700 pt-24 pb-16 px-4 md:px-8 lg:px-16 text-center min-h-screen w-full flex flex-col justify-center items-center"
          style={{
            clipPath: 'polygon(0% 10%, 100% 0%, 100% 100%, 0% 100%)',
          }}
        >
          {/* FOLLOW US */}
          <div className="mb-12 w-full max-w-4xl opacity-0 animate-fadeInUp transform-gpu"> {/* Added animation classes */}
            <h3 className="text-4xl font-bold mb-8 text-white drop-shadow">FOLLOW US</h3>
            <div className="flex justify-center space-x-8">
              <a href="#" className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center text-white text-3xl hover:bg-gray-600 transition-all duration-300 transform hover:scale-110 shadow-lg border border-gray-600 active:scale-90"> {/* Added active:scale-90 */}
                {/* Placeholder for Facebook Icon */}
                F
              </a>
              <a href="#" className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center text-white text-3xl hover:bg-gray-600 transition-all duration-300 transform hover:scale-110 shadow-lg border border-gray-600 active:scale-90"> {/* Added active:scale-90 */}
                {/* Placeholder for Twitter Icon */}
                T
              </a>
              <a href="#" className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center text-white text-3xl hover:bg-gray-600 transition-all duration-300 transform hover:scale-110 shadow-lg border border-gray-600 active:scale-90"> {/* Added active:scale-90 */}
                {/* Placeholder for Instagram Icon */}
                I
              </a>
              <a href="#" className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center text-white text-3xl hover:bg-gray-600 transition-all duration-300 transform hover:scale-110 shadow-lg border border-gray-600 active:scale-90"> {/* Added active:scale-90 */}
                {/* Placeholder for YouTube Icon */}
                Y
              </a>
            </div>
          </div>

          {/* CONTACT US Form */}
          <div className="max-w-3xl mx-auto w-full opacity-0 animate-fadeInUp animation-delay-200 transform-gpu"> {/* Added animation classes */}
            <h3 className="text-4xl font-bold mb-6 text-white drop-shadow">CONTACT US</h3>
            <p className="text-gray-300 mb-10 text-lg">GET IN TOUCH NOW!</p>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
              <input
                type="text"
                placeholder="Your Name"
                className="p-4 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300 border border-gray-600 shadow-md"
              />
              <input
                type="email"
                placeholder="Your Email"
                className="p-4 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300 border border-gray-600 shadow-md"
              />
              <textarea
                placeholder="Your Message"
                rows="6"
                className="md:col-span-2 p-4 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300 border border-gray-600 shadow-md"
              ></textarea>
              <button
                type="submit"
                className="md:col-span-2 bg-red-600 text-white px-10 py-4 rounded-full hover:bg-red-700 transition-all duration-300 mt-6 transform hover:scale-105 shadow-xl font-bold text-xl focus:outline-none focus:ring-4 focus:ring-red-500 focus:ring-opacity-50 active:scale-95"
              >
                SEND MESSAGE
              </button>
            </form>
          </div>
        </footer>

        {/* Bottom Copyright Bar - Adjusted to take w-full */}
        <div className="bg-black py-6 text-center text-gray-500 text-sm flex flex-col sm:flex-row justify-between items-center px-4 md:px-8 lg:px-16 w-full border-t border-gray-800">
          <div className="flex space-x-6 mb-3 sm:mb-0 opacity-0 animate-fadeInUp animation-delay-100 transform-gpu"> {/* Added animation classes */}
            <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-lg text-gray-400 shadow-inner">●</div>
            <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-lg text-gray-400 shadow-inner">●</div>
            <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-lg text-gray-400 shadow-inner">●</div>
            <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-lg text-gray-400 shadow-inner">●</div>
          </div>
          <div className="text-base opacity-0 animate-fadeInUp animation-delay-200 transform-gpu"> {/* Added animation classes */}
            &copy; {new Date().getFullYear()} MUSIC ALER. All Rights Reserved.
          </div>
        </div>
      </div>
    );
  }

  export default Homepage;
