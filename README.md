# PRD Template

A reusable React template for turning Product Requirements Documents into clean, responsive HTML microsites.

A single app can hold multiple PRDs. Each project's content lives in its own JSON file, separate from the reusable page structure and styling.

## Tech Stack

- React
- Vite
- JavaScript
- Tailwind CSS

## Getting Started

Clone the repository and install dependencies:

```bash
npm install
```

Start the local development server:

```bash
npm run dev
```

Vite will provide a local URL, typically:

```text
http://localhost:5173
```

## Creating a New PRD

1. Copy `src/content/projects/template.json` to a new file, e.g. `src/content/projects/my-project.json`. The filename becomes the project's id.
2. Update the PRD content in the new file.
3. Add any workflow diagrams, wireframes, or other images to `public/` (e.g. `public/my-project/workflow.png`) and reference them by path in the JSON (`"image": "/my-project/workflow.png"`). Full URLs also work.
4. Run the project locally with `npm run dev`.
5. Commit and publish the completed PRD.

## Multiple Projects

Every JSON file in `src/content/projects/` is picked up automatically. Projects are loaded from the URL using the `project` query parameter, which is the filename without `.json`:

```text
http://localhost:5173/?project=my-project
```

With no project in the URL (or an id that doesn't match a file), the app shows a list of all available projects. Each PRD's navigation has an "All projects" link back to the list.

## Project Structure

```text
src/
├── assets/          # App-level images
├── components/      # Reusable PRD components
├── content/
│   ├── projects/    # One JSON file per PRD
│   └── projects.js  # Loads every project JSON
├── App.jsx          # PRD page structure
├── App.css
├── index.css
└── main.jsx
```

## Components

The template uses reusable components for common PRD content, including:

- Navigation
- Header
- Sections
- Overview
- Text content
- Tables
- Ordered lists
- Commercial benefits
- Media / images

## PRD Structure

The template currently supports:

1. Overview
2. The Problem
3. The Solution
4. Scope
5. Timeline
6. Risks
7. Dependencies
8. Assumptions / Open Questions

Navigation links are generated from the configured sections and jump directly to the relevant part of the page.

## Editing Content

Project-specific content lives in the project's JSON file:

```text
src/content/projects/<project-id>.json
```

The React components control how that content is displayed, allowing the same design and structure to be reused across multiple PRDs.
