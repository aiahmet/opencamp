# Contributing to OpenCamp

Thank you for your interest in contributing to OpenCamp! This document provides guidelines and information for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Submitting Contributions](#submitting-contributions)
- [Coding Standards](#coding-standards)
- [Content Guidelines](#content-guidelines)

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on what is best for the community
- Show empathy towards other contributors

## Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn
- Git
- Familiarity with TypeScript, React, Next.js

### Setup

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/opencamp.git`
3. Navigate to the project directory: `cd opencamp`
4. Install dependencies: `npm install`
5. Create a branch: `git checkout -b feature/your-feature-name`

## Development Workflow

1. Make your changes
2. Write tests for your changes
3. Run linter: `npm run lint`
4. Run type checker: `npx tsc --noEmit`
5. Run tests: `npm test`
6. Commit your changes: `git commit -m "feat: add new feature"`
7. Push to your fork: `git push origin feature/your-feature-name`
8. Create a pull request

### Commit Message Convention

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` A new feature
- `fix:` A bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

Examples:
- `feat: add Go language support`
- `fix: resolve sandbox timeout issue`
- `docs: update CONTRIBUTING.md`

## Submitting Contributions

### Pull Requests

1. Keep PRs focused on a single issue or feature
2. Provide a clear description of what your PR does
3. Link to related issues
4. Include screenshots for UI changes
5. Ensure all CI checks pass

### Review Process

1. Your PR will be reviewed by maintainers
2. Address review feedback promptly
3. Keep discussions constructive and focused
4. Maintainers may request changes before merging

## Coding Standards

### TypeScript

- Use strict type checking
- Avoid `any` and `as` type assertions
- Prefer explicit types where clarity is needed
- Use type inference for obvious cases

### React

- Use functional components with hooks
- Follow React best practices
- Keep components small and focused
- Use composition over inheritance

### Naming Conventions

- **Components**: PascalCase (`UserProfile.tsx`)
- **Files**: kebab-case (`user-profile.tsx`)
- **Variables/Functions**: camelCase (`getUserData`)
- **Constants**: UPPER_SNAKE_CASE (`API_TIMEOUT`)
- **Types/Interfaces**: PascalCase (`UserData`)

### Code Style

- 2-space indentation
- Double quotes for strings
- Semicolons at end of statements
- Meaningful variable and function names
- Comment complex logic

## Content Guidelines

### Adding Lessons

1. Follow curriculum structure in `CURRICULUM_TODO.md`
2. Use consistent formatting with existing lessons
3. Include code examples that run in sandbox
4. Add learning objectives at the start
5. Provide explanations, not just code
6. Include practice exercises
7. Add real-world context and examples

### Adding Challenges

1. Create test suite that passes with correct solution
2. Include multiple test cases
3. Add clear problem statement
4. Provide starter code with TODO comments
5. Set appropriate difficulty level
6. Add hints system for debugging exercises

### Content Review

All content contributions go through review:
1. Automated validation (YAML, code execution)
2. Peer review by 2 maintainers
3. Beta testing with real users
4. Accessibility audit

## Testing

- Write unit tests for new functions
- Test edge cases and error conditions
- Aim for >80% code coverage
- Use descriptive test names
- Follow Arrange-Act-Assert pattern

## Documentation

- Update relevant docs when adding features
- Keep documentation concise and clear
- Include code examples
- Update CHANGELOG.md for significant changes

## Getting Help

- Check existing issues and PRs first
- Ask questions in discussions for non-issues
- Be patient with maintainers
- Provide context and code when asking for help

## Recognition

Contributors are recognized in:
- Contributors section in README
- Release notes
- Community highlights

Major contributors may be invited to become maintainers.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to OpenCamp! 🎉
