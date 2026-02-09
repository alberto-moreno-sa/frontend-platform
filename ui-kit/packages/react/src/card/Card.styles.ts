import { cva } from "class-variance-authority";

/* ========== Card root ========== */

export const cardStyles = cva(
  [
    "rounded-xl",
    "bg-bg-primary",
    "text-text-primary",
    "transition-shadow",
    "outline-none",
    "overflow-hidden",
  ],
  {
    variants: {
      variant: {
        default: ["border", "border-border-secondary", "shadow-xs"],
        elevated: ["border", "border-border-secondary", "shadow-md"],
        outline: ["border", "border-border-primary", "shadow-none"],
        ghost: ["border-transparent", "shadow-none"],
      },
      size: {
        default: [],
        sm: [],
      },
      interactive: {
        false: null,
        true: [
          "cursor-pointer",
          "hover:shadow-md",
          "focus-visible:ring-4",
          "focus-visible:ring-focus-ring/24",
        ],
      },
    },
    compoundVariants: [
      {
        variant: "elevated",
        interactive: true,
        class: "hover:shadow-lg",
      },
    ],
    defaultVariants: {
      variant: "default",
      size: "default",
      interactive: false,
    },
  },
);

/* ========== Card image ========== */

export const cardImageStyles = cva(["w-full", "object-cover"], {
  variants: {
    position: {
      top: [],
      bottom: [],
    },
    height: {
      sm: ["h-32"],
      md: ["h-48"],
      lg: ["h-64"],
      auto: ["h-auto"],
    },
  },
  defaultVariants: {
    position: "top",
    height: "md",
  },
});

/* ========== Card header ========== */

export const cardHeaderStyles = cva(
  ["flex", "flex-col", "gap-1"],
  {
    variants: {
      size: {
        default: ["px-6", "pt-6"],
        sm: ["px-4", "pt-4"],
      },
      hasAction: {
        false: null,
        true: ["flex-row", "items-start", "justify-between"],
      },
    },
    defaultVariants: { size: "default", hasAction: false },
  },
);

/* ========== Card action (top-right slot in header) ========== */

export const cardActionStyles = cva(["ml-auto", "shrink-0"]);

/* ========== Card title ========== */

export const cardTitleStyles = cva(
  ["font-semibold", "leading-tight", "text-text-primary"],
  {
    variants: {
      size: {
        default: ["text-lg"],
        sm: ["text-md"],
      },
    },
    defaultVariants: { size: "default" },
  },
);

/* ========== Card description ========== */

export const cardDescriptionStyles = cva(
  ["text-text-tertiary"],
  {
    variants: {
      size: {
        default: ["text-sm"],
        sm: ["text-xs"],
      },
    },
    defaultVariants: { size: "default" },
  },
);

/* ========== Card content (body) ========== */

export const cardContentStyles = cva([], {
  variants: {
    size: {
      default: ["px-6", "py-5"],
      sm: ["px-4", "py-3"],
    },
  },
  defaultVariants: { size: "default" },
});

/* ========== Card footer ========== */

export const cardFooterStyles = cva(
  ["flex", "items-center", "gap-3"],
  {
    variants: {
      size: {
        default: ["px-6", "pb-6"],
        sm: ["px-4", "pb-4"],
      },
    },
    defaultVariants: { size: "default" },
  },
);

/* ========== Card divider ========== */

export const cardDividerStyles = cva([
  "border-t",
  "border-border-secondary",
  "w-full",
]);
