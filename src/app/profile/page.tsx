'use client';

import React from 'react';
import { getUserData, clearUserData } from '../../lib/userState';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import BottomNavigation from '@/components/male/BottomNavigation';

export default function Profile() {
  const userData = getUserData();
  const router = useRouter();

  // Redirect if no user data
  React.useEffect(() => {
    if (!userData) {
      router.push('/');
    }
  }, [userData, router]);

  const handleLogout = () => {
    clearUserData();
    router.push('/');
  };

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1414] text-white p-8 pb-20">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2">Profile</h1>
          <p className="text-gray-300">Your personal information and settings</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Basic Information */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <span className="mr-2">👤</span>
              Basic Information
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-300">Name:</span>
                <span className="font-medium">{userData.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Email:</span>
                <span className="font-medium">{userData.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Gender:</span>
                <span className="font-medium capitalize">{userData.gender}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Location:</span>
                <span className="font-medium">{userData.location}</span>
              </div>
            </div>
          </div>

          {/* Analysis Results */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <span className="mr-2">🔬</span>
              Analysis Results
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-300">Skin Tone:</span>
                <span className={`font-medium ${userData.skin_tone ? 'text-green-400' : 'text-red-400'}`}>
                  {userData.skin_tone || 'Not completed'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Face Shape:</span>
                <span className={`font-medium ${userData.face_shape ? 'text-green-400' : 'text-red-400'}`}>
                  {userData.face_shape || 'Not completed'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Body Shape:</span>
                <span className={`font-medium ${userData.body_shape ? 'text-green-400' : 'text-red-400'}`}>
                  {userData.body_shape || 'Not completed'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Personality:</span>
                <span className={`font-medium ${userData.personality ? 'text-green-400' : 'text-red-400'}`}>
                  {userData.personality || 'Not completed'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/dashboard"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors text-center"
          >
            📊 Go to Dashboard
          </Link>
          
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            🚪 Logout
          </button>
        </div>
      </div>
      <BottomNavigation />
    </div>
  );
}
