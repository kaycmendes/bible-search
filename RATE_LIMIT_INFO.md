# Google Gemini API Rate Limit Information

## Current Issue
Your application is hitting the **Google Gemini API rate limit** (HTTP 429).

## What This Means
- Google Gemini free tier has strict rate limits
- Default: ~15 requests per minute (RPM)
- When exceeded, you get 429 errors for ~30-60 seconds

## Solutions Implemented

### 1. Client-Side Rate Limiting ✅
- Added 2-second cooldown between searches
- Users see a toast notification if they search too quickly
- Prevents rapid-fire requests

### 2. Better Error Messages ✅
- Shows "Rate limit reached. Please wait 30 seconds" instead of generic error
- Clear user feedback with countdown timer

### 3. Request Validation ✅
- Backend validates all requests before hitting Gemini API
- Prevents wasted API calls on invalid data

## Long-Term Solutions

### Option 1: Enable Billing (Recommended)
Enable billing in Google Cloud Console to increase limits significantly:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Navigate to **Billing** → **Link a billing account**
4. Enable **Generative AI API**
5. New limits: **1000 requests per minute**

**Cost:** Very low for personal use (~$0.00025 per request)

### Option 2: Implement Backend Caching
Cache popular queries to reduce API calls:

```javascript
// Example: Cache in Redis or Vercel KV
const cacheKey = `search:${query}:${version}`;
const cached = await redis.get(cacheKey);
if (cached) return cached;

// Make API call
const result = await callGeminiAPI(query);

// Cache for 1 hour
await redis.set(cacheKey, result, 'EX', 3600);
```

### Option 3: Queue System
Implement a request queue with controlled rate:

```javascript
// Example: Use BullMQ or similar
const queue = new Queue('bible-search', {
  limiter: {
    max: 10, // 10 requests
    duration: 60000 // per minute
  }
});
```

### Option 4: Alternative AI Provider
Consider switching to or adding fallback providers:
- **OpenAI GPT-4** - Higher rate limits, paid only
- **Anthropic Claude** - Good for text, paid only
- **Cohere** - Free tier with higher limits
- **Hugging Face** - Free inference API

## Temporary Workaround

For now, users need to:
1. **Wait 30-60 seconds** between searches if they hit the limit
2. **Avoid rapid searches** - the app now enforces 2-second cooldown
3. **Be patient** - the free tier is quite restrictive

## Monitoring Rate Limits

### Check Your Quota
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** → **Enabled APIs**
3. Click **Generative Language API**
4. Click **Quotas & System Limits**
5. View your current usage

### Signs You're Rate Limited
- Getting 429 errors consistently
- Searches fail after a few successful ones
- Error message: "Rate limit exceeded"

## Recommended Next Steps

**For Production Use:**
1. ✅ Enable billing in Google Cloud Console (increases to 1000 RPM)
2. ✅ Implement caching for popular queries
3. ✅ Add user-specific rate limiting
4. ✅ Consider alternative AI providers as fallback

**For Development:**
- Current client-side rate limiting (2 sec cooldown) is sufficient
- Test less frequently
- Consider using mock responses for UI development

## Code Changes Made

### `pages/index.js`
- Added `lastSearchTime` state to track requests
- Added 2-second cooldown enforcement
- Enhanced error handling for 429 responses
- Shows user-friendly messages

### `pages/api/search.js`
- Already had 429 error detection
- Returns clear error messages
- Logs rate limit errors for monitoring

## Testing Rate Limits

To verify the fixes work:
1. Make a successful search
2. Wait 2 seconds
3. Make another search
4. Try to search immediately (should be blocked by client)
5. If you still hit Gemini's limit, wait 30 seconds

## Support Links

- [Google Gemini API Pricing](https://ai.google.dev/pricing)
- [Google Cloud Billing](https://console.cloud.google.com/billing)
- [Gemini API Quotas](https://console.cloud.google.com/apis/api/generativelanguage.googleapis.com/quotas)
