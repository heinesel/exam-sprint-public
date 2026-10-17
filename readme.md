# ExamSprint

ExamSprint is a small study app for active exam practice. Students choose a subject and module, answer short quizzes, review mistakes and see which topics need more work.

This public repository uses original fictional demo content. It does not include lecture slides, Canvas material or questions copied from a course. The included worlds, rules, notes and quizzes were written specifically to demonstrate the app.

The prototype was created for Mandatory Assignment 3 in DAVE3625 – Introduction to Artificial Intelligence. It demonstrates how generative AI can support brainstorming, implementation, testing and iterative improvement.

## Core features

1. **Practice mode** – balanced quizzes with immediate explanations.
2. **Smart Review** – a wrong answer enters the review queue and is removed after two correct answers in a row.
3. **Progress dashboard** – shows accuracy, answered questions, strong and weak modules, and questions to review.

Progress is stored locally in the browser. The app has no accounts, backend, database or API keys.

## Run locally

Requirements: a current Node.js version with npm.

```bash
npm install
npm run dev
```

Open the local address printed by Vite.

## Quality checks

Run all content validation, automated tests and the production build:

```bash
npm run check
```

Individual commands:

```bash
npm run validate
npm test
npm run build
npm run preview
```

The content validator checks module references, question IDs, answer indexes, difficulty levels and required explanations. A warning means the app can still build, but the affected quiz may not contain five questions at every difficulty level.

## Project structure

```text
src/components/       Screens and reusable interface components
src/data/subjects/    Subject catalogues, notes and quiz questions
src/lib/              Quiz, review, storage and layout logic
scripts/              Content validation
tests/                Automated logic tests
```

To add a ready module:

1. Add the module to its subject catalogue in `src/data/subjects/`.
2. Add a JSON content file with the same `moduleId`.
3. Run `npm run validate`.

Modules without content must be marked with `"comingSoon": true`.

## GitHub Pages

The Vite base path is configured for a repository named `exam-sprint-public`.

Before publishing:

1. Run `npm run check`.
2. Confirm that no passwords, API keys or personal data are present.
3. Build with `npm run build`.
4. Publish the generated `dist/` directory using GitHub Pages or the repository's approved deployment workflow.
5. Open the published link in a private browser window and test Practice, Review, Dashboard, course switching and the Back button.

## AI-assisted development

Generative AI was used to help brainstorm the concept, create and improve React components, test navigation and mobile layouts, identify stability problems, and add automated checks. The generated work was reviewed through browser testing, content validation, automated tests and production builds.

## Short submission description

> ExamSprint is an interactive exam-practice app that helps students test their knowledge instead of only rereading notes. It provides topic-based quizzes, immediate explanations, a review queue for missed questions and a dashboard showing learning progress. The prototype was built and iteratively tested with generative-AI assistance.
