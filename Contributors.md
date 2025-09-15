# Contributing to GDG MJCET Website 🚀

Welcome to the GDG MJCET website project! We're excited to have you contribute to our community-driven platform. This guide will help you get started with contributing to our React.js website built with shadcn/ui.

## 🌟 We're Open to Contributions!

We believe in the power of open-source collaboration and welcome contributions from developers of all skill levels. Whether you're a beginner or an experienced developer, there's a place for you in our community!

## 🛠️ Tech Stack

- **Frontend**: React.js with TypeScript
- **UI Components**: shadcn/ui + Tailwind CSS
- **Build Tool**: Vite
- **Package Manager**: npm/yarn
- **Version Control**: Git & GitHub

## 📋 Prerequisites

Before you start contributing, make sure you have:

- Node.js (v16 or higher) installed
- npm or yarn package manager
- Git installed and configured
- A GitHub account
- Basic knowledge of React.js and TypeScript

## 🚀 Getting Started

### 1. Fork the Repository

1. Go to our [GitHub repository](https://github.com/gdg-mjcet/website)
2. Click the "Fork" button in the top right corner
3. This creates a copy of the repository in your GitHub account

### 2. Clone Your Fork

```bash
git clone https://github.com/YOUR_USERNAME/gdg-mjcet-website.git
cd gdg-mjcet-website
```

### 3. Set Up Remote Upstream

```bash
git remote add upstream https://github.com/gdg-mjcet/website.git
git remote -v  # Verify remotes
```

### 4. Install Dependencies

```bash
npm install
# or
yarn install
```

### 5. Start Development Server

```bash
npm run dev
# or
yarn dev
```

The website should now be running at `http://localhost:3000`

## 🔄 Contributing Workflow

### Step 1: Check for Issues

1. Visit our [Issues page](https://github.com/gdg-mjcet/website/issues)
2. Look for issues labeled with:
   - `good first issue` - Perfect for beginners
   - `help wanted` - We need community help
   - `bug` - Something that needs fixing
   - `enhancement` - New features or improvements

### Step 2: Create a New Branch

**Always create a new branch for your changes!**

```bash
# Sync your fork with upstream
git fetch upstream
git checkout main
git merge upstream/main

# Create and switch to a new branch
git checkout -b feature/your-feature-name
# or for bug fixes
git checkout -b fix/issue-description
```

**Branch Naming Convention:**
- `feature/add-event-page` - For new features
- `fix/navbar-responsive-issue` - For bug fixes
- `docs/update-readme` - For documentation
- `style/button-hover-effect` - For UI/styling changes

### Step 3: Make Your Changes

1. Write clean, readable code following our coding standards
2. Use shadcn/ui components when possible
3. Ensure your code is responsive and accessible
4. Test your changes thoroughly

### Step 4: Commit Your Changes

```bash
git add .
git commit -m "feat: add event registration form with validation"
```

**Commit Message Convention:**
- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests

### Step 5: Push to Your Fork

```bash
git push origin your-branch-name
```

### Step 6: Create a Pull Request

1. Go to your fork on GitHub
2. Click "Compare & pull request"
3. Fill out the PR template with:
   - Clear description of changes
   - Screenshots (if UI changes)
   - Reference to related issues (#123)
4. Submit the pull request

## 📝 Pull Request Guidelines

### Before Creating a PR:

- [ ] Code follows our style guidelines
- [ ] All tests pass locally
- [ ] Changes are tested in different screen sizes
- [ ] No console errors or warnings
- [ ] Code is properly commented when necessary

### PR Description Should Include:

- **What**: Brief description of changes
- **Why**: Reason for the changes
- **How**: How you implemented the solution
- **Screenshots**: For UI changes
- **Testing**: How you tested the changes

### Example PR Description:

```markdown
## What
Added a new event registration form with form validation

## Why
Users need a way to register for upcoming GDG events (#45)

## How
- Created a new EventRegistration component using shadcn/ui Form
- Added form validation using react-hook-form
- Integrated with our existing API endpoint

## Screenshots
[Include before/after screenshots]

## Testing
- Tested form validation with various inputs
- Verified responsive design on mobile and desktop
- Checked accessibility with screen reader
```

## 🎨 Design Guidelines

### Using shadcn/ui Components

```tsx
// ✅ Good: Use shadcn/ui components
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

// ❌ Avoid: Custom components when shadcn/ui exists
<div className="custom-button">Click me</div>
```

### Styling Best Practices

- Use Tailwind CSS classes for styling
- Follow mobile-first responsive design
- Maintain consistent spacing and typography
- Use our design tokens for colors and fonts

## 🐛 Reporting Issues

Found a bug or have a feature request? We'd love to hear from you!

### Bug Reports Should Include:

1. **Description**: Clear description of the issue
2. **Steps to Reproduce**: Step-by-step instructions
3. **Expected Behavior**: What should happen
4. **Actual Behavior**: What actually happens
5. **Screenshots**: Visual proof if applicable
6. **Environment**: Browser, OS, device info

### Feature Requests Should Include:

1. **Problem**: What problem does this solve?
2. **Solution**: Proposed solution
3. **Alternatives**: Alternative solutions considered
4. **Additional Context**: Any other relevant information

## 📚 Resources

### Learning Resources:

- [React Documentation](https://react.dev/)
- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

### Project-Specific:

- [Component Library](./src/components/README.md)
- [API Documentation](./docs/api.md)
- [Deployment Guide](./docs/deployment.md)

## 🤝 Community

Join our community and connect with other contributors:

- **Discord**: [GDG MJCET Discord Server](https://discord.gg/gdg-mjcet)
- **Telegram**: [GDG MJCET Telegram Group](https://t.me/gdgmjcet)
- **Email**: gdg@mjcollege.ac.in

## 🆘 Need Help?

Stuck? Don't worry, we're here to help!

1. **Check existing issues** - Someone might have faced the same problem
2. **Ask in our Discord** - Get real-time help from the community
3. **Create a discussion** - For general questions and ideas
4. **Comment on issues** - Get clarification on specific tasks

## 🎉 Recognition

We value every contribution! Contributors will be:

- Listed in our `CONTRIBUTORS.md` file
- Featured on our website's contributors page
- Recognized in our community channels
- Eligible for GDG MJCET contributor swag (for significant contributions)

## 📜 Code of Conduct

Please note that this project is released with a [Code of Conduct](./CODE_OF_CONDUCT.md). By participating in this project, you agree to abide by its terms. We're committed to providing a welcoming and inclusive environment for everyone.

## ⚖️ License

By contributing to this project, you agree that your contributions will be licensed under the [MIT License](./LICENSE).

---

## 🚀 Ready to Contribute?

1. **Star** ⭐ the repository to show your support
2. **Fork** the repository
3. **Check** the issues for something that interests you
4. **Create** a new branch for your changes
5. **Make** your awesome contribution
6. **Submit** a pull request

Thank you for contributing to GDG MJCET! Together, we're building something amazing for our developer community. 🎉

---

*Happy Coding! 💻✨*