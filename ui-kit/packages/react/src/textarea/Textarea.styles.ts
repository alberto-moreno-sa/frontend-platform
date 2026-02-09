import { cva } from "class-variance-authority";

/* ========== Textarea field ========== */

export const textareaStyles = cva(
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
    "resize-y",
    "placeholder:text-text-placeholder",
    "focus:ring-4",
  ],
  {
    variants: {
      size: {
        small: ["text-sm", "py-2", "px-3"],
        medium: ["text-md", "py-2.5", "px-3.5"],
        large: ["text-lg", "py-3", "px-4"],
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
          "resize-none",
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
