import { useEffect, useLayoutEffect, useRef } from "react";
import { siteContent } from "../content/siteContent";
import { bulletSources, entitySources, explosionSources, heroSources, markSpaceDefenderReady, preloadSpaceDefender } from "./SpaceDefenderAssets";
import { getThemeColor } from "../theme/getThemeColor";

const LOGO_PATTERN = [
  "000001111011111011111001111011001000",
  "000011000010101010101011100001010000",
  "000011111000100000100010000001100000",
  "000000011000100010101011100001010000",
  "000011110000100011111001111011001000",
  "000000000000000000000000000000000000",
  "011110011100111110010001001110010001",
  "110000110110110110001010011011010001",
  "111100100010111100000100010001010001",
  "110000110110110100000100011011011011",
  "100000011100100010001110001110001110",
  "000000000000000000000000000000000000",
];

const TILE_SIZE = 18;
const EXPLOSION_TIME = 667;
const FIRE_INTERVAL = 135;

type Entity = {
  x: number;
  y: number;
  explodingAt: number | null;
  sprite: HTMLImageElement;
};

type Bullet = { x: number; y: number; sprite: HTMLImageElement };

type SpaceDefenderProps = {
  isOpen: boolean;
  onEngage: () => void;
  onHit: (count: number) => void;
  onWave: (wave: number) => void;
};

function loadImage(src: string) {
  const image = new Image();
  image.src = src;
  return image;
}

export default function SpaceDefender({ isOpen, onEngage, onHit, onWave }: SpaceDefenderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isOpenRef = useRef(isOpen);
  const frameRef = useRef<number | null>(null);
  const scheduleRef = useRef<(() => void) | null>(null);
  const pauseRef = useRef<(() => void) | null>(null);

  useLayoutEffect(() => {
    isOpenRef.current = isOpen;
    if (isOpen) {
      scheduleRef.current?.();
    } else {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
      pauseRef.current?.();
    }
  }, [isOpen]);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const entities = entitySources.map(loadImage);
    const bulletImages = bulletSources.map(loadImage);
    const blasts = explosionSources.map(loadImage);
    const targetFill = getThemeColor("--color-game-target");
    const hero = {
      idle: [loadImage(heroSources["../assets/game/hero/idle_01.png"]), loadImage(heroSources["../assets/game/hero/idle_02.png"])],
      left: loadImage(heroSources["../assets/game/hero/moving_left.png"]),
      right: loadImage(heroSources["../assets/game/hero/moving_right.png"]),
    };
    const images = [...entities, ...bulletImages, ...blasts, ...hero.idle, hero.left, hero.right];

    let disposed = false;
    let ready = false;
    let firstFramePainted = false;
    let targets: Entity[] = [];
    let bullets: Bullet[] = [];
    let engaged = false;
    let firing = false;
    let wave = 1;
    let scale = 1;
    let gameTime = 0;
    let lastFrameTime = 0;
    let lastShot = -FIRE_INTERVAL;
    let lastIdleSwitch = 0;
    let idleFrame = 0;
    let direction: "idle" | "left" | "right" = "idle";
    const ship = { x: 0, targetX: 0, y: 0 };

    const makeWave = () => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (!width || !height) return;
      const columns = LOGO_PATTERN[0].length;
      scale = Math.min(width / 700, width * 0.86 / (columns * TILE_SIZE), height * 0.47 / (LOGO_PATTERN.length * TILE_SIZE), 1.12);
      const tile = TILE_SIZE * scale;
      const left = (width - (columns - 1) * tile) / 2;
      const top = height * 0.17;
      targets = [];
      LOGO_PATTERN.forEach((row, r) => {
        [...row].forEach((pixel, c) => {
          if (pixel === "1") targets.push({ x: left + c * tile, y: top + r * tile, explodingAt: null, sprite: entities[Math.floor(Math.random() * entities.length)] });
        });
      });
      ship.y = height - 42 * scale;
    };

    const render = (time: number) => {
      frameRef.current = null;
      if (disposed || !ready) return;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (!width || !height) return;
      const active = isOpenRef.current;
      const delta = active && lastFrameTime ? Math.min((time - lastFrameTime) / 1000, 0.05) : 0;
      lastFrameTime = active ? time : 0;
      if (active) gameTime += delta * 1000;
      ctx.clearRect(0, 0, width, height);

      if (active) {
        ship.x += (ship.targetX - ship.x) * (1 - Math.pow(0.82, delta * 60));
        if (Math.abs(ship.targetX - ship.x) < 0.5) {
          ship.x = ship.targetX;
          direction = "idle";
        } else {
          direction = ship.targetX < ship.x ? "left" : "right";
        }
        if (gameTime - lastIdleSwitch >= 500) {
          idleFrame = 1 - idleFrame;
          lastIdleSwitch = gameTime;
        }
        if (firing && gameTime - lastShot >= FIRE_INTERVAL) {
          bullets.push({ x: ship.x, y: ship.y - 22 * scale, sprite: bulletImages[Math.floor(Math.random() * bulletImages.length)] });
          lastShot = gameTime;
        }
      }

      const bulletSize = 10 * scale;
      bullets.forEach((bullet) => {
        if (active) bullet.y -= height * 1.18 * delta;
        if (bullet.sprite.naturalWidth) ctx.drawImage(bullet.sprite, bullet.x - bulletSize / 2, bullet.y - bulletSize / 2, bulletSize, bulletSize);
      });
      if (active) bullets = bullets.filter((bullet) => bullet.y > -bulletSize);

      const tile = TILE_SIZE * scale;
      targets.forEach((target) => {
        if (target.explodingAt !== null) {
          const elapsed = gameTime - target.explodingAt;
          const blast = blasts[elapsed < EXPLOSION_TIME / 2 ? 0 : 1];
          const size = tile * 1.5;
          if (blast?.naturalWidth) ctx.drawImage(blast, target.x - size / 2, target.y - size / 2, size, size);
          return;
        }
        const size = tile * 0.86;
        ctx.fillStyle = targetFill;
        ctx.fillRect(target.x - size / 2, target.y - size / 2, size, size);
        if (target.sprite.naturalWidth) {
          const aspect = target.sprite.naturalWidth / target.sprite.naturalHeight;
          const drawWidth = aspect > 1 ? size : size * aspect;
          const drawHeight = aspect > 1 ? size / aspect : size;
          ctx.drawImage(target.sprite, target.x - drawWidth / 2, target.y - drawHeight / 2, drawWidth, drawHeight);
        }
      });

      if (active) {
        let hits = 0;
        const radiusSquared = (tile * 0.55) ** 2;
        bullets.forEach((bullet) => {
          const target = targets.find((candidate) => candidate.explodingAt === null && (bullet.x - candidate.x) ** 2 + (bullet.y - candidate.y) ** 2 < radiusSquared);
          if (target) {
            target.explodingAt = gameTime;
            bullet.y = -bulletSize * 2;
            hits++;
          }
        });
        if (hits) onHit(hits);
        targets = targets.filter((target) => target.explodingAt === null || gameTime - target.explodingAt < EXPLOSION_TIME);
        if (targets.length === 0) {
          wave++;
          makeWave();
          onWave(wave);
        }
      }

      const image = direction === "left" ? hero.left : direction === "right" ? hero.right : hero.idle[idleFrame];
      const shipSize = 67 * scale;
      if (image.naturalWidth) ctx.drawImage(image, ship.x - shipSize / 2, ship.y - shipSize / 2, shipSize, shipSize);
      if (!firstFramePainted) {
        firstFramePainted = true;
        markSpaceDefenderReady();
      }
      if (active) schedule();
    };

    const schedule = () => {
      if (!disposed && ready && frameRef.current === null) frameRef.current = requestAnimationFrame(render);
    };
    scheduleRef.current = schedule;
    pauseRef.current = () => {
      firing = false;
      lastFrameTime = 0;
      direction = "idle";
    };

    const resize = () => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (!width || !height) return;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(canvas.width / width, 0, 0, canvas.height / height, 0, 0);
      bullets = [];
      ship.x = ship.targetX = width / 2;
      makeWave();
      schedule();
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    const moveShip = (clientX: number) => {
      const bounds = canvas.getBoundingClientRect();
      const width = canvas.clientWidth;
      if (!bounds.width || !width) return;
      const halfShip = 34 * scale;
      ship.targetX = Math.max(halfShip, Math.min(width - halfShip, (clientX - bounds.left) / bounds.width * width));
      firing = true;
      if (!engaged) {
        engaged = true;
        onEngage();
      }
    };
    const mouseMove = (event: MouseEvent) => {
      if (isOpenRef.current) moveShip(event.clientX);
    };
    const mouseLeave = () => { firing = false; };
    const touchMove = (event: TouchEvent) => {
      if (!isOpenRef.current || !event.touches.length) return;
      event.preventDefault();
      moveShip(event.touches[0].clientX);
    };
    canvas.addEventListener("mousemove", mouseMove);
    canvas.addEventListener("mouseleave", mouseLeave);
    canvas.addEventListener("touchstart", touchMove, { passive: false });
    canvas.addEventListener("touchmove", touchMove, { passive: false });
    canvas.addEventListener("touchend", mouseLeave);
    canvas.addEventListener("touchcancel", mouseLeave);

    // Wait for the shared splash preload, then paint exactly one ready frame if inactive.
    preloadSpaceDefender()
      .then(() => Promise.all(images.map((image) => image.decode())))
      .then(() => {
        if (disposed) return;
        ready = true;
        schedule();
      })
      .catch((error) => console.error("Failed to prepare SpaceDefender sprites:", error));

    return () => {
      disposed = true;
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
      scheduleRef.current = null;
      pauseRef.current = null;
      observer.disconnect();
      canvas.removeEventListener("mousemove", mouseMove);
      canvas.removeEventListener("mouseleave", mouseLeave);
      canvas.removeEventListener("touchstart", touchMove);
      canvas.removeEventListener("touchmove", touchMove);
      canvas.removeEventListener("touchend", mouseLeave);
      canvas.removeEventListener("touchcancel", mouseLeave);
    };
  }, [onEngage, onHit, onWave]);

  return <canvas ref={canvasRef} className="spaceDefenderCanvas" aria-label={siteContent.spaceDefender.canvasLabel} />;
}
