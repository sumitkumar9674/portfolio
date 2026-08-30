import { useEffect, useState } from "react";

type NeonTextProps = {
  // Text to display.
  text: string;

  // Font used by the text.
  fontFamily?: string;

  // Size of the text.
  fontSize?: string | number;

  // Final color of the neon text.
  textColor?: string;

  // Background color behind the text.
  backgroundColor?: string;

  // Delay before the flicker animation begins.
  initialDelay?: number;

  // Total duration of the flicker animation.
  flickerDuration?: number;

  // How quickly the flicker checks for a new state.
  flickerSpeed?: number;
};

export default function NeonText({
  text,

  fontFamily = "Arial",
  fontSize = "32px",

  textColor = "#00ffff",
  backgroundColor = "#000000",

  initialDelay = 500,
  flickerDuration = 1500,
  flickerSpeed = 80,
}: NeonTextProps) {
  // Current brightness of the neon text.
  const [brightness, setBrightness] = useState(0);

  useEffect(() => {
    // Start completely dark whenever the animation restarts.
    setBrightness(0);

    let flickerInterval: ReturnType<typeof setInterval> | null = null;

    // --------------------------------
    // INITIAL DELAY
    // --------------------------------

    const startTimer = setTimeout(() => {
      const startTime = Date.now();

      // --------------------------------
      // GLITCH FLICKER
      // --------------------------------

      flickerInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;

        /*
         * Once the flicker duration is finished,
         * turn the neon fully on and stop flickering.
         */
        if (elapsed >= flickerDuration) {
          if (flickerInterval) {
            clearInterval(flickerInterval);
            flickerInterval = null;
          }

          setBrightness(1);

          return;
        }

        /*
         * Progress through the animation.
         *
         * 0 = beginning
         * 1 = almost finished
         */
        const progress = elapsed / flickerDuration;

        // --------------------------------
        // GLITCH INTENSITY
        // --------------------------------

        /*
         * Early in the animation:
         * mostly dark with occasional flashes.
         *
         * Later:
         * increasingly aggressive flickering.
         */
        const intensity = progress < 0.35 ? 0.25 : progress < 0.7 ? 0.55 : 1;

        const random = Math.random();

        let nextBrightness = 0;

        // --------------------------------
        // EARLY FLICKER
        // --------------------------------

        if (progress < 0.35) {
          /*
           * Mostly very dim.
           */
          if (random > 0.65) {
            nextBrightness = Math.random() * 0.35;
          }
        }

        // --------------------------------
        // MIDDLE FLICKER
        // --------------------------------
        else if (progress < 0.7) {
          /*
           * More frequent and stronger flashes.
           */
          if (random > 0.35) {
            nextBrightness = Math.random() * 0.75;
          }

          /*
           * Occasionally hit a bright flash.
           */
          if (random > 0.85) {
            nextBrightness = 1;
          }
        }

        // --------------------------------
        // FINAL RAPID FLICKER
        // --------------------------------
        else {
          /*
           * Very aggressive ON/OFF behavior.
           */
          if (random > 0.5) {
            nextBrightness = Math.random() > 0.35 ? 1 : 0.7;
          } else {
            nextBrightness = 0;
          }
        }

        /*
         * Apply the new brightness immediately.
         *
         * There is intentionally NO CSS transition.
         *
         * This makes the light jump between states
         * instead of smoothly fading.
         */
        setBrightness(nextBrightness);
      }, flickerSpeed);
    }, initialDelay);

    // --------------------------------
    // CLEANUP
    // --------------------------------

    return () => {
      clearTimeout(startTimer);

      if (flickerInterval) {
        clearInterval(flickerInterval);
      }
    };
  }, [text, initialDelay, flickerDuration, flickerSpeed]);

  // --------------------------------
  // SUBTLE NEON GLOW
  // --------------------------------

  /*
   * Keep the glow deliberately small.
   *
   * This allows the component to work with
   * very large text without creating a huge halo.
   */
  const glowSize = 2 + brightness * 5;

  return (
    <div
      style={{
        width: "100%",
        backgroundColor,
        boxSizing: "border-box",

        display: "flex",
        alignItems: "center",
        justifyContent: "center",

        padding: "20px",
      }}
    >
      <span
        style={{
          fontFamily,
          fontSize,
          color: textColor,

          /*
           * Hard brightness changes create the
           * glitchy electrical-light effect.
           */
          opacity: 0.03 + brightness * 0.97,

          /*
           * Very subtle glow.
           */
          textShadow:
            brightness > 0 ? `0 0 ${glowSize}px ${textColor}` : "none",

          /*
           * No transition.
           *
           * The brightness should jump instantly.
           */
          whiteSpace: "pre-wrap",
        }}
      >
        {text}
      </span>
    </div>
  );
}
