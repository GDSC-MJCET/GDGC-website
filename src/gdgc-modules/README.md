# GDGC Event Modules

This directory contains self-contained modules for GDGC event pages. Each module is independently organized and can be easily extracted, modified, or shipped to other projects.

## Module Structure

Each module follows this structure:

```
module-name/
├── components/          # React components used by this module
├── styles/             # CSS files specific to this module
├── public/             # Images and assets specific to this module
├── Page.jsx            # Main page component (exported to App.jsx)
└── README.md           # Module-specific documentation
```

## Modules

### 📷 Photobooth (`/photobooth`)

**Route**: `/photobooth`  
**Page**: `PhotoBooth.jsx`

The GDGC Photobooth experience - an interactive event page with animated sections.

**Components**:
- `Booth.jsx` - Main booth component with scrollable content
- `Hero.jsx` - Hero section
- `nav.jsx` - Navigation component
- `PixelSkyline.jsx` - Pixelated skyline visual

**Assets**: `booth.jpg`, `Frame-*.svg`, `heart.svg`, `camera.svg`

**Usage**:
```jsx
import { PhotoBooth } from '../../modules/photobooth/PhotoBooth';

// In App.jsx routes:
<Route path='photobooth' element={<PhotoBooth />} />
```

---

### 🏴‍☠️ The Heist (`/heist`)

**Route**: `/heist`  
**Page**: `TheHeistAdsophos.jsx`

An immersive spy heist themed event experience with parallax backgrounds and puzzle elements.

**Components**:
- Uses shared adsophos components (Room1, Room2, Final, PixelSkyline, Nav)
- Responsive mobile/desktop layouts

**Assets**: `ali-bg-*.{jpeg,png}`, `adsophos-hero.png`

**Usage**:
```jsx
import TheHeistAdsophos from '../../modules/heist/TheHeistAdsophos';

// In App.jsx routes:
<Route path='heist' element={<TheHeistAdsophos />} />
```

---

### 🔬 Loop13 (`/loop13`)

**Route**: `/loop13`  
**Page**: `Loop_13.jsx`

A laboratory-themed interactive experience with animated sequences and equipment lists.

**Components**:
- Uses shared adsophos components (Final, PixelSkyline)
- Motion animations via framer-motion
- Responsive design with scrollable content

**Assets**: `loop-*.jpeg`, `eyes.svg`, `adsophos-hero.png`

**Usage**:
```jsx
import Loop13 from '../../modules/loop13/Loop_13';

// In App.jsx routes:
<Route path='loop13' element={<Loop13 />} />
```

---

## Shared Components

These modules rely on shared components located in `/src/components/`:

- `adsophos/` folder components (Room1, Room2, Final, PixelSkyline, nav)
- `Footer` component
- `Background` component
- `WinnerPopup` component

## Importing Modules in App.jsx

All modules are already imported and routed in `App.jsx`:

```jsx
import { PhotoBooth } from './pages/PhotoBooth.jsx';
import TheHeistAdsophos from './pages/TheHeistAdsophos.jsx';
import Loop13 from './pages/Loop_13.jsx';

// Routes:
<Route path='photobooth' element={<PhotoBooth />} />
<Route path='heist' element={<TheHeistAdsophos />} />
<Route path='loop13' element={<Loop13 />} />
```

## Extracting a Module

To extract a module for use in another project:

1. Copy the entire module folder: `/modules/{module-name}/`
2. Copy required shared components from `/components/` 
3. Copy any additional public assets needed
4. Update import paths to match your project structure
5. Ensure shared dependencies are installed (framer-motion, axios, etc.)

### Dependencies for Each Module

**Photobooth**:
- React, React DOM
- Framer Motion (if animations are needed)

**Heist**:
- React, React DOM
- Shared adsophos components

**Loop13**:
- React, React DOM
- Framer Motion
- Shared adsophos components

## File Mapping

| Component | Old Path | New Path |
|-----------|----------|----------|
| Booth | `src/components/photobooth/Booth.jsx` | `src/modules/photobooth/components/Booth.jsx` |
| PhotoBooth Page | `src/pages/PhotoBooth.jsx` | `src/modules/photobooth/PhotoBooth.jsx` |
| TheHeistAdsophos | `src/pages/TheHeistAdsophos.jsx` | `src/modules/heist/TheHeistAdsophos.jsx` |
| Loop_13 | `src/pages/Loop_13.jsx` | `src/modules/loop13/Loop_13.jsx` |

## Notes

- Each module contains its own styles in `/styles` folder
- Public assets are duplicated in each module's `/public` folder for easy extraction
- Shared components (from `/components/adsophos`, `/components/Footer`, etc.) are referenced from main source
- Update import paths in components when moving between projects

---

**Last Updated**: April 2026  
**Maintained by**: GDGC Development Team
