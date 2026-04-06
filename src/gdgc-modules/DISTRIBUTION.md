# Module Packaging & Distribution Guide

## Overview
This guide explains how to package, extract, and use the GDGC event modules in standalone projects or send them to other developers.

## Current Module Structure

All event modules are organized in `/src/modules/`:
```
src/modules/
├── photobooth/
│   ├── components/
│   ├── styles/
│   ├── public/
│   ├── PhotoBooth.jsx
│   └── README.md
├── heist/
│   ├── components/
│   ├── styles/
│   ├── public/
│   ├── TheHeistAdsophos.jsx
│   └── README.md
├── loop13/
│   ├── components/
│   ├── styles/
│   ├── public/
│   ├── Loop_13.jsx
│   └── README.md
└── README.md
```

## How to Extract a Module

### Option 1: Copy the Folder
```bash
# Copy entire module to another location
cp -r src/modules/photobooth ~/my-new-project/src/modules/photobooth
```

### Option 2: Create a Tarball
```bash
# Create compressed archive
tar -czf gdgc-photobooth-module.tar.gz src/modules/photobooth/

# Extract in another project
tar -xzf gdgc-photobooth-module.tar.gz -C ~/other-project/src/modules/
```

### Option 3: Create a ZIP
```bash
# Create ZIP file (macOS)
zip -r gdgc-photobooth-module.zip src/modules/photobooth/

# Extract
unzip gdgc-photobooth-module.zip -d ~/other-project/src/modules/
```

## Integration Steps for New Projects

### 1. Copy Module Files
```bash
cp -r src/modules/{module-name} /path/to/new-project/src/modules/
```

### 2. Copy Shared Dependencies
Modules depend on shared components in `/components/`:
```bash
# Copy required shared components
cp -r src/components/adsophos /path/to/new-project/src/components/
cp src/components/Footer.jsx /path/to/new-project/src/components/
cp src/components/Background.jsx /path/to/new-project/src/components/
```

### 3. Update Import Paths
In the module files, check and update relative paths:

**Before** (in GDGC project):
```jsx
import Room1 from "../../components/adsophos/Room1";
import bgii from "../../public/ali-bg-ii.jpeg";
```

**After** (in new project):
```jsx
import Room1 from "../../../components/adsophos/Room1";
import bgii from "../../../public/ali-bg-ii.jpeg";
```

### 4. Copy Public Assets
```bash
# Copy module-specific public assets
cp public/booth.jpg /path/to/new-project/public/
cp public/Frame-*.svg /path/to/new-project/public/
cp public/ali-bg-*.* /path/to/new-project/public/
cp public/loop-*.* /path/to/new-project/public/
```

### 5. Add Route to App.jsx
```jsx
import { PhotoBooth } from './modules/photobooth/PhotoBooth';

// In routes:
<Route path='photobooth' element={<PhotoBooth />} />
```

### 6. Install Dependencies
Ensure all required packages are installed:
```bash
npm install react react-dom framer-motion axios
```

## Dependencies by Module

### Photobooth
- React 18+
- React DOM 18+
- CSS (built-in)

### Heist (TheHeistAdsophos)
- React 18+
- React DOM 18+
- Framer Motion 6+

### Loop13
- React 18+
- React DOM 18+
- Framer Motion 6+

## File Checklist

### Photobooth Module ✓
- [x] `components/Booth.jsx`
- [x] `components/Hero.jsx`
- [x] `components/PixelSkyline.jsx`
- [x] `components/nav.jsx`
- [x] `styles/photobooth.css`
- [x] `PhotoBooth.jsx` (page)
- [x] Public assets (booth.jpg, Frame-*.svg, heart.svg, camera.svg)
- [x] README.md

### Heist Module ✓
- [x] `TheHeistAdsophos.jsx` (page)
- [x] Public assets (ali-bg-*.*, adsophos-hero.png)
- [x] README.md
- [⚠️] Requires shared adsophos components

### Loop13 Module ✓
- [x] `Loop_13.jsx` (page)
- [x] Public assets (loop-*.*, eyes.svg)
- [x] README.md
- [⚠️] Requires shared adsophos components

## Shared Components Reference

These components are used by modules and must be copied to the target project:

### adsophos/
- `Room1.jsx` - First challenge section
- `Room2.jsx` - Second challenge section
- `Final.jsx` - Conclusion section
- `PixelSkyline.jsx` - Pixelated decorative elements
- `nav.jsx` - Navigation
- `adsophos.css` - Core styles

### Other Shared
- `Footer.jsx` - Footer component
- `Background.jsx` - Background wrapper
- `WinnerPopup.jsx` - Victory celebration (optional)

## Creating a Standalone Package

### Step 1: Create Package.json
```json
{
  "name": "@gdgc/photobooth-module",
  "version": "1.0.0",
  "description": "GDGC Photobooth Event Module",
  "main": "PhotoBooth.jsx",
  "keywords": ["gdgc", "event", "photobooth"],
  "author": "GDGC Development Team",
  "license": "MIT",
  "peerDependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "framer-motion": "^6.0.0"
  }
}
```

### Step 2: Create Index Export
```jsx
// modules/photobooth/index.js
export { default as PhotoBooth } from './PhotoBooth.jsx';
export { default as Booth } from './components/Booth.jsx';
export { default as BoothHero } from './components/Hero.jsx';
export { default as Nav } from './components/nav.jsx';
export { default as PixelSkyline } from './components/PixelSkyline.jsx';
```

### Step 3: Document Usage
Create a comprehensive guide showing:
- Installation instructions
- Import examples
- Customization options
- API documentation
- Troubleshooting

## Distribution Methods

### Method 1: GitHub
```bash
# Create a new repo
gh repo create gdgc-photobooth-module --public

# Push modules
git add src/modules/photobooth/
git commit -m "Add photobooth module"
git push origin main
```

### Method 2: NPM Package
```bash
# Prepare for npm
npm init -y
npm pack

# Publish
npm publish
```

### Method 3: Zip/Tarball
```bash
# Create archive
tar -czf gdgc-modules.tar.gz src/modules/

# Share via email, Google Drive, or file transfer
```

### Method 4: Docker Container
```dockerfile
FROM node:18-alpine
COPY src/modules/ /app/modules/
COPY public/ /app/public/
WORKDIR /app
RUN npm install
```

## Versioning

Each module should follow semantic versioning:
- **MAJOR**: Breaking changes (e.g., API change)
- **MINOR**: New features (e.g., new animations)
- **PATCH**: Bug fixes

Example: `v1.2.3`

## Documentation Template

For each shared module, create:
1. `README.md` - Overview and usage
2. `CHANGELOG.md` - Version history
3. `API.md` - Component props and interfaces
4. `CUSTOMIZATION.md` - How to modify
5. `CONTRIBUTING.md` - Development guidelines

## Quick Integration Checklist

- [ ] Copy module files
- [ ] Copy shared components
- [ ] Copy public assets
- [ ] Update import paths
- [ ] Add routes to App.jsx
- [ ] Install dependencies
- [ ] Test in browser
- [ ] Update documentation

## Troubleshooting

### Module Not Found
```bash
# Check file exists
ls -la src/modules/photobooth/

# Check import path
# Update relative paths if needed
```

### Missing Dependencies
```bash
# Install missing packages
npm install framer-motion
npm install react-hot-toast
```

### Import Errors
- Verify file names match (case-sensitive on Linux/Mac)
- Check relative path depth (`../../../` vs `../../`)
- Use absolute paths if available

### CSS Not Loading
- Verify CSS file is in correct location
- Check import statement in component
- Ensure CSS file path is correct

## Questions?

For module-specific issues, see:
- `src/modules/photobooth/README.md`
- `src/modules/heist/README.md`
- `src/modules/loop13/README.md`

---

**Last Updated**: April 2026  
**Maintained by**: GDGC Development Team
