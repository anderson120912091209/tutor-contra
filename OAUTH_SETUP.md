# OAuth Authentication Setup Guide

This guide will help you set up Google and Facebook OAuth authentication for your application.

## Overview

We've added OAuth authentication options to both the sign-in and sign-up pages. Users can now:
- Sign in/up with Google
- Sign in/up with Facebook
- View their profile in the sidebar when logged in
- Sign out from the sidebar dropdown

## Supabase OAuth Configuration

### 1. Google OAuth Setup

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Configure the OAuth consent screen
6. For **Application type**, select **Web application**
7. Add authorized redirect URIs:
   ```
   https://<your-supabase-project>.supabase.co/auth/v1/callback
   ```
8. Copy the **Client ID** and **Client Secret**

#### Add to Supabase:

1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Navigate to **Authentication** → **Providers**
3. Find **Google** and click **Edit**
4. Enable Google provider
5. Paste your **Client ID** and **Client Secret**
6. Save changes

### 2. Facebook OAuth Setup

1. Go to [Facebook for Developers](https://developers.facebook.com/)
2. Create a new app or select an existing one
3. Add **Facebook Login** product to your app
4. Go to **Facebook Login** → **Settings**
5. Add OAuth redirect URI:
   ```
   https://<your-supabase-project>.supabase.co/auth/v1/callback
   ```
6. Go to **Settings** → **Basic**
7. Copy the **App ID** and **App Secret**

#### Add to Supabase:

1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Navigate to **Authentication** → **Providers**
3. Find **Facebook** and click **Edit**
4. Enable Facebook provider
5. Paste your **App ID** (as Client ID) and **App Secret** (as Client Secret)
6. Save changes

## Local Development Setup

### Update Your Site URL

In Supabase Dashboard:
1. Go to **Authentication** → **URL Configuration**
2. Set **Site URL** to: `http://localhost:3000`
3. Add **Redirect URLs**:
   ```
   http://localhost:3000/auth/callback
   http://localhost:3000
   ```

### Environment Variables

Make sure your `.env.local` file contains:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## Features Implemented

### 1. OAuth Buttons on Auth Pages

Both sign-in and sign-up pages now have:
- Google OAuth button with Google logo
- Facebook OAuth button with Facebook logo
- Visual separator ("或" / "OR")
- Proper loading states

### 2. User Profile in Sidebar

When logged in, the sidebar displays:
- User avatar (from OAuth provider or custom upload)
- Display name (from profile or OAuth metadata)
- Email address
- Dropdown menu with:
  - "前往控制台" (Go to Dashboard)
  - "編輯個人檔案" (Edit Profile) - for tutors only
  - "登出" (Sign Out) with red color

### 3. Sign Out Functionality

- Users can sign out from the sidebar dropdown
- Proper loading state during sign-out
- Automatic redirect to homepage after sign-out

## User Flow

### New User with OAuth

1. User clicks "Google" or "Facebook" on sign-up page
2. OAuth provider authentication
3. User is redirected to `/auth/callback`
4. Then redirected to `/auth/select-role` (to choose tutor/parent)
5. Complete profile setup
6. Redirected to their dashboard

### Existing User with OAuth

1. User clicks "Google" or "Facebook" on sign-in page
2. OAuth provider authentication
3. User is redirected to `/auth/callback`
4. Then redirected to their appropriate dashboard

### OAuth Callback Handling

The callback route (`/app/auth/callback/route.ts`) handles:
- Exchanging OAuth code for session
- Checking if user has a profile
- Redirecting to appropriate page

## Testing OAuth Locally

### Important Notes:

1. **Google OAuth**: Works on localhost without additional setup
2. **Facebook OAuth**: You may need to add your localhost domain as a test domain in Facebook app settings

### Testing Steps:

1. Start your dev server:
   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:3000`
3. Click "登入" (Sign In) or "註冊" (Sign Up)
4. Click the Google or Facebook button
5. Complete the OAuth flow
6. You should be redirected back and logged in

## Common Issues & Solutions

### Issue: "Invalid redirect URI"

**Solution**: Make sure the redirect URI in your OAuth provider settings exactly matches:
```
https://<your-supabase-project>.supabase.co/auth/v1/callback
```

### Issue: OAuth popup closes immediately

**Solution**: Check browser console for errors. Usually this is due to misconfigured redirect URIs.

### Issue: User not being redirected after OAuth

**Solution**: Check that your `/auth/callback/route.ts` file exists and is handling the callback correctly.

### Issue: User profile not showing in sidebar

**Solution**: Make sure the user has completed role selection and profile setup. The `app/page.tsx` now fetches this data server-side.

## Production Deployment

### Before deploying:

1. Update OAuth redirect URIs in Google and Facebook to include your production URL:
   ```
   https://your-domain.com/auth/callback
   ```

2. Update Supabase URL Configuration:
   - Site URL: `https://your-domain.com`
   - Add redirect URL: `https://your-domain.com/auth/callback`

3. Ensure environment variables are set in your deployment platform (Vercel, etc.)

## Security Considerations

1. **Never commit** OAuth secrets to version control
2. Always use HTTPS in production for OAuth callbacks
3. Validate user data after OAuth sign-in
4. Implement rate limiting for authentication endpoints
5. Use Supabase's built-in security features (RLS, policies)

## Additional Resources

- [Supabase OAuth Documentation](https://supabase.com/docs/guides/auth/social-login)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Facebook Login Documentation](https://developers.facebook.com/docs/facebook-login)

## Support

If you encounter issues:
1. Check Supabase Auth logs in Dashboard
2. Review browser console for errors
3. Verify OAuth provider settings
4. Check redirect URI configuration

