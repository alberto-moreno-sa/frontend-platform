import { cva } from "class-variance-authority";

/* ========== Trigger button ========== */
export const datePickerTriggerStyles = cva(
  [
    "inline-flex",
    "items-center",
    "gap-2",
    "rounded-lg",
    "border",
    "border-border-primary",
    "bg-bg-primary",
    "text-text-primary",
    "text-sm",
    "font-medium",
    "shadow-xs",
    "cursor-pointer",
    "transition-colors",
    "outline-none",
    "px-3.5",
    "py-2.5",
    "hover:bg-bg-primary_hover",
    "focus-visible:ring-4",
    "focus-visible:ring-focus-ring/24",
    "focus-visible:border-brand-300",
  ],
  {
    variants: {
      open: {
        false: null,
        true: ["ring-4", "ring-focus-ring/24", "border-brand-300"],
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
        ],
      },
      hasValue: {
        false: ["text-text-placeholder"],
        true: null,
      },
    },
    defaultVariants: { open: false, disabled: false, hasValue: false },
  },
);

/* ========== Trigger icon ========== */
export const datePickerTriggerIconStyles = cva([
  "size-5",
  "shrink-0",
  "text-fg-quaternary",
]);

/* ========== Popover container ========== */
export const datePickerPopoverStyles = cva(
  [
    "absolute",
    "z-50",
    "mt-1",
    "flex",
    "flex-col",
    "bg-bg-primary",
    "border",
    "border-border-secondary",
    "rounded-xl",
    "shadow-lg",
    "overflow-hidden",
  ],
  {
    variants: {
      align: {
        start: ["left-0"],
        center: ["left-1/2", "-translate-x-1/2"],
        end: ["right-0"],
      },
    },
    defaultVariants: { align: "start" },
  },
);

/* ========== Date inputs row ========== */
export const datePickerInputRowStyles = cva([
  "flex",
  "items-center",
  "gap-2",
  "px-4",
  "py-3",
  "border-t",
  "border-border-secondary",
]);

export const datePickerDateInputStyles = cva(
  [
    "flex",
    "w-full",
    "rounded-lg",
    "border",
    "border-border-primary",
    "bg-bg-primary",
    "text-text-primary",
    "text-sm",
    "shadow-xs",
    "outline-none",
    "transition-colors",
    "px-3",
    "py-2",
    "h-10",
    "placeholder:text-text-placeholder",
    "focus:border-brand-300",
    "focus:ring-4",
    "focus:ring-focus-ring/24",
  ],
  {
    variants: {
      hasError: {
        false: null,
        true: [
          "border-error-300",
          "focus:border-error-300",
          "focus:ring-error-100/24",
        ],
      },
    },
    defaultVariants: { hasError: false },
  },
);

export const datePickerInputSeparatorStyles = cva([
  "text-text-quaternary",
  "text-sm",
  "shrink-0",
]);

/* ========== Footer (Cancel / Apply) ========== */
export const datePickerFooterStyles = cva([
  "flex",
  "items-center",
  "justify-end",
  "gap-3",
  "px-4",
  "py-3",
  "border-t",
  "border-border-secondary",
]);
