'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { userManager } from '@/lib/auth';

export default function CallbackPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    userManager.signinRedirectCallback()
      .then(() => {
        // Redirect to home page after successful login
        router.push('/');
      })
      .catch((err) => {
        console.error('Error completing authentication:', err);
        setError(err.message);
      });
  }, [router]);

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 max-w-md w-full border border-white/20">
          <h1 className="text-3xl font-bold text-white mb-4">Authentication Error</h1>
          <p className="text-white/80">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="mt-6 w-full bg-white text-red-600 font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 max-w-md w-full border border-white/20 text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto"></div>
        <h2 className="text-2xl font-bold text-white mt-6">Completing sign in...</h2>
        <p className="text-white/80 mt-2">Please wait while we authenticate you</p>
      </div>
    </div>
  );
}
