# Contributing to nym

Thank you for your interest in contributing to nym! This document provides guidelines and instructions for contributing.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/nym.git`
3. Create a branch: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Test your changes thoroughly
6. Commit: `git commit -m "Add your feature"`
7. Push: `git push origin feature/your-feature-name`
8. Create a Pull Request

## Development Setup

See README.md for detailed setup instructions.

### Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local

# Start development servers
npm run dev
```

## Code Style Guidelines

### TypeScript/JavaScript

- Use TypeScript for all new files
- Follow ESLint configuration
- Use meaningful variable names
- Add JSDoc comments for complex functions
- Prefer functional components in React
- Use hooks over class components

### CSS/Styling

- Use TailwindCSS utility classes
- Follow the existing color scheme
- Maintain consistent spacing
- Ensure responsive design
- Test on multiple screen sizes

### Database

- Use prepared statements to prevent SQL injection
- Create migrations for schema changes
- Add indexes for frequently queried columns
- Document complex queries

## Project Structure

```
nym/
├── frontend/           # Next.js frontend
│   ├── src/
│   │   ├── app/       # Pages and layouts
│   │   ├── components/# React components
│   │   ├── lib/       # Utilities and API client
│   │   └── store/     # Zustand state management
│   └── package.json
├── backend/           # Express backend
│   ├── src/
│   │   ├── routes/    # API routes
│   │   ├── db/        # Database configuration
│   │   └── index.ts   # Entry point
│   └── package.json
└── package.json       # Root package.json
```

## Testing

Before submitting a PR:

1. Test all new features manually
2. Ensure no console errors
3. Test on multiple browsers
4. Verify database operations work correctly
5. Test Web3 integration if modified

## Pull Request Guidelines

### PR Title
Use conventional commit format:
- `feat: Add new feature`
- `fix: Fix bug in component`
- `docs: Update documentation`
- `style: Format code`
- `refactor: Refactor component`
- `test: Add tests`
- `chore: Update dependencies`

### PR Description
Include:
1. What changes were made
2. Why the changes were needed
3. How to test the changes
4. Screenshots (if UI changes)
5. Related issues

### Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings or errors
- [ ] Tested on multiple browsers
- [ ] Mobile responsive (if applicable)

## Feature Requests

Open an issue with:
- Clear description of the feature
- Use cases
- Expected behavior
- Optional: mockups or examples

## Bug Reports

Open an issue with:
- Clear description of the bug
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots if applicable
- Browser/OS information
- Console errors

## Areas for Contribution

### High Priority
- [ ] Add unit tests
- [ ] Improve error handling
- [ ] Add loading states
- [ ] Optimize performance
- [ ] Add accessibility features
- [ ] Mobile responsiveness improvements

### Features
- [ ] Code templates
- [ ] Component library
- [ ] Version history
- [ ] Collaborative editing
- [ ] Advanced deployment options
- [ ] Smart contract integration

### Documentation
- [ ] API documentation
- [ ] Component documentation
- [ ] Tutorial videos
- [ ] Example projects
- [ ] Troubleshooting guide

## Code Review Process

1. Maintainer reviews PR
2. Feedback provided if needed
3. Changes requested or approved
4. PR merged when approved
5. Branch deleted after merge

## Community

- Be respectful and inclusive
- Help others learn
- Provide constructive feedback
- Follow the code of conduct

## Questions?

Open an issue with the `question` label or reach out to maintainers.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.


