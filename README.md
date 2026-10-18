# PRD Template

A reusable React template for turning Product Requirements Documents into clean, responsive HTML microsites.

The template is designed so each PRD can be created as its own repository, with project-specific content separated from the reusable page structure and styling.

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

1. Create a new repository from this template.
2. Update the PRD content in `src/content/prd.js`.
3. Add any project-specific workflow diagrams, wireframes, or other images to `src/assets`.
4. Update the relevant image imports in `prd.js`.
5. Run the project locally with `npm run dev`.
6. Commit and publish the completed PRD.

## Project Structure

```text
src/
├── assets/          # Images, workflows and wireframes
├── components/      # Reusable PRD components
├── content/
│   └── prd.js       # Project-specific PRD content
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

Most project-specific content should be updated in:

```text
src/content/prd.js
```

The React components control how that content is displayed, allowing the same design and structure to be reused across multiple PRDs.
