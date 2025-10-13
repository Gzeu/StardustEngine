# 🤝 Contributing to StardustEngine

We welcome contributions to StardustEngine! This document provides guidelines for contributing to our NFT gaming platform on MultiversX.

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and npm 9+
- **Docker Desktop** for smart contract development
- **Git** for version control
- **MultiversX CLI** tools (mxpy)
- **Rust** for smart contract development

### Development Setup

1. **Fork the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/StardustEngine.git
   cd StardustEngine
   ```

2. **Set up development environment**
   ```bash
   # Start Docker environment
   ./docker-dev.sh
   
   # Install frontend dependencies
   cd frontend
   npm install
   ```

3. **Create a branch for your feature**
   ```bash
   git checkout -b feature/your-feature-name
   ```

## 📋 Contribution Guidelines

### Code Style

#### Frontend (TypeScript/React)
- Use **TypeScript** for type safety
- Follow **React best practices** with hooks
- Use **Tailwind CSS** for styling
- Implement **responsive design** for mobile compatibility
- Add **ESLint** and **Prettier** configurations

#### Smart Contracts (Rust)
- Follow **MultiversX Rust** coding standards
- Add comprehensive **unit tests** for all functions
- Include **gas optimization** considerations
- Document all public functions with **rust doc comments**

#### General Code Guidelines
- Write **clear, descriptive commit messages**
- Add **comprehensive comments** for complex logic
- Follow **conventional commit** standards:
  - `feat:` for new features
  - `fix:` for bug fixes
  - `docs:` for documentation
  - `test:` for tests
  - `refactor:` for code refactoring
  - `style:` for formatting changes

### Testing Requirements

#### Frontend Testing
```bash
# Run all tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

**Required Test Coverage:**
- **Unit tests** for all React components
- **Integration tests** for MultiversX interactions
- **E2E tests** for critical user flows
- **Minimum 80% code coverage**

#### Smart Contract Testing
```bash
# Test in Docker environment
./docker-dev.sh

# Run contract tests
cd /workspace/stardust-contracts
mxpy contract test
```

**Required Tests:**
- All smart contract functions
- Edge cases and error conditions
- Gas usage optimization
- Security vulnerability checks

### Documentation

- **Update README.md** if you change functionality
- **Add JSDoc comments** for all TypeScript functions
- **Update API documentation** for new endpoints
- **Include examples** in your documentation
- **Add screenshots** for UI changes

## 🎮 Contributing Areas

### 🔥 High Priority Areas

1. **Gaming Features**
   - New asset types and mechanics
   - Tournament system improvements
   - Player progression features
   - Achievement system expansion

2. **UI/UX Improvements**
   - Holographic effects optimization
   - Mobile responsiveness
   - Accessibility features
   - Animation performance

3. **Blockchain Integration**
   - Smart contract optimizations
   - Cross-chain compatibility
   - NFT marketplace features
   - DeFi gaming mechanics

### 🛠️ Technical Improvements

1. **Performance**
   - Frontend loading optimization
   - Smart contract gas efficiency
   - Image and asset optimization
   - Caching strategies

2. **Testing & Quality**
   - Automated testing suites
   - End-to-end test scenarios
   - Security auditing tools
   - Performance benchmarking

3. **DevOps & Infrastructure**
   - CI/CD pipeline improvements
   - Docker optimization
   - Deployment automation
   - Monitoring and logging

## 📝 Pull Request Process

### Before Submitting

1. **Ensure your code follows our guidelines**
2. **Run all tests and ensure they pass**
3. **Update documentation** as needed
4. **Add or update tests** for your changes
5. **Test your changes** locally

### Pull Request Template

```markdown
## Description
Brief description of what this PR does

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes
- [ ] I have tested this change on mobile devices

## Screenshots (if applicable)
[Add screenshots here]

## Checklist
- [ ] My code follows the style guidelines of this project
- [ ] I have performed a self-review of my own code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] Any dependent changes have been merged and published
```

### Review Process

1. **Automated checks** must pass (CI/CD, tests, linting)
2. **Code review** by maintainers
3. **Testing** in development environment
4. **Approval** from at least one maintainer
5. **Merge** into main branch

## 🐛 Bug Reports

### Bug Report Template

```markdown
**Describe the bug**
A clear and concise description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected behavior**
A clear and concise description of what you expected to happen.

**Screenshots**
If applicable, add screenshots to help explain your problem.

**Environment:**
 - Device: [e.g. iPhone12, Desktop]
 - OS: [e.g. iOS14, Windows 10]
 - Browser: [e.g. Chrome, Safari]
 - Version: [e.g. 22]

**Additional context**
Add any other context about the problem here.
```

## 💡 Feature Requests

### Feature Request Template

```markdown
**Is your feature request related to a problem?**
A clear and concise description of what the problem is.

**Describe the solution you'd like**
A clear and concise description of what you want to happen.

**Describe alternatives you've considered**
A clear and concise description of any alternative solutions or features you've considered.

**Additional context**
Add any other context or screenshots about the feature request here.

**Implementation ideas**
If you have ideas about how this could be implemented, please share them.
```

## 🏆 Recognition

### Contributor Rewards

- **GitHub recognition** in our contributors list
- **NFT rewards** for significant contributions
- **Early access** to new features
- **Community showcase** for outstanding work

### Contribution Levels

- **🌟 First-time Contributor**: Welcome package
- **🔥 Regular Contributor**: Special recognition badge
- **💎 Core Contributor**: Platform governance participation
- **🚀 Maintainer**: Direct collaboration opportunities

## 📞 Community & Support

### Getting Help

- **GitHub Issues**: For bug reports and feature requests
- **GitHub Discussions**: For questions and community interaction
- **Documentation**: Check our comprehensive docs
- **Email**: [email] for sensitive matters

### Community Guidelines

- **Be respectful** and inclusive
- **Help others** learn and contribute
- **Share knowledge** and best practices
- **Follow our code of conduct**

## 📚 Resources

### Learning Resources

- **MultiversX Documentation**: [docs.multiversx.com](https://docs.multiversx.com)
- **React Documentation**: [react.dev](https://react.dev)
- **TypeScript Handbook**: [typescriptlang.org](https://www.typescriptlang.org/docs/)
- **Rust Programming**: [doc.rust-lang.org](https://doc.rust-lang.org/book/)

### Development Tools

- **MultiversX IDE**: [ide.multiversx.com](https://ide.multiversx.com)
- **VS Code Extensions**: MultiversX, Rust Analyzer, ES7+ React
- **Browser Extensions**: MultiversX Web Wallet
- **Testing Tools**: Jest, React Testing Library, Playwright

---

## 🎯 Quick Start Checklist for New Contributors

- [ ] Fork the repository
- [ ] Set up development environment
- [ ] Read through existing code and documentation  
- [ ] Join our community discussions
- [ ] Pick a "good first issue" or ask for recommendations
- [ ] Create your feature branch
- [ ] Make your changes with tests
- [ ] Submit your pull request
- [ ] Respond to review feedback
- [ ] Celebrate your contribution! 🎉

---

**Thank you for contributing to StardustEngine! Together we're building the future of blockchain gaming.** 🌟🎮

*Built with ❤️ by the StardustEngine community*