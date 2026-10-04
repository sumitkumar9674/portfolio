export function getThemeColor(token: `--${string}`) {
  return getComputedStyle(document.documentElement).getPropertyValue(token).trim();
}
