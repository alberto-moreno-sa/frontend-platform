import { cva } from "class-variance-authority";

/* ========== Input field ========== */

export const inputStyles = cva(
  [
    "flex",
    "w-full",
    "rounded-lg",
    "border",
    "border-border-primary",
    "bg-bg-primary",
    "text-text-primary",
    "font-body",
    "shadow-xs",
    "outline-none",
    "transition-colors",
    "placeholder:text-text-placeholder",
    "focus:ring-4",
  ],
  {
    variants: {
      size: {
        small: ["text-sm", "py-2", "px-3", "h-10"],
        medium: ["text-md", "py-2.5", "px-3.5", "h-11"],
        large: ["text-lg", "py-3", "px-4", "h-12"],
      },
      variant: {
        default: ["focus:border-brand-300", "focus:ring-focus-ring/24"],
        error: [
          "border-border-error_subtle",
          "focus:border-border-error",
          "focus:ring-focus-ring-error/24",
        ],
        success: [
          "border-border-brand",
          "focus:border-border-brand_alt",
          "focus:ring-focus-ring/24",
        ],
      },
      disabled: {
        false: null,
        true: [
          "bg-bg-disabled",
          "border-border-disabled",
          "text-text-disabled",
          "cursor-not-allowed",
          "pointer-events-none",
          "shadow-none",
          "focus:ring-0",
        ],
      },
    },
    defaultVariants: {
      size: "medium",
      variant: "default",
      disabled: false,
    },
  },
);

/* ========== Input wrapper (positions icons) ========== */

export const inputWrapperStyles = cva(["relative", "flex", "items-center", "w-full"]);

/* ========== Leading icon ========== */

export const inputIconStyles = cva(
  ["pointer-events-none", "absolute", "size-5", "text-fg-quaternary"],
  {
    variants: {
      size: {
        small: ["left-3"],
        medium: ["left-3.5"],
        large: ["left-4"],
      },
      disabled: {
        false: null,
        true: ["text-fg-disabled"],
      },
    },
    defaultVariants: { size: "medium", disabled: false },
  },
);

/* ========== Trailing icon (error) ========== */

export const inputTrailingIconStyles = cva(
  ["pointer-events-none", "absolute", "size-4", "text-fg-error-secondary"],
  {
    variants: {
      size: {
        small: ["right-3"],
        medium: ["right-3.5"],
        large: ["right-4"],
      },
    },
    defaultVariants: { size: "medium" },
  },
);

/* ========== Shortcut badge ========== */

export const inputShortcutStyles = cva(
  [
    "pointer-events-none",
    "absolute",
    "inset-y-0.5",
    "right-0.5",
    "z-10",
    "flex",
    "items-center",
    "rounded-r-[inherit]",
    "bg-gradient-to-r",
    "from-transparent",
    "to-bg-primary",
    "to-40%",
    "pl-8",
  ],
  {
    variants: {
      size: {
        small: ["pr-2"],
        medium: ["pr-2.5"],
        large: ["pr-3"],
      },
    },
    defaultVariants: { size: "medium" },
  },
);

export const inputShortcutBadgeStyles = cva([
  "pointer-events-none",
  "rounded",
  "px-1",
  "py-px",
  "text-xs",
  "font-medium",
  "text-text-quaternary",
  "ring-1",
  "ring-border-secondary",
  "select-none",
  "ring-inset",
]);

