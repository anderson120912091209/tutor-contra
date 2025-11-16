# Loading Screen Implementation

## Overview
A beautiful loading screen with morphing animation for seamless page transitions.

## Features

### 1. **Morphing Animation**
- White background video animation
- Smooth, modern aesthetic
- 122KB optimized WebM format
- Auto-play and loop

### 2. **Loading Text Indicator**
- Animated dots (載入中...)
- Professional typography
- Subtle gray color

### 3. **Full Screen Coverage**
- Fixed position overlay
- White background
- High z-index (z-50)
- Centered layout

## Files Created

### Core Component
```
components/ui/loading-screen.tsx  # Main loading screen component
components/ui/page-loader.tsx     # Navigation-aware loader
```

### Route-Level Loading Files
```
app/loading.tsx                   # Root level
app/(app)/loading.tsx            # App routes
app/(app)/tutor/loading.tsx      # Tutor pages
app/(app)/parent/loading.tsx     # Parent pages
app/(public)/loading.tsx         # Public pages
```

### Assets
```
public/morphing-animation.webm   # 122KB animation video
```

## Usage

### Automatic (Recommended)
Next.js automatically shows `loading.tsx` during page transitions:

```tsx
// No code needed - just navigate
<Link href="/tutor/dashboard">Go to Dashboard</Link>
```

### Manual Usage
If you need to show loading manually:

```tsx
import { LoadingScreen } from "@/components/ui/loading-screen";

export default function MyPage() {
  const [loading, setLoading] = useState(false);
  
  if (loading) return <LoadingScreen />;
  
  return <div>Content</div>;
}
```

## How It Works

### Next.js Loading States
When navigating between pages, Next.js automatically:
1. Detects navigation start
2. Shows `loading.tsx` component
3. Fetches new page data
4. Hides loading screen
5. Displays new page

### Component Structure
```tsx
<div className="fixed inset-0">  // Full screen overlay
  <video autoPlay loop muted>    // Morphing animation
    <source src="/morphing-animation.webm" />
  </video>
  <span>載入中...</span>           // Animated text
</div>
```

## Animation Details

### Video Specs
- **Format**: WebM
- **Size**: 122KB
- **Background**: White
- **Loop**: Infinite
- **Autoplay**: Yes
- **Muted**: Yes (required for autoplay)

### Text Animation
- **Effect**: Dots cycling (. .. ...)
- **Speed**: 500ms per dot
- **Color**: Gray-600
- **Font**: Medium weight, large size

## Customization

### Change Animation Speed
```tsx
// In loading-screen.tsx
const interval = setInterval(() => {
  setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
}, 300); // Change from 500 to 300 for faster animation
```

### Change Animation Size
```tsx
<div className="w-64 h-64 mb-6"> // Increase from w-48 h-48
  <video ... />
</div>
```

### Change Background Color
```tsx
<div className="fixed inset-0 bg-gray-50 z-50"> // Change from bg-white
```

### Change Text
```tsx
<span className="text-gray-600 text-lg font-medium">
  Loading{dots} // Change from 載入中{dots}
</span>
```

### Add Progress Bar
```tsx
<div className="w-64 h-1 bg-gray-200 rounded-full overflow-hidden mt-4">
  <div className="h-full bg-primary animate-pulse" style={{ width: `${progress}%` }} />
</div>
```

## Performance Optimization

### 1. **Video Preloading**
Added in `app/layout.tsx`:
```tsx
export function generateMetadata() {
  return {
    other: {
      'link': [
        { rel: 'preload', href: '/morphing-animation.webm', as: 'video', type: 'video/webm' }
      ]
    }
  };
}
```

### 2. **Optimized File Size**
- WebM format: Best compression for web
- 122KB: Small enough for quick loading
- Video attributes: `playsInline` for mobile

### 3. **Instant Display**
- Component loads from server
- No JavaScript required initially
- Video starts immediately

## Browser Support

### Video Format
- ✅ Chrome/Edge (all versions)
- ✅ Firefox (all versions)
- ✅ Safari 14.1+
- ✅ Mobile browsers

### Fallback
If video fails to load:
- Background remains white
- Text indicator still visible
- No broken UI

## Accessibility

### Screen Readers
The loading screen is decorative, but you can add:
```tsx
<div role="status" aria-live="polite">
  <span className="sr-only">頁面載入中</span>
  <span aria-hidden="true">載入中{dots}</span>
</div>
```

### Reduced Motion
For users who prefer reduced motion:
```tsx
@media (prefers-reduced-motion: reduce) {
  video {
    display: none;
  }
}
```

## Testing

### Test Loading State
To see the loading screen:

1. **Slow 3G Simulation**
   - Open DevTools → Network tab
   - Change throttling to "Slow 3G"
   - Navigate between pages

2. **Manual Test**
   ```tsx
   // In any page component
   import { LoadingScreen } from "@/components/ui/loading-screen";
   
   export default function TestPage() {
     return <LoadingScreen />;
   }
   ```

3. **Delay Route Loading**
   ```tsx
   // Add artificial delay
   await new Promise(resolve => setTimeout(resolve, 2000));
   ```

## Troubleshooting

### Video Not Playing
- Check file exists: `ls public/morphing-animation.webm`
- Check file size: Should be ~122KB
- Check browser console for errors
- Ensure `autoPlay` and `muted` attributes are set

### Loading Screen Not Showing
- Check `loading.tsx` files exist in route folders
- Verify Next.js App Router is being used
- Check z-index conflicts (should be z-50)

### Animation Stuttering
- Check video file quality
- Reduce video resolution if needed
- Enable hardware acceleration in browser

## Future Enhancements

### Potential Improvements
1. **Progress Percentage**: Show actual loading progress
2. **Skip Button**: Allow users to cancel loading
3. **Multiple Animations**: Random animation on each load
4. **Skeleton Screens**: Show page structure while loading
5. **Loading Messages**: Rotate through different messages

### Alternative Formats
If WebM doesn't work:
- Convert to MP4 for broader support
- Use Lottie animation as fallback
- Use CSS animation as ultimate fallback

## Best Practices

✅ **Do:**
- Keep animation under 200KB
- Use white/neutral backgrounds
- Add muted attribute for autoplay
- Include loading text for clarity
- Test on slow connections

❌ **Don't:**
- Use large video files (>500KB)
- Forget mobile optimization
- Block user interaction unnecessarily
- Show loading for instant navigation
- Use distracting animations

## Related Files
- [Components README](../components/ui/README.md)
- [Layout Documentation](../app/layout.tsx)
- [Performance Guide](./PERFORMANCE.md)

---

**Note**: The morphing animation provides a premium, professional feel to page transitions, significantly improving perceived performance and user experience.

