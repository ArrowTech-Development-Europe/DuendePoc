using Duende.IdentityServer.Models;

namespace IdentityServer;

public static class Config
{
    public static IEnumerable<IdentityResource> IdentityResources =>
        new IdentityResource[]
        {
            new IdentityResources.OpenId(),
            new IdentityResources.Profile(),
            new IdentityResources.Email(),
        };

    public static IEnumerable<ApiScope> ApiScopes =>
        new ApiScope[]
        {
            new ApiScope("api1", "My API")
        };

    public static IEnumerable<Client> GetClients(string? webClientUrl = null)
    {
        var clientUrl = webClientUrl ?? "https://localhost:5002";

        return new Client[]
        {
            // MVC client using authorization code flow
            new Client
            {
                ClientId = "mvc",
                ClientName = "MVC Client",
                ClientSecrets = { new Secret("secret".Sha256()) },

                AllowedGrantTypes = GrantTypes.Code,

                // where to redirect to after login
                RedirectUris = { $"{clientUrl}/signin-oidc", $"{clientUrl}/callback" },

                // where to redirect to after logout
                PostLogoutRedirectUris = { $"{clientUrl}/signout-callback-oidc", $"{clientUrl}" },

                AllowedScopes = new List<string>
                {
                    "openid",
                    "profile",
                    "email",
                    "api1"
                },

                RequirePkce = true,
                AllowPlainTextPkce = false
            },
            // Client credentials for API-to-API
            new Client
            {
                ClientId = "client",
                ClientName = "Client Credentials Client",
                ClientSecrets = { new Secret("secret".Sha256()) },
                AllowedGrantTypes = GrantTypes.ClientCredentials,
                AllowedScopes = { "api1" }
            },
            // SPA client using Authorization Code + PKCE (secure browser-based flow)
            new Client
            {
                ClientId = "spa",
                ClientName = "SPA Client",

                // No client secret needed for PKCE (public client)
                RequireClientSecret = false,

                AllowedGrantTypes = GrantTypes.Code,

                // Redirect URIs for Next.js webapp
                RedirectUris = {
                    $"{clientUrl}/api/auth/callback/duende",
                    $"{clientUrl}/callback"
                },

                // Post logout redirect URIs
                PostLogoutRedirectUris = {
                    $"{clientUrl}",
                    $"{clientUrl}/signout-callback"
                },

                AllowedScopes = new List<string>
                {
                    "openid",
                    "profile",
                    "email",
                    "api1"
                },

                // Enable PKCE
                RequirePkce = true,
                AllowPlainTextPkce = false,

                // Allow refresh tokens
                AllowOfflineAccess = true,
                RefreshTokenUsage = TokenUsage.OneTimeOnly,
                RefreshTokenExpiration = TokenExpiration.Sliding,

                // Token lifetimes
                AccessTokenLifetime = 3600, // 1 hour
                IdentityTokenLifetime = 300, // 5 minutes

                // Allow CORS for browser-based requests
                AllowedCorsOrigins = { clientUrl }
            }
        };
    }
}
