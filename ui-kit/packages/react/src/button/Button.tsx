import * as React from "react";
import type { VariantProps } from "class-variance-authority";
import { cx } from "@ahiggs-ui/utils";
import {
  buttonStyles,
  buttonIconStyles,
  buttonSpinnerStyles,
  closeButtonStyles,
  closeButtonIconStyles,
} from "./Button.styles";

/* ========== Button ========== */

export interface ButtonProps
  extends
    Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "disabled">,
    Omit<VariantProps<typeof buttonStyles>, "iconOnly"> {
  children?: React.ReactNode;
  /** Leading icon component (e.g. from Lucide, Heroicons, @untitledui/icons). */
  leadingIcon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  /** Trailing icon component. */
  trailingIcon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  /** Show loading spinner and optional loading text. Disables interaction. */
  loading?: boolean;
  /** Text to display while loading (e.g. "Submitting..."). Falls back to children. */
  loadingText?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      destructive,
      disabled = false,
      loading = false,
      loadingText,
      children,
      leadingIcon: LeadingIcon,
      trailingIcon: TrailingIcon,
      ...props
    },
    ref,
  ) => {
    const isDisabled = !!disabled || loading;
    const iconOnly = !children && !loadingText && (!!LeadingIcon || !!TrailingIcon);

    return (
      <button
        className={cx(
          buttonStyles({
            variant,
            size,
            destructive: !!destructive,
            iconOnly,
            disabled: isDisabled,
          }),
          className,
        )}
        ref={ref}
        disabled={isDisabled}
        aria-busy={loading || undefined}
        {...props}
      >
        {loading && (
          <LoadingSpinner
            className={cx(buttonSpinnerStyles({ size }))}
            aria-hidden="true"
          />
        )}

        {!loading && LeadingIcon && (
          <LeadingIcon
            aria-hidden="true"
            className={cx(buttonIconStyles({ size }))}
          />
        )}

        {loading ? (loadingText || children) : children}

        {!loading && TrailingIcon && (
          <TrailingIcon
            aria-hidden="true"
            className={cx(buttonIconStyles({ size }))}
          />
        )}
      </button>
    );
  },
);

Button.displayName = "Button";

/* ========== CloseButton ========== */

export interface CloseButtonProps
  extends
    Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "disabled">,
    VariantProps<typeof closeButtonStyles> {
  /** Accessible label for the close button. */
  "aria-label"?: string;
}

const CloseButton = React.forwardRef<HTMLButtonElement, CloseButtonProps>(
  ({ className, size, disabled = false, "aria-label": ariaLabel = "Close", ...props }, ref) => (
    <button
      className={cx(closeButtonStyles({ size, disabled: !!disabled }), className)}
      ref={ref}
      disabled={!!disabled}
      aria-label={ariaLabel}
      {...props}
    >
      <CloseIcon className={cx(closeButtonIconStyles({ size }))} aria-hidden="true" />
    </button>
  ),
);

CloseButton.displayName = "CloseButton";

export { Button, CloseButton };

/* ========== Inline SVG icons ========== */

const LoadingSpinner = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    {...props}
  >
    <path d="M10 2a8 8 0 0 1 8 8" opacity="1" />
    <path d="M10 2a8 8 0 1 0 8 8" opacity="0.25" />
  </svg>
);

const CloseIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);
