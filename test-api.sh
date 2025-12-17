#!/bin/bash
# Test script for Bible Search API endpoints

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Default to localhost, but allow override
API_URL="${1:-http://aiaskthebible.com}"

echo "Testing Bible Search API at: $API_URL"
echo "=========================================="
echo ""

# Test 1: OPTIONS request to /api/search
echo "Test 1: OPTIONS request to /api/search (CORS preflight)"
response=$(curl -s -o /dev/null -w "%{http_code}" -X OPTIONS "$API_URL/api/search" \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: POST")

if [ "$response" = "200" ]; then
  echo -e "${GREEN}✓ PASSED${NC} - OPTIONS request successful (Status: $response)"
else
  echo -e "${RED}✗ FAILED${NC} - OPTIONS request failed (Status: $response)"
fi
echo ""

# Test 2: POST request to /api/search with valid data
echo "Test 2: POST request to /api/search with valid data"
response=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X POST "$API_URL/api/search" \
  -H "Content-Type: application/json" \
  -d '{"query": "love", "version": "KJV", "lastVerse": ""}')

http_code=$(echo "$response" | grep "HTTP_STATUS" | cut -d: -f2)
body=$(echo "$response" | sed '/HTTP_STATUS/d')

if [ "$http_code" = "200" ]; then
  echo -e "${GREEN}✓ PASSED${NC} - POST request successful (Status: $http_code)"
  echo "Response preview: ${body:0:100}..."
elif [ "$http_code" = "500" ] && echo "$body" | grep -q "API key not configured"; then
  echo -e "${YELLOW}⚠ WARNING${NC} - API key not configured (Status: $http_code)"
  echo "This is expected if GOOGLE_GEMINI_API_KEY is not set"
else
  echo -e "${RED}✗ FAILED${NC} - POST request failed (Status: $http_code)"
  echo "Response: $body"
fi
echo ""

# Test 3: GET request to /api/search (should fail with 405)
echo "Test 3: GET request to /api/search (should return 405)"
response=$(curl -s -o /dev/null -w "%{http_code}" -X GET "$API_URL/api/search")

if [ "$response" = "405" ]; then
  echo -e "${GREEN}✓ PASSED${NC} - GET request correctly rejected (Status: $response)"
else
  echo -e "${RED}✗ FAILED${NC} - Expected 405, got $response"
fi
echo ""

# Test 4: POST request with missing query parameter
echo "Test 4: POST request with missing query parameter"
response=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X POST "$API_URL/api/search" \
  -H "Content-Type: application/json" \
  -d '{"version": "KJV"}')

http_code=$(echo "$response" | grep "HTTP_STATUS" | cut -d: -f2)

if [ "$http_code" = "400" ]; then
  echo -e "${GREEN}✓ PASSED${NC} - Invalid request correctly rejected (Status: $http_code)"
else
  echo -e "${RED}✗ FAILED${NC} - Expected 400, got $http_code"
fi
echo ""

# Test 5: POST request with invalid JSON
echo "Test 5: POST request with invalid JSON"
response=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$API_URL/api/search" \
  -H "Content-Type: application/json" \
  -d 'invalid json')

if [ "$response" = "400" ] || [ "$response" = "500" ]; then
  echo -e "${GREEN}✓ PASSED${NC} - Invalid JSON correctly rejected (Status: $response)"
else
  echo -e "${RED}✗ FAILED${NC} - Expected 400 or 500, got $response"
fi
echo ""

echo "=========================================="
echo "Testing complete!"
echo ""
echo "To test against production:"
echo "  ./test-api.sh https://yourdomain.vercel.app"
