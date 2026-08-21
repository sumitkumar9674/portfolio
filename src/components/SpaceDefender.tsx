import { useEffect, useRef } from "react";

// ---------- Load Assets ----------

const asteroidSources = Object.values(
  import.meta.glob("../assets/game/asteroids/*.png", {
    eager: true,
    import: "default",
  }),
) as string[];

const entitySources = Object.values(
  import.meta.glob("../assets/game/entities/*.png", {
    eager: true,
    import: "default",
  }),
) as string[];

const shipSource = Object.values(
  import.meta.glob("../assets/game/ship/*.png", {
    eager: true,
    import: "default",
  }),
)[0] as string;

const backgroundSource = Object.values(
  import.meta.glob("../assets/game/background/space_bg.png", {
    eager: true,
    import: "default",
  }),
)[0] as string;

const asteroidBlastSource = Object.values(
  import.meta.glob("../assets/game/explosions/asteroid_blast.png", {
    eager: true,
    import: "default",
  }),
)[0] as string;

const entityBlastSource = Object.values(
  import.meta.glob("../assets/game/explosions/entity_blast.png", {
    eager: true,
    import: "default",
  }),
)[0] as string;

// ---------- Types ----------

type Entity = {
  x: number;
  y: number;
  alive: boolean;
  exploding: boolean;
  explosionStart: number;
  type: "entity" | "asteroid";
  sprite: HTMLImageElement;
  rotation: number;
};

type Bullet = {
  x: number;
  y: number;
};

type SpriteAsset = {
  image: HTMLImageElement;
  type: "entity" | "asteroid";
};

export default function SpaceDefender() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    const DPR = window.devicePixelRatio || 1;

    const TILE_SIZE = 18;
    const TILE_PADDING = 1;

    // ---------- Spawn Weights ----------
    const ASTEROID_WEIGHT = 80;
    const ENTITY_WEIGHT = 20;

    const resize = () => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      canvas.width = width * DPR;
      canvas.height = height * DPR;

      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    };

    let isPlaying = false;

    const ship = {
      x: 180,
      targetX: 180,
      y: 360,
    };

    let bullets: Bullet[] = [];
    let aliens: Entity[] = [];

    const LOGO = [{ text: "STICK" }, { text: "FORYOU" }];

    const FONT: Record<string, string[]> = {
      S: ["11111", "10000", "11110", "00001", "11111"],
      T: ["11111", "00100", "00100", "00100", "00100"],
      I: ["11111", "00100", "00100", "00100", "11111"],
      C: ["11111", "10000", "10000", "10000", "11111"],
      K: ["10001", "10010", "01100", "10010", "10001"],
      F: ["11111", "10000", "11110", "10000", "10000"],
      O: ["11111", "10001", "10001", "10001", "11111"],
      R: ["11110", "10001", "11110", "10010", "10001"],
      Y: ["10001", "01010", "00100", "00100", "00100"],
      U: ["10001", "10001", "10001", "10001", "11111"],
    };

    // ---------- Images ----------

    const asteroidAssets: SpriteAsset[] = asteroidSources.map((src) => {
      const img = new Image();
      img.src = src;
      return { image: img, type: "asteroid" };
    });

    const entityAssets: SpriteAsset[] = entitySources.map((src) => {
      const img = new Image();
      img.src = src;
      return { image: img, type: "entity" };
    });

    const shipImage = new Image();
    shipImage.src = shipSource;

    const backgroundImage = new Image();
    backgroundImage.src = backgroundSource;

    const asteroidBlastImage = new Image();
    asteroidBlastImage.src = asteroidBlastSource;

    const entityBlastImage = new Image();
    entityBlastImage.src = entityBlastSource;

    // ---------- Shuffle ----------

    const shuffle = <T,>(array: T[]) => {
      const copy = [...array];

      for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
      }

      return copy;
    };

    // ---------- Weighted Bag ----------

    const buildWeightedBag = () => {
      const bag: SpriteAsset[] = [];

      const asteroidCopies = Math.round(ASTEROID_WEIGHT / 10);
      const entityCopies = Math.round(ENTITY_WEIGHT / 10);

      for (let i = 0; i < asteroidCopies; i++) {
        bag.push(...asteroidAssets);
      }

      for (let i = 0; i < entityCopies; i++) {
        bag.push(...entityAssets);
      }

      return shuffle(bag);
    };

    let spriteBag = buildWeightedBag();

    const nextSprite = () => {
      if (spriteBag.length === 0) {
        spriteBag = buildWeightedBag();
      }

      return spriteBag.pop()!;
    };

    // ---------- Logo ----------

    const createWave = () => {
      aliens = [];

      const width = canvas.clientWidth;

      const base = TILE_SIZE;
      const letterGap = 8;
      const wordSpacing = 20;

      let currentY = 28;

      LOGO.forEach((line) => {
        const size = base;
        const step = size;

        const chars = line.text.split("");

        const formationWidth =
          chars.length * 5 * step + (chars.length - 1) * letterGap;

        let cursor = (width - formationWidth) / 2;

        chars.forEach((char) => {
          const pattern = FONT[char];

          pattern.forEach((row, r) => {
            [...row].forEach((pixel, c) => {
              if (pixel === "1") {
                const asset = nextSprite();

                aliens.push({
                  x: cursor + c * step,
                  y: currentY + r * step,

                  alive: true,
                  exploding: false,
                  explosionStart: 0,

                  type: asset.type,
                  sprite: asset.image,

                  rotation: Math.random() * Math.PI * 2,
                });
              }
            });
          });

          cursor += 5 * step + letterGap;
        });

        currentY += 5 * step + wordSpacing;
      });
    };

    resize();
    createWave();

    const handleResize = () => {
      resize();
      createWave();
    };

    window.addEventListener("resize", handleResize);

    // ---------- Controls ----------

    let lastShot = 0;

    const moveShip = (clientX: number) => {
      const rect = canvas.getBoundingClientRect();

      ship.targetX = Math.max(
        20,
        Math.min(rect.width - 20, clientX - rect.left),
      );
    };

    const mouseMove = (e: MouseEvent) => {
      isPlaying = true;
      moveShip(e.clientX);
    };

    const touchMove = (e: TouchEvent) => {
      e.preventDefault();
      isPlaying = true;
      moveShip(e.touches[0].clientX);
    };

    canvas.addEventListener("mousemove", mouseMove);
    canvas.addEventListener("mouseleave", () => (isPlaying = false));

    canvas.addEventListener("touchstart", touchMove, { passive: false });
    canvas.addEventListener("touchmove", touchMove, { passive: false });
    canvas.addEventListener("touchend", () => (isPlaying = false));

    // ---------- Game Loop ----------

    const loop = (time: number) => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      ctx.clearRect(0, 0, width, height);

      // Background Image (Cover)
      if (backgroundImage.complete) {
        const scale = Math.max(
          width / backgroundImage.width,
          height / backgroundImage.height,
        );

        const sw = width / scale;
        const sh = height / scale;

        const sx = (backgroundImage.width - sw) / 2;
        const sy = (backgroundImage.height - sh) / 2;

        ctx.drawImage(backgroundImage, sx, sy, sw, sh, 0, 0, width, height);
      } else {
        ctx.fillStyle = "#05070D";
        ctx.fillRect(0, 0, width, height);
      }

      // Ship
      ship.x += (ship.targetX - ship.x) * 0.18;

      // Fire
      const FIRE_RATE = 37;

      if (isPlaying && time - lastShot > FIRE_RATE) {
        bullets.push({
          x: ship.x,
          y: ship.y - 18,
        });

        lastShot = time;
      }

      // Bullets
      ctx.strokeStyle = "#60A5FA";
      ctx.lineWidth = 2;

      bullets.forEach((b) => {
        b.y -= 7;

        ctx.beginPath();
        ctx.moveTo(b.x, b.y);
        ctx.lineTo(b.x, b.y - 10);
        ctx.stroke();
      });

      bullets = bullets.filter((b) => b.y > -20);

      // Aliens
      let aliveCount = 0;

      aliens.forEach((a) => {
        if (!a.alive) return;

        if (a.exploding) {
          const elapsed = time - a.explosionStart;

          if (elapsed > 300) {
            a.alive = false;
            return;
          }

          const blast =
            a.type === "asteroid" ? asteroidBlastImage : entityBlastImage;

          const SIZE = 24;

          ctx.drawImage(blast, a.x - SIZE / 2, a.y - SIZE / 2, SIZE, SIZE);

          aliveCount++;
          return;
        }

        aliveCount++;

        const maxSize = TILE_SIZE - TILE_PADDING * 2;

        const aspect = a.sprite.width / a.sprite.height;

        let drawWidth = maxSize;
        let drawHeight = maxSize;

        if (aspect > 1) {
          drawHeight = maxSize / aspect;
        } else {
          drawWidth = maxSize * aspect;
        }

        ctx.save();
        ctx.translate(a.x, a.y);

        if (a.type === "asteroid") {
          ctx.rotate(a.rotation);
        }

        ctx.drawImage(
          a.sprite,
          -drawWidth / 2,
          -drawHeight / 2,
          drawWidth,
          drawHeight,
        );

        ctx.restore();
      });

      // Collision
      bullets.forEach((b) => {
        aliens.forEach((a) => {
          if (!a.alive || a.exploding) return;

          const dx = b.x - a.x;
          const dy = b.y - a.y;

          if (Math.sqrt(dx * dx + dy * dy) < 10) {
            a.exploding = true;
            a.explosionStart = time;

            b.y = -100;
          }
        });
      });

      // New Wave
      if (aliveCount === 0) {
        createWave();
      }

      // Ship
      const SHIP_SIZE = 42;

      ctx.drawImage(
        shipImage,
        ship.x - SHIP_SIZE / 2,
        ship.y - SHIP_SIZE / 2,
        SHIP_SIZE,
        SHIP_SIZE,
      );

      requestAnimationFrame(loop);
    };

    requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("resize", handleResize);

      canvas.removeEventListener("mousemove", mouseMove);
      canvas.removeEventListener("touchstart", touchMove);
      canvas.removeEventListener("touchmove", touchMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: "100%",
        height: "420px",
        borderRadius: "22px",
        display: "block",
        touchAction: "none",
      }}
    />
  );
}
