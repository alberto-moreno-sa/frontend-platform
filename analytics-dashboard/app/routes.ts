import { type RouteConfig, layout, route, index } from "@react-router/dev/routes";

export default [
  // Auth layout (unauthenticated pages)
  layout("routes/_auth.tsx", [
    route("login", "routes/_auth.login.tsx"),
    route("register", "routes/_auth.register.tsx"),
  ]),

  // Dashboard layout (protected pages)
  layout("routes/_dashboard.tsx", [
    index("routes/_dashboard._index.tsx"),
    route("components/button", "routes/_dashboard.components.button.tsx"),
    route("components/input", "routes/_dashboard.components.input.tsx"),
    route("components/textarea", "routes/_dashboard.components.textarea.tsx"),
    route("components/input-group", "routes/_dashboard.components.input-group.tsx"),
    route("components/card", "routes/_dashboard.components.card.tsx"),
    route("components/modal", "routes/_dashboard.components.modal.tsx"),
    route("components/badge", "routes/_dashboard.components.badge.tsx"),
  ]),

  // Logout resource route
  route("logout", "routes/logout.tsx"),
] satisfies RouteConfig;
