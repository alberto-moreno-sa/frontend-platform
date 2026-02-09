import { cva } from "class-variance-authority";

/* ========== InputGroup wrapper ========== */

export const inputGroupWrapperStyles = cva([
  "relative",
  "flex",
  "w-full",
  "flex-row",
  "items-stretch",
  "rounded-lg",
]);

/* ========== InputPrefix (text addon like "https://") ========== */

export const inputPrefixStyles = cva(
  [
    "flex",
    "items-center",
    "text-text-tertiary",
    "bg-bg-secondary_subtle",
    "border",
    "border-border-primary",
  ],
  {
    variants: {
      position: {
        leading: ["rounded-l-lg", "-mr-px"],
        trailing: ["rounded-r-lg", "-ml-px"],
      },
      size: {
        small: ["px-3", "py-2", "text-sm"],
        medium: ["px-3.5", "py-2.5", "text-md"],
        large: ["px-4", "py-3", "text-lg"],
      },
      disabled: {
        false: null,
        true: ["text-text-disabled", "bg-bg-disabled"],
      },
    },
    defaultVariants: { position: "leading", size: "medium", disabled: false },
  },
);
