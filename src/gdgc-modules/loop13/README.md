# Loop13 Module

## Overview
Loop13 is a laboratory-themed interactive event experience featuring animated sequences, equipment showcases, and an immersive sci-fi aesthetic. It includes smooth scrolling, motion animations, and responsive design.

## Directory Structure
```
loop13/
├── components/
│   └── (shared from src/components/adsophos/)
├── styles/
│   └── (shared from src/components/adsophos/)
├── public/
│   ├── loop-heading.jpeg
│   ├── loop-section-i.jpeg
│   ├── eyes.svg
│   ├── adsophos-hero.png
│   └── (other shared assets)
├── Loop_13.jsx           # Main page component
└── README.md            # This file
```

## Key Features

### Interactive Elements
- **Equipment Showcase** - Animated list of lab equipment
- **Notes Section** - Important event information
- **Animated Hero** - Fade-in and scale animations
- **Scrollable Panels** - Hidden scrollbars, smooth scrolling
- **Motion Effects** - Framer Motion animations throughout

### Responsive Design
- Mobile-first approach
- Adaptive typography
- Touch-friendly interactions
- Optimized image loading

### Visual Style
- Dark sci-fi aesthetic
- Lab/laboratory theme
- Neon accents
- Animated particles and effects

## Component Structure

### Loop_13.jsx
Main page component that:
- Sets up the shell container
- Manages animation states
- Handles responsive layouts
- Coordinates all sub-sections

### Shared Components Used
- `Final` - Conclusion/CTA section
- `PixelSkyline` - Decorative pixelated elements
- CSS from `adsophos.css`

## Content: Equipment Items

The module displays these equipment items:
```
- Lab Coat
- Envelope
- ID cards/badges
```

Easily customizable by editing the `equipmentItems` array in Loop_13.jsx.

## Content: Important Notes

```
- Equipment provided by organizers, must be returned in same condition
- Participants responsible for any damages
- Any room damage will be charged
```

## Usage

### In App.jsx
```jsx
import Loop13 from './pages/Loop_13.jsx';

// Add route:
<Route path='loop13' element={<Loop13 />} />
```

### Standalone
```jsx
import Loop13 from './modules/loop13/Loop_13';

function EventPage() {
  return <Loop13 />;
}
```

## Styling

### Color Scheme
- Primary Background: `#000000` (Pure Black)
- Text: `#FFFFFF`
- Accent: `#00FF00` (Neon Green)
- Secondary: `#0099FF` (Electric Blue)

### Typography
- Sans-serif font stack
- Responsive font sizes using `clamp()`
- High contrast for accessibility

### Animations
- Fade-in: 0.8s ease-in-out
- Scale: 0.6 → 1
- Bounce: Framer Motion spring physics
- Stagger: Cascading animations

## CSS Classes

### Loop13 Shell
```css
.loop13-shell {
  position: relative;
  min-height: 100vh;
  width: 100%;
  overflow-x: hidden;
  background: black;
  color: white;
}

.loop13-shell .loop13-panel-copy::-webkit-scrollbar {
  display: none;
}
```

### Responsive Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## Dependencies
- React 18+
- Framer Motion (for animations)
- CSS Grid/Flexbox

## Performance Optimizations
- Lazy load images with Intersection Observer
- CSS transforms for animations (GPU-accelerated)
- Hidden scrollbars reduce layout shifts
- Optimized image formats (JPEG for photos, SVG for icons)

## Accessibility
- Semantic HTML structure (`<section>`, `<article>`, etc.)
- Alt text on all images
- High contrast text (WCAG AA compliant)
- Keyboard navigation support
- Focus indicators on interactive elements

## Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Customization

### Change Equipment Items
Edit Loop_13.jsx:
```jsx
const equipmentItems = [
  "Lab Coat",
  "Envelope",
  "ID cards/badges",
  // Add more items here
];
```

### Modify Animations
Adjust Framer Motion values:
```jsx
initial={{ scale: 1.08, opacity: 0 }}
animate={{ scale: 1, opacity: 1 }}
transition={{ duration: 1.6, ease: [0.25, 0.46, 0.45, 0.94] }}
```

### Update Colors
Modify inline styles:
```jsx
className="bg-black text-white"
style={{ color: '#00FF00' }}
```

### Change Background Images
Update image imports:
```jsx
import heroImg from "../../public/custom-hero.png";
```

## Known Issues
- Scrollbar hiding uses webkit vendor prefix (Chrome, Safari, Edge only)
- Firefox hides scrollbars differently (uses `scrollbar-width: none`)
- Some older devices may experience stuttering with animations
- Mobile devices may disable animations for performance

## Future Enhancements
- [ ] Add particle effect background
- [ ] Implement 3D perspective transforms
- [ ] Add sound effects for interactions
- [ ] Create multiplayer challenges
- [ ] Add countdown timer
- [ ] Implement leaderboard system
- [ ] Add WebP image optimization
- [ ] Create PWA offline support

## Troubleshooting

### Scrollbar Still Visible
Ensure the CSS rule is included:
```css
.loop13-panel-copy::-webkit-scrollbar {
  display: none;
}
```

### Animations Not Smooth
Check:
- Framer Motion is properly installed
- No heavy CPU operations during animation
- Hardware acceleration is enabled in browser
- Device has sufficient memory

### Images Not Loading
- Verify image paths are correct
- Check public folder contains images
- Ensure no CORS issues
- Try clearing browser cache

---

**Last Updated**: April 2026
