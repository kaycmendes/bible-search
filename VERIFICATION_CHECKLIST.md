# Post-Deployment Verification Checklist

## Immediate Actions After Vercel Deploys

Once Vercel finishes deploying the latest changes, complete this checklist:

### 1. Environment Variables Verification ✓
**Action:** Go to Vercel Dashboard → Settings → Environment Variables

Verify these are set for **Production**:
- [ ] `GOOGLE_GEMINI_API_KEY` - Google Gemini API key
- [ ] `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anon key
- [ ] `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key
- [ ] `NEXTAUTH_URL` - Your production URL (e.g., https://aiaskthebible.vercel.app)
- [ ] `NEXTAUTH_SECRET` - Random secret for session encryption
- [ ] `GOOGLE_CLIENT_ID` - Google OAuth client ID
- [ ] `GOOGLE_CLIENT_SECRET` - Google OAuth client secret

**If any are missing:** Add them now and redeploy

### 2. Supabase Status Verification ✓
**Action:** Go to https://supabase.com/dashboard

- [ ] Project is **Active** (not paused)
- [ ] Database is accessible
- [ ] RLS policies are enabled
- [ ] `cards` table exists with correct schema

### 3. Deployment Logs Check ✓
**Action:** Vercel Dashboard → Deployments → [Latest] → View

- [ ] No build errors
- [ ] Functions deployed successfully
- [ ] No runtime errors in initial logs

### 4. Basic Functionality Tests ✓

#### Test 1: Homepage Loads
- [ ] Visit your production URL
- [ ] Homepage loads without errors
- [ ] No console errors in browser DevTools (F12)

#### Test 2: Authentication
- [ ] Click "Sign In" button
- [ ] Google OAuth login works
- [ ] Redirects back to the app after login
- [ ] User profile appears in navbar

#### Test 3: Search Functionality (MAIN FIX)
- [ ] Sign in to the app
- [ ] Enter a search query (e.g., "love")
- [ ] Click Search button
- [ ] **Verify:** No "Method not allowed" error
- [ ] **Verify:** Search returns a Bible verse
- [ ] **Verify:** Verse displays correctly

#### Test 4: Version Selection
- [ ] Change version selector (KJV → NKJV → ACF)
- [ ] Perform search with different versions
- [ ] Verify verses are in correct translation

#### Test 5: Card Management
- [ ] Save a search result
- [ ] Refresh page
- [ ] Verify saved cards appear
- [ ] Delete a card
- [ ] Verify card is removed

### 5. API Endpoint Tests ✓

Run these from your terminal:

```bash
# Make script executable (if not already)
chmod +x test-api.sh

# Test production API
./test-api.sh https://aiaskthebible.vercel.app
```

**Expected Results:**
- [ ] Test 1: OPTIONS request - ✓ PASSED (Status: 200)
- [ ] Test 2: POST with valid data - ✓ PASSED or ⚠ WARNING if API key needed
- [ ] Test 3: GET request - ✓ PASSED (Status: 405 as expected)
- [ ] Test 4: Missing parameters - ✓ PASSED (Status: 400)
- [ ] Test 5: Invalid JSON - ✓ PASSED (Status: 400)

### 6. Browser Console Check ✓
**Action:** Open DevTools (F12) → Console tab

While using the app:
- [ ] No CORS errors
- [ ] No 405 "Method not allowed" errors
- [ ] No failed network requests (except expected auth checks)
- [ ] No JavaScript errors

### 7. Network Tab Verification ✓
**Action:** Open DevTools (F12) → Network tab

Perform a search and verify:
- [ ] `/api/search` request shows Status 200
- [ ] Request Method is POST
- [ ] Response contains verse data
- [ ] No failed requests

### 8. Error Handling Tests ✓

#### Test Invalid Query
- [ ] Search with empty string - Should show error message
- [ ] Search with very long text - Should handle gracefully

#### Test Rate Limiting
- [ ] Make multiple rapid searches
- [ ] If rate limited, error message should be clear and user-friendly

### 9. Cross-Browser Testing ✓
Test on multiple browsers if possible:
- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari (if on Mac)
- [ ] Mobile browser

### 10. Mobile Responsiveness ✓
**Action:** Open DevTools → Toggle device toolbar

Test on different screen sizes:
- [ ] Mobile (375px width)
- [ ] Tablet (768px width)
- [ ] Desktop (1920px width)
- [ ] UI is usable on all sizes
- [ ] No horizontal scrolling issues

---

## If Any Issues Are Found

### Issue: Still Getting "Method not allowed"

1. **Check Vercel Function Logs:**
   - Dashboard → Deployments → Functions tab
   - Look for the actual error message

2. **Verify Deployment:**
   ```bash
   curl -I https://yourdomain.vercel.app/api/search
   ```
   Should return headers including `Access-Control-Allow-Methods`

3. **Clear Browser Cache:**
   - Hard refresh: Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)
   - Or use Incognito/Private mode

4. **Check Git Commit:**
   - Verify Vercel deployed the latest commit
   - Dashboard → Deployments → Check commit hash matches

### Issue: Environment Variable Problems

1. **Re-add Variables:**
   - Delete and re-add in Vercel dashboard
   - Make sure to save and redeploy

2. **Check for Typos:**
   - Variable names are case-sensitive
   - No extra spaces in values

### Issue: Supabase Connection Errors

1. **Regenerate API Keys:**
   - Supabase Dashboard → Settings → API
   - Copy new keys
   - Update in Vercel
   - Redeploy

2. **Check RLS Policies:**
   - Database → Policies
   - Ensure policies allow authenticated users

### Issue: Search Returns No Results

1. **Check Gemini API:**
   - Verify API key is valid
   - Check quota in Google Cloud Console
   - Enable billing if needed

2. **Check Logs:**
   - Vercel Function logs will show Gemini API errors
   - Look for 429 (rate limit) or 401 (auth) errors

---

## Success Criteria

The fix is successful when:
- ✅ Users can search for Bible verses without errors
- ✅ No "Method not allowed" messages appear
- ✅ Search results display correctly
- ✅ Cards save and sync with Supabase
- ✅ Authentication works properly
- ✅ No console errors during normal usage

---

## Rollback Plan

If critical issues persist after verification:

1. **Immediate Rollback:**
   ```bash
   # In Vercel Dashboard
   Deployments → [Previous Working Version] → Promote to Production
   ```

2. **Debug in Preview:**
   - Make fixes in a branch
   - Deploy to preview environment
   - Test thoroughly before promoting

3. **Contact Support:**
   - If Vercel-specific issues: support@vercel.com
   - If Supabase issues: Check Supabase Discord/Support
   - If Gemini API issues: Check Google Cloud Support

---

**Last Updated:** December 17, 2025  
**Related Files:** FIXES.md, DEPLOYMENT.md
