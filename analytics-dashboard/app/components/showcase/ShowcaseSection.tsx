interface ShowcaseSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export function ShowcaseSection({ title, description, children }: ShowcaseSectionProps) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
        {description && <p className="mt-1 text-sm text-text-tertiary">{description}</p>}
      </div>
      <div className="flex flex-wrap items-start gap-4">{children}</div>
    </section>
  );
}
