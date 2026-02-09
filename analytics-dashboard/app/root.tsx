import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
} from "react-router";
import type { LinksFunction, MetaFunction } from "react-router";
import { useTranslation } from "react-i18next";
import stylesheet from "~/styles/app.css?url";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",
  },
];

export const meta: MetaFunction = () => [
  { title: "Analytics Dashboard" },
  { name: "description", content: "Enterprise Analytics Dashboard" },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="bg-bg-primary text-text-primary antialiased" style={{ fontFamily: "Inter, sans-serif" }}>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: { error: unknown }) {
  const { t } = useTranslation();

  if (isRouteErrorResponse(error)) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-display-sm font-semibold text-text-primary">{error.status}</h1>
          <p className="mt-2 text-md text-text-tertiary">{error.statusText}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-display-sm font-semibold text-text-primary">{t("error.generic")}</h1>
        <p className="mt-2 text-md text-text-tertiary">{t("error.genericDetail")}</p>
      </div>
    </div>
  );
}
