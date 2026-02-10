import type { MetaFunction } from "react-router";
import { useTranslation } from "react-i18next";
import { Button, CloseButton } from "@ahiggs-ui/react";
import { ShowcaseSection } from "~/components/showcase/ShowcaseSection";

const StarIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

export const meta: MetaFunction = () => [{ title: "Button | Components" }];

export default function ButtonShowcase() {
  const { t } = useTranslation();

  return (
    <div className="space-y-10">
      <h1 className="text-2xl font-semibold text-text-primary">{t("dashboard.nav.button")}</h1>

      <ShowcaseSection title={t("showcase.variants")}>
        <Button variant="primary">Primary</Button>
        <Button variant="secondaryGray">Secondary Gray</Button>
        <Button variant="secondaryColor">Secondary Color</Button>
        <Button variant="tertiaryGray">Tertiary Gray</Button>
        <Button variant="tertiaryColor">Tertiary Color</Button>
        <Button variant="linkGray">Link Gray</Button>
        <Button variant="linkColor">Link Color</Button>
      </ShowcaseSection>

      <ShowcaseSection title={t("showcase.sizes")}>
        <Button size="sm">Small</Button>
        <Button size="md">Medium</Button>
        <Button size="lg">Large</Button>
        <Button size="xl">Extra Large</Button>
        <Button size="2xl">2X Large</Button>
      </ShowcaseSection>

      <ShowcaseSection title="Destructive">
        <Button variant="primary" destructive>Primary</Button>
        <Button variant="secondaryGray" destructive>Secondary Gray</Button>
        <Button variant="secondaryColor" destructive>Secondary Color</Button>
        <Button variant="tertiaryGray" destructive>Tertiary Gray</Button>
        <Button variant="tertiaryColor" destructive>Tertiary Color</Button>
      </ShowcaseSection>

      <ShowcaseSection title="With Icons">
        <Button leadingIcon={StarIcon}>Leading Icon</Button>
        <Button trailingIcon={StarIcon}>Trailing Icon</Button>
        <Button leadingIcon={StarIcon} trailingIcon={StarIcon}>Both Icons</Button>
      </ShowcaseSection>

      <ShowcaseSection title="Loading">
        <Button loading>Loading</Button>
        <Button loading loadingText="Saving...">Save</Button>
      </ShowcaseSection>

      <ShowcaseSection title={t("showcase.states")}>
        <Button disabled>Disabled</Button>
        <Button variant="secondaryGray" disabled>Disabled Secondary</Button>
      </ShowcaseSection>

      <ShowcaseSection title="CloseButton">
        <CloseButton size="sm" />
        <CloseButton size="md" />
        <CloseButton size="lg" />
      </ShowcaseSection>
    </div>
  );
}
