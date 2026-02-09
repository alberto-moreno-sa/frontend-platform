# @ui-kit

Librería de componentes React basada en el design system Untitled UI. Monorepo con Nx, Tailwind CSS v4 y CVA (class-variance-authority).

## Stack

| Tecnología | Uso |
| ---------- | --- |
| React 19 | Componentes con `forwardRef` |
| Tailwind CSS v4 | Estilos con directiva `@theme` (sin tailwind.config.js) |
| CVA | Variantes de estilo por componente |
| tailwind-merge | Resolución de clases conflictivas vía `cx` |
| Vite 6 | Build de librería (ES + CJS + tipos) |
| Storybook 8 | Documentación visual e interactiva |
| Jest + Testing Library | Tests unitarios y de interacción |
| Nx 22 | Orquestación del monorepo, cache, tasks |

## Paquetes

| Paquete | Descripción |
| ------- | ----------- |
| `@ui-kit/react` | Componentes React (Button, Input, Textarea, InputGroup, Card, Modal, Badge, DatePickerRange, Select) |
| `@ui-kit/styles` | Design tokens CSS (colores, tipografía, sombras, espaciado) |
| `@ui-kit/utils` | Utilidades (`cx` para merge de clases Tailwind) |

## Arquitectura

```text
ui-kit/
├── packages/
│   ├── react/                    # Componentes React
│   │   ├── src/
│   │   │   ├── _shared/          # Estilos y iconos compartidos entre componentes
│   │   │   ├── button/           # Button, CloseButton
│   │   │   ├── input/            # Input
│   │   │   ├── textarea/         # Textarea
│   │   │   ├── input-group/      # InputGroup, InputPrefix
│   │   │   ├── card/             # Card, CardImage, CardHeader, CardTitle, ...
│   │   │   ├── modal/            # Modal, ModalHeader, ModalIcon, ModalBody, ...
│   │   │   ├── badge/            # Badge
│   │   │   ├── date-picker-range/# DatePickerRange (react-day-picker + date-fns)
│   │   │   ├── select/           # Select, SelectItem, SelectGroup, SelectSeparator
│   │   │   └── index.ts          # Barrel export principal
│   │   ├── .storybook/           # Configuración de Storybook
│   │   ├── vite.config.ts        # Build de librería (10 entry points)
│   │   ├── jest.config.cjs       # Configuración de Jest
│   │   └── package.json
│   ├── styles/                   # Design tokens (CSS puro)
│   │   └── src/
│   │       ├── colors.css        # Paletas + tokens semánticos (text-*, bg-*, border-*, fg-*)
│   │       ├── typography.css    # Display + body font sizes
│   │       ├── shadows.css       # xs, sm, md, lg, xl, 2xl, 3xl
│   │       └── spacing.css       # Escala de espaciado
│   └── utils/                    # Utilidades compartidas
│       └── src/
│           └── cx.ts             # extendTailwindMerge con custom classGroups
├── nx.json                       # Plugins: @nx/vite, @nx/jest, @nx/storybook
├── package.json                  # Workspaces + scripts raíz
└── eslint.config.mjs
```

### Patrón por componente

Cada componente sigue la misma estructura:

```text
component/
├── Component.tsx          # Componente React (forwardRef, VariantProps)
├── Component.styles.ts    # Variantes CVA con tokens semánticos
├── Component.stories.tsx  # Stories de Storybook (autodocs)
├── Component.test.tsx     # Tests con @testing-library/react + userEvent
└── index.ts               # Barrel exports
```

- **Estilos**: CVA define variantes (`bg-bg-primary`, `text-text-secondary`, `border-border-primary`, etc.)
- **Componentes**: `forwardRef` + `VariantProps` de CVA + `cx()` para merge de clases
- **Tests**: `@testing-library/react` + `userEvent` para simular interacción
- **Stories**: Storybook con `autodocs`, `argTypes` para controles interactivos

## Componentes disponibles

| Componente | Variantes | Tamaños | Características |
| ---------- | --------- | ------- | --------------- |
| **Button** | primary, secondaryGray/Color, tertiaryGray/Color, linkGray/Color | sm, md, lg, xl, 2xl | destructive, loading, leadingIcon, trailingIcon, CloseButton |
| **Input** | default, error, success | small, medium, large | icon, tooltip, shortcut, isRequired, helperText |
| **Textarea** | default, error, success | small, medium, large | tooltip, isRequired, helperText, rows |
| **InputGroup** | - | small, medium, large | prefix, leadingAddon, trailingAddon, label, hint |
| **Card** | default, elevated, outline, ghost | default, sm | interactive, CardImage, CardHeader action slot |
| **Modal** | - | sm, md, lg | ModalIcon (5 colores), closeOnOverlayClick, Escape, X button |
| **Badge** | - | - | - |
| **DatePickerRange** | - | - | Calendar 2 meses, date inputs, Cancel/Apply, align, minDate/maxDate, i18n |
| **Select** | default, error, success | small, medium, large | keyboard nav, typeahead, groups, separators, controlled/uncontrolled |

## Setup

### Prerequisitos

- Node.js >= 18
- npm >= 9

### Instalación

```bash
cd ui-kit
npm install
```

## Storybook

Storybook permite navegar, probar y documentar los componentes visualmente.

```bash
# Desde la raíz del monorepo ui-kit
npx nx run @ui-kit/react:storybook

# O desde packages/react
cd packages/react && npm run storybook
```

Abre `http://localhost:6006` en el navegador. Cada componente tiene stories con controles interactivos y documentación automática.

## Tests

```bash
# Todos los tests (235 tests)
npm test

# Solo @ui-kit/react
npx nx test react

# Un componente específico
npx nx test react --testPathPattern="button/Button.test"
npx nx test react --testPathPattern="select/Select.test"
npx nx test react --testPathPattern="date-picker-range/DatePickerRange.test"

# Con cobertura (threshold: 80% branches, functions, lines, statements)
npx nx test react --coverage
```

## Build (compilar para usar en otros proyectos)

### Compilar todos los paquetes

```bash
npm run build
```

Nx ejecuta `nx run-many -t build` que compila los 3 paquetes en orden de dependencias: `utils` → `styles` → `react`.

### Compilar un paquete individual

```bash
npx nx run @ui-kit/react:vite:build
npx nx run @ui-kit/utils:vite:build
```

`@ui-kit/styles` no requiere compilación con Vite — concatena los CSS directamente.

### Salida del build

```text
packages/react/dist/
├── index.js / index.cjs              # Barrel (todos los componentes)
├── index.d.ts                        # Tipos TypeScript
├── button.js / button.cjs            # Subpath: @ui-kit/react/button
├── input.js / input.cjs              # Subpath: @ui-kit/react/input
├── textarea.js / textarea.cjs        # Subpath: @ui-kit/react/textarea
├── input-group.js / input-group.cjs  # Subpath: @ui-kit/react/input-group
├── card.js / card.cjs                # Subpath: @ui-kit/react/card
├── modal.js / modal.cjs              # Subpath: @ui-kit/react/modal
├── badge.js / badge.cjs              # Subpath: @ui-kit/react/badge
├── date-picker-range.js / .cjs       # Subpath: @ui-kit/react/date-picker-range
├── select.js / select.cjs            # Subpath: @ui-kit/react/select
└── style.css                         # Estilos compilados de Tailwind

packages/utils/dist/
├── utils.js / utils.cjs
└── index.d.ts

packages/styles/dist/
└── index.css                         # Todos los design tokens concatenados
```

Cada paquete genera **ES modules** (`.js`) y **CommonJS** (`.cjs`) con declaraciones TypeScript (`.d.ts`).

### Usar en otro proyecto

1. Instalar los paquetes (o hacer link local):

```bash
npm install @ui-kit/react @ui-kit/styles @ui-kit/utils
```

2. Importar los estilos en el CSS raíz del proyecto consumidor:

```css
@import "tailwindcss";
@import "@ui-kit/styles/index.css";
```

3. Usar los componentes:

```tsx
// Barrel import (tree-shakeable)
import { Button, Input, Modal, Select } from "@ui-kit/react";

// O subpath import (bundle más pequeño)
import { Button } from "@ui-kit/react/button";
import { Select, SelectItem } from "@ui-kit/react/select";
import { DatePickerRange } from "@ui-kit/react/date-picker-range";
```

4. Usar las utilidades:

```tsx
import { cx } from "@ui-kit/utils";

// cx resuelve clases Tailwind conflictivas
cx("px-4 py-2", "px-6"); // => "px-6 py-2"
```

## Desarrollo (watch mode)

Para recompilar automáticamente al guardar cambios:

```bash
npx nx run @ui-kit/react:dev
npx nx run @ui-kit/utils:dev
```

## Lint y formato

```bash
npm run lint            # ESLint en todos los paquetes
npm run format:check    # Verificar formato con Prettier
npm run format          # Aplicar formato con Prettier
```
