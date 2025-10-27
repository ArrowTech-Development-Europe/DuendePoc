# Duende IdentityServer POC - Phase 2: Interactive Login Flow

This is a proof-of-concept implementation of Duende IdentityServer demonstrating the Authorization Code Flow with PKCE.

## Architecture

The solution consists of three projects:

1. **IdentityServer** (Port 5001) - The OAuth 2.0/OpenID Connect authorization server
2. **WebClient** (Port 5002) - An ASP.NET Core MVC client application
3. **Api** (Port 5003) - A protected API resource

## Prerequisites

- .NET 8 SDK
- HTTPS development certificates configured (`dotnet dev-certs https --trust`)

## Project Structure

```
DuendePoc/
├── src/
│   ├── IdentityServer/     # Duende IdentityServer
│   ├── WebClient/           # MVC Client
│   └── Api/                 # Protected API
└── tests/                   # (Future: integration tests)
```

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/ArrowTech-Development-Europe/DuendePoc.git
cd DuendePoc
```

### 2. Restore Dependencies

```bash
cd src/IdentityServer && dotnet restore
cd ../WebClient && dotnet restore
cd ../Api && dotnet restore
```

### 3. Trust HTTPS Certificates

```bash
dotnet dev-certs https --trust
```

## Running the POC

You need to run all three projects simultaneously. Open three terminal windows:

### Terminal 1: Start IdentityServer

```bash
cd src/IdentityServer
dotnet run
```

Browse to: https://localhost:5001

### Terminal 2: Start API

```bash
cd src/Api
dotnet run
```

Browse to: https://localhost:5003/swagger

### Terminal 3: Start WebClient

```bash
cd src/WebClient
dotnet run
```

Browse to: https://localhost:5002

## Testing the Flow

### Test Users

Two test users are pre-configured:

| Username | Password | Role  |
|----------|----------|-------|
| alice    | alice    | admin |
| bob      | bob      | user  |

### Testing Steps

1. **View Discovery Document**
   - Go to https://localhost:5001/.well-known/openid-configuration
   - This shows all OAuth/OIDC endpoints

2. **Test Login Flow**
   - Open https://localhost:5002
   - Click "Secure" or any protected page
   - You'll be redirected to IdentityServer login
   - Login with `alice` / `alice`
   - You'll be redirected back to the client
   - You should see your claims displayed

3. **Test API Call**
   - After logging into the WebClient, the access token is stored
   - You can make API calls to https://localhost:5003/identity
   - The API validates the token and returns your claims

4. **Test Logout**
   - Click "Logout" in the WebClient
   - You'll be logged out from both the client and IdentityServer

### Manual API Testing with Postman/curl

To test the API directly with an access token:

1. Get an access token using the authorization code flow (complex, use the WebClient instead)
2. Or use client credentials flow for machine-to-machine:

```bash
# Request token (requires adding a client credentials client to Config.cs)
curl -X POST https://localhost:5001/connect/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "client_id=client&client_secret=secret&grant_type=client_credentials&scope=api1"

# Use the access_token from response
curl https://localhost:5003/identity \
  -H "Authorization: Bearer <your_access_token>"
```

## What's Implemented

### IdentityServer
- ✅ In-memory configuration (clients, scopes, users)
- ✅ Test users with claims
- ✅ Authorization Code Flow with PKCE
- ✅ OpenID Connect discovery document
- ⏳ Login UI (basic Razor Pages - you'll need to add full UI for production)

### WebClient
- ✅ OpenID Connect authentication
- ✅ Authorization Code Flow
- ✅ Cookie-based session
- ✅ Protected pages requiring authentication
- ✅ Logout flow

### API
- ✅ JWT Bearer token authentication
- ✅ Token validation against IdentityServer
- ✅ Scope-based authorization (`api1` scope required)
- ✅ Claims endpoint to view user identity

## Key Concepts Demonstrated

1. **Authorization Code Flow**: Most secure flow for web applications
2. **PKCE (Proof Key for Code Exchange)**: Additional security for public clients
3. **OpenID Connect**: Authentication layer on top of OAuth 2.0
4. **JWT Access Tokens**: Stateless token validation
5. **Scopes**: `openid`, `profile`, `email`, `api1`
6. **Claims**: User identity information (name, email, roles)

## Configuration Details

### Ports
- IdentityServer: `https://localhost:5001`
- WebClient: `https://localhost:5002`
- API: `https://localhost:5003`

### Client Configuration
- **Client ID**: `mvc`
- **Client Secret**: `secret` (hashed with SHA256)
- **Grant Type**: Authorization Code + PKCE
- **Scopes**: `openid`, `profile`, `email`, `api1`

## Next Steps (Phase 3+)

- [ ] Add database persistence (Entity Framework Core)
- [ ] Integrate ASP.NET Core Identity for user management
- [ ] Add user registration and profile management
- [ ] Implement external authentication (Google, Microsoft)
- [ ] Add refresh tokens
- [ ] Implement proper login/consent UI
- [ ] Add multi-factor authentication
- [ ] Deploy to Azure/Kubernetes

## Troubleshooting

### HTTPS Certificate Issues
```bash
dotnet dev-certs https --clean
dotnet dev-certs https --trust
```

### Port Already in Use
Change ports in `Properties/launchSettings.json` for each project.

### "Unable to obtain configuration" Error
- Ensure IdentityServer is running first
- Check https://localhost:5001/.well-known/openid-configuration is accessible

### Login Redirect Loop
- Clear browser cookies
- Check that URLs in `Config.cs` match your actual URLs

## Learning Resources

- [Duende IdentityServer Documentation](https://docs.duendesoftware.com/identityserver/v7)
- [OAuth 2.0 Simplified](https://oauth.net/2/)
- [OpenID Connect Core Spec](https://openid.net/specs/openid-connect-core-1_0.html)

## License

This is a learning POC. Duende IdentityServer requires a license for production use.

## Contact

Questions? Open an issue on GitHub!
