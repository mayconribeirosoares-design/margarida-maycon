export type AdminAccessUser = { role: "admin" | "user" } | null | undefined;

export function getAdminAccessState(user: AdminAccessUser, coupleAllowed = false) {
  if (!user) return "unauthenticated" as const;
  if (!coupleAllowed) return "forbidden" as const;
  return "allowed" as const;
}

export function getAdminPanelView(user: AdminAccessUser, coupleAllowed: boolean, accessLoading = false) {
  if (accessLoading) return "loading" as const;
  const state = getAdminAccessState(user, coupleAllowed);
  if (state === "unauthenticated") return "login" as const;
  if (state === "forbidden") return "restricted" as const;
  return "panel" as const;
}
