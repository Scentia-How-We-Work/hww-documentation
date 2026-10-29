# hww-documentation: specification

Source of truth for behaviour. Update it in the same PR as any behaviour change.

## Goals

Renders Product Requirements Documents (PRDs) as clean, responsive microsites. Each PRD is a JSON file in `src/content/projects/`; the app lists them all and shows one at `/?project=<id>`. Used by Scentia How We Work to publish and share PRDs.

## Users

## Features

- **Project list** at `/`: every PRD, sorted by page title, with its team and target delivery. An
  unknown `?project=` id shows the list with a "No project found" message.
- **PRD page** at `/?project=<id>`: eight numbered sections (Overview, The Problem, The Solution,
  Scope, Timeline, Risks, Dependencies, Assumptions) with side navigation.
- **Media:** the Workflows and Wireframes items in The Solution are each either an image or a link
  card. Images are shown full width; link cards are shown in a grid and open their link in a new tab.
- **Levels:** table cells reading Low, Medium or High (any case) show as coloured tags.
- **Theme:** light, dark or system, remembered in `localStorage`.

## Integrations

None. Link cards point at external pages (for example the mock-ups on
https://scentia-aim.github.io/HWW-Mock-Ups/) but nothing is fetched from them.

## Data

One JSON file per PRD in `src/content/projects/`, bundled at build time. The file name is the
project id. The shape is the `Prd` type in `src/lib/types.ts`; `template.json` is a blank example.
A media item is an image (`{ "image", "alt" }`) or a link card (`{ "link", "title", "description" }`).

## Non-goals

## Open questions
