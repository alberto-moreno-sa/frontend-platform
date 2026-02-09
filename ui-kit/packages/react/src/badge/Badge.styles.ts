import { cva } from "class-variance-authority";

export const badgeStyles = cva(
  [
    "inline-flex",
    "items-center",
    "rounded-full",
    "border",
    "font-semibold",
    "transition-colors",
    "focus:outline-none",
    "focus:ring-2",
    "focus:ring-ring",
    "focus:ring-offset-2",
  ],
  {
    variants: {
      intent: {
        default: ["bg-primary", "text-primary-foreground", "border-transparent"],
        secondary: ["bg-secondary", "text-secondary-foreground", "border-transparent"],
        destructive: ["bg-destructive", "text-destructive-foreground", "border-transparent"],
        outline: ["bg-transparent", "text-foreground", "border-border"],
        success: ["bg-success", "text-success-foreground", "border-transparent"],
        warning: ["bg-warning", "text-warning-foreground", "border-transparent"],
      },
      size: {
        small: ["text-xs", "px-2", "py-0.5"],
        medium: ["text-xs", "px-2.5", "py-0.5"],
        large: ["text-sm", "px-3", "py-1"],
      },
    },
    defaultVariants: {
      intent: "default",
      size: "medium",
    },
  },
);
