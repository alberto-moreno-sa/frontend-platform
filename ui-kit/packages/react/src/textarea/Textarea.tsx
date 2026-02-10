import * as React from "react";
import type { VariantProps } from "class-variance-authority";
import { cx } from "@ahiggs-ui/utils";
import { textareaStyles } from "./Textarea.styles";
import {
  labelStyles,
  labelTooltipStyles,
  requiredIndicatorStyles,
  helperTextStyles,
} from "../_shared/form-field.styles";
import { HelpCircleIcon } from "../_shared/icons";

export interface TextareaProps
  extends
    Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "disabled">,
    VariantProps<typeof textareaStyles> {
  /** Label text above the textarea. */
  label?: string;
  /** Helper/hint text below the textarea. */
  helperText?: string;
  /** Tooltip text shown via native title attribute on a help icon next to the label. */
  tooltip?: string;
  /** Mark the field as required (shows asterisk on label). */
  isRequired?: boolean;
  /** Hide required indicator even when `isRequired` is true. */
  hideRequiredIndicator?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      size,
      variant,
      disabled = false,
      label,
      helperText,
      id,
      tooltip,
      isRequired,
      hideRequiredIndicator,
      rows = 4,
      ...props
    },
    ref,
  ) => {
    const textareaId = id || React.useId();
    const isError = variant === "error";

    return (
      <div className="flex w-full flex-col items-start gap-1.5">
        {label && (
          <label htmlFor={textareaId} className={cx(labelStyles())}>
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

        <textarea
          id={textareaId}
          className={cx(textareaStyles({ size, variant, disabled: !!disabled }), className)}
          ref={ref}
          rows={rows}
          disabled={!!disabled}
          required={isRequired || undefined}
          aria-invalid={isError || undefined}
          aria-describedby={helperText ? `${textareaId}-helper` : undefined}
          {...props}
        />

        {helperText && (
          <p id={`${textareaId}-helper`} className={cx(helperTextStyles({ variant }))}>
            {helperText}
          </p>
        )}
      </div>
    );
  },
);

Textarea.displayName = "Textarea";

export { Textarea };
