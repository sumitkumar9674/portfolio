import { useEffect, useRef } from "react";

// ---------- Assets ----------

const entitySources = Object.values(
  import.meta.glob("../assets/game/entities/*.png", {
    eager: true,
    import: "default",
  }),
) as string[];

const bulletSources = Object.values(
  import.meta.glob("../assets/game/bullets/*.png", {
    eager: true,
    import: "default",
  }),
) as string[];

const heroSources = Object.values(
  import.meta.glob("../assets/game/hero/*.png", {
    eager: true,
    import: "default",
  }),
) as string[];

const backgroundSources = Object.values(
  import.meta.glob("../assets/game/background/*.png", {
    eager: true,
    import: "default",
  }),
) as string[];

const explosionSources = Object.values(
  import.meta.glob("../assets/game/explosions/*.png", {
    eager: true,
    import: "default",
  }),
) as string[];

// ---------- Types ----------

type Entity = {
  x: number;
  y: number;
  alive: boolean;
  exploding: boolean;
  explosionStart: number;
  sprite: HTMLImageElement;
};

type Bullet = {
  x: number;
  y: number;
  sprite: HTMLImageElement;
};

export default function SpaceDefender() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    const DPR = window.devicePixelRatio || 1;

    const DESIGN_WIDTH = 700;
    let currentScale = 1;

    const TILE_SIZE = 18;
    const TEXT_TILE = 14;
    const TILE_PADDING = 1;
    const EXPLOSION_TIME = 667;

    const resize = () => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      canvas.width = width * DPR;
      canvas.height = height * DPR;

      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    };

    // ---------- Images ----------

    const entityImages = entitySources.map((src) => {
      const img = new Image();

      img.onerror = () => {
        console.error("FAILED TO LOAD ENTITY:", src);
      };

      img.src = src;

      return img;
    });

    const bulletImages = bulletSources.map((src) => {
      const img = new Image();
      img.src = src;
      return img;
    });

    const heroImages = {
      idle01: new Image(),
      idle02: new Image(),
      left: new Image(),
      right: new Image(),
    };

    heroImages.idle01.src = heroSources.find((src) =>
      src.includes("idle_01.png"),
    )!;

    heroImages.idle02.src = heroSources.find((src) =>
      src.includes("idle_02.png"),
    )!;

    heroImages.left.src = heroSources.find((src) =>
      src.includes("moving_left.png"),
    )!;

    heroImages.right.src = heroSources.find((src) =>
      src.includes("moving_right.png"),
    )!;

    const backgroundImage = new Image();

    backgroundImage.src =
      backgroundSources[Math.floor(Math.random() * backgroundSources.length)];

    const blastImages = explosionSources.map((src) => {
      const img = new Image();
      img.src = src;
      return img;
    });

    // ---------- Random Pixel Picker ----------

    const nextSprite = () => {
      const index = Math.floor(Math.random() * entityImages.length);

      console.log("Entity selected:", index, entitySources[index]);

      return entityImages[index];
    };
    // ---------- 5x5 Pixel Font ----------

    // ---------- Big Logo S (11 × 9) ----------

    // ---------- Complete Space Defender Logo ----------
    // 49 columns × 10 rows
    //
    // "1" = pixel / entity
    // "0" = empty space
    //
    // Edit this grid to change the entire logo.
    // Every row must contain exactly 49 characters.

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

    // ---------- Game State ----------

    let aliens: Entity[] = [];
    let bullets: Bullet[] = [];
    let isPlaying = false;
    let lastShot = 0;

    const ship = {
      x: 180,
      targetX: 180,
      y: 0,
    };

    let heroDirection: "idle" | "left" | "right" = "idle";
    let idleFrame = 0;
    let lastIdleSwitch = 0;

    // ---------- Build StickForYou Logo ----------

    const createWave = () => {
      aliens = [];

      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      ship.y = height - 40;

      const LOGO_MARGIN = 20;
      const availableLogoWidth = width - LOGO_MARGIN * 2;

      // The actual pattern is 49 pixels wide.
      const patternColumns = LOGO_PATTERN[0].length;

      // Scale the pattern so the entire 49-pixel width fits inside the box.
      const scale = Math.min(
        width / DESIGN_WIDTH,
        availableLogoWidth / (patternColumns * TILE_SIZE),
        1,
      );

      currentScale = scale;

      currentScale = scale;

      const tileSize = TILE_SIZE * scale;
      const textTile = TEXT_TILE * scale;

      const patternRows = LOGO_PATTERN.length;

      const patternWidth = patternColumns * tileSize;
      const patternHeight = patternRows * tileSize;

      const LOGO_LEFT =
        LOGO_MARGIN + Math.round((availableLogoWidth - patternWidth) / 2) + 7;
      const LOGO_TOP = 35 * scale;
      const TEXT_START = LOGO_LEFT;

      // ===== COMPLETE LOGO PATTERN =====

      LOGO_PATTERN.forEach((row, r) => {
        [...row].forEach((pixel, c) => {
          if (pixel === "1") {
            aliens.push({
              x: LOGO_LEFT + c * tileSize,
              y: LOGO_TOP + r * tileSize,
              alive: true,
              exploding: false,
              explosionStart: 0,
              sprite: nextSprite(),
            });
          }
        });
      });

      const LETTER_GAP = 8 * scale;
      const WORD_GAP = 30 * scale;

      // ===== STICK =====

      const RIGHT_MARGIN = 20 * scale;
      const textAreaWidth = width - TEXT_START - RIGHT_MARGIN;

      // STICK
      const stickWidth = 5 * 5 * textTile + LETTER_GAP * 4;
      const stickStart = TEXT_START + (textAreaWidth - stickWidth) / 2;

      // FOR YOU
      const forWidth = 3 * 5 * textTile + LETTER_GAP * 2;
      const youWidth = 3 * 5 * textTile + LETTER_GAP * 2;
      const totalWidth = forWidth + WORD_GAP + youWidth;

      const bottomStart = TEXT_START + (textAreaWidth - totalWidth) / 2;
    };

    // ---------- Initial Setup ----------

    resize();
    createWave();

    const handleResize = () => {
      resize();
      createWave();
    };

    window.addEventListener("resize", handleResize);
    // ---------- Controls ----------

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

    let animationFrameId: number;

    const loop = (time: number) => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      ctx.clearRect(0, 0, width, height);

      // ===== Background =====

      const bgAspect = backgroundImage.width / backgroundImage.height;
      const canvasAspect = width / height;

      let bgWidth = width;
      let bgHeight = height;

      if (bgAspect > canvasAspect) {
        bgHeight = height;
        bgWidth = height * bgAspect;
      } else {
        bgWidth = width;
        bgHeight = width / bgAspect;
      }

      ctx.drawImage(
        backgroundImage,
        (width - bgWidth) / 2,
        (height - bgHeight) / 2,
        bgWidth,
        bgHeight,
      );
      // ===== Ship Movement =====

      ship.x += (ship.targetX - ship.x) * 0.18;

      if (Math.abs(ship.targetX - ship.x) < 0.5) {
        ship.x = ship.targetX;
        heroDirection = "idle";
      } else if (ship.targetX < ship.x) {
        heroDirection = "left";
      } else {
        heroDirection = "right";
      }

      if (heroDirection === "idle" && time - lastIdleSwitch >= 500) {
        idleFrame = idleFrame === 0 ? 1 : 0;
        lastIdleSwitch = time;
      }

      // ===== Auto Fire =====

      const FIRE_RATE = 21;

      if (isPlaying && time - lastShot > FIRE_RATE) {
        bullets.push({
          x: ship.x,
          y: ship.y - 21,
          sprite: bulletImages[Math.floor(Math.random() * bulletImages.length)],
        });

        lastShot = time;
      }

      // ===== Bullets =====

      bullets.forEach((b) => {
        b.y -= 9;

        const BULLET_SIZE = 7;

        ctx.drawImage(
          b.sprite,
          b.x - BULLET_SIZE / 2,
          b.y - BULLET_SIZE / 2,
          BULLET_SIZE,
          BULLET_SIZE,
        );
      });

      bullets = bullets.filter((b) => b.y > -20);

      // ===== Draw Pixels =====

      let aliveCount = 0;

      aliens.forEach((a) => {
        if (!a.alive) return;

        aliveCount++;

        // Explosion
        if (a.exploding) {
          const elapsed = time - a.explosionStart;

          if (elapsed >= EXPLOSION_TIME) {
            a.alive = false;
            return;
          }

          const SIZE = (TILE_SIZE + 8) * currentScale;

          const blastFrame =
            elapsed < EXPLOSION_TIME / 2 ? blastImages[0] : blastImages[1];

          ctx.drawImage(blastFrame, a.x - SIZE / 2, a.y - SIZE / 2, SIZE, SIZE);

          return;
        }

        // Fit image inside tile
        const maxSize = TILE_SIZE * currentScale - TILE_PADDING * 2;
        const aspect = a.sprite.width / a.sprite.height;

        let drawWidth = maxSize;
        let drawHeight = maxSize;

        if (aspect > 1) {
          drawHeight = maxSize / aspect;
        } else {
          drawWidth = maxSize * aspect;
        }

        if (a.sprite.complete && a.sprite.naturalWidth > 0) {
          ctx.fillStyle = "rgba(183, 125, 153, 0.71)";
          ctx.fillRect(
            a.x - drawWidth / 2 + 2,
            a.y - drawHeight / 2 + 2,
            drawWidth,
            drawHeight,
          );

          ctx.drawImage(
            a.sprite,
            a.x - drawWidth / 2,
            a.y - drawHeight / 2,
            drawWidth,
            drawHeight,
          );
        }
      });

      // ===== Collision =====

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

      // Remove exploded pixels
      aliens = aliens.filter((a) => a.alive);

      // New Logo
      if (aliveCount === 0) {
        createWave();
      }

      // ===== Ship =====

      const SHIP_SIZE = 67;

      let heroImage: HTMLImageElement;

      if (heroDirection === "left") {
        heroImage = heroImages.left;
      } else if (heroDirection === "right") {
        heroImage = heroImages.right;
      } else if (idleFrame === 0) {
        heroImage = heroImages.idle01;
      } else {
        heroImage = heroImages.idle02;
      }

      if (heroImage.complete && heroImage.naturalWidth > 0) {
        ctx.drawImage(
          heroImage,
          ship.x - SHIP_SIZE / 2,
          ship.y - SHIP_SIZE / 2,
          SHIP_SIZE,
          SHIP_SIZE,
        );
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    requestAnimationFrame(loop);

    // ---------- Cleanup ----------

    return () => {
      cancelAnimationFrame(animationFrameId);
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
        height: "600px",
        display: "block",
        borderRadius: "22px",
        touchAction: "none",
      }}
    />
  );
}
