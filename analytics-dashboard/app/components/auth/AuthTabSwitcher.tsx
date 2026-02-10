import { Link, useLocation } from "react-router";
import { useTranslation } from "react-i18next";
import { cx } from "@ahiggs-ui/utils";

export function AuthTabSwitcher() {
  const { t } = useTranslation();
  const location = useLocation();
  const isLogin = location.pathname === "/login";

  const baseClasses = "flex-1 rounded-md py-2 text-center text-sm font-semibold transition-colors";
  const activeClasses = "bg-bg-primary text-text-primary shadow-xs";
  const inactiveClasses = "text-text-tertiary hover:text-text-secondary";

  return (
    <div className="mb-8 flex rounded-lg bg-bg-secondary p-1">
      <Link
        to="/register"
        className={cx(baseClasses, !isLogin ? activeClasses : inactiveClasses)}
      >
        {t("auth.tabs.signup")}
      </Link>
      <Link
        to="/login"
        className={cx(baseClasses, isLogin ? activeClasses : inactiveClasses)}
      >
        {t("auth.tabs.login")}
      </Link>
    </div>
  );
}
