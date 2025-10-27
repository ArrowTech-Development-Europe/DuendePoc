'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { userManager } from '@/lib/auth';
import { User } from 'oidc-client-ts';

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    userManager.getUser().then((user) => {
      setUser(user);
      setLoading(false);
    });

    // Listen for user loaded events
    const handleUserLoaded = (user: User) => {
      setUser(user);
    };

    userManager.events.addUserLoaded(handleUserLoaded);

    return () => {
      userManager.events.removeUserLoaded(handleUserLoaded);
    };
  }, []);

  const handleLogin = async () => {
    // Redirect to IdentityServer login page
    await userManager.signinRedirect();
  };

  const handleLogout = async () => {
    setApiResponse(null);
    await userManager.signoutRedirect();
  };

  const callApi = async () => {
    if (!user) return;

    try {
      const response = await fetch('https://duende-api.k8s.arrowtech.dev/identity', {
        headers: {
          Authorization: `Bearer ${user.access_token}`,
        },
      });
      const data = await response.json();
      setApiResponse(data);
    } catch (error) {
      console.error('API call failed:', error);
      setApiResponse({ error: 'Failed to call API' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute -top-40 -left-40 w-96 h-96 bg-white/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
          className="absolute -bottom-40 -right-40 w-96 h-96 bg-white/10 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-6xl font-bold text-white mb-4">
            Duende IdentityServer
          </h1>
          <p className="text-2xl text-white/90">Modern Authentication Demo</p>
        </motion.div>

        <div className="flex justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full max-w-md"
          >
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
              <AnimatePresence mode="wait">
                {!user ? (
                  <motion.div
                    key="login"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-6"
                  >
                    <div className="text-center mb-8">
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="inline-block"
                      >
                        <svg
                          className="w-24 h-24 mx-auto text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                          />
                        </svg>
                      </motion.div>
                      <h2 className="text-3xl font-bold text-white mt-4">Welcome Back</h2>
                      <p className="text-white/80 mt-2">Sign in with Duende IdentityServer</p>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleLogin}
                      disabled={loading}
                      className="w-full bg-white text-purple-600 font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full"
                        />
                      ) : (
                        <>
                          <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                            />
                          </svg>
                          <span>Sign In with IdentityServer</span>
                        </>
                      )}
                    </motion.button>

                    <div className="text-center text-white/60 text-sm">
                      <p>You will be redirected to the secure login page</p>
                      <p className="mt-2">Test Users: alice/alice or bob/bob</p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="profile"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="text-center mb-6">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 10 }}
                        className="inline-block"
                      >
                        <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white text-4xl font-bold mx-auto shadow-xl">
                          {user.profile?.name?.[0]?.toUpperCase() || 'U'}
                        </div>
                      </motion.div>
                      <h2 className="text-2xl font-bold text-white mt-4">
                        {user.profile?.name || 'User'}
                      </h2>
                      <p className="text-white/80">{user.profile?.email || 'No email'}</p>
                    </div>

                    <div className="bg-white/10 rounded-xl p-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-white/70">Subject:</span>
                        <span className="text-white font-mono text-xs">{user.profile?.sub?.substring(0, 8)}...</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-white/70">Status:</span>
                        <span className="text-green-300">Authenticated via OIDC</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-white/70">Token Expires:</span>
                        <span className="text-white text-xs">{new Date(user.expires_at! * 1000).toLocaleTimeString()}</span>
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={callApi}
                      className="w-full bg-green-500 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                      <span>Call Protected API</span>
                    </motion.button>

                    {apiResponse && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="bg-black/30 rounded-xl p-4 text-white text-sm font-mono overflow-auto max-h-64"
                      >
                        <pre>{JSON.stringify(apiResponse, null, 2)}</pre>
                      </motion.div>
                    )}

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleLogout}
                      className="w-full bg-white/20 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl hover:bg-white/30 transition-all duration-300 flex items-center justify-center space-x-2"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      <span>Sign Out</span>
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center mt-12 text-white/60 text-sm"
        >
          <p>Powered by Duende IdentityServer • OAuth 2.0 & OpenID Connect</p>
        </motion.div>
      </div>
    </div>
  );
}
