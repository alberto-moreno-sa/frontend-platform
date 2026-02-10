import type { MetaFunction } from "react-router";
import { useTranslation } from "react-i18next";
import { Input } from "@ahiggs-ui/react";
import { ShowcaseSection } from "~/components/showcase/ShowcaseSection";

const SearchIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

export const meta: MetaFunction = () => [{ title: "Input | Components" }];

export default function InputShowcase() {
  const { t } = useTranslation();

  return (
    <div className="space-y-10">
      <h1 className="text-2xl font-semibold text-text-primary">{t("dashboard.nav.input")}</h1>

      <ShowcaseSection title={t("showcase.variants")}>
        <Input label="Default" placeholder="Enter text" />
        <Input label="Error" variant="error" placeholder="Enter text" helperText="This field is required" />
        <Input label="Success" variant="success" placeholder="Enter text" helperText="Looks good!" />
      </ShowcaseSection>

      <ShowcaseSection title={t("showcase.sizes")}>
        <Input label="Small" size="small" placeholder="Small input" />
        <Input label="Medium" size="medium" placeholder="Medium input" />
        <Input label="Large" size="large" placeholder="Large input" />
      </ShowcaseSection>

      <ShowcaseSection title="With Icon">
        <Input label="Search" icon={SearchIcon} placeholder="Search..." />
      </ShowcaseSection>

      <ShowcaseSection title="With Shortcut">
        <Input label="Command" shortcut placeholder="Type a command..." />
        <Input label="Custom Shortcut" shortcut="⌘S" placeholder="Save..." />
      </ShowcaseSection>

      <ShowcaseSection title="With Tooltip">
        <Input label="Email" tooltip="We'll never share your email" placeholder="you@example.com" />
      </ShowcaseSection>

      <ShowcaseSection title={t("showcase.states")}>
        <Input label="Required" isRequired placeholder="Required field" />
        <Input label="Disabled" disabled placeholder="Disabled input" />
        <Input label="Filled" defaultValue="john@example.com" />
      </ShowcaseSection>
    </div>
  );
}
