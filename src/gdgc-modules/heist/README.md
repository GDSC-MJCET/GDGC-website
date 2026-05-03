# The Heist Module

## Overview
The Heist is an immersive spy-themed event experience featuring a multi-section layout with parallax backgrounds, atmospheric design, and interactive elements. It includes both desktop and mobile responsive layouts.

## Directory Structure
```
heist/
├── components/
│   └── (shared from src/components/adsophos/)
├── styles/
│   └── (shared from src/components/adsophos/)
├── public/
│   ├── ali-bg-i.png
│   ├── ali-bg-ii.jpeg
│   ├── ali-bg-iii.png
│   ├── ali-bg-mobile.png
│   └── adsophos-hero.png
├── TheHeistAdsophos.jsx  # Main page component
└── README.md            # This file
```

## Key Features

### Layout Sections
1. **Hero Section** - Immersive background with navigation
2. **Story Sections** - Multiple narrative sections with parallax effects
3. **Equipment Display** - Interactive equipment showcase
4. **Rules & Notes** - Important event information
5. **Final Section** - Call-to-action and closure

### Responsive Design
- Mobile layout (optimized for small screens)
- Desktop layout (full parallax effects)
- Adaptive image loading based on device

### Visual Elements
- Parallax scrolling backgrounds
- Animated text reveals with Framer Motion
- Multi-layer image compositing
- Dark atmospheric color scheme

## Component Structure

### TheHeistAdsophos.jsx
Main page component that:
- Detects mobile vs desktop viewport
- Renders appropriate layout
- Manages section visibility with Intersection Observer
- Coordinates animations between sections

### Shared Components Used
- `Room1` - First challenge section
- `Room2` - Second challenge section
- `Final` - Conclusion section
- `PixelSkyline` - Decorative pixelated elements
- `Nav` - Navigation component

## Usage

### In App.jsx
```jsx
import TheHeistAdsophos from './pages/TheHeistAdsophos.jsx';

// Add route:
<Route path='heist' element={<TheHeistAdsophos />} />
```

### Standalone
```jsx
import TheHeistAdsophos from './modules/heist/TheHeistAdsophos';

function EventPage() {
  return <TheHeistAdsophos />;
}
```

## Content Structure

### Mobile Layout
- Stacked sections
- Full-width images
- Optimized touch interactions
- Simplified animations

### Desktop Layout
- Side-by-side sections
- Parallax backgrounds
- Full animation suite
- Multi-column layouts

## Styling

### Color Scheme
- Primary: `#1a1a1a` (Dark)
- Accent: `#FFD700` (Gold)
- Text: `#FFFFFF`
- Shadows: Heavy, atmospheric

### Background Images
- `ali-bg-i.png` - Hero section background
- `ali-bg-ii.jpeg` - Middle section parallax
- `ali-bg-iii.png` - Detail background
- `ali-bg-mobile.png` - Mobile-optimized background
- `adsophos-hero.png` - Header decoration

## Dependencies
- React 18+
- Framer Motion (for animations)
- CSS Grid/Flexbox

## Performance Considerations
- Background images are relatively large (optimize with WebP)
- Parallax effects use CSS transforms (GPU-accelerated)
- Intersection Observer for lazy animation triggering

## Accessibility
- Semantic HTML structure
- Alt text on all images
- High contrast text
- Keyboard navigation support

## Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Customization

### Change Background Images
Update image paths in TheHeistAdsophos.jsx:
```jsx
import bgii from "../../public/ali-bg-ii.jpeg";
```

### Adjust Colors
Modify inline style props or update CSS files:
```jsx
className="bg-[#1a1a1a] text-[#FFD700]"
```

### Modify Content
Edit the JSX content directly in TheHeistAdsophos.jsx

## Known Issues
- Mobile background image loading can be slow on 3G
- Parallax effects are disabled on mobile for performance
- Some older devices may experience stuttering with animations

## Future Enhancements
- [ ] Add WebP image optimization
- [ ] Implement service worker caching
- [ ] Add sound effects
- [ ] Create multiplayer interaction
- [ ] Add 3D parallax effects

---

**Last Updated**: April 2026
