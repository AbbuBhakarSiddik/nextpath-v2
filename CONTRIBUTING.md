# Contributing to NextPath AI

Thank you for your interest in contributing to **NextPath AI**!

We welcome bug fixes, feature ideas, documentation improvements, UI/UX enhancements, and thoughtful discussions.

## 1. Before You Start

- Check existing [GitHub Issues](https://github.com/AbbuBhakarSiddik/nextpath-v2/issues).
- Discuss major features or architectural changes in an issue first.
- Keep pull requests focused and manageable.

## 2. Development Setup

**Prerequisites:** Node.js, npm, PostgreSQL, Google Gemini API key, and NewsAPI key.

Fork and clone:

```bash
git clone https://github.com/<your-github-username>/nextpath-v2.git
cd nextpath-v2
```

Install dependencies:

```bash
npm install --prefix backend
npm install --prefix frontend
```

Configure your backend environment:

```bash
cp backend/.env.example backend/.env
```

Add your API keys and PostgreSQL connection string to `backend/.env`.

Never commit API keys, credentials, or environment files.

Set up the database:

```bash
npm run db:generate
npm run db:push
```

Start the application:

```bash
npm run dev
```

## 3. Branch Naming

Create a branch from the latest upstream `main`:

```bash
git fetch upstream
git checkout -b feature/short-description upstream/main
```

Use these prefixes:

- `feature/` — new functionality
- `fix/` — bug fixes
- `docs/` — documentation
- `refactor/` — code improvements

## 4. Testing

Before submitting changes:

- Test the functionality you modified.
- Check browser console and backend logs.
- Verify relevant API and database behavior.
- Run applicable build or validation scripts.
- Document any checks you could not perform.

## 5. Pull Requests

Push your branch:

```bash
git push origin feature/short-description
```

Open a pull request against the original repository's `main` branch.

Include:

1. Description of your changes.
2. Related issue number, if applicable.
3. Screenshots for UI changes.
4. Testing steps and results.
5. Database or configuration implications.

### Pull Request Checklist

- [ ] Changes are focused and relevant.
- [ ] Affected functionality has been tested.
- [ ] Documentation has been updated.
- [ ] No secrets or credentials are included.
- [ ] Changes and testing are clearly described.

## 6. Bugs and Feature Requests

Use [GitHub Issues](https://github.com/AbbuBhakarSiddik/nextpath-v2/issues).

Include reproduction steps, expected behavior, actual behavior, and relevant error messages.

Never share credentials or sensitive personal information in issues.

## 7. Community Guidelines

Be respectful, constructive, and welcoming. Focus feedback on improving the code and solving problems.

**Thank you for helping make NextPath AI better for developers everywhere!**
