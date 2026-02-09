import { cva } from "class-variance-authority";

/* ========== Label ========== */

export const labelStyles = cva([
  "flex",
  "cursor-default",
  "items-center",
  "gap-0.5",
  "text-sm",
  "font-medium",
  "text-text-secondary",
]);

export const requiredIndicatorStyles = cva(["text-brand-tertiary"]);

export const labelTooltipStyles = cva([
  "inline-flex",
  "cursor-help",
  "text-fg-quaternary",
  "ml-0.5",
]);

/* ========== Helper text ========== */

export const helperTextStyles = cva(["text-sm", "text-text-tertiary"], {
  variants: {
    variant: {
      default: ["text-text-tertiary"],
      error: ["text-text-error-primary"],
      success: ["text-text-success-primary"],
    },
  },
  defaultVariants: {
    variant: "default",
  },
});
