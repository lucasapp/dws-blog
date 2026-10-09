# DWS Blog

A responsive blog front end built with **React 19**, **TypeScript** and **Vite**. It lists posts from the DWS tech-test API. You can search posts, filter them by category and author, sort them by date, and open each post to read it in full.

## Features

- **Post listing** with loading skeletons, an empty state and an error state with retry.
- **Search** by post title, author name or category name. It ignores case and accents.
- **Filters** by category and author, with multiple selection. Desktop shows them in a sidebar and mobile shows them as dropdowns.
- **Sorting** by newest or oldest first.
- **Post detail page** (`/posts/:id`) with the author, date, cover image, content and the 3 latest articles.
  - Posts already loaded on the home page are reused. If you open a post URL directly, the post is fetched from the API.
  - A post that does not exist shows a "not found" message.
- Unknown routes redirect to `/`.
- Search, filter and sort settings stay in place when you move between the listing and the detail page.

## Tech stack

| Area      | Tools                                                                    |
| --------- | ------------------------------------------------------------------------ |
| UI        | React 19, React Router 7                                                 |
| Language  | TypeScript                                                               |
| Build/dev | Vite                                                                     |
| Styling   | SCSS Modules (`sass-embedded`), with shared tokens and mixins            |
| Testing   | Vitest, Testing Library (React, user-event, jest-dom), jsdom             |
| Linting   | ESLint with `typescript-eslint`, `react-hooks` and `react-refresh` rules |

## Prerequisites

- **Node.js** 20.19+ or 22.12+ (the version Vite requires). Development used Node 24.
- **npm** (comes with Node)

## Getting started

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server (http://localhost:5173)
npm run dev
```

`npm start` works too. It runs the same command as `npm run dev`.

## Running the tests

The project is tested with **Vitest** and **Testing Library** in a **jsdom** environment. Each component, hook, context and API module has its own test file next to its source (`*.test.ts` / `*.test.tsx`).

```bash
# Run all tests once
npm test

# Watch mode: re-runs the affected tests when you save a file
npm run test:watch

# Run a single file or the files matching a pattern
npx vitest run src/hooks/useFilteredPosts.test.tsx
npx vitest run PostCard

# Run the tests whose name matches a string
npx vitest run -t "filters by category"
``
