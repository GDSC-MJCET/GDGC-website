
A modern, responsive website for Google Developer Group Community (GDGC) built with React and Vite.

## 🚀 Features

- **Modern UI/UX** - Clean, professional design with glassmorphism effects
- **Responsive Design** - Fully responsive across all devices
- **React Router** - Client-side routing with nested routes
- **Fixed Navigation** - Sticky navbar that stays at the top
- **Multiple Pages** - Home, About, Hiring, and more
- **Smooth Animations** - Powered by Framer Motion
- **Background Patterns** - Beautiful silk background texture

## 🛠️ Tech Stack

- **Frontend Framework**: React 19.1.1
- **Build Tool**: Vite 7.1.2
- **Routing**: React Router DOM
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **UI Components**: Custom resizable navbar components
- Demo

## 📁 Project Structure

```
src/
├── components/
│   ├── Navbar.jsx              # Main navigation component
│   └── ui/
│       └── resizable-navbar.jsx # Reusable navbar UI components
├── pages/
│   ├── HomePage.jsx            # Home page
│   ├── AboutPage.jsx           # About page
│   └── HiringPage.jsx          # Hiring page
├── assets/
│   ├── BG Silk image top.png   # Background texture
│   └── ...                     # Other assets
├── App.jsx                     # Main app component with routing
├── App.css                     # Global styles
└── main.jsx                    # Entry point
```

## 🚀 Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd GDGC-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` (or the port shown in terminal)

## 📱 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎨 Design Features

### Navigation
- **Fixed Position** - Navbar stays at the top while scrolling
- **Responsive** - Mobile-friendly hamburger menu
- **Smooth Transitions** - Animated hover effects and transitions

### Background
- **Silk Texture** - Beautiful repeating background pattern
- **Glassmorphism** - Modern frosted glass effects
- **Gradient Overlays** - Subtle color gradients for depth

### Pages
- **Home** - Landing page with hero section
- **About** - Information about the community
- **Hiring** - Job opportunities and career information

## 🔧 Customization

### Adding New Pages
1. Create a new component in `src/pages/`
2. Add the route in `src/App.jsx`
3. Update navigation items in `src/components/Navbar.jsx`

### Styling
- Global styles: `src/App.css`
- Component styles: Use Tailwind CSS classes
- Custom components: `src/components/ui/`

## 🌐 Deployment

### Build for Production
```bash
npm run build
```

The built files will be in the `dist/` directory, ready for deployment to any static hosting service.

### Recommended Hosting
- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **GDGC Community** - Google Developer Group Community

## 📞 Contact

For questions or support, please contact the GDGC team or create an issue in this repository.

---

**Built with ❤️ by the GDGC Community**
