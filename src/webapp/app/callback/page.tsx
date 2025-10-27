'use client';

import { useEffect } from 'react';
import { UserManager } from 'oidc-client-ts';
import { useRouter } from 'next/navigation';

const oidcConfig = {
  authority: 'https://duende-identity.k8s.arrowtech.dev',
  client_id: 'mvc',
  client_secret: 'secret',
  redirect_uri: typeof window !== 'undefined' ? `${window.location.origin}/callback` : '',
  response_type: 'code',
  scope: 'openid profile email api1',
  post_logout_redirect_uri: typeof window !== 'undefined' ? window.location.origin : '',
};

export default function Callback() {
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      const manager = new UserManager(oidcConfig);
      try {
        await manager.signinRedirectCallback();
        router.push('/');
      } catch (error) {
        console.error('Error during callback:', error);
        router.push('/');
      }
    };

    handleCallback();
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center">
      <div className="text-white text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
        <p className="text-xl">Completing sign in...</p>
      </div>
    </div>
  );
}
