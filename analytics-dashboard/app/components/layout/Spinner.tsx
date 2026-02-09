const sizeClasses = {
  sm: "h-5 w-5 border-2",
  md: "h-8 w-8 border-[3px]",
  lg: "h-12 w-12 border-4",
};

const textSizeClasses = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-md",
};

interface SpinnerProps {
  size?: keyof typeof sizeClasses;
  label?: string;
}

export function Spinner({ size = "md", label }: SpinnerProps) {
  return (
    <div className="flex flex-col items-center gap-2" role="status">
      <div
        className={`animate-spin rounded-full border-gray-200 border-t-brand-600 ${sizeClasses[size]}`}
      />
      {label && (
        <span className={`text-text-tertiary ${textSizeClasses[size]}`}>
          {label}
        </span>
      )}
      <span className="sr-only">{label ?? "Loading"}</span>
    </div>
  );
}
