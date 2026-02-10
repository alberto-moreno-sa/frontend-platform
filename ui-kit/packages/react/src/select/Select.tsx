import * as React from "react";
import type { VariantProps } from "class-variance-authority";
import { cx } from "@ahiggs-ui/utils";
import {
  selectTriggerStyles,
  selectChevronStyles,
  selectDropdownStyles,
  selectDropdownInnerStyles,
  selectItemStyles,
  selectGroupLabelStyles,
  selectSeparatorStyles,
} from "./Select.styles";
import {
  labelStyles,
  labelTooltipStyles,
  requiredIndicatorStyles,
  helperTextStyles,
} from "../_shared/form-field.styles";
import { HelpCircleIcon } from "../_shared/icons";

/* ========== Types ========== */

export interface SelectProps
  extends Omit<VariantProps<typeof selectTriggerStyles>, "open"> {
  /** Currently selected value (controlled). */
  value?: string;
  /** Default value (uncontrolled). */
  defaultValue?: string;
  /** Called when the selected value changes. */
  onValueChange?: (value: string) => void;
  /** Placeholder text shown when no value is selected. */
  placeholder?: string;
  /** Label text above the trigger. */
  label?: string;
  /** Helper/hint text below the trigger. */
  helperText?: string;
  /** Tooltip text shown via native title attribute on a help icon next to the label. */
  tooltip?: string;
  /** Mark the field as required (shows asterisk on label). */
  isRequired?: boolean;
  /** Hide required indicator even when isRequired is true. */
  hideRequiredIndicator?: boolean;
  /** Additional className merged onto the trigger button. */
  className?: string;
  /** Unique id (auto-generated via useId if omitted). */
  id?: string;
  /** Children: SelectItem, SelectGroup, SelectSeparator. */
  children: React.ReactNode;
  /** Callback when the dropdown opens or closes. */
  onOpenChange?: (open: boolean) => void;
}

export interface SelectItemProps
  extends Omit<React.LiHTMLAttributes<HTMLLIElement>, "value"> {
  /** The string value this item represents. */
  value: string;
  /** Whether this item is disabled. */
  disabled?: boolean;
  /** Content to render (text label). */
  children: React.ReactNode;
}

export interface SelectGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Group heading label. */
  label: string;
  children: React.ReactNode;
}

export type SelectSeparatorProps = React.HTMLAttributes<HTMLHRElement>;

/* ========== Context ========== */

interface ItemEntry {
  value: string;
  label: string;
  disabled: boolean;
  index: number;
}

interface SelectContextValue {
  selectId: string;
  selectedValue: string | undefined;
  highlightedValue: string | null;
  onSelect: (value: string) => void;
  registerItem: (value: string, label: string, disabled: boolean) => number;
  unregisterItem: (value: string) => void;
}

const SelectContext = React.createContext<SelectContextValue | null>(null);

function useSelectContext() {
  const ctx = React.useContext(SelectContext);
  if (!ctx)
    throw new Error("Select sub-components must be used within <Select>");
  return ctx;
}

/* ========== Select ========== */

const Select = React.forwardRef<HTMLDivElement, SelectProps>(
  (
    {
      value,
      defaultValue,
      onValueChange,
      placeholder = "Select...",
      label,
      helperText,
      tooltip,
      isRequired,
      hideRequiredIndicator,
      className,
      id,
      children,
      onOpenChange,
      size,
      variant,
      disabled = false,
    },
    ref,
  ) => {
    const selectId = id || React.useId();
    const listboxId = `${selectId}-listbox`;

    const [open, setOpen] = React.useState(false);
    const [internalValue, setInternalValue] = React.useState(defaultValue);
    const [highlightedValue, setHighlightedValue] = React.useState<
      string | null
    >(null);

    // Force re-render after items register so getSelectedLabel() works
    const [, forceRender] = React.useReducer((x: number) => x + 1, 0);

    const selectedValue = value !== undefined ? value : internalValue;

    const triggerRef = React.useRef<HTMLButtonElement>(null);
    const listboxRef = React.useRef<HTMLUListElement>(null);
    const itemsRef = React.useRef<Map<string, ItemEntry>>(new Map());
    const indexCounterRef = React.useRef(0);
    const typeaheadBufferRef = React.useRef("");
    const typeaheadTimeoutRef = React.useRef<ReturnType<typeof setTimeout>>(
      undefined,
    );

    const getEnabledItems = React.useCallback(() => {
      return Array.from(itemsRef.current.values())
        .filter((item) => !item.disabled)
        .sort((a, b) => a.index - b.index);
    }, []);

    const getSelectedLabel = React.useCallback(() => {
      if (!selectedValue) return null;
      const item = itemsRef.current.get(selectedValue);
      return item?.label ?? null;
    }, [selectedValue]);

    const closeDropdown = React.useCallback(() => {
      setOpen(false);
      setHighlightedValue(null);
      onOpenChange?.(false);
    }, [onOpenChange]);

    const openDropdown = React.useCallback(() => {
      if (disabled) return;
      setOpen(true);
      onOpenChange?.(true);
    }, [disabled, onOpenChange]);

    // Set initial highlight when dropdown opens (runs after items register)
    React.useEffect(() => {
      if (!open) return;
      const enabled = getEnabledItems();
      if (enabled.length === 0) return;
      if (
        selectedValue &&
        enabled.some((i) => i.value === selectedValue)
      ) {
        setHighlightedValue(selectedValue);
      } else {
        setHighlightedValue(enabled[0].value);
      }
    }, [open, selectedValue, getEnabledItems]);

    const handleSelect = React.useCallback(
      (itemValue: string) => {
        if (value === undefined) setInternalValue(itemValue);
        onValueChange?.(itemValue);
        closeDropdown();
        triggerRef.current?.focus();
      },
      [value, onValueChange, closeDropdown],
    );

    const registerItem = React.useCallback(
      (itemValue: string, itemLabel: string, itemDisabled: boolean) => {
        const idx = indexCounterRef.current++;
        itemsRef.current.set(itemValue, {
          value: itemValue,
          label: itemLabel,
          disabled: itemDisabled,
          index: idx,
        });
        forceRender();
        return idx;
      },
      [],
    );

    const unregisterItem = React.useCallback((itemValue: string) => {
      itemsRef.current.delete(itemValue);
    }, []);

    // Scroll highlighted item into view
    React.useEffect(() => {
      if (!open || !highlightedValue || !listboxRef.current) return;
      const el = listboxRef.current.querySelector(
        `[data-value="${CSS.escape(highlightedValue)}"]`,
      );
      if (el && typeof (el as HTMLElement).scrollIntoView === "function") {
        (el as HTMLElement).scrollIntoView({ block: "nearest" });
      }
    }, [open, highlightedValue]);

    const handleTypeahead = React.useCallback(
      (char: string) => {
        clearTimeout(typeaheadTimeoutRef.current);
        typeaheadBufferRef.current += char.toLowerCase();

        const enabled = getEnabledItems();
        const match = enabled.find((item) =>
          item.label.toLowerCase().startsWith(typeaheadBufferRef.current),
        );
        if (match) setHighlightedValue(match.value);

        typeaheadTimeoutRef.current = setTimeout(() => {
          typeaheadBufferRef.current = "";
        }, 500);
      },
      [getEnabledItems],
    );

    const handleKeyDown = React.useCallback(
      (e: React.KeyboardEvent) => {
        const enabled = getEnabledItems();
        const currentIdx = enabled.findIndex(
          (item) => item.value === highlightedValue,
        );

        switch (e.key) {
          case "ArrowDown": {
            e.preventDefault();
            if (!open) {
              openDropdown();
              return;
            }
            const next =
              currentIdx < enabled.length - 1 ? currentIdx + 1 : 0;
            setHighlightedValue(enabled[next].value);
            break;
          }
          case "ArrowUp": {
            e.preventDefault();
            if (!open) {
              openDropdown();
              return;
            }
            const prev =
              currentIdx > 0 ? currentIdx - 1 : enabled.length - 1;
            setHighlightedValue(enabled[prev].value);
            break;
          }
          case "Enter":
          case " ": {
            e.preventDefault();
            if (!open) {
              openDropdown();
              return;
            }
            if (highlightedValue) handleSelect(highlightedValue);
            break;
          }
          case "Escape": {
            e.preventDefault();
            closeDropdown();
            triggerRef.current?.focus();
            break;
          }
          case "Tab": {
            closeDropdown();
            break;
          }
          case "Home": {
            e.preventDefault();
            if (open && enabled.length)
              setHighlightedValue(enabled[0].value);
            break;
          }
          case "End": {
            e.preventDefault();
            if (open && enabled.length)
              setHighlightedValue(enabled[enabled.length - 1].value);
            break;
          }
          default: {
            if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && open) {
              e.preventDefault();
              handleTypeahead(e.key);
            }
          }
        }
      },
      [
        open,
        highlightedValue,
        getEnabledItems,
        openDropdown,
        closeDropdown,
        handleSelect,
        handleTypeahead,
      ],
    );

    const toggleOpen = () => {
      if (open) {
        closeDropdown();
      } else {
        openDropdown();
      }
    };

    const displayLabel = getSelectedLabel();
    const hasValue = !!displayLabel;
    const isError = variant === "error";

    const contextValue: SelectContextValue = React.useMemo(
      () => ({
        selectId,
        selectedValue,
        highlightedValue,
        onSelect: handleSelect,
        registerItem,
        unregisterItem,
      }),
      [
        selectId,
        selectedValue,
        highlightedValue,
        handleSelect,
        registerItem,
        unregisterItem,
      ],
    );

    return (
      <div ref={ref} className="flex w-full flex-col items-start gap-1.5">
        {/* Label */}
        {label && (
          <label htmlFor={selectId} className={cx(labelStyles())}>
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

        {/* Trigger + dropdown wrapper */}
        <div className="relative w-full">
          <button
            ref={triggerRef}
            type="button"
            id={selectId}
            role="combobox"
            aria-haspopup="listbox"
            aria-expanded={open}
            aria-controls={open ? listboxId : undefined}
            aria-describedby={
              helperText ? `${selectId}-helper` : undefined
            }
            aria-required={isRequired || undefined}
            aria-invalid={isError || undefined}
            disabled={!!disabled}
            onClick={toggleOpen}
            onKeyDown={handleKeyDown}
            className={cx(
              selectTriggerStyles({
                size,
                variant,
                disabled: !!disabled,
                open,
              }),
              className,
            )}
          >
            <span
              className={cx(
                "truncate text-left",
                !hasValue && "text-text-placeholder",
              )}
            >
              {displayLabel ?? placeholder}
            </span>
            <ChevronDownIcon
              className={cx(
                selectChevronStyles({ open, disabled: !!disabled }),
              )}
            />
          </button>

          {/* Click-outside overlay */}
          {open && (
            <div
              className="fixed inset-0 z-40"
              onClick={closeDropdown}
              aria-hidden="true"
              data-testid="select-overlay"
            />
          )}

          {/* Dropdown listbox — always rendered for item registration, hidden when closed */}
          <SelectContext.Provider value={contextValue}>
            <ul
              ref={listboxRef}
              id={listboxId}
              role="listbox"
              aria-activedescendant={
                open && highlightedValue
                  ? `${selectId}-option-${highlightedValue}`
                  : undefined
              }
              tabIndex={-1}
              onKeyDown={handleKeyDown}
              className={cx(
                selectDropdownStyles(),
                !open && "hidden",
              )}
              aria-hidden={!open || undefined}
            >
              <div className={cx(selectDropdownInnerStyles())}>
                {children}
              </div>
            </ul>
          </SelectContext.Provider>
        </div>

        {/* Helper text */}
        {helperText && (
          <p
            id={`${selectId}-helper`}
            className={cx(helperTextStyles({ variant }))}
          >
            {helperText}
          </p>
        )}
      </div>
    );
  },
);

Select.displayName = "Select";

/* ========== SelectItem ========== */

const SelectItem = React.forwardRef<HTMLLIElement, SelectItemProps>(
  ({ value, disabled = false, children, className, ...props }, ref) => {
    const ctx = useSelectContext();
    const isSelected = ctx.selectedValue === value;
    const isHighlighted = ctx.highlightedValue === value;

    const labelText =
      typeof children === "string"
        ? children
        : typeof children === "number"
          ? String(children)
          : value;

    React.useEffect(() => {
      ctx.registerItem(value, labelText, disabled);
      return () => ctx.unregisterItem(value);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value, labelText, disabled]);

    const handleClick = () => {
      if (disabled) return;
      ctx.onSelect(value);
    };

    return (
      <li
        ref={ref}
        id={`${ctx.selectId}-option-${value}`}
        role="option"
        aria-selected={isSelected}
        aria-disabled={disabled || undefined}
        data-value={value}
        onClick={handleClick}
        className={cx(
          selectItemStyles({
            highlighted: isHighlighted,
            selected: isSelected,
            disabled,
          }),
          className,
        )}
        {...props}
      >
        <span className="truncate">{children}</span>
        {isSelected && (
          <CheckIcon
            className="size-5 shrink-0 text-brand-600"
            aria-hidden="true"
          />
        )}
      </li>
    );
  },
);

SelectItem.displayName = "SelectItem";

/* ========== SelectGroup ========== */

const SelectGroup = React.forwardRef<HTMLDivElement, SelectGroupProps>(
  ({ label, children, className, ...props }, ref) => {
    const groupLabelId = React.useId();

    return (
      <div
        ref={ref}
        role="group"
        aria-labelledby={groupLabelId}
        {...props}
      >
        <div
          id={groupLabelId}
          className={cx(selectGroupLabelStyles(), className)}
        >
          {label}
        </div>
        {children}
      </div>
    );
  },
);

SelectGroup.displayName = "SelectGroup";

/* ========== SelectSeparator ========== */

const SelectSeparator = React.forwardRef<
  HTMLHRElement,
  SelectSeparatorProps
>(({ className, ...props }, ref) => (
  <hr
    ref={ref}
    className={cx(selectSeparatorStyles(), className)}
    aria-hidden="true"
    {...props}
  />
));

SelectSeparator.displayName = "SelectSeparator";

/* ========== Exports ========== */

export { Select, SelectItem, SelectGroup, SelectSeparator };

/* ========== Inline SVGs ========== */

function ChevronDownIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
