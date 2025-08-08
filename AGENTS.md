# Agent Configuration for TypeScriptAccount

## Build/Lint/Test Commands

- **Development server**: `bun dev`
- **Build for production**: `bun run build`
- **Run unit tests**: `bun test:unit`
- **Run single unit test file**: `bun test:unit src/__tests__/filename.spec.ts`
- **Run end-to-end tests**: `bun test:e2e`
- **Lint and fix**: `bun lint`
- **Format code**: `bun format`
- **Type checking**: `bun run type-check`

## Code Style Guidelines

### Imports

- Use absolute imports with `@/*` alias for src directory
- Group imports: built-in, external, internal, type-only imports at bottom
- Use named imports when possible

### Formatting

- Single quotes for strings
- No semicolons
- Print width: 100 characters
- Use Prettier for automatic formatting

### Types

- Use TypeScript for all JavaScript code
- Leverage Vue's type inference where possible
- Define explicit types for function parameters and return values
- Use interfaces for object shapes

### Naming Conventions

- Use PascalCase for components and types
- Use camelCase for variables and functions
- Use UPPER_SNAKE_CASE for constants

### Error Handling

- Handle promises with async/await and try/catch
- Use Vue's error handling mechanisms for component errors
- Validate props with required types

### Vue-Specific

- Use Composition API with `<script setup>` syntax
- Follow Vue 3 best practices
- Use TypeScript in Vue components
