import { cva } from "class-variance-authority";

/* ========== Trigger button ========== */

export const selectTriggerStyles = cva(
  [
    "flex",
    "w-full",
    "items-center",
    "justify-between",
    "gap-2",
    "rounded-lg",
    "border",
    "border-border-primary",
    "bg-bg-primary",
    "text-text-primary",
    "font-body",
    "shadow-xs",
    "outline-none",
    "transition-colors",
    "cursor-pointer",
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
      open: {
        false: null,
        true: ["ring-4", "ring-focus-ring/24", "border-brand-300"],
      },
    },
    compoundVariants: [
      {
        open: true,
        variant: "error",
        class: ["ring-focus-ring-error/24", "border-border-error"],
      },
      {
        open: true,
        variant: "success",
        class: ["ring-focus-ring/24", "border-border-brand_alt"],
      },
    ],
    defaultVariants: {
      size: "medium",
      variant: "default",
      disabled: false,
      open: false,
    },
  },
);

/* ========== Chevron icon ========== */

export const selectChevronStyles = cva(
  [
    "size-5",
    "shrink-0",
    "text-fg-quaternary",
    "transition-transform",
    "duration-200",
  ],
  {
    variants: {
      open: {
        false: null,
        true: ["rotate-180"],
      },
      disabled: {
        false: null,
        true: ["text-fg-disabled"],
      },
    },
    defaultVariants: { open: false, disabled: false },
  },
);

/* ========== Dropdown listbox ========== */

export const selectDropdownStyles = cva([
  "absolute",
  "z-50",
  "mt-1",
  "w-full",
  "bg-bg-primary",
  "border",
  "border-border-secondary",
  "rounded-lg",
  "shadow-lg",
  "overflow-hidden",
  "py-1",
]);

/* ========== Scrollable inner ========== */

export const selectDropdownInnerStyles = cva(["max-h-60", "overflow-y-auto"]);

/* ========== Item ========== */

export const selectItemStyles = cva(
  [
    "flex",
    "items-center",
    "justify-between",
    "w-full",
    "px-3.5",
    "py-2.5",
    "text-sm",
    "text-text-primary",
    "cursor-pointer",
    "transition-colors",
    "outline-none",
  ],
  {
    variants: {
      highlighted: {
        false: null,
        true: ["bg-bg-primary_hover"],
      },
      selected: {
        false: null,
        true: null,
      },
      disabled: {
        false: null,
        true: [
          "text-text-disabled",
          "cursor-not-allowed",
          "pointer-events-none",
        ],
      },
    },
    defaultVariants: { highlighted: false, selected: false, disabled: false },
  },
);

/* ========== Group label ========== */

export const selectGroupLabelStyles = cva([
  "px-3.5",
  "py-2",
  "text-xs",
  "font-medium",
  "text-text-tertiary",
  "select-none",
]);

/* ========== Separator ========== */

export const selectSeparatorStyles = cva([
  "border-t",
  "border-border-secondary",
  "my-1",
]);
