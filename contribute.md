# Contributing to RIVETO

Thank you for wanting to contribute to RIVETO! We welcome contributions of all sizes — bug reports, documentation improvements, examples, tests, or code changes.

## Table of contents

- What to expect
- Reporting bugs
- Suggesting enhancements
- Development setup
- Branching & commits
- Pull request process
- Style & tests
- Code of Conduct
- Getting help

## What to expect

Contributions are reviewed by the maintainers. We aim to respond to issues and PRs within a few business days. Be patient and polite; maintainers may ask for changes before merging.

## Reporting bugs

1. Search existing issues to see if the bug is already reported.
2. If not found, open a new issue with the following information:
   - A clear, descriptive title
   - Steps to reproduce
   - Expected and actual behavior
   - Environment (OS, Node/Python/other runtime and version, if relevant)
   - Minimal reproducible example or screenshots/logs

## Suggesting enhancements

Create an issue describing the proposed change, why it is needed, and possible approaches. If you plan to implement it, mention that you will work on a PR.

## Development setup

1. Fork the repository and clone your fork.
2. Create a branch for your change from main:
   - git checkout -b feat/my-feature
3. Install dependencies and run the test suite and linters locally. Follow any instructions in the README for project-specific setup.

## Branching & commits

- Use clear branch names: feat/..., fix/..., docs/..., test/...
- Write descriptive commit messages. We follow conventional-commit style where appropriate (e.g., "feat: add X", "fix: correct Y").
- Keep changes focused and small when possible.

## Pull request process

1. Push your branch to your fork.
2. Open a pull request against the main branch of the upstream repository.
3. In the PR description include:
   - What the change does
   - Why the change is needed
   - Any noteworthy implementation details
   - Reference related issue(s) using the "#" notation
4. Ensure CI passes and address any review comments.

PR checklist

- [ ] My code follows the repository style guidelines
- [ ] I added tests for my changes where applicable
- [ ] All new and existing tests pass
- [ ] I updated documentation if necessary

## Style & tests

- Run linters and formatters before submitting. If the project has configuration files (e.g., .eslintrc, prettier, or equivalent), use those settings.
- Add or update tests for changes to behavior.

## Code of Conduct

This project follows the Contributor Covenant. By participating, you agree to abide by its terms. If the repository does not yet include a CODE_OF_CONDUCT.md, please raise an issue to add one or propose it in your PR.

## Getting help

If you're unsure where to start, check open issues labeled "good first issue" or "help wanted". You can also ask questions in issues — maintainers or other contributors may point you in the right direction.

---

Thank you for contributing to RIVETO! Your help makes this project better for everyone.