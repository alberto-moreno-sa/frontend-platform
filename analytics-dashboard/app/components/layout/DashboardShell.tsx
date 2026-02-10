import { useState } from "react";
import { Form, useNavigation } from "react-router";
import { useTranslation } from "react-i18next";
import { Button } from "@ahiggs-ui/react";
import { Sidebar } from "./Sidebar";
import { Spinner } from "./Spinner";

const SIDEBAR_KEY = "sidebar-collapsed";

function getInitialCollapsed() {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(SIDEBAR_KEY) === "true";
}

interface DashboardShellProps {
  user: { id: string; email: string; name: string };
  children: React.ReactNode;
}

export function DashboardShell({ user, children }: DashboardShellProps) {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const isNavigating = navigation.state !== "idle";
  const [collapsed, setCollapsed] = useState(getInitialCollapsed);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      <Sidebar
        collapsed={collapsed}
        onToggleCollapse={() =>
          setCollapsed((c) => {
            localStorage.setItem(SIDEBAR_KEY, String(!c));
            return !c;
          })
        }
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      {/* Main area */}
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-border-secondary px-6">
          <div className="flex items-center gap-3">
            {/* Mobile hamburger */}
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="rounded-md p-1 text-text-tertiary hover:text-text-primary lg:hidden"
              aria-label="Open sidebar"
            >
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
            <span className="text-sm text-text-secondary">{t("dashboard.welcome", { name: user.name })}</span>
          </div>
          <Form method="post" action="/logout">
            <Button type="submit" variant="secondaryGray" size="sm">
              {t("dashboard.logout")}
            </Button>
          </Form>
        </header>
        <main className="relative flex-1 p-6">
          {isNavigating && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-bg-primary/60">
              <Spinner size="lg" label={t("dashboard.loading")} />
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}
