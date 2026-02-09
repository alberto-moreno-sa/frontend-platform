# @ui-kit

React component library based on the Untitled UI design system. Monorepo powered by Nx, Tailwind CSS v4, and CVA (class-variance-authority).

## Packages

| Package | Description |
|---------|-------------|
| `@ui-kit/react` | React components (Button, Input, Textarea, InputGroup, Card, Modal, Badge) |
| `@ui-kit/styles` | CSS design tokens (colors, typography, shadows, spacing) |
| `@ui-kit/utils` | Utilities (`cx` for Tailwind class merging, `sortCx`) |

## Requirements

- Node.js >= 18
- npm >= 9

## Installation

```bash
npm install
```

## Development

### Storybook

To visually develop and browse components:

```bash
# From the monorepo root
npx nx run @ui-kit/react:storybook

# Or from packages/react
cd packages/react && npm run storybook
```

Opens <http://localhost:6006> in the browser.

### Watch mode (auto-rebuild)

```bash
npx nx run @ui-kit/react:dev
npx nx run @ui-kit/utils:dev
```

### Tests

```bash
# All tests
npm test

# Only @ui-kit/react
npx nx test react

# A specific component
npx nx test react --testPathPattern="button/Button.test"
npx nx test react --testPathPattern="modal/Modal.test"
npx nx test react --testPathPattern="textarea/Textarea.test"
npx nx test react --testPathPattern="input-group/InputGroup.test"

# With coverage
npx nx run @ui-kit/react:test:coverage
```

### Lint and format

```bash
# Lint
npm run lint

# Check formatting
npm run format:check

# Apply formatting
npm run format
```

## Build

### Build all packages

```bash
npm run build
```

### Build a single package

```bash
npx nx run @ui-kit/react:vite:build
npx nx run @ui-kit/utils:vite:build
```

`@ui-kit/styles` requires no build step (it exports CSS directly).

### Build output

After `npm run build`, each package generates its `dist/`:

```
packages/react/dist/
  index.js / index.cjs        # Barrel (all components)
  index.d.ts                   # TypeScript types
  button.js / button.cjs       # Subpath: @ui-kit/react/button
  input.js / input.cjs         # Subpath: @ui-kit/react/input
  textarea.js / textarea.cjs   # Subpath: @ui-kit/react/textarea
  input-group.js / ...         # Subpath: @ui-kit/react/input-group
  card.js / card.cjs           # Subpath: @ui-kit/react/card
  modal.js / modal.cjs         # Subpath: @ui-kit/react/modal
  badge.js / badge.cjs         # Subpath: @ui-kit/react/badge

packages/utils/dist/
  utils.js / utils.cjs
  index.d.ts
```

## Usage

### Styles

```css
/* In your main CSS file */
@import "@ui-kit/styles";
```

### Components

```tsx
// Import from the barrel (tree-shakeable)
import { Button, Input, Modal } from "@ui-kit/react";

// Or import via subpath (smaller bundle)
import { Button } from "@ui-kit/react/button";
import { Input } from "@ui-kit/react/input";
import { Textarea } from "@ui-kit/react/textarea";
import { InputGroup, InputPrefix } from "@ui-kit/react/input-group";
import { Card, CardHeader, CardTitle } from "@ui-kit/react/card";
import { Modal, ModalHeader, ModalBody } from "@ui-kit/react/modal";
import { Badge } from "@ui-kit/react/badge";
```

### Utilities

```tsx
import { cx } from "@ui-kit/utils";

// cx resolves conflicting Tailwind classes
cx("px-4 py-2", "px-6"); // => "px-6 py-2"
```

## Project structure

```
ui-kit/
  packages/
    react/
      src/
        _shared/           # Shared styles and icons across components
        button/            # Button, CloseButton
        input/             # Input
        textarea/          # Textarea
        input-group/       # InputGroup, InputPrefix
        card/              # Card, CardImage, CardHeader, ...
        modal/             # Modal, ModalHeader, ModalIcon, ...
        badge/             # Badge
        index.ts           # Main barrel export
      vite.config.ts
      package.json
    styles/
      src/
        index.css          # Imports all tokens
        colors.css         # Color tokens (brand, error, gray, semantic)
        typography.css     # Typography
        shadows.css        # Shadows (xs to 3xl)
        spacing.css        # Spacing
      package.json
    utils/
      src/
        cx.ts              # extendTailwindMerge + sortCx
        index.ts
      vite.config.ts
      package.json
  nx.json
  package.json
```

## Component pattern

Every component follows the same structure:

```
component/
  Component.tsx          # React component (forwardRef)
  Component.styles.ts    # CVA variants with semantic tokens
  Component.stories.tsx  # Storybook stories
  Component.test.tsx     # Tests with @testing-library/react
  index.ts               # Barrel exports
```

## Available components

| Component | Variants | Sizes | Features |
| --------- | -------- | ----- | -------- |
| **Button** | primary, secondaryGray/Color, tertiaryGray/Color, linkGray/Color | sm, md, lg, xl, 2xl | destructive, loading, leadingIcon, trailingIcon, CloseButton |
| **Input** | default, error, success | small, medium, large | icon, tooltip, shortcut, isRequired, helperText |
| **Textarea** | default, error, success | small, medium, large | tooltip, isRequired, helperText, rows |
| **InputGroup** | - | small, medium, large | prefix, leadingAddon, trailingAddon, label, hint |
| **Card** | default, elevated, outline, ghost | default, sm | interactive, CardImage, CardHeader action slot |
| **Modal** | - | sm, md, lg | ModalIcon (5 colors), closeOnOverlayClick, Escape, X button |
| **Badge** | - | - | - |

## Tech stack

- **React 19** with `forwardRef`
- **Tailwind CSS v4** with `@theme` directive (no tailwind.config.js)
- **CVA** (class-variance-authority) for style variants
- **tailwind-merge** (via `cx`) for resolving class conflicts
- **Vite** for builds (ES + CJS)
- **Storybook 8** for visual documentation
- **Jest** + **@testing-library/react** for testing
- **Nx** for monorepo orchestration
