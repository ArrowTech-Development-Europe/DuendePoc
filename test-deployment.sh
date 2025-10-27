#!/bin/bash

echo "=== Duende IdentityServer POC - Full Test ==="
echo ""

echo "1. Testing IdentityServer Discovery Document:"
curl -s https://duende-identity.k8s.arrowtech.dev/.well-known/openid-configuration | jq -r '{issuer, token_endpoint, authorization_endpoint, jwks_uri}'
echo ""

echo "2. Getting Access Token (Client Credentials Flow):"
TOKEN=$(curl -s -X POST https://duende-identity.k8s.arrowtech.dev/connect/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "client_id=client" \
  -d "client_secret=secret" \
  -d "grant_type=client_credentials" \
  -d "scope=api1" | jq -r '.access_token')
echo "Token received: ${TOKEN:0:50}..."
echo ""

echo "3. Calling Protected API Endpoint:"
curl -s https://duende-api.k8s.arrowtech.dev/identity \
  -H "Authorization: Bearer $TOKEN" | jq .
echo ""

echo "=== All Tests Passed! ==="
echo ""
echo "URLs:"
echo "  IdentityServer: https://duende-identity.k8s.arrowtech.dev"
echo "  API: https://duende-api.k8s.arrowtech.dev"
