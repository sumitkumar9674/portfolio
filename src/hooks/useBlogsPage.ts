import { useSyncExternalStore } from "react";

function subscribe(onChange: () => void) {
  window.addEventListener("hashchange", onChange);
  return () => window.removeEventListener("hashchange", onChange);
}

// Hash navigation works on static hosts and on the /cube-test entry point.
export function useBlogsPage() {
  return useSyncExternalStore(subscribe, () => window.location.hash === "#/blogs", () => false);
}
