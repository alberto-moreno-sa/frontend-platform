// Input
export { Input, type InputProps } from "./Input";

export {
  inputStyles,
  inputWrapperStyles,
  inputIconStyles,
  inputTrailingIconStyles,
  inputShortcutStyles,
  inputShortcutBadgeStyles,
} from "./Input.styles";

// Re-export shared form-field styles (backward compatibility)
export {
  labelStyles,
  labelTooltipStyles,
  requiredIndicatorStyles,
  helperTextStyles,
} from "../_shared/form-field.styles";

// Re-export Textarea (backward compatibility — prefer @ui-kit/react/textarea)
export { Textarea, type TextareaProps, textareaStyles } from "../textarea";

// Re-export InputGroup (backward compatibility — prefer @ui-kit/react/input-group)
export {
  InputGroup,
  InputPrefix,
  type InputGroupProps,
  type InputPrefixProps,
  inputGroupWrapperStyles,
  inputPrefixStyles,
} from "../input-group";
