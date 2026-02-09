import { cva } from "class-variance-authority";

/* ========== Button ========== */

export const buttonStyles = cva(
  [
    "inline-flex",
    "items-center",
    "justify-center",
    "whitespace-nowrap",
    "font-semibold",
    "rounded-lg",
    "border",
    "transition-colors",
    "outline-none",
    "cursor-pointer",
    "focus-visible:ring-4",
  ],
  {
    variants: {
      variant: {
        primary: [
          "bg-brand-600",
          "text-white",
          "border-brand-600",
          "shadow-xs",
          "hover:bg-brand-700",
          "hover:border-brand-700",
          "focus-visible:ring-brand-500/24",
        ],
        secondaryGray: [
          "bg-bg-primary",
          "text-fg-secondary",
          "border-border-primary",
          "shadow-xs",
          "hover:bg-bg-primary_hover",
          "hover:text-fg-secondary",
          "focus-visible:ring-gray-100/80",
        ],
        secondaryColor: [
          "bg-bg-primary",
          "text-brand-700",
          "border-brand-300",
          "shadow-xs",
          "hover:bg-brand-50",
          "hover:text-brand-800",
          "focus-visible:ring-brand-500/24",
        ],
        tertiaryGray: [
          "bg-transparent",
          "text-fg-tertiary",
          "border-transparent",
          "hover:bg-bg-primary_hover",
          "hover:text-fg-secondary",
          "focus-visible:ring-gray-100/80",
        ],
        tertiaryColor: [
          "bg-transparent",
          "text-brand-700",
          "border-transparent",
          "hover:bg-brand-50",
          "hover:text-brand-800",
          "focus-visible:ring-brand-500/24",
        ],
        linkGray: [
          "bg-transparent",
          "text-fg-tertiary",
          "border-transparent",
          "hover:text-fg-secondary",
          "focus-visible:ring-gray-100/80",
        ],
        linkColor: [
          "bg-transparent",
          "text-brand-700",
          "border-transparent",
          "hover:text-brand-800",
          "focus-visible:ring-brand-500/24",
        ],
      },
      size: {
        sm: ["text-sm", "py-2", "px-3", "gap-1", "h-9"],
        md: ["text-sm", "py-2.5", "px-4", "gap-1.5", "h-10"],
        lg: ["text-md", "py-2.5", "px-[18px]", "gap-1.5", "h-11"],
        xl: ["text-md", "py-3", "px-5", "gap-1.5", "h-12"],
        "2xl": ["text-lg", "py-4", "px-7", "gap-2.5", "h-[60px]"],
      },
      destructive: {
        false: null,
        true: null,
      },
      iconOnly: {
        false: null,
        true: ["p-0"],
      },
      disabled: {
        false: null,
        true: ["pointer-events-none", "cursor-not-allowed"],
      },
    },
    compoundVariants: [
      /* ---- Destructive overrides ---- */
      {
        variant: "primary",
        destructive: true,
        class: [
          "bg-error-600",
          "text-white",
          "border-error-600",
          "hover:bg-error-700",
          "hover:border-error-700",
          "focus-visible:ring-error-500/24",
        ],
      },
      {
        variant: "secondaryGray",
        destructive: true,
        class: [
          "text-error-700",
          "hover:bg-error-50",
          "hover:text-error-800",
          "focus-visible:ring-error-500/24",
        ],
      },
      {
        variant: "secondaryColor",
        destructive: true,
        class: [
          "text-error-700",
          "border-error-300",
          "hover:bg-error-50",
          "hover:text-error-800",
          "focus-visible:ring-error-500/24",
        ],
      },
      {
        variant: "tertiaryGray",
        destructive: true,
        class: [
          "text-error-700",
          "hover:bg-error-50",
          "hover:text-error-800",
          "focus-visible:ring-error-500/24",
        ],
      },
      {
        variant: "tertiaryColor",
        destructive: true,
        class: [
          "text-error-700",
          "hover:bg-error-50",
          "hover:text-error-800",
          "focus-visible:ring-error-500/24",
        ],
      },
      {
        variant: "linkGray",
        destructive: true,
        class: [
          "text-error-700",
          "hover:text-error-800",
          "focus-visible:ring-error-500/24",
        ],
      },
      {
        variant: "linkColor",
        destructive: true,
        class: [
          "text-error-700",
          "hover:text-error-800",
          "focus-visible:ring-error-500/24",
        ],
      },

      /* ---- Disabled overrides ---- */
      {
        variant: "primary",
        disabled: true,
        class: "bg-bg-disabled border-border-disabled text-fg-disabled shadow-none",
      },
      {
        variant: "secondaryGray",
        disabled: true,
        class: "border-border-disabled text-fg-disabled shadow-none",
      },
      {
        variant: "secondaryColor",
        disabled: true,
        class: "border-border-disabled text-fg-disabled shadow-none",
      },
      {
        variant: "tertiaryGray",
        disabled: true,
        class: "text-fg-disabled",
      },
      {
        variant: "tertiaryColor",
        disabled: true,
        class: "text-fg-disabled",
      },
      {
        variant: "linkGray",
        disabled: true,
        class: "text-fg-disabled",
      },
      {
        variant: "linkColor",
        disabled: true,
        class: "text-fg-disabled",
      },

      /* ---- Destructive + disabled overrides ---- */
      {
        destructive: true,
        disabled: true,
        class: "bg-bg-disabled border-border-disabled text-fg-disabled shadow-none",
      },

      /* ---- Icon-only size overrides ---- */
      { iconOnly: true, size: "sm", class: "w-9 h-9 px-0 py-0" },
      { iconOnly: true, size: "md", class: "w-10 h-10 px-0 py-0" },
      { iconOnly: true, size: "lg", class: "w-11 h-11 px-0 py-0" },
      { iconOnly: true, size: "xl", class: "w-12 h-12 px-0 py-0" },
      { iconOnly: true, size: "2xl", class: "w-14 h-14 px-0 py-0" },
    ],
    defaultVariants: {
      variant: "primary",
      size: "md",
      destructive: false,
      iconOnly: false,
      disabled: false,
    },
  },
);

/* ========== Button icon ========== */

export const buttonIconStyles = cva(["shrink-0"], {
  variants: {
    size: {
      sm: ["size-5"],
      md: ["size-5"],
      lg: ["size-5"],
      xl: ["size-5"],
      "2xl": ["size-6"],
    },
  },
  defaultVariants: { size: "md" },
});

/* ========== Loading spinner wrapper ========== */

export const buttonSpinnerStyles = cva(
  ["animate-spin", "shrink-0"],
  {
    variants: {
      size: {
        sm: ["size-5"],
        md: ["size-5"],
        lg: ["size-5"],
        xl: ["size-5"],
        "2xl": ["size-6"],
      },
    },
    defaultVariants: { size: "md" },
  },
);

/* ========== Close button ========== */

export const closeButtonStyles = cva(
  [
    "inline-flex",
    "items-center",
    "justify-center",
    "rounded-lg",
    "border",
    "border-transparent",
    "bg-transparent",
    "text-fg-quaternary",
    "transition-colors",
    "outline-none",
    "cursor-pointer",
    "hover:bg-bg-primary_hover",
    "hover:text-fg-secondary",
    "focus-visible:ring-4",
    "focus-visible:ring-gray-100/80",
  ],
  {
    variants: {
      size: {
        sm: ["size-9", "p-2"],
        md: ["size-10", "p-2.5"],
        lg: ["size-11", "p-3"],
      },
      disabled: {
        false: null,
        true: ["pointer-events-none", "cursor-not-allowed", "text-fg-disabled"],
      },
    },
    defaultVariants: {
      size: "md",
      disabled: false,
    },
  },
);

export const closeButtonIconStyles = cva(["shrink-0"], {
  variants: {
    size: {
      sm: ["size-5"],
      md: ["size-5"],
      lg: ["size-5"],
    },
  },
  defaultVariants: { size: "md" },
});
