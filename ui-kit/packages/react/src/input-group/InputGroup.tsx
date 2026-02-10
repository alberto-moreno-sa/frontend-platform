import * as React from "react";
import type { VariantProps } from "class-variance-authority";
import { cx } from "@ahiggs-ui/utils";
import { labelStyles, requiredIndicatorStyles, helperTextStyles } from "../_shared/form-field.styles";
import { inputGroupWrapperStyles, inputPrefixStyles } from "./InputGroup.styles";

/* ========== InputPrefix ========== */

export type InputPrefixProps = React.HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof inputPrefixStyles>;

const InputPrefix = React.forwardRef<HTMLSpanElement, InputPrefixProps>(
  ({ className, position, size, disabled, children, ...props }, ref) => (
    <span
      ref={ref}
      className={cx(inputPrefixStyles({ position, size, disabled }), className)}
      {...props}
    >
      {children}
    </span>
  ),
);

InputPrefix.displayName = "InputPrefix";

/* ========== InputGroup ========== */

export interface InputGroupProps {
  /** Size variant for label/hint alignment. */
  size?: "small" | "medium" | "large";
  /** Text prefix displayed inside the input row (e.g. "https://"). */
  prefix?: string;
  /** Leading addon rendered before the input (e.g. dropdown, icon button). */
  leadingAddon?: React.ReactNode;
  /** Trailing addon rendered after the input (e.g. button, dropdown). */
  trailingAddon?: React.ReactNode;
  /** Label text above the group. */
  label?: string;
  /** Hint/helper text below the group. */
  hint?: string;
  /** Show required asterisk on label. */
  isRequired?: boolean;
  /** Mark group as invalid (applies error styling to hint). */
  isInvalid?: boolean;
  /** Disable the group visually. */
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
}

const InputGroup: React.FC<InputGroupProps> & { Prefix: typeof InputPrefix } = ({
  size = "medium",
  prefix,
  leadingAddon,
  trailingAddon,
  label,
  hint,
  isRequired,
  isInvalid,
  disabled,
  className,
  children,
}) => {
  const groupId = React.useId();
  const hasLeading = !!(leadingAddon || prefix);
  const hasTrailing = !!trailingAddon;

  return (
    <div className={cx("flex w-full flex-col items-start gap-1.5", className)}>
      {label && (
        <label htmlFor={groupId} className={cx(labelStyles())}>
          {label}
          {isRequired && <span className={cx(requiredIndicatorStyles())}>*</span>}
        </label>
      )}

      <div className={cx(inputGroupWrapperStyles())}>
        {leadingAddon && <div>{leadingAddon}</div>}

        {prefix && (
          <InputPrefix position="leading" size={size} disabled={!!disabled}>
            {prefix}
          </InputPrefix>
        )}

        <div
          className={cx(
            "relative flex w-full",
            hasLeading && "[&>*]:rounded-l-none",
            hasTrailing && "[&>*]:rounded-r-none",
          )}
        >
          {children}
        </div>

        {trailingAddon && <div>{trailingAddon}</div>}
      </div>

      {hint && (
        <p className={cx(helperTextStyles({ variant: isInvalid ? "error" : "default" }))}>{hint}</p>
      )}
    </div>
  );
};

InputGroup.Prefix = InputPrefix;
InputGroup.displayName = "InputGroup";

export { InputGroup, InputPrefix };
