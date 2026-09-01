import { useEffect, useState } from "react";

type NeonFrameProps = {
  // Anything placed inside the frame.
  children: React.ReactNode;

  // Frame size.
  width?: string | number;
  height?: string | number;

  // Frame colors.
  backgroundColor?: string;
  borderColor?: string;
  cornerColor?: string;

  // Thickness of the main neon tubes.
  borderWidth?: number;

  // Thickness of the corner pipes.
  cornerWidth?: number;

  // Radius of the pipe bends.
  cornerRadius?: number;

  // Delay before the animation starts.
  initialDelay?: number;

  // Time used by each side.
  // Four sides × 250ms = approximately 1000ms.
  sideDuration?: number;

  // Strength of the neon glow.
  glowStrength?: number;

  // Strength of the colored shadow.
  shadowStrength?: number;
};

export default function NeonFrame({
  children,

  width = "fit-content",
  height = "fit-content",

  backgroundColor = "#000000",

  borderColor = "#00ffff",
  cornerColor = "#ffad00",

  borderWidth = 6,
  cornerWidth = 6,

  cornerRadius = 18,

  initialDelay = 500,

  sideDuration = 250,

  glowStrength = 0.8,
  shadowStrength = 0.8,
}: NeonFrameProps) {
  /*
   * Which sides have permanently turned on.
   *
   * 0 = left
   * 1 = top
   * 2 = right
   * 3 = bottom
   */
  const [litSides, setLitSides] = useState<boolean[]>([
    false,
    false,
    false,
    false,
  ]);

  /*
   * Which side is currently performing
   * its electrical flicker sequence.
   */
  const [activeSide, setActiveSide] = useState(-1);

  /*
   * Whether the current side is currently
   * flickering ON.
   */
  const [flickerOn, setFlickerOn] = useState(false);

  /*
   * Whether the complete animation has finished.
   */
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    /*
     * Reset the animation.
     */
    setLitSides([false, false, false, false]);
    setActiveSide(-1);
    setFlickerOn(false);
    setFinished(false);

    /*
     * Randomize the order of the four sides.
     */
    const sides = [0, 1, 2, 3];

    sides.sort(() => Math.random() - 0.5);

    let sideIndex = 0;
    let stopped = false;

    let startTimer: ReturnType<typeof setTimeout> | null = null;

    let sideTimer: ReturnType<typeof setTimeout> | null = null;

    let flickerTimer: ReturnType<typeof setTimeout> | null = null;

    /*
     * Start the glitching sequence for one side.
     */
    const startSide = (side: number) => {
      if (stopped) {
        return;
      }

      setActiveSide(side);
      setFlickerOn(false);

      const sideStartTime = Date.now();

      /*
       * Electrical flicker loop.
       */
      const flicker = () => {
        if (stopped) {
          return;
        }

        const elapsed = Date.now() - sideStartTime;

        /*
         * This side has finished its flicker window.
         */
        if (elapsed >= sideDuration) {
          setFlickerOn(false);

          /*
           * Permanently turn this side ON.
           */
          setLitSides((current) => {
            const next = [...current];

            next[side] = true;

            return next;
          });

          /*
           * Move to the next side.
           */
          sideIndex++;

          /*
           * All four sides are finished.
           */
          if (sideIndex >= sides.length) {
            setActiveSide(-1);
            setFlickerOn(false);
            setFinished(true);

            return;
          }

          /*
           * Very small gap before the next side.
           */
          sideTimer = setTimeout(() => {
            startSide(sides[sideIndex]);
          }, 15);

          return;
        }

        /*
         * Random electrical behavior.
         *
         * OFF is slightly more likely than ON.
         */
        const shouldTurnOn = Math.random() > 0.43;

        setFlickerOn(shouldTurnOn);

        /*
         * ON flashes are short.
         * OFF periods are slightly longer.
         */
        const nextDelay = shouldTurnOn
          ? 18 + Math.random() * 35
          : 35 + Math.random() * 65;

        flickerTimer = setTimeout(flicker, nextDelay);
      };

      /*
       * Start immediately.
       */
      flicker();
    };

    /*
     * Initial delay.
     */
    startTimer = setTimeout(() => {
      startSide(sides[0]);
    }, initialDelay);

    /*
     * Cleanup.
     */
    return () => {
      stopped = true;

      if (startTimer) {
        clearTimeout(startTimer);
      }

      if (sideTimer) {
        clearTimeout(sideTimer);
      }

      if (flickerTimer) {
        clearTimeout(flickerTimer);
      }
    };
  }, [initialDelay, sideDuration]);

  /*
   * Determines whether a side should currently
   * appear illuminated.
   */
  const isSideOn = (side: number) => {
    return finished || litSides[side] || (activeSide === side && flickerOn);
  };

  /*
   * Directional illumination mask.
   */
  const getContentGradient = () => {
    /*
     * Final state.
     */
    if (finished) {
      return "transparent";
    }

    /*
     * No active light.
     */
    if (activeSide === -1 || !flickerOn) {
      return "rgba(0, 0, 0, 0.96)";
    }

    /*
     * LEFT → RIGHT
     */
    if (activeSide === 0) {
      return `
        linear-gradient(
          to right,
          rgba(0, 0, 0, 0)
          0%,
          rgba(0, 0, 0, 0.12)
          18%,
          rgba(0, 0, 0, 0.50)
          48%,
          rgba(0, 0, 0, 0.85)
          75%,
          rgba(0, 0, 0, 0.96)
          100%
        )
      `;
    }

    /*
     * TOP → BOTTOM
     */
    if (activeSide === 1) {
      return `
        linear-gradient(
          to bottom,
          rgba(0, 0, 0, 0)
          0%,
          rgba(0, 0, 0, 0.12)
          18%,
          rgba(0, 0, 0, 0.50)
          48%,
          rgba(0, 0, 0, 0.85)
          75%,
          rgba(0, 0, 0, 0.96)
          100%
        )
      `;
    }

    /*
     * RIGHT → LEFT
     */
    if (activeSide === 2) {
      return `
        linear-gradient(
          to left,
          rgba(0, 0, 0, 0)
          0%,
          rgba(0, 0, 0, 0.12)
          18%,
          rgba(0, 0, 0, 0.50)
          48%,
          rgba(0, 0, 0, 0.85)
          75%,
          rgba(0, 0, 0, 0.96)
          100%
        )
      `;
    }

    /*
     * BOTTOM → TOP
     */
    return `
      linear-gradient(
        to top,
        rgba(0, 0, 0, 0)
        0%,
        rgba(0, 0, 0, 0.12)
        18%,
        rgba(0, 0, 0, 0.50)
        48%,
        rgba(0, 0, 0, 0.85)
        75%,
        rgba(0, 0, 0, 0.96)
        100%
      )
    `;
  };

  /*
   * Creates the lifted shadow.
   */
  const getFrameShadow = () => {
    if (finished) {
      return `
        0 8px 18px
        rgba(
          0,
          255,
          255,
          ${0.12 * shadowStrength}
        )
      `;
    }

    if (activeSide !== -1 && flickerOn) {
      return `
        0 7px 16px
        rgba(
          0,
          255,
          255,
          ${0.25 * shadowStrength}
        )
      `;
    }

    return `
      0 8px 18px
      rgba(0, 0, 0, 0.35)
    `;
  };

  /*
   * Main neon pipe glow.
   */
  const pipeGlow = `
    0 0 ${3 * glowStrength}px ${borderColor},
    0 4px ${8 * glowStrength}px ${borderColor}
  `;

  /*
   * Size used by the SVG corner.
   *
   * The SVG is large enough to contain the
   * complete quarter-circle pipe.
   */
  const cornerSize = cornerRadius + cornerWidth;

  return (
    <div
      style={{
        width,
        height,

        position: "relative",

        display: "inline-block",

        padding: "28px",

        backgroundColor,
        margin: "9px",

        boxSizing: "border-box",

        borderRadius: cornerRadius,

        boxShadow: getFrameShadow(),
      }}
    >
      {/* ================================= */}
      {/* CONTENT */}
      {/* ================================= */}

      <div
        style={{
          position: "relative",
          zIndex: 1,
        }}
      >
        {children}
      </div>

      {/* ================================= */}
      {/* CONTENT ILLUMINATION MASK */}
      {/* ================================= */}

      <div
        style={{
          position: "absolute",

          inset: 0,

          zIndex: 3,

          pointerEvents: "none",

          background: getContentGradient(),

          borderRadius: cornerRadius,
        }}
      />

      {/* ================================= */}
      {/* TOP NEON PIPE */}
      {/* ================================= */}

      <div
        style={{
          position: "absolute",

          top: 0,
          left: cornerRadius,
          right: cornerRadius,

          height: borderWidth,

          backgroundColor: isSideOn(1) ? borderColor : "#d8d8d8",

          opacity: 1,

          zIndex: 5,

          borderRadius: borderWidth,

          boxShadow: isSideOn(1)
            ? pipeGlow
            : `
              0 1px 2px
              rgba(0, 0, 0, 0.25)
            `,
        }}
      />

      {/* ================================= */}
      {/* RIGHT NEON PIPE */}
      {/* ================================= */}

      <div
        style={{
          position: "absolute",

          top: cornerRadius,
          right: 0,
          bottom: cornerRadius,

          width: borderWidth,

          backgroundColor: isSideOn(2) ? borderColor : "#d8d8d8",

          opacity: 1,

          zIndex: 5,

          borderRadius: borderWidth,

          boxShadow: isSideOn(2)
            ? `
              0 0 ${3 * glowStrength}px ${borderColor},
              -4px 0 ${8 * glowStrength}px ${borderColor}
            `
            : `
              0 1px 2px
              rgba(0, 0, 0, 0.25)
            `,
        }}
      />

      {/* ================================= */}
      {/* BOTTOM NEON PIPE */}
      {/* ================================= */}

      <div
        style={{
          position: "absolute",

          bottom: 0,
          left: cornerRadius,
          right: cornerRadius,

          height: borderWidth,

          backgroundColor: isSideOn(3) ? borderColor : "#d8d8d8",

          opacity: 1,

          zIndex: 5,

          borderRadius: borderWidth,

          boxShadow: isSideOn(3)
            ? `
              0 0 ${3 * glowStrength}px ${borderColor},
              0 -4px ${8 * glowStrength}px ${borderColor}
            `
            : `
              0 1px 2px
              rgba(0, 0, 0, 0.25)
            `,
        }}
      />

      {/* ================================= */}
      {/* LEFT NEON PIPE */}
      {/* ================================= */}

      <div
        style={{
          position: "absolute",

          top: cornerRadius,
          left: 0,
          bottom: cornerRadius,

          width: borderWidth,

          backgroundColor: isSideOn(0) ? borderColor : "#d8d8d8",

          opacity: 1,

          zIndex: 5,

          borderRadius: borderWidth,

          boxShadow: isSideOn(0)
            ? `
              0 0 ${3 * glowStrength}px ${borderColor},
              4px 0 ${8 * glowStrength}px ${borderColor}
            `
            : `
              0 1px 2px
              rgba(0, 0, 0, 0.25)
            `,
        }}
      />

      {/* ================================= */}
      {/* TOP-LEFT CORNER */}
      {/* ================================= */}

      <svg
        width={cornerSize}
        height={cornerSize}
        viewBox={`0 0 ${cornerSize} ${cornerSize}`}
        style={{
          position: "absolute",

          top: 0,
          left: 0,

          zIndex: 6,

          pointerEvents: "none",

          overflow: "visible",
        }}
      >
        <path
          d={`
            M ${cornerRadius} ${cornerWidth / 2}
            A ${cornerRadius - cornerWidth / 2}
              ${cornerRadius - cornerWidth / 2}
              0
              0
              0
              ${cornerWidth / 2}
              ${cornerRadius}
          `}
          fill="none"
          stroke={cornerColor}
          strokeWidth={cornerWidth}
          strokeLinecap="round"
          style={{
            filter: `
              drop-shadow(
                0 0
                ${3 * glowStrength}px
                ${cornerColor}
              )
            `,
          }}
        />
      </svg>

      {/* ================================= */}
      {/* TOP-RIGHT CORNER */}
      {/* ================================= */}

      <svg
        width={cornerSize}
        height={cornerSize}
        viewBox={`0 0 ${cornerSize} ${cornerSize}`}
        style={{
          position: "absolute",

          top: 0,
          right: 0,

          zIndex: 6,

          pointerEvents: "none",

          overflow: "visible",
        }}
      >
        <path
          d={`
            M ${cornerSize - cornerRadius}
              ${cornerWidth / 2}
            A ${cornerRadius - cornerWidth / 2}
              ${cornerRadius - cornerWidth / 2}
              0
              0
              1
              ${cornerSize - cornerWidth / 2}
              ${cornerRadius}
          `}
          fill="none"
          stroke={cornerColor}
          strokeWidth={cornerWidth}
          strokeLinecap="round"
          style={{
            filter: `
              drop-shadow(
                0 0
                ${3 * glowStrength}px
                ${cornerColor}
              )
            `,
          }}
        />
      </svg>

      {/* ================================= */}
      {/* BOTTOM-RIGHT CORNER */}
      {/* ================================= */}

      <svg
        width={cornerSize}
        height={cornerSize}
        viewBox={`0 0 ${cornerSize} ${cornerSize}`}
        style={{
          position: "absolute",

          bottom: 0,
          right: 0,

          zIndex: 6,

          pointerEvents: "none",

          overflow: "visible",
        }}
      >
        <path
          d={`
            M ${cornerSize - cornerWidth / 2}
              ${cornerSize - cornerRadius}
            A ${cornerRadius - cornerWidth / 2}
              ${cornerRadius - cornerWidth / 2}
              0
              0
              1
              ${cornerSize - cornerRadius}
              ${cornerSize - cornerWidth / 2}
          `}
          fill="none"
          stroke={cornerColor}
          strokeWidth={cornerWidth}
          strokeLinecap="round"
          style={{
            filter: `
              drop-shadow(
                0 0
                ${3 * glowStrength}px
                ${cornerColor}
              )
            `,
          }}
        />
      </svg>

      {/* ================================= */}
      {/* BOTTOM-LEFT CORNER */}
      {/* ================================= */}

      <svg
        width={cornerSize}
        height={cornerSize}
        viewBox={`0 0 ${cornerSize} ${cornerSize}`}
        style={{
          position: "absolute",

          bottom: 0,
          left: 0,

          zIndex: 6,

          pointerEvents: "none",

          overflow: "visible",
        }}
      >
        <path
          d={`
            M ${cornerWidth / 2}
              ${cornerSize - cornerRadius}
            A ${cornerRadius - cornerWidth / 2}
              ${cornerRadius - cornerWidth / 2}
              0
              0
              0
              ${cornerRadius}
              ${cornerSize - cornerWidth / 2}
          `}
          fill="none"
          stroke={cornerColor}
          strokeWidth={cornerWidth}
          strokeLinecap="round"
          style={{
            filter: `
              drop-shadow(
                0 0
                ${3 * glowStrength}px
                ${cornerColor}
              )
            `,
          }}
        />
      </svg>
    </div>
  );
}
