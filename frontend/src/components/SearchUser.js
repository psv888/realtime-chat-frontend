import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function ComingSoon() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4">
      {/* Back Button */}
      <div className="absolute top-4 left-4">
        <button
          onClick={() => navigate('/home')}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-medium"
        >
          {/* Unicode Left Arrow */}
          <span className="text-xl">&#8592;</span>
          <span>Back</span>
        </button>
      </div>

      {/* Center Content */}
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">🚧 Coming Soon</h1>
        <p className="text-gray-600 text-lg">This feature is under construction. Stay tuned!</p>
      </div>
    </div>
  );
}
