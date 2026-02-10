import * as React from "react";
import type { VariantProps } from "class-variance-authority";
import { cx } from "@ahiggs-ui/utils";
import {
  inputStyles,
  inputWrapperStyles,
  inputIconStyles,
  inputTrailingIconStyles,
  inputShortcutStyles,
  inputShortcutBadgeStyles,
} from "./Input.styles";
import {
  labelStyles,
  labelTooltipStyles,
  requiredIndicatorStyles,
  helperTextStyles,
} from "../_shared/form-field.styles";
import { HelpCircleIcon } from "../_shared/icons";

export interface InputProps
  extends
    Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "disabled">,
    VariantProps<typeof inputStyles> {
  /** Label text above the input. */
  label?: string;
  /** Helper/hint text below the input. */
  helperText?: string;
  /** Leading icon component (e.g. from Lucide, Heroicons, @untitledui/icons). */
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  /** Tooltip text shown via native title attribute on a help icon next to the label. */
  tooltip?: string;
  /** Keyboard shortcut to display. Pass `true` for default "⌘K", or a custom string. */
  shortcut?: string | boolean;
  /** Mark the field as required (shows asterisk on label). */
  isRequired?: boolean;
  /** Hide required indicator even when `isRequired` is true. */
  hideRequiredIndicator?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      size,
      variant,
      disabled = false,
      label,
      helperText,
      id,
      icon: Icon,
      tooltip,
      shortcut,
      isRequired,
      hideRequiredIndicator,
      ...props
    },
    ref,
  ) => {
    const inputId = id || React.useId();
    const isError = variant === "error";
    const hasLeadingIcon = !!Icon;

    const iconPadding = cx(
      hasLeadingIcon && (size === "small" ? "pl-10" : size === "large" ? "pl-12" : "pl-11"),
      (isError || shortcut) && (size === "small" ? "pr-10" : size === "large" ? "pr-12" : "pr-11"),
    );

    return (
      <div className="flex w-full flex-col items-start gap-1.5">
        {label && (
          <label htmlFor={inputId} className={cx(labelStyles())}>
            {label}
            {isRequired && !hideRequiredIndicator && (
              <span className={cx(requiredIndicatorStyles())}>*</span>
            )}
            {tooltip && (
              <span
                className={cx(labelTooltipStyles())}
                title={tooltip}
                role="img"
                aria-label={tooltip}
              >
                <HelpCircleIcon />
              </span>
            )}
          </label>
        )}

        <div className={cx(inputWrapperStyles())}>
          {Icon && (
            <Icon
              aria-hidden="true"
              className={cx(inputIconStyles({ size, disabled: !!disabled }))}
            />
          )}

          <input
            id={inputId}
            className={cx(
              inputStyles({ size, variant, disabled: !!disabled }),
              iconPadding,
              className,
            )}
            ref={ref}
            disabled={!!disabled}
            required={isRequired || undefined}
            aria-invalid={isError || undefined}
            aria-describedby={helperText ? `${inputId}-helper` : undefined}
            {...props}
          />

          {isError && (
            <InfoCircleIcon className={cx(inputTrailingIconStyles({ size }))} aria-hidden="true" />
          )}

          {shortcut && (
            <div className={cx(inputShortcutStyles({ size }))}>
              <span className={cx(inputShortcutBadgeStyles())} aria-hidden="true">
                {typeof shortcut === "string" ? shortcut : "⌘K"}
              </span>
            </div>
          )}
        </div>

        {helperText && (
          <p id={`${inputId}-helper`} className={cx(helperTextStyles({ variant }))}>
            {helperText}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export { Input };

/* ========== Inline SVG icon ========== */

const InfoCircleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="8" cy="8" r="6.25" />
    <line x1="8" y1="5.5" x2="8" y2="5.51" strokeWidth="2" />
    <line x1="8" y1="7.5" x2="8" y2="10.5" />
  </svg>
);
