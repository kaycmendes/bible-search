# Fixes Applied - December 17, 2025

## Issue: "Method not allowed" Error (405) on Vercel Deployment

### Problem
After Supabase was unlocked following inactivity, the `/api/search` endpoint started returning HTTP 405 "Method not allowed" errors on the Vercel deployment.

### Root Cause
1. **Missing CORS preflight handling** - Browser was sending OPTIONS requests before POST requests, which weren't being handled
2. **No CORS headers on responses** - API wasn't setting proper Access-Control headers
3. **Insufficient error details** - Error messages didn't provide enough debugging information

### Changes Made

#### 1. `/pages/api/search.js`
- ✅ Added OPTIONS request handler for CORS preflight
- ✅ Added proper CORS headers to all responses
- ✅ Enhanced request validation with detailed error messages
- ✅ Improved error logging to include request method
- ✅ Added specific handling for 429 (rate limit) errors
- ✅ Added validation for request body structure

**Key additions:**
```javascript
// Handle CORS preflight requests
if (req.method === 'OPTIONS') {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return res.status(200).end();
}

// Set CORS headers for POST requests
res.setHeader('Access-Control-Allow-Origin', '*');
res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
```

#### 2. `/pages/api/cards.js`
- ✅ Added OPTIONS request handler for CORS preflight
- ✅ Added CORS headers to all responses
- Ensures consistency across all API endpoints

#### 3. Documentation
- ✅ Created `DEPLOYMENT.md` - Comprehensive deployment guide
  - Environment variables checklist
  - Common issues and solutions
  - Database schema reference
  - Testing procedures
  - Monitoring and rollback procedures

- ✅ Created `test-api.sh` - API testing script
  - Tests OPTIONS (preflight) requests
  - Tests valid POST requests
  - Tests invalid requests (GET, missing params, bad JSON)
  - Can test both local and production environments

### How to Deploy the Fix

1. **Pull the latest changes** (if using git)
   ```bash
   git pull origin main
   ```

2. **Verify environment variables in Vercel**
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Ensure these are set:
     - `GOOGLE_GEMINI_API_KEY`
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `SUPABASE_SERVICE_ROLE_KEY`
     - `NEXTAUTH_URL`
     - `NEXTAUTH_SECRET`
     - `GOOGLE_CLIENT_ID`
     - `GOOGLE_CLIENT_SECRET`

3. **Deploy to Vercel**
   ```bash
   # If using Vercel CLI
   vercel --prod
   
   # Or push to your git branch connected to Vercel
   git push origin main
   ```

4. **Test the deployment**
   ```bash
   # Make the test script executable
   chmod +x test-api.sh
   
   # Test production API
   ./test-api.sh https://yourdomain.vercel.app
   ```

### Expected Results After Fix

✅ **Before:** 405 "Method not allowed" error  
✅ **After:** Search requests work normally

✅ **Browser preflight requests:** Handled correctly  
✅ **CORS errors:** Resolved  
✅ **Error messages:** More informative and actionable  

### Testing Checklist

After deploying, verify:
- [ ] Search functionality works in the UI
- [ ] No CORS errors in browser console
- [ ] Error messages are clear if something fails
- [ ] Cards save to Supabase correctly
- [ ] Authentication still works
- [ ] Version selector (KJV, NKJV, ACF) works

### Rollback Plan

If issues persist after deployment:

1. **Check Vercel Function Logs**
   - Vercel Dashboard → Deployments → [Latest] → Functions
   - Look for error messages in the logs

2. **Verify API endpoint responses**
   - Use the test script: `./test-api.sh https://yourdomain.vercel.app`
   - Check what status codes are being returned

3. **If needed, roll back**
   - Vercel Dashboard → Deployments
   - Find last working deployment
   - Click "Promote to Production"

### Additional Notes

- **Rate Limiting:** If you see 429 errors from Google Gemini API, you've hit your quota. Check Google Cloud Console.
- **Supabase Connection:** Ensure your Supabase project is active and not paused
- **CORS in Development:** These changes also improve local development CORS handling

### Files Modified
- `pages/api/search.js` - Main search endpoint
- `pages/api/cards.js` - Cards CRUD endpoint

### Files Created
- `DEPLOYMENT.md` - Deployment documentation
- `test-api.sh` - API testing script
- `FIXES.md` - This file

---

**Status:** ✅ Ready to deploy  
**Priority:** High (Production is broken)  
**Risk Level:** Low (Only adds CORS handling, doesn't change business logic)
