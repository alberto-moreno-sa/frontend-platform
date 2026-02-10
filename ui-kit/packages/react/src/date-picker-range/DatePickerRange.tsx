import * as React from "react";
import { DayPicker } from "react-day-picker";
import type { DateRange, Matcher } from "react-day-picker";
import { format, parse, isValid } from "date-fns";
import { cx } from "@ahiggs-ui/utils";
import {
  datePickerTriggerStyles,
  datePickerTriggerIconStyles,
  datePickerPopoverStyles,
  datePickerInputRowStyles,
  datePickerDateInputStyles,
  datePickerInputSeparatorStyles,
  datePickerFooterStyles,
} from "./DatePickerRange.styles";

/* ========== Types ========== */

export type DatePickerRangeValue = DateRange | undefined;

export interface DatePickerRangeProps {
  /** Controlled value: the selected date range. */
  value?: DatePickerRangeValue;
  /** Called when the user clicks Apply (committed change). */
  onChange?: (range: DatePickerRangeValue) => void;
  /** Placeholder text shown when no range is selected. */
  placeholder?: string;
  /** Format string for displaying dates in the trigger (date-fns format). */
  displayFormat?: string;
  /** Format string for the date inputs inside the popover. */
  inputFormat?: string;
  /** Number of months to display side-by-side. */
  numberOfMonths?: number;
  /** The earliest selectable date. */
  minDate?: Date;
  /** The latest selectable date. */
  maxDate?: Date;
  /** Whether the component is disabled. */
  disabled?: boolean;
  /** Additional className for the trigger button. */
  className?: string;
  /** Alignment of the popover relative to the trigger. */
  align?: "start" | "center" | "end";
  /** Label for the Cancel button (i18n). */
  cancelLabel?: string;
  /** Label for the Apply button (i18n). */
  applyLabel?: string;
  /** Callback when the popover opens or closes. */
  onOpenChange?: (open: boolean) => void;
}

/* ========== Helpers ========== */

const DEFAULT_DISPLAY_FORMAT = "MMM d, yyyy";
const DEFAULT_INPUT_FORMAT = "M / d / yyyy";

function formatTriggerText(
  value: DatePickerRangeValue,
  displayFormat: string,
): string | null {
  if (!value?.from) return null;
  const fromStr = format(value.from, displayFormat);
  if (!value.to) return fromStr;
  return `${fromStr} – ${format(value.to, displayFormat)}`;
}

/* ========== DatePickerRange ========== */

const DatePickerRange = React.forwardRef<HTMLDivElement, DatePickerRangeProps>(
  (
    {
      value,
      onChange,
      placeholder = "Select date range",
      displayFormat = DEFAULT_DISPLAY_FORMAT,
      inputFormat = DEFAULT_INPUT_FORMAT,
      numberOfMonths = 2,
      minDate,
      maxDate,
      disabled = false,
      className,
      align = "start",
      cancelLabel = "Cancel",
      applyLabel = "Apply",
      onOpenChange,
    },
    ref,
  ) => {
    const [open, setOpen] = React.useState(false);
    const [draft, setDraft] = React.useState<DateRange | undefined>(value);

    // Date input text state
    const [fromText, setFromText] = React.useState("");
    const [toText, setToText] = React.useState("");
    const [fromError, setFromError] = React.useState(false);
    const [toError, setToError] = React.useState(false);

    // Sync draft text fields when draft changes via calendar clicks
    React.useEffect(() => {
      setFromText(draft?.from ? format(draft.from, inputFormat) : "");
      setFromError(false);
    }, [draft?.from, inputFormat]);

    React.useEffect(() => {
      setToText(draft?.to ? format(draft.to, inputFormat) : "");
      setToError(false);
    }, [draft?.to, inputFormat]);

    const openPopover = () => {
      if (disabled) return;
      setDraft(value);
      setOpen(true);
      onOpenChange?.(true);
    };

    const closePopover = () => {
      setOpen(false);
      onOpenChange?.(false);
    };

    const handleCancel = () => {
      setDraft(value);
      closePopover();
    };

    const handleApply = () => {
      onChange?.(draft);
      closePopover();
    };

    const handleSelect = (range: DateRange | undefined) => {
      setDraft(range);
    };

    // Parse from-input on blur
    const handleFromBlur = () => {
      if (!fromText.trim()) {
        setDraft((prev) => (prev ? { ...prev, from: undefined } : undefined));
        setFromError(false);
        return;
      }
      const parsed = parse(fromText, inputFormat, new Date());
      if (isValid(parsed)) {
        setDraft((prev) => ({ from: parsed, to: prev?.to }));
        setFromError(false);
      } else {
        setFromError(true);
      }
    };

    // Parse to-input on blur
    const handleToBlur = () => {
      if (!toText.trim()) {
        setDraft((prev) => (prev ? { ...prev, to: undefined } : undefined));
        setToError(false);
        return;
      }
      const parsed = parse(toText, inputFormat, new Date());
      if (isValid(parsed)) {
        setDraft((prev) => ({ from: prev?.from, to: parsed }));
        setToError(false);
      } else {
        setToError(true);
      }
    };

    // Escape key handler
    React.useEffect(() => {
      if (!open) return;
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") handleCancel();
      };
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, value]);

    const triggerText = formatTriggerText(value, displayFormat);
    const hasValue = !!triggerText;

    // Disabled date matcher for react-day-picker
    const disabledMatcher: Matcher[] = [];
    if (minDate) disabledMatcher.push({ before: minDate });
    if (maxDate) disabledMatcher.push({ after: maxDate });

    const today = new Date();

    return (
      <div ref={ref} className="relative inline-block">
        {/* Trigger */}
        <button
          type="button"
          onClick={openPopover}
          className={cx(
            datePickerTriggerStyles({
              open,
              disabled,
              hasValue,
            }),
            className,
          )}
          aria-haspopup="dialog"
          aria-expanded={open}
          disabled={disabled}
        >
          <CalendarIcon />
          <span>{triggerText ?? placeholder}</span>
        </button>

        {/* Popover */}
        {open && (
          <>
            {/* Click-outside overlay */}
            <div
              className="fixed inset-0 z-40"
              onClick={handleCancel}
              aria-hidden="true"
              data-testid="datepicker-overlay"
            />
            <div
              role="dialog"
              aria-label="Date range picker"
              className={cx(datePickerPopoverStyles({ align }))}
            >
              {/* Calendar */}
              <DayPicker
                mode="range"
                selected={draft}
                onSelect={handleSelect}
                numberOfMonths={numberOfMonths}
                showOutsideDays={false}
                disabled={disabledMatcher.length > 0 ? disabledMatcher : undefined}
                today={today}
                classNames={{
                  root: "p-4",
                  months: "flex gap-4",
                  month: "flex flex-col gap-2",
                  month_caption: "flex items-center justify-center px-1 mb-2",
                  caption_label: "text-sm font-semibold text-text-primary",
                  nav: "absolute top-4 flex w-[calc(100%-2rem)] justify-between px-0 z-10",
                  button_previous: cx(
                    "inline-flex items-center justify-center size-8 rounded-lg",
                    "text-fg-quaternary cursor-pointer transition-colors outline-none",
                    "hover:bg-bg-primary_hover hover:text-fg-secondary",
                  ),
                  button_next: cx(
                    "inline-flex items-center justify-center size-8 rounded-lg",
                    "text-fg-quaternary cursor-pointer transition-colors outline-none",
                    "hover:bg-bg-primary_hover hover:text-fg-secondary",
                  ),
                  weekdays: "flex",
                  weekday:
                    "w-10 h-10 flex items-center justify-center text-xs font-medium text-text-quaternary",
                  week: "flex",
                  day: "relative w-10 h-10 flex items-center justify-center text-sm font-medium",
                  day_button:
                    "w-full h-full flex items-center justify-center rounded-full outline-none cursor-pointer transition-colors",
                  selected: "",
                  range_start: "bg-brand-50 rounded-l-full",
                  range_end: "bg-brand-50 rounded-r-full",
                  range_middle: "bg-brand-50 rounded-none",
                  today: "font-bold",
                  outside: "text-text-disabled pointer-events-none opacity-0",
                  disabled: "text-text-disabled cursor-not-allowed pointer-events-none",
                }}
                components={{
                  Chevron: CustomChevron,
                  DayButton: CustomDayButton,
                }}
                modifiers={{
                  today: today,
                }}
              />

              {/* Date inputs */}
              <div className={cx(datePickerInputRowStyles())}>
                <input
                  type="text"
                  value={fromText}
                  onChange={(e) => setFromText(e.target.value)}
                  onBlur={handleFromBlur}
                  placeholder={inputFormat.toLowerCase()}
                  className={cx(datePickerDateInputStyles({ hasError: fromError }))}
                  aria-label="Start date"
                />
                <span className={cx(datePickerInputSeparatorStyles())}>–</span>
                <input
                  type="text"
                  value={toText}
                  onChange={(e) => setToText(e.target.value)}
                  onBlur={handleToBlur}
                  placeholder={inputFormat.toLowerCase()}
                  className={cx(datePickerDateInputStyles({ hasError: toError }))}
                  aria-label="End date"
                />
              </div>

              {/* Footer */}
              <div className={cx(datePickerFooterStyles())}>
                <button
                  type="button"
                  onClick={handleCancel}
                  className={cx(
                    "inline-flex items-center justify-center rounded-lg border border-border-primary",
                    "bg-bg-primary text-text-secondary text-sm font-semibold",
                    "shadow-xs px-4 py-2.5 transition-colors",
                    "hover:bg-bg-primary_hover hover:text-text-secondary_hover",
                    "focus-visible:ring-4 focus-visible:ring-focus-ring/24 outline-none",
                  )}
                >
                  {cancelLabel}
                </button>
                <button
                  type="button"
                  onClick={handleApply}
                  className={cx(
                    "inline-flex items-center justify-center rounded-lg border border-brand-600",
                    "bg-brand-600 text-white text-sm font-semibold",
                    "shadow-xs px-4 py-2.5 transition-colors",
                    "hover:bg-brand-700 hover:border-brand-700",
                    "focus-visible:ring-4 focus-visible:ring-focus-ring/24 outline-none",
                  )}
                >
                  {applyLabel}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    );
  },
);

DatePickerRange.displayName = "DatePickerRange";

export { DatePickerRange };

/* ========== Internal Components ========== */

function CustomChevron({
  orientation,
  ...props
}: {
  className?: string;
  size?: number;
  disabled?: boolean;
  orientation?: "up" | "down" | "left" | "right";
}) {
  const rotation =
    orientation === "right"
      ? "rotate(0)"
      : orientation === "left"
        ? "rotate(180deg)"
        : orientation === "up"
          ? "rotate(90deg)"
          : "rotate(-90deg)";

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
      style={{ transform: rotation }}
      {...props}
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

function CustomDayButton(
  props: React.ButtonHTMLAttributes<HTMLButtonElement> & {
    day: { date: Date };
    modifiers: Record<string, boolean>;
  },
) {
  const { children, day: _day, modifiers, className, ...rest } = props;
  const isToday = modifiers.today;
  const isSelected = modifiers.range_start || modifiers.range_end;
  const isInRange = modifiers.range_middle;

  return (
    <button
      type="button"
      className={cx(
        className,
        isSelected
          ? "bg-brand-600 text-white hover:bg-brand-700"
          : isInRange
            ? "text-brand-800 hover:bg-brand-100"
            : "hover:bg-bg-secondary",
      )}
      {...rest}
    >
      {children}
      {isToday && (
        <span
          className={cx(
            "absolute bottom-1 left-1/2 -translate-x-1/2 size-1 rounded-full",
            isSelected ? "bg-white" : "bg-brand-600",
          )}
          data-testid="today-dot"
        />
      )}
    </button>
  );
}

/* ========== Inline SVGs ========== */

function CalendarIcon() {
  return (
    <svg
      className={cx(datePickerTriggerIconStyles())}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}
