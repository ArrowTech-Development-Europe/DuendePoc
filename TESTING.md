# Testing Duende IdentityServer on Kubernetes

The Duende IdentityServer POC is deployed to your AKS cluster and accessible at:

- **IdentityServer**: https://duende-identity.k8s.arrowtech.dev
- **API**: https://duende-api.k8s.arrowtech.dev

## Test Users

- Username: `alice`, Password: `alice` (admin role)
- Username: `bob`, Password: `bob` (user role)

## Testing with curl/Postman

### 1. Get an Access Token (Client Credentials Flow)

This is the easiest way to test - it's for machine-to-machine communication.

```bash
# Get access token using client credentials
curl -X POST https://duende-identity.k8s.arrowtech.dev/connect/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "client_id=client" \
  -d "client_secret=secret" \
  -d "grant_type=client_credentials" \
  -d "scope=api1"
```

**Expected Response:**
```json
{
  "access_token": "eyJhbGc...",
  "expires_in": 3600,
  "token_type": "Bearer",
  "scope": "api1"
}
```

### 2. Call the Protected API

Copy the `access_token` from step 1 and use it:

```bash
# Replace <YOUR_TOKEN> with the actual token
curl https://duende-api.k8s.arrowtech.dev/identity \
  -H "Authorization: Bearer <YOUR_TOKEN>"
```

**Expected Response:**
```json
{
  "message": "You are authenticated!",
  "user": "client",
  "claims": [
    {
      "type": "client_id",
      "value": "client"
    },
    {
      "type": "scope",
      "value": "api1"
    }
  ]
}
```

### 3. View Discovery Document

See all available OAuth/OIDC endpoints:

```bash
curl https://duende-identity.k8s.arrowtech.dev/.well-known/openid-configuration | jq
```

## Postman Collection

### Setup

1. Create a new Collection in Postman
2. Add these requests:

#### Request 1: Get Token

- **Method**: POST
- **URL**: `https://duende-identity.k8s.arrowtech.dev/connect/token`
- **Headers**:
  - `Content-Type`: `application/x-www-form-urlencoded`
- **Body** (x-www-form-urlencoded):
  - `client_id`: `client`
  - `client_secret`: `secret`
  - `grant_type`: `client_credentials`
  - `scope`: `api1`

#### Request 2: Call API

- **Method**: GET
- **URL**: `https://duende-api.k8s.arrowtech.dev/identity`
- **Headers**:
  - `Authorization`: `Bearer {{access_token}}`

**To auto-set the token:**
1. In the "Get Token" request, go to "Tests" tab
2. Add this script:
```javascript
var jsonData = JSON.parse(responseBody);
pm.collectionVariables.set("access_token", jsonData.access_token);
```
3. In the "Call API" request, the `{{access_token}}` variable will be auto-populated

## Testing Authorization Code Flow (Interactive Login)

The Authorization Code Flow requires a browser and is more complex to test with curl. It's designed for web applications where users log in interactively.

### Manual Test (Browser)

1. Open: https://duende-identity.k8s.arrowtech.dev
2. You should see the IdentityServer home page
3. For full interactive login, you would need the WebClient deployed (currently not deployed as it requires additional UI work)

## Checking Deployment Status

```bash
# Check if pods are running
kubectl get pods -n duende-poc

# Check services
kubectl get svc -n duende-poc

# Check ingresses
kubectl get ingress -n duende-poc

# Check certificates
kubectl get certificate -n duende-poc

# View logs
kubectl logs -n duende-poc deployment/identity-server
kubectl logs -n duende-poc deployment/duende-api
```

## Common Issues

### 401 Unauthorized from API

- Check that your token is not expired (expires_in is in seconds)
- Ensure you're including the `Bearer ` prefix
- Verify the token has the `api1` scope

### Cannot connect to IdentityServer

- Check DNS resolution: `nslookup duende-identity.k8s.arrowtech.dev`
- Verify certificate: `curl -I https://duende-identity.k8s.arrowtech.dev`
- Check pod status: `kubectl get pods -n duende-poc`

### Token validation fails

- Ensure API can reach IdentityServer at `https://duende-identity.k8s.arrowtech.dev`
- Check API logs: `kubectl logs -n duende-poc deployment/duende-api`

## Advanced: Decode JWT Token

Use https://jwt.io to decode and inspect your access token. You'll see:

**Header:**
```json
{
  "alg": "RS256",
  "kid": "...",
  "typ": "JWT"
}
```

**Payload:**
```json
{
  "client_id": "client",
  "scope": ["api1"],
  "exp": 1234567890,
  "iss": "https://duende-identity.k8s.arrowtech.dev",
  ...
}
```

## Next Steps

- Try different scopes
- Test token expiration
- Implement refresh tokens
- Add resource owner password flow
- Deploy the WebClient for interactive login testing
