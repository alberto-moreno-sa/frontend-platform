import { NavLink, useLocation } from "react-router";
import { useTranslation } from "react-i18next";

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

const navItems = [
  {
    to: "/",
    labelKey: "dashboard.nav.dashboard",
    icon: (
      <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
];

const componentItems = [
  {
    to: "/components/button",
    labelKey: "dashboard.nav.button",
    icon: (
      <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="7" width="16" height="10" rx="2" />
        <line x1="9" y1="12" x2="15" y2="12" />
      </svg>
    ),
  },
  {
    to: "/components/input",
    labelKey: "dashboard.nav.input",
    icon: (
      <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="6" width="18" height="12" rx="2" />
        <line x1="7" y1="10" x2="7" y2="14" />
      </svg>
    ),
  },
  {
    to: "/components/textarea",
    labelKey: "dashboard.nav.textarea",
    icon: (
      <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <line x1="7" y1="8" x2="17" y2="8" />
        <line x1="7" y1="12" x2="17" y2="12" />
        <line x1="7" y1="16" x2="13" y2="16" />
      </svg>
    ),
  },
  {
    to: "/components/input-group",
    labelKey: "dashboard.nav.inputGroup",
    icon: (
      <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="7" rx="2" />
        <rect x="3" y="13" width="18" height="7" rx="2" />
      </svg>
    ),
  },
  {
    to: "/components/card",
    labelKey: "dashboard.nav.card",
    icon: (
      <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <line x1="2" y1="10" x2="22" y2="10" />
      </svg>
    ),
  },
  {
    to: "/components/modal",
    labelKey: "dashboard.nav.modal",
    icon: (
      <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="5" width="16" height="14" rx="2" />
        <line x1="9" y1="9" x2="15" y2="9" />
        <line x1="9" y1="13" x2="13" y2="13" />
      </svg>
    ),
  },
  {
    to: "/components/badge",
    labelKey: "dashboard.nav.badge",
    icon: (
      <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="4" />
        <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8" />
      </svg>
    ),
  },
];

function SidebarContent({ collapsed, onToggleCollapse, onCloseMobile }: Omit<SidebarProps, "mobileOpen">) {
  const { t } = useTranslation();
  const location = useLocation();

  function isActive(to: string) {
    if (to === "/") return location.pathname === "/";
    return location.pathname.startsWith(to);
  }

  const linkClass = (to: string) =>
    `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
      isActive(to)
        ? "bg-bg-active text-text-primary"
        : "text-text-secondary hover:bg-bg-primary-hover hover:text-text-primary"
    }`;

  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-600">
            <svg className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="12" width="4" height="9" rx="1" />
              <rect x="10" y="8" width="4" height="13" rx="1" />
              <rect x="17" y="4" width="4" height="17" rx="1" />
            </svg>
          </div>
          {!collapsed && <span className="text-lg font-semibold text-text-primary">{t("dashboard.brand")}</span>}
        </div>
        {/* Close button for mobile */}
        <button
          type="button"
          onClick={onCloseMobile}
          className="rounded-md p-1 text-text-tertiary hover:text-text-primary lg:hidden"
          aria-label="Close sidebar"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* Main nav */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
        {navItems.map((item) => (
          <NavLink key={item.to} to={item.to} end className={linkClass(item.to)} title={collapsed ? t(item.labelKey) : undefined}>
            {item.icon}
            {!collapsed && <span>{t(item.labelKey)}</span>}
          </NavLink>
        ))}

        {/* Components section */}
        {!collapsed && (
          <div className="pb-1 pt-4 px-3 text-xs font-semibold uppercase tracking-wider text-text-quaternary">
            {t("dashboard.nav.components")}
          </div>
        )}
        {collapsed && <div className="my-3 border-t border-border-secondary" />}

        {componentItems.map((item) => (
          <NavLink key={item.to} to={item.to} className={linkClass(item.to)} title={collapsed ? t(item.labelKey) : undefined}>
            {item.icon}
            {!collapsed && <span>{t(item.labelKey)}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Collapse toggle (desktop only) */}
      <div className="hidden border-t border-border-secondary p-3 lg:block">
        <button
          type="button"
          onClick={onToggleCollapse}
          className="flex w-full items-center justify-center rounded-md p-2 text-text-tertiary transition-colors hover:bg-bg-primary-hover hover:text-text-primary"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <svg
            className={`h-5 w-5 transition-transform ${collapsed ? "rotate-180" : ""}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="11 17 6 12 11 7" />
            <polyline points="18 17 13 12 18 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export function Sidebar({ collapsed, onToggleCollapse, mobileOpen, onCloseMobile }: SidebarProps) {
  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={`sticky top-0 hidden h-screen border-r border-border-secondary bg-bg-primary transition-[width] duration-200 lg:block ${
          collapsed ? "w-[64px]" : "w-[280px]"
        }`}
      >
        <SidebarContent collapsed={collapsed} onToggleCollapse={onToggleCollapse} onCloseMobile={onCloseMobile} />
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" data-testid="mobile-sidebar-overlay">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          {/* Sidebar panel */}
          <aside className="fixed inset-y-0 left-0 z-50 w-[280px] bg-bg-primary shadow-lg">
            <SidebarContent collapsed={false} onToggleCollapse={onToggleCollapse} onCloseMobile={onCloseMobile} />
          </aside>
        </div>
      )}
    </>
  );
}
