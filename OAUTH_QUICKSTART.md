# OAuth Authentication - Quick Start

## ✅ What's Been Implemented

### 1. OAuth Buttons Added

**Sign In Page** (`/auth/signin`):
- ✅ Google OAuth button with logo
- ✅ Facebook OAuth button with logo
- ✅ Visual separator
- ✅ Proper loading states

**Sign Up Page** (`/auth/signup`):
- ✅ Google OAuth button with logo
- ✅ Facebook OAuth button with logo
- ✅ Visual separator
- ✅ Proper loading states

### 2. User Profile in Sidebar

**When Logged In**:
- ✅ Shows user avatar (from OAuth or custom upload)
- ✅ Displays user name (from profile or OAuth metadata)
- ✅ Shows email address
- ✅ Dropdown menu with options

**Dropdown Menu**:
- ✅ "前往控制台" - Go to dashboard (tutor or parent)
- ✅ "編輯個人檔案" - Edit profile (tutors only)
- ✅ "登出" - Sign out (red color)

**When Logged Out**:
- ✅ Shows "登入" (Sign In) button
- ✅ Shows "註冊" (Sign Up) button

### 3. Components Created

- `components/landing/sidebar-profile.tsx` - User profile display component
- Updated `components/landing/landing-content.tsx` - Conditional sidebar rendering
- Updated `app/page.tsx` - Server-side user data fetching
- Updated `app/auth/signin/page.tsx` - OAuth sign-in handlers
- Updated `app/auth/signup/page.tsx` - OAuth sign-up handlers

## 🚀 How to Set Up OAuth

### Step 1: Configure Google OAuth

1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Create/select a project
3. Enable Google+ API
4. Create OAuth 2.0 Client ID
5. Add redirect URI: `https://<your-supabase-project>.supabase.co/auth/v1/callback`
6. Copy Client ID and Client Secret

### Step 2: Configure Facebook OAuth

1. Visit [Facebook for Developers](https://developers.facebook.com/)
2. Create/select an app
3. Add Facebook Login product
4. Add OAuth redirect URI: `https://<your-supabase-project>.supabase.co/auth/v1/callback`
5. Copy App ID and App Secret

### Step 3: Add to Supabase

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Navigate to **Authentication** → **Providers**
3. Enable and configure Google and Facebook providers
4. Paste the credentials

### Step 4: Configure URLs (for local development)

In Supabase Dashboard → Authentication → URL Configuration:
- Site URL: `http://localhost:3000`
- Redirect URLs:
  - `http://localhost:3000/auth/callback`
  - `http://localhost:3000`

## 🧪 Testing

1. Start your dev server:
   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:3000`

3. Click "登入" or "註冊"

4. Click the Google or Facebook button

5. Complete OAuth flow

6. You should see your profile in the sidebar!

## 📸 Screenshots of What to Expect

### Sign In Page
- Email/password form at top
- Divider with "或" (OR)
- Google button (blue/red/yellow/green logo)
- Facebook button (blue logo)

### Sign Up Page
- Same layout as sign in
- Links to sign in at bottom

### Sidebar When Logged In
- Round avatar with gradient background
- User name and email
- Dropdown arrow
- Menu with dashboard link, profile link (tutors), and sign out

### Sidebar When Logged Out
- Two buttons: "登入" and "註冊"

## 🔧 Troubleshooting

### OAuth buttons do nothing
- Check browser console for errors
- Verify OAuth credentials in Supabase
- Ensure redirect URIs match exactly

### User not showing in sidebar after OAuth
- User needs to complete role selection
- Check that profile was created in database
- Verify RLS policies allow reading user profile

### Sign out not working
- Check browser console for errors
- Verify Supabase client is properly initialized
- Check that cookies are enabled

## 📁 File Changes Summary

```
Modified:
- app/auth/signin/page.tsx - Added OAuth handlers and buttons
- app/auth/signup/page.tsx - Added OAuth handlers and buttons
- app/page.tsx - Added user data fetching
- components/landing/landing-content.tsx - Conditional sidebar rendering

Created:
- components/landing/sidebar-profile.tsx - User profile component
- OAUTH_SETUP.md - Detailed setup guide
- OAUTH_QUICKSTART.md - This file
```

## 🎯 Next Steps

After setting up OAuth in Supabase:

1. **Test OAuth Flow**: Try signing up with Google/Facebook
2. **Complete Profile**: Users should be redirected to role selection
3. **Test Sign Out**: Verify users can sign out properly
4. **Production Setup**: Update OAuth redirect URIs for your production domain

## 💡 Pro Tips

1. **Google OAuth works on localhost** without additional configuration
2. **Facebook OAuth** requires adding localhost as a test domain
3. **Always use HTTPS in production** for OAuth callbacks
4. **Avatar images** from OAuth providers are automatically used
5. **Full name** from OAuth is used as display name if no custom name set

## 🔒 Security Notes

- OAuth secrets are stored in Supabase (not in your code)
- Supabase handles all OAuth token management
- RLS policies protect user profile data
- Session cookies are httpOnly and secure

## 📚 Additional Documentation

See `OAUTH_SETUP.md` for detailed configuration steps, troubleshooting, and production deployment guide.

