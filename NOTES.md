# Development Notes

## What's Included

This POC includes the core infrastructure for Phase 2, but requires additional work to be fully functional.

## What's Missing (To Complete Phase 2)

### 1. IdentityServer Login UI

The IdentityServer needs a full login/consent UI. Currently, only a home page exists.

**Required Pages:**
- `Pages/Account/Login.cshtml` - Login form
- `Pages/Account/Logout.cshtml` - Logout confirmation
- `Pages/Consent/Index.cshtml` - Consent screen (optional for trusted clients)
- `Pages/Error/Index.cshtml` - Error page

**Quick Fix:**
Use Duende's Quickstart UI templates:
```bash
cd src/IdentityServer
dotnet new install Duende.IdentityServer.Templates
dotnet new isui
```

This will scaffold all required login pages.

### 2. WebClient Views

The WebClient MVC app needs actual views.

**Required Views:**
- `Views/Home/Index.cshtml` - Home page
- `Views/Home/Secure.cshtml` - Protected page showing user claims
- `Views/Shared/_Layout.cshtml` - Master layout with login/logout links
- `Views/_ViewStart.cshtml` - View start file

**What to Display:**
```csharp
// In Secure.cshtml, show:
@User.Identity.Name
@User.Claims (all claims)
@User.FindFirst("email")?.Value
```

### 3. Solution File

Create a solution file to manage all projects:
```bash
dotnet new sln -n DuendePoc
dotnet sln add src/IdentityServer/IdentityServer.csproj
dotnet sln add src/WebClient/WebClient.csproj
dotnet sln add src/Api/Api.csproj
```

### 4. Dev Certificates

Make sure HTTPS dev certs are trusted:
```bash
dotnet dev-certs https --trust
```

## Testing Without Full UI

Even without the full login UI, you can still test:

1. **Discovery Document**: https://localhost:5001/.well-known/openid-configuration
2. **API Swagger**: https://localhost:5003/swagger
3. **Direct Token Request**: Use Postman to test OAuth flows

## Next Implementation Steps

1. Add Duende UI templates to IdentityServer
2. Create WebClient views
3. Test full authorization code flow
4. Add API client to WebClient to call the API
5. Display API response in WebClient views

## Phase 3 Preparation

When moving to Phase 3 (Database + ASP.NET Identity):

1. Add Entity Framework Core packages
2. Add PostgreSQL/SQL Server connection strings
3. Replace in-memory stores with EF stores
4. Add ASP.NET Core Identity
5. Create user registration/management UI

## Useful Commands

### Run All Projects (in separate terminals)
```bash
# Terminal 1
cd src/IdentityServer && dotnet watch run

# Terminal 2
cd src/WebClient && dotnet watch run

# Terminal 3
cd src/Api && dotnet watch run
```

### Check Logs
All projects use Serilog - logs will appear in console with timestamps.

### Token Inspection
Use https://jwt.io to decode and inspect JWT tokens.

## Common Issues

1. **Port conflicts**: Change ports in `launchSettings.json`
2. **CORS issues**: Add CORS if testing from different origins
3. **Certificate errors**: Re-trust certificates with `dotnet dev-certs https --clean && dotnet dev-certs https --trust`

## Learning Checkpoints

After completing Phase 2, you should understand:
- [ ] Authorization Code Flow mechanics
- [ ] PKCE (Proof Key for Code Exchange)
- [ ] ID tokens vs Access tokens
- [ ] Scopes and Claims
- [ ] Token validation in APIs
- [ ] Cookie-based sessions in clients
- [ ] Single Sign-Out

## Resources for Building UI

- [Duende Quickstart UI](https://github.com/DuendeSoftware/IdentityServer.Quickstart.UI)
- [Bootstrap 5](https://getbootstrap.com/) for styling
- [ASP.NET Core MVC Views](https://learn.microsoft.com/en-us/aspnet/core/mvc/views/overview)
