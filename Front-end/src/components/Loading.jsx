// src/components/Loading.jsx
import React from 'react';
import ReactLoading from 'react-loading';

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen
                    bg-gradient-to-br from-blue-700 to-purple-900
                    text-white p-8">
      <div className="bg-white/20 rounded-2xl shadow-xl backdrop-blur-sm border border-white/30 p-10 flex flex-col items-center space-y-6 max-w-md text-center">
        <ReactLoading type="spinningBubbles" color="#ffffff" height={80} width={80} />

        <h2 className="text-4xl font-extrabold tracking-wide drop-shadow-lg">
          Loading...
        </h2>

        <p className="text-lg text-gray-300">
          Hang tight! Music is loading 🎵
        </p>
      </div>
    </div>
  );
}
