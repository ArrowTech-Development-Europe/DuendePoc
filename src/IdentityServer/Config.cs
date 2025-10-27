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
            // SPA client using Resource Owner Password
            new Client
            {
                ClientId = "spa",
                ClientName = "SPA Client",
                ClientSecrets = { new Secret("secret".Sha256()) },
                AllowedGrantTypes = GrantTypes.ResourceOwnerPassword,
                AllowedScopes = new List<string>
                {
                    "openid",
                    "profile",
                    "email",
                    "api1"
                },
                AllowOfflineAccess = true,
                RefreshTokenUsage = TokenUsage.ReUse
            }
        };
    }
}
