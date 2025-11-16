# Testing the Loading Screen

## Quick Test Methods

### Method 1: Direct Preview Page
Visit the test page to see the loading screen directly:

```
http://localhost:3000/test-loading
```

This page shows:
- Live preview of the loading screen
- Navigation links to trigger loading
- Testing tips and instructions

### Method 2: Slow Loading Page
Visit the slow loading test page:

```
http://localhost:3000/test-loading-slow
```

This page:
- Automatically delays for 3 seconds
- Shows loading screen during delay
- Perfect for testing without network throttling

### Method 3: Chrome DevTools (Recommended)

**Step-by-step:**

1. Open Chrome DevTools
   - Press `F12` (Windows/Linux)
   - Press `Cmd + Option + I` (Mac)

2. Go to **Network** tab

3. Change throttling dropdown to:
   - **Slow 3G** (slower, easier to see)
   - **Fast 3G** (moderate)
   - **Custom** (adjust as needed)

4. Navigate between pages:
   - Click any link in your app
   - Use browser back/forward buttons
   - Type URL in address bar

5. Watch for the loading screen!

### Method 4: Manual Page Reload

Simply navigate to any page and reload:

```bash
# Visit any page
http://localhost:3000/tutor/dashboard

# Press Cmd+R (Mac) or Ctrl+R (Windows)
# Or click reload button
```

With slow network, you'll see the loading screen.

## Testing Different Scenarios

### Scenario 1: Home → Dashboard
```tsx
// Start at home
http://localhost:3000

// Click "登入" button
// Navigate to dashboard
// Should see loading screen
```

### Scenario 2: Dashboard → Profile
```tsx
// Start at dashboard
http://localhost:3000/tutor/dashboard

// Click "Profile" link
// Should see loading screen
```

### Scenario 3: External Navigation
```tsx
// Use <a> tags instead of <Link>
<a href="/tutor/dashboard">Go</a>

// This triggers full page load
// Always shows loading screen
```

## Network Throttling Profiles

### Slow 3G (Best for Testing)
- **Download**: 400 Kbps
- **Upload**: 400 Kbps  
- **Latency**: 2000ms
- **Result**: Loading screen visible 2-5 seconds

### Fast 3G
- **Download**: 1.6 Mbps
- **Upload**: 750 Kbps
- **Latency**: 562.5ms
- **Result**: Loading screen visible 0.5-2 seconds

### Custom Throttling
Create your own profile:
1. Click throttling dropdown
2. Select "Add..."
3. Set custom values
4. Save and test

## Browser DevTools Commands

### Open DevTools
```bash
# Chrome/Edge
F12 or Ctrl+Shift+I (Windows)
Cmd+Option+I (Mac)

# Firefox
F12 or Ctrl+Shift+K (Windows)
Cmd+Option+K (Mac)

# Safari
Cmd+Option+I (Mac)
# First enable: Preferences → Advanced → Show Develop menu
```

### Network Panel Shortcuts
```bash
# Clear network log
Cmd+K (Mac) or Ctrl+L (Windows)

# Preserve log across navigations
Check "Preserve log" checkbox

# Disable cache
Check "Disable cache" checkbox
```

## Testing Checklist

### Visual Tests
- [ ] Loading animation plays smoothly
- [ ] Text "載入中..." appears
- [ ] Dots animate (...  ..  .)
- [ ] White background covers full screen
- [ ] No flickering or glitches

### Functional Tests
- [ ] Loading appears on navigation
- [ ] Loading disappears when page loads
- [ ] Works on desktop
- [ ] Works on mobile/tablet
- [ ] Works in different browsers

### Performance Tests
- [ ] Animation starts immediately
- [ ] No lag or stuttering
- [ ] Video file loads quickly
- [ ] No console errors

### Browser Compatibility
- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari
- [ ] Mobile Safari (iOS)
- [ ] Mobile Chrome (Android)

## Common Issues & Solutions

### Loading Screen Not Showing

**Problem**: Navigate but no loading screen appears

**Solutions**:
1. Check you're using regular `<a>` tags
2. Enable network throttling
3. Clear browser cache
4. Check `loading.tsx` files exist
5. Verify video file at `/public/morphing-animation.webm`

### Video Not Playing

**Problem**: See white screen but no animation

**Solutions**:
1. Check video file exists: `ls public/morphing-animation.webm`
2. Check browser console for errors
3. Try different browser
4. Check file permissions
5. Verify video format (WebM)

### Loading Screen Too Fast

**Problem**: Loading screen flashes too quickly

**Solutions**:
1. Enable network throttling (Slow 3G)
2. Test on actual slow connection
3. Add minimum display time (see below)
4. Test with slow loading page

### Add Minimum Display Time

```tsx
// In loading-screen.tsx
export function LoadingScreen() {
  const [show, setShow] = useState(true);
  
  useEffect(() => {
    // Ensure minimum 1 second display
    const timer = setTimeout(() => {
      setShow(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (!show) return null;
  
  return (/* ... */);
}
```

## Mobile Testing

### iOS Safari
```bash
# Enable Web Inspector
Settings → Safari → Advanced → Web Inspector

# Connect to Mac
Safari → Develop → [Your iPhone] → [Page]
```

### Android Chrome
```bash
# Enable USB Debugging
Settings → Developer Options → USB Debugging

# Chrome DevTools
chrome://inspect/#devices
```

### Responsive Mode (Desktop)
```bash
# Chrome DevTools
Cmd+Shift+M (Mac)
Ctrl+Shift+M (Windows)

# Test different devices:
- iPhone 12/13/14
- iPad Pro
- Samsung Galaxy
```

## Advanced Testing

### Lighthouse Test
```bash
# Chrome DevTools → Lighthouse tab
1. Select "Performance"
2. Select "Mobile" or "Desktop"
3. Click "Analyze page load"
4. Check loading experience scores
```

### Network Timeline
```bash
# DevTools → Performance tab
1. Start recording
2. Navigate to page
3. Stop recording
4. Analyze loading timeline
5. Check when loading screen appears/disappears
```

### Video Recording
```bash
# Record loading screen demo
1. Open screen recorder
2. Enable network throttling
3. Navigate between pages
4. Capture smooth loading transitions
```

## Testing Scripts

### Automated Test (Future)
```typescript
// playwright test example
test('loading screen appears', async ({ page }) => {
  // Slow down network
  await page.route('**/*', route => {
    setTimeout(() => route.continue(), 2000);
  });
  
  // Navigate
  await page.goto('/tutor/dashboard');
  
  // Check loading screen
  await expect(page.locator('video')).toBeVisible();
  
  // Wait for page load
  await page.waitForLoadState('networkidle');
  
  // Loading should be gone
  await expect(page.locator('video')).not.toBeVisible();
});
```

## Best Testing Practices

✅ **Do:**
- Test on real devices when possible
- Use various network speeds
- Test in different browsers
- Check mobile experience
- Test with cleared cache

❌ **Don't:**
- Only test on fast connection
- Ignore mobile testing
- Skip browser compatibility
- Forget to clear cache
- Test only in dev mode

## Quick Commands

```bash
# Start dev server
npm run dev

# Visit test page
open http://localhost:3000/test-loading

# Visit slow loading test
open http://localhost:3000/test-loading-slow

# Check video file
ls -lh public/morphing-animation.webm

# Clear Next.js cache
rm -rf .next
```

## Need Help?

If loading screen isn't working:
1. Check console for errors
2. Verify all files created correctly
3. Clear browser cache
4. Restart dev server
5. Check this documentation

Happy testing! 🎉

