import { UserManager, WebStorageStateStore } from 'oidc-client-ts';

export const userManager = new UserManager({
  authority: 'https://duende-identity.k8s.arrowtech.dev',
  client_id: 'spa',
  redirect_uri: typeof window !== 'undefined' ? `${window.location.origin}/callback` : '',
  post_logout_redirect_uri: typeof window !== 'undefined' ? window.location.origin : '',
  response_type: 'code',
  scope: 'openid profile email api1',

  // PKCE settings
  response_mode: 'query',

  // Store tokens in session storage for security
  userStore: typeof window !== 'undefined' ? new WebStorageStateStore({ store: window.sessionStorage }) : undefined,

  // Automatic silent renew
  automaticSilentRenew: true,
  silent_redirect_uri: typeof window !== 'undefined' ? `${window.location.origin}/silent-renew` : '',

  // Load user profile from ID token
  loadUserInfo: true,

  // Token settings
  accessTokenExpiringNotificationTimeInSeconds: 60,

  // Metadata (optional, will be fetched from .well-known/openid-configuration)
  metadata: {
    issuer: 'https://duende-identity.k8s.arrowtech.dev',
    authorization_endpoint: 'https://duende-identity.k8s.arrowtech.dev/connect/authorize',
    token_endpoint: 'https://duende-identity.k8s.arrowtech.dev/connect/token',
    userinfo_endpoint: 'https://duende-identity.k8s.arrowtech.dev/connect/userinfo',
    end_session_endpoint: 'https://duende-identity.k8s.arrowtech.dev/connect/endsession',
  }
});

// Handle silent renew
if (typeof window !== 'undefined') {
  userManager.events.addAccessTokenExpiring(() => {
    console.log('Access token expiring...');
  });

  userManager.events.addAccessTokenExpired(() => {
    console.log('Access token expired');
  });

  userManager.events.addSilentRenewError((error) => {
    console.error('Silent renew error:', error);
  });
}
