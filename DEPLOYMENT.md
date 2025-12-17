# Bible Search - Deployment Guide

## Environment Variables Required

### Vercel Environment Variables

Make sure ALL of these environment variables are set in your Vercel project settings:

1. **Supabase Configuration**
   - `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key
   - `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key (for server-side operations)

2. **Google Gemini API**
   - `GOOGLE_GEMINI_API_KEY` - Your Google Gemini API key for AI-powered search

3. **NextAuth Configuration**
   - `NEXTAUTH_URL` - Your production URL (e.g., https://aiaskthebible.vercel.app)
   - `NEXTAUTH_SECRET` - A random secret string for session encryption
   - `GOOGLE_CLIENT_ID` - Google OAuth client ID
   - `GOOGLE_CLIENT_SECRET` - Google OAuth client secret

### How to Set Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add each variable listed above
4. Set them for **Production**, **Preview**, and **Development** environments
5. Redeploy your application after adding variables

## Common Deployment Issues

### Issue 1: "Method not allowed" Error (405)

**Symptoms:**
- Error message: `{"message":"Method not allowed"}`
- HTTP status code: 405 or 429

**Causes:**
- Browser sending OPTIONS preflight request (CORS)
- API endpoint receiving GET instead of POST request
- Missing CORS headers

**Solution:**
- ✅ Fixed by adding OPTIONS request handling to API routes
- ✅ Added proper CORS headers to all API endpoints
- Redeploy after pulling latest changes

### Issue 2: Supabase Connection Issues

**Symptoms:**
- "Unauthorized" errors
- Database operations failing
- Cards not saving

**Causes:**
- Supabase project was paused/locked
- Missing environment variables
- Invalid API keys after Supabase unlock

**Solution:**
1. Verify Supabase project is active at https://supabase.com/dashboard
2. Check that RLS (Row Level Security) policies are configured correctly
3. Regenerate API keys if needed:
   - Go to Project Settings → API
   - Copy new `anon` and `service_role` keys
   - Update Vercel environment variables
4. Redeploy application

### Issue 3: Google Gemini API Rate Limiting

**Symptoms:**
- 429 errors from Gemini API
- "Rate limit exceeded" messages

**Solution:**
1. Check your Google Cloud Console quota limits
2. Enable billing if on free tier
3. Implement request throttling on client side
4. Consider adding retry logic with exponential backoff

### Issue 4: Authentication Not Working

**Symptoms:**
- Can't sign in with Google
- Redirect errors after authentication

**Solution:**
1. Verify `NEXTAUTH_URL` matches your production domain exactly
2. Check Google OAuth redirect URIs include:
   - `https://yourdomain.com/api/auth/callback/google`
3. Ensure `NEXTAUTH_SECRET` is set and consistent across deployments
4. Clear browser cookies and try again

## Vercel Deployment Checklist

Before deploying, ensure:

- [ ] All environment variables are set in Vercel
- [ ] Supabase project is active and not paused
- [ ] Google Cloud project has Gemini API enabled
- [ ] OAuth credentials are configured with correct redirect URIs
- [ ] `vercel.json` is properly configured for API timeouts
- [ ] Database tables exist in Supabase with correct schema

## Database Schema

Ensure your Supabase database has the following table:

```sql
CREATE TABLE cards (
  id BIGSERIAL PRIMARY KEY,
  user_email TEXT NOT NULL,
  verse TEXT NOT NULL,
  verse_location TEXT NOT NULL,
  query TEXT NOT NULL,
  version TEXT DEFAULT 'KJV',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_cards_user_email ON cards(user_email);
CREATE INDEX idx_cards_created_at ON cards(created_at DESC);

-- Enable Row Level Security
ALTER TABLE cards ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to see only their own cards
CREATE POLICY "Users can view their own cards"
  ON cards FOR SELECT
  USING (auth.jwt() ->> 'email' = user_email);

-- Create policy to allow users to insert their own cards
CREATE POLICY "Users can insert their own cards"
  ON cards FOR INSERT
  WITH CHECK (auth.jwt() ->> 'email' = user_email);

-- Create policy to allow users to delete their own cards
CREATE POLICY "Users can delete their own cards"
  ON cards FOR DELETE
  USING (auth.jwt() ->> 'email' = user_email);
```

## Testing After Deployment

1. **Test Search Functionality**
   ```bash
   curl -X POST https://yourdomain.com/api/search \
     -H "Content-Type: application/json" \
     -d '{"query": "love", "version": "KJV", "lastVerse": ""}'
   ```

2. **Check Environment Variables**
   - Create a test API route that logs (but doesn't expose) env vars
   - Verify they're being loaded correctly

3. **Test Authentication Flow**
   - Sign in with Google
   - Verify session persistence
   - Test sign out

4. **Test Database Operations**
   - Save a card
   - Load saved cards
   - Delete a card
   - Verify sync between devices

## Monitoring

### Vercel Logs

Access logs in Vercel dashboard:
1. Go to your project
2. Navigate to **Deployments**
3. Click on a deployment
4. View **Functions** logs

### Supabase Logs

Monitor database activity:
1. Go to Supabase dashboard
2. Navigate to **Logs**
3. Check for errors or unusual activity

## Rollback Procedure

If deployment fails:

1. Go to Vercel dashboard
2. Find previous working deployment
3. Click **Promote to Production**
4. Investigate issue in preview deployment

## Support

If issues persist:
1. Check Vercel deployment logs
2. Check browser console for client-side errors
3. Verify all environment variables are set correctly
4. Test API endpoints independently using curl/Postman
5. Check Supabase dashboard for database errors
