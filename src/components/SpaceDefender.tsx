import { useEffect, useRef } from "react";

// ---------- Assets ----------

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
  sprite: HTMLImageElement;
};

type Bullet = {
  x: number;
  y: number;
};

export default function SpaceDefender() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    const DPR = window.devicePixelRatio || 1;

    const DESIGN_WIDTH = 700;

    const TILE_SIZE = 18;
    const TEXT_TILE = 14;
    const TILE_PADDING = 1;
    const EXPLOSION_TIME = 300;

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
      img.src = src;
      return img;
    });

    const shipImage = new Image();
    shipImage.src = shipSource;

    const backgroundImage = new Image();
    backgroundImage.src = backgroundSource;

    const blastImage = new Image();
    blastImage.src = entityBlastSource;

    // ---------- Random Pixel Picker ----------

    const nextSprite = () =>
      entityImages[Math.floor(Math.random() * entityImages.length)];

    // ---------- 5x5 Pixel Font ----------

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

    // ---------- Big Logo S (11 × 9) ----------

    const BIG_S = [
      "001111110",
      "001111111",
      "111000000",
      "111000000",
      "111111111",
      "111111111", // extra middle row
      "000000111",
      "000000111",
      "111111100",
      "011111100",
    ];

    // ---------- Game State ----------

    let aliens: Entity[] = [];
    let bullets: Bullet[] = [];
    let isPlaying = false;
    let lastShot = 0;

    const ship = {
      x: 180,
      targetX: 180,
      y: 360,
    };

    // ---------- Build StickForYou Logo ----------

    const createWave = () => {
      aliens = [];

      const width = canvas.clientWidth;

      // Scale the entire logo based on the available width.
      const scale = Math.min(width / DESIGN_WIDTH, 1);

      const tileSize = TILE_SIZE * scale;
      const textTile = TEXT_TILE * scale;

      const LOGO_WIDTH = DESIGN_WIDTH * scale;
      const LOGO_LEFT = (width - LOGO_WIDTH) / 2;

      const TEXT_START = LOGO_LEFT + 230 * scale;

      // ===== BIG S =====

      BIG_S.forEach((row, r) => {
        [...row].forEach((pixel, c) => {
          if (pixel === "1") {
            aliens.push({
              x: LOGO_LEFT + 24 * scale + c * tileSize,
              y: 30 * scale + r * tileSize,
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

      const drawWord = (word: string, startX: number, y: number) => {
        let cursor = startX;

        word.split("").forEach((char) => {
          const pattern = FONT[char];

          pattern.forEach((row, r) => {
            [...row].forEach((pixel, c) => {
              if (pixel === "1") {
                aliens.push({
                  x: cursor + c * textTile,
                  y: y + r * textTile,
                  alive: true,
                  exploding: false,
                  explosionStart: 0,
                  sprite: nextSprite(),
                });
              }
            });
          });

          cursor += 5 * textTile + LETTER_GAP * scale;
        });

        return cursor;
      };

      // ===== STICK =====

      const RIGHT_MARGIN = 20 * scale;
      const textAreaWidth = width - TEXT_START - RIGHT_MARGIN;

      // STICK
      const stickWidth = 5 * 5 * textTile + LETTER_GAP * 4;
      const stickStart = TEXT_START + (textAreaWidth - stickWidth) / 2;
      drawWord("STICK", stickStart, 30 * scale);
      // FOR YOU
      const forWidth = 3 * 5 * textTile + LETTER_GAP * 2;
      const youWidth = 3 * 5 * textTile + LETTER_GAP * 2;
      const totalWidth = forWidth + WORD_GAP + youWidth;

      const bottomStart = TEXT_START + (textAreaWidth - totalWidth) / 2;
      const afterFor = drawWord("FOR", bottomStart, 138 * scale);
      drawWord("YOU", afterFor + WORD_GAP, 138 * scale);
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

    const loop = (time: number) => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      ctx.clearRect(0, 0, width, height);

      // ===== Background =====

      ctx.drawImage(backgroundImage, 0, 0, width, height);

      // ===== Ship Movement =====

      ship.x += (ship.targetX - ship.x) * 0.18;

      // ===== Auto Fire =====

      const FIRE_RATE = 37;

      if (isPlaying && time - lastShot > FIRE_RATE) {
        bullets.push({
          x: ship.x,
          y: ship.y - 18,
        });

        lastShot = time;
      }

      // ===== Bullets =====

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

          const SIZE = TILE_SIZE + 8;

          ctx.drawImage(blastImage, a.x - SIZE / 2, a.y - SIZE / 2, SIZE, SIZE);

          return;
        }

        // Fit image inside tile
        const maxSize = TILE_SIZE - TILE_PADDING * 2;

        const aspect = a.sprite.width / a.sprite.height;

        let drawWidth = maxSize;
        let drawHeight = maxSize;

        if (aspect > 1) {
          drawHeight = maxSize / aspect;
        } else {
          drawWidth = maxSize * aspect;
        }

        ctx.drawImage(
          a.sprite,
          a.x - drawWidth / 2,
          a.y - drawHeight / 2,
          drawWidth,
          drawHeight,
        );
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

    // ---------- Cleanup ----------

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
        display: "block",
        borderRadius: "22px",
        touchAction: "none",
      }}
    />
  );
}
