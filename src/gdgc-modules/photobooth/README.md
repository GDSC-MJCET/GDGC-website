# Photobooth Module

## Overview
The GDGC Photobooth is an interactive event page featuring animated sections, a responsive layout, and engaging visuals for users to register for the photobooth experience.

## Directory Structure
```
photobooth/
├── components/
│   ├── Booth.jsx          # Main booth display with scrollable polaroid panel
│   ├── Hero.jsx           # Hero section component
│   ├── PixelSkyline.jsx   # Pixelated skyline decoration
│   └── nav.jsx            # Navigation bar
├── styles/
│   └── photobooth.css     # All styling for photobooth components
├── public/
│   ├── booth.jpg
│   ├── booth-container.svg
│   ├── photo-booth.png
│   ├── Frame-board.svg
│   ├── Frame-container.svg
│   ├── heart.svg
│   └── camera.svg
├── PhotoBooth.jsx         # Main page component
└── README.md             # This file
```

## Key Features

### Booth Component
- **Parallax Animation**: Smooth mouse and scroll tracking with lerp easing
- **Scrollable Content**: Text content scrolls within the polaroid frame without overflow
- **Responsive Design**: Adapts from mobile (8px text) to desktop (20px text)
- **Register Button**: Animated button with heart and camera decorations

### Styling
- Responsive font sizes using `clamp()`
- Hidden scrollbars with webkit scrollbar styling
- Animations for fade-in and text effects
- Trophy emoji bounce animation

## Component Props

### Booth.jsx
No props required - uses internal state via refs for parallax effects.

```jsx
const Booth = () => {
  // Uses refs for smooth transform updates without re-renders
  // Tracks window scroll and mouse position
}
```

## Styling Variables

### Font Sizes (from photobooth.css)
- **Heading**: `clamp(11px, 1.2vw, 24px)`
- **Copy Text**: `clamp(8px, 0.9vw, 20px)`
- **Note Text**: `clamp(7px, 0.8vw, 18px)`

### Colors
- Primary Text: `#1E1E1E`
- Shadow: `rgba(234, 67, 54, 0.3)`
- Gradient: Red to Pink (`#EA4335` → `#FF00A2`)

## Usage

### In App.jsx
```jsx
import { PhotoBooth } from './pages/PhotoBooth.jsx';

// Add route:
<Route path='photobooth' element={<PhotoBooth />} />
```

### Standalone
```jsx
import Booth from './components/photobooth/Booth';
import Hero from './components/photobooth/Hero';
import Nav from './components/photobooth/nav';

export function MyPhotoboothPage() {
  return (
    <>
      <Nav />
      <Hero />
      <Booth />
    </>
  );
}
```

## Dependencies
- React 18+
- No external animation libraries (uses CSS keyframes and requestAnimationFrame)

## Accessibility
- Semantic HTML structure
- ARIA labels on interactive elements
- High contrast text on backgrounds
- Keyboard-navigable components

## Performance Optimizations
- Uses `refs` and direct DOM manipulation for parallax (no re-renders)
- `will-change` CSS property on animated elements
- `pointer-events-none` on decorative elements
- `requestAnimationFrame` for smooth 60fps animations

## Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Known Issues
- Scrollbar hiding uses webkit vendor prefix (works on most modern browsers)
- Touch scrolling on mobile devices works but parallax effects are subtle

## Future Enhancements
- [ ] Add touch parallax support
- [ ] Add analytics tracking for register button clicks
- [ ] Create variant layouts
- [ ] Add dark mode support

---

**Last Updated**: April 2026
