// Sprite URLs are shared by the splash preloader and the mounted game.
export const entitySources = Object.values(import.meta.glob("../assets/game/entities/*.png", { eager: true, import: "default" })) as string[];
export const bulletSources = Object.values(import.meta.glob("../assets/game/bullets/*.png", { eager: true, import: "default" })) as string[];
export const heroSources = import.meta.glob("../assets/game/hero/*.png", { eager: true, import: "default" }) as Record<string, string>;
export const explosionSources = Object.values(import.meta.glob("../assets/game/explosions/*.png", { eager: true, import: "default" })) as string[];

function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve();
    image.onerror = () => reject(new Error(`Failed to preload image: ${src}`));
    image.src = src;
  });
}

let preloadPromise: Promise<void> | null = null;
export function preloadSpaceDefender(): Promise<void> {
  // StrictMode, App, and the mounted game share one boot request.
  return preloadPromise ??= Promise.all(
    [...entitySources, ...bulletSources, ...Object.values(heroSources), ...explosionSources].map(preloadImage),
  ).then(() => undefined);
}

// The splash waits for the canvas's first completed ready frame as well as the images.
let resolveReady: () => void;
export const spaceDefenderReady = new Promise<void>((resolve) => { resolveReady = resolve; });
export function markSpaceDefenderReady() { resolveReady(); }
