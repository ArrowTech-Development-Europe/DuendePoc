using System.Security.Claims;
using Duende.IdentityServer;
using Duende.IdentityServer.Test;

namespace IdentityServer;

public class TestUsers
{
    public static List<TestUser> Users =>
        new List<TestUser>
        {
            new TestUser
            {
                SubjectId = "1",
                Username = "alice",
                Password = "alice",
                Claims =
                {
                    new Claim("name", "Alice Smith"),
                    new Claim("given_name", "Alice"),
                    new Claim("family_name", "Smith"),
                    new Claim("email", "alice@example.com"),
                    new Claim("email_verified", "true", ClaimValueTypes.Boolean),
                    new Claim("role", "admin"),
                    new Claim("website", "http://alice.com")
                }
            },
            new TestUser
            {
                SubjectId = "2",
                Username = "bob",
                Password = "bob",
                Claims =
                {
                    new Claim("name", "Bob Johnson"),
                    new Claim("given_name", "Bob"),
                    new Claim("family_name", "Johnson"),
                    new Claim("email", "bob@example.com"),
                    new Claim("email_verified", "true", ClaimValueTypes.Boolean),
                    new Claim("role", "user"),
                    new Claim("website", "http://bob.com")
                }
            }
        };
}
