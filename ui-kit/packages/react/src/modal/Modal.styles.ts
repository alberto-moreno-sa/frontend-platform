import { cva } from "class-variance-authority";

/* ========== Overlay / backdrop ========== */

export const overlayStyles = cva([
  "fixed",
  "inset-0",
  "z-50",
  "bg-bg-overlay/70",
  "backdrop-blur-sm",
]);

/* ========== Modal panel ========== */

export const modalStyles = cva(
  [
    "fixed",
    "z-50",
    "flex",
    "flex-col",
    "bg-bg-primary",
    "border",
    "border-border-secondary",
    "shadow-xl",
    "rounded-xl",
    "w-full",
    "max-h-[85vh]",
    "top-1/2",
    "left-1/2",
    "-translate-x-1/2",
    "-translate-y-1/2",
    "outline-none",
    "overflow-hidden",
  ],
  {
    variants: {
      size: {
        sm: ["max-w-sm"],
        md: ["max-w-lg"],
        lg: ["max-w-2xl"],
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

/* ========== Header ========== */

export const modalHeaderStyles = cva([
  "flex",
  "items-start",
  "justify-between",
  "gap-4",
  "px-6",
  "pt-6",
]);

/* ========== Header icon (featured icon slot) ========== */

export const modalIconStyles = cva(
  [
    "shrink-0",
    "inline-flex",
    "items-center",
    "justify-center",
    "rounded-full",
    "border",
  ],
  {
    variants: {
      variant: {
        brand: [
          "bg-brand-50",
          "border-brand-100",
          "text-brand-600",
        ],
        success: [
          "bg-success-50",
          "border-success-100",
          "text-success-600",
        ],
        error: [
          "bg-error-50",
          "border-error-100",
          "text-error-600",
        ],
        warning: [
          "bg-warning-50",
          "border-warning-100",
          "text-warning-600",
        ],
        gray: [
          "bg-gray-50",
          "border-gray-100",
          "text-gray-600",
        ],
      },
      size: {
        sm: ["size-10", "p-2"],
        md: ["size-12", "p-3"],
      },
    },
    defaultVariants: {
      variant: "brand",
      size: "md",
    },
  },
);

/* ========== Title ========== */

export const modalTitleStyles = cva([
  "text-lg",
  "font-semibold",
  "leading-tight",
  "text-text-primary",
]);

/* ========== Description ========== */

export const modalDescriptionStyles = cva([
  "text-sm",
  "text-text-tertiary",
  "mt-1",
]);

/* ========== Body ========== */

export const modalBodyStyles = cva([
  "flex-1",
  "overflow-y-auto",
  "px-6",
  "py-5",
]);

/* ========== Footer ========== */

export const modalFooterStyles = cva([
  "flex",
  "items-center",
  "gap-3",
  "px-6",
  "pb-6",
]);

/* ========== Divider ========== */

export const modalDividerStyles = cva([
  "border-t",
  "border-border-secondary",
  "w-full",
]);

/* ========== Close button ========== */

export const modalCloseButtonStyles = cva([
  "inline-flex",
  "items-center",
  "justify-center",
  "shrink-0",
  "rounded-lg",
  "size-9",
  "p-2",
  "text-fg-quaternary",
  "cursor-pointer",
  "transition-colors",
  "outline-none",
  "hover:bg-bg-primary_hover",
  "hover:text-fg-secondary",
  "focus-visible:ring-4",
  "focus-visible:ring-gray-100/80",
]);
