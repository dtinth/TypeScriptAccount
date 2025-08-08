# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Vue 3 + TypeScript application designed as a Grist widget. The app integrates with the Grist spreadsheet API to display record data in a formatted view.

## Key Architecture

- **Frontend Framework**: Vue 3 with Composition API and `<script setup>` syntax
- **Build Tool**: Vite for fast development and optimized builds
- **Package Manager**: Bun (preferred over npm/yarn)
- **Testing**: Vitest for unit tests, Playwright for E2E tests
- **Type System**: Full TypeScript with Vue-specific type definitions
- **Integration**: Grist API for receiving and displaying spreadsheet data

## Development Commands

Use Bun for all commands (not npm/yarn):

```bash
# Development
bun dev                    # Start dev server with hot reload
bun run build             # Build for production (includes type-check)
bun preview               # Preview production build

# Testing
bun test:unit             # Run all unit tests with Vitest
bun test:unit filename    # Run specific test file
bun test:e2e              # Run Playwright E2E tests

# Code Quality
bun lint                  # Run ESLint with auto-fix
bun format                # Format code with Prettier
bun run type-check        # TypeScript type checking only
```

## Grist Integration

The app connects to Grist's widget API through:
- Global `window.grist` object availability check
- `grist.ready()` to signal widget is loaded
- `grist.onRecord()` to receive data updates
- TypeScript definitions in `src/types/grist.d.ts`

The widget gracefully handles standalone mode when Grist API is not available.

## Code Structure

```
src/
├── App.vue           # Main component with Grist integration
├── main.ts           # Vue app bootstrap
├── types/
│   └── grist.d.ts    # Grist API type definitions
└── __tests__/        # Unit test files
```

## Development Notes

- Uses Bun as primary package manager (check bun.lock exists)
- Follows Vue 3 Composition API patterns with TypeScript
- All components should use `<script setup lang="ts">` syntax
- ESLint and Prettier are configured for consistent code style
- Vite handles module resolution with `@/*` aliases for src directory