import type { MetaFunction } from "react-router";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardDivider,
  Button,
} from "@ui-kit/react";
import { ShowcaseSection } from "~/components/showcase/ShowcaseSection";

export const meta: MetaFunction = () => [{ title: "Card | Components" }];

export default function CardShowcase() {
  const { t } = useTranslation();

  return (
    <div className="space-y-10">
      <h1 className="text-2xl font-semibold text-text-primary">{t("dashboard.nav.card")}</h1>

      <ShowcaseSection title={t("showcase.variants")}>
        <Card className="w-72">
          <CardHeader>
            <CardTitle>Default</CardTitle>
            <CardDescription>Default card variant</CardDescription>
          </CardHeader>
          <CardContent>Card content goes here.</CardContent>
        </Card>
        <Card variant="elevated" className="w-72">
          <CardHeader>
            <CardTitle>Elevated</CardTitle>
            <CardDescription>Elevated card variant</CardDescription>
          </CardHeader>
          <CardContent>Card content goes here.</CardContent>
        </Card>
        <Card variant="outline" className="w-72">
          <CardHeader>
            <CardTitle>Outline</CardTitle>
            <CardDescription>Outline card variant</CardDescription>
          </CardHeader>
          <CardContent>Card content goes here.</CardContent>
        </Card>
        <Card variant="ghost" className="w-72">
          <CardHeader>
            <CardTitle>Ghost</CardTitle>
            <CardDescription>Ghost card variant</CardDescription>
          </CardHeader>
          <CardContent>Card content goes here.</CardContent>
        </Card>
      </ShowcaseSection>

      <ShowcaseSection title={t("showcase.sizes")}>
        <Card className="w-72">
          <CardHeader>
            <CardTitle>Default Size</CardTitle>
            <CardDescription>Standard padding</CardDescription>
          </CardHeader>
          <CardContent>Default size card content.</CardContent>
        </Card>
        <Card size="sm" className="w-72">
          <CardHeader>
            <CardTitle>Small Size</CardTitle>
            <CardDescription>Compact padding</CardDescription>
          </CardHeader>
          <CardContent>Small size card content.</CardContent>
        </Card>
      </ShowcaseSection>

      <ShowcaseSection title="With Header Action">
        <Card className="w-80">
          <CardHeader action={<Button variant="tertiaryGray" size="sm">Edit</Button>}>
            <CardTitle>Settings</CardTitle>
            <CardDescription>Manage your preferences</CardDescription>
          </CardHeader>
          <CardContent>Card content with an action button in the header.</CardContent>
        </Card>
      </ShowcaseSection>

      <ShowcaseSection title="With Divider and Footer">
        <Card className="w-80">
          <CardHeader>
            <CardTitle>Project</CardTitle>
            <CardDescription>Deploy your new project</CardDescription>
          </CardHeader>
          <CardDivider />
          <CardContent>Card content with a divider separating header and content.</CardContent>
          <CardDivider />
          <CardFooter>
            <Button variant="secondaryGray" size="sm">Cancel</Button>
            <Button size="sm">Deploy</Button>
          </CardFooter>
        </Card>
      </ShowcaseSection>

      <ShowcaseSection title="Interactive">
        <Card interactive className="w-72" onClick={() => {}}>
          <CardHeader>
            <CardTitle>Clickable Card</CardTitle>
            <CardDescription>Click or focus this card</CardDescription>
          </CardHeader>
          <CardContent>Interactive cards show hover and focus states.</CardContent>
        </Card>
      </ShowcaseSection>
    </div>
  );
}
