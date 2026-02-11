# Contributing to RIVETO

Thanks for contributing to RIVETO! We welcome bug reports, documentation improvements, tests, UI polish, and new features.

## Table of contents

- [What to expect](#what-to-expect)
- [Reporting bugs](#reporting-bugs)
- [Suggesting enhancements](#suggesting-enhancements)
- [Development setup](#development-setup)
- [Branching & commits](#branching--commits)
- [Pull request process](#pull-request-process)
- [Style & tests](#style--tests)
- [Code of Conduct](#code-of-conduct)
- [Getting help](#getting-help)

## What to expect

Maintainers review contributions and aim to respond within a few business days. Please be respectful and patient; requested changes are normal during review.

## Reporting bugs

1. Search existing issues to see if the bug is already reported.
2. If not found, open a new issue with:
   - A clear, descriptive title
   - Steps to reproduce
   - Expected vs. actual behavior
   - Environment details (OS, Node version, browser, etc.)
   - Minimal reproduction or screenshots/logs

## Suggesting enhancements

Create an issue describing the change, why it’s needed, and possible approaches. If you plan to implement it, mention that in the issue so others can coordinate.

## Development setup

1. Fork the repository and clone your fork.
2. Create a branch from main:

   ```bash
   git checkout -b feat/my-feature
   ```

3. Install dependencies and start the apps you need:

   **Backend**

   ```bash
   cd backend
   npm install
   npm run dev
   ```

   **Frontend**

   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

   **Admin**

   ```bash
   cd ../admin
   npm install
   npm run dev
   ```

4. Configure environment files as described in the README.

## Branching & commits

- Use clear branch names: `feat/...`, `fix/...`, `docs/...`, `test/...`, `chore/...`
- Prefer conventional commits when possible (e.g., `feat: add X`, `fix: correct Y`).
- Keep PRs focused and reasonably small.

## Pull request process

1. Push your branch to your fork.
2. Open a pull request against the main branch.
3. In the PR description include:
   - What the change does
   - Why it is needed
   - Noteworthy implementation details
   - Related issue references using `#<issue-number>`
4. Ensure CI passes and address review comments.

### PR checklist

- [ ] My code follows the repository style guidelines
- [ ] I added tests where applicable
- [ ] All new and existing tests pass
- [ ] I updated documentation if necessary

## Style & tests

- Run linters/formatters before submitting.
- Add or update tests for any behavior changes.

## Code of Conduct

This project follows the Contributor Covenant. By participating, you agree to uphold it. If a CODE_OF_CONDUCT.md file is missing, please open an issue.

## Getting help

If you’re unsure where to start, check issues labeled “good first issue” or “help wanted”. You can also ask questions on an issue for guidance.

---

Thank you for helping improve RIVETO.
