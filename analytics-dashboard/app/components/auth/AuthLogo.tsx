export function AuthLogo() {
  return (
    <div className="mb-6 flex justify-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-600">
        <svg
          className="h-6 w-6 text-white"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="12" width="4" height="9" rx="1" />
          <rect x="10" y="8" width="4" height="13" rx="1" />
          <rect x="17" y="4" width="4" height="17" rx="1" />
        </svg>
      </div>
    </div>
  );
}
