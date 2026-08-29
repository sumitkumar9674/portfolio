import { useEffect, useState } from "react";

type DecodeTextProps = {
  // Text that will be decoded.
  text: string;

  // Font used by both the invisible layout text and visible text.
  fontFamily?: string;

  // Font size used by both the invisible layout text and visible text.
  fontSize?: string | number;

  // Color of the outer box border.
  borderColor?: string;

  // How long to wait before each character starts rotating.
  rotationStartDelay?: number;

  // How quickly each rotating character changes.
  rotationSpeed?: number;

  // Delay before the first character is allowed to resolve.
  resolveStartDelay?: number;

  // Delay between each character's resolution turn.
  resolveDelay?: number;
};

// Characters that are allowed to rotate.
const UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
const NUMBERS = "0123456789";

export default function DecodeText({
  text,

  fontFamily = "Arial",
  fontSize = "16px",
  borderColor = "#ffffff",

  rotationStartDelay = 200,
  rotationSpeed = 50,

  resolveStartDelay = 500,
  resolveDelay = 200,
}: DecodeTextProps) {
  // Current character displayed at every position.
  const [characters, setCharacters] = useState<string[]>(
    Array.from(text, () => ""),
  );

  const [resolvedCharacters, setResolvedCharacters] = useState<boolean[]>(
    Array.from(text, () => false),
  );

  useEffect(() => {
    // Reset the visible text whenever the animation starts again.
    setCharacters(Array.from(text, () => ""));
    setResolvedCharacters(Array.from(text, () => false));

    // Store every timeout and interval so we can clean them up.
    const timers: ReturnType<typeof setTimeout>[] = [];
    const intervals: ReturnType<typeof setInterval>[] = [];

    // Create independent state for every character.
    const states = text.split("").map((target) => {
      const isUppercase = /[A-Z]/.test(target);
      const isLowercase = /[a-z]/.test(target);
      const isNumber = /[0-9]/.test(target);

      // Symbols and spaces do not rotate.
      const shouldRotate = isUppercase || isLowercase || isNumber;

      const characterSet = isUppercase
        ? UPPERCASE
        : isLowercase
          ? LOWERCASE
          : NUMBERS;

      // Pick a random starting position.
      let currentIndex = shouldRotate
        ? Math.floor(Math.random() * characterSet.length)
        : 0;

      // Whether this character has been permanently resolved.
      let resolved = false;

      // Whether this character is now allowed to resolve.
      let canResolve = false;

      return {
        target,
        shouldRotate,
        characterSet,
        currentIndex,
        resolved,
        canResolve,
      };
    });

    /*
     * Start each character's rotation.
     *
     * Character 0 starts immediately.
     * Character 1 starts after rotationStartDelay.
     * Character 2 starts after another rotationStartDelay.
     * And so on.
     */
    states.forEach((state, index) => {
      // Symbols and spaces don't need a rotation timer.
      if (!state.shouldRotate) {
        const symbolResolveTimer = setTimeout(
          () => {
            setResolvedCharacters((current) => {
              const next = [...current];

              next[index] = true;

              return next;
            });

            setCharacters((current) => {
              const next = [...current];

              next[index] = state.target;

              return next;
            });
          },
          resolveStartDelay + index * resolveDelay,
        );

        timers.push(symbolResolveTimer);

        return;
      }

      // -----------------------------
      // ROTATION WAVE
      // -----------------------------

      const rotationStartTimer = setTimeout(() => {
        // Show the random starting character immediately.
        setCharacters((current) => {
          const next = [...current];

          next[index] = state.characterSet[state.currentIndex];

          return next;
        });

        // Keep rotating until this character resolves.
        const rotationInterval = setInterval(() => {
          // Once resolved, stop changing this character.
          if (state.resolved) {
            return;
          }

          // Move to the next character in the set.
          state.currentIndex =
            (state.currentIndex + 1) % state.characterSet.length;

          const currentCharacter = state.characterSet[state.currentIndex];

          // Update the visible character.
          setCharacters((current) => {
            const next = [...current];

            next[index] = currentCharacter;

            return next;
          });

          /*
           * Resolution can only happen after this character's
           * scheduled resolution time has arrived.
           *
           * If the current rotating character is already the
           * target, lock it immediately.
           */
          if (
            state.canResolve &&
            currentCharacter.toLowerCase() === state.target.toLowerCase()
          ) {
            state.resolved = true;

            clearInterval(rotationInterval);

            setResolvedCharacters((current) => {
              const next = [...current];

              next[index] = true;

              return next;
            });

            setCharacters((current) => {
              const next = [...current];

              next[index] = state.target;

              return next;
            });
          }
        }, rotationSpeed);

        intervals.push(rotationInterval);
      }, index * rotationStartDelay);

      timers.push(rotationStartTimer);

      // -----------------------------
      // RESOLUTION WAVE
      // -----------------------------

      const resolveTimer = setTimeout(
        () => {
          /*
           * This does NOT resolve the character immediately.
           *
           * It only gives this character permission to resolve.
           *
           * The character must still wait until its rotating
           * sequence reaches the correct character.
           */
          state.canResolve = true;

          /*
           * Check whether the character is already sitting on
           * the correct letter.
           *
           * This handles the case where it happens to land on
           * the target exactly when its resolution turn begins.
           */
          if (
            state.characterSet[state.currentIndex].toLowerCase() ===
            state.target.toLowerCase()
          ) {
            state.resolved = true;

            setResolvedCharacters((current) => {
              const next = [...current];

              next[index] = true;

              return next;
            });

            setCharacters((current) => {
              const next = [...current];

              next[index] = state.target;

              return next;
            });
          }
        },
        resolveStartDelay + index * resolveDelay,
      );

      timers.push(resolveTimer);
    });

    // Clean everything when the component unmounts
    // or the text/settings change.
    return () => {
      timers.forEach((timer) => {
        clearTimeout(timer);
      });

      intervals.forEach((interval) => {
        clearInterval(interval);
      });
    };
  }, [
    text,
    rotationStartDelay,
    rotationSpeed,
    resolveStartDelay,
    resolveDelay,
  ]);

  return (
    <div
      style={{
        width: "100%",
        position: "relative",
        fontFamily,
        boxSizing: "border-box",
      }}
    >
      {/* 
        Invisible layout text.

        This determines the final size of the component
        before the animation starts.
      */}
      <div
        style={{
          width: "100%",
          visibility: "hidden",
          whiteSpace: "pre-wrap",
          overflowWrap: "normal",
          boxSizing: "border-box",
          padding: "16px",
          fontFamily,
          fontSize,
          lineHeight: "1",
        }}
      >
        {text}
      </div>

      {/*
        Visual box.

        It is positioned over the invisible text so the
        component's physical size never changes.
      */}
      <div
        style={{
          position: "absolute",
          inset: 0,

          width: "100%",
          height: "100%",

          border: `1px solid ${borderColor}`,
          boxSizing: "border-box",

          padding: "16px",
          overflow: "hidden",

          whiteSpace: "pre-wrap",
          wordBreak: "normal",
          overflowWrap: "normal",

          fontFamily,
          fontSize,
          lineHeight: "1",
        }}
      >
        {characters.map((character, index) => {
          const targetCharacter = text[index];

          return (
            <span
              key={index}
              style={{
                display: "inline-block",
                position: "relative",
                whiteSpace: "pre",
              }}
            >
              {/* Invisible target controls the real slot width */}
              <span style={{ visibility: "hidden" }}>
                {targetCharacter === " " ? "\u00A0" : targetCharacter}
              </span>

              {/* Rotating character sits inside the fixed slot */}
              <span
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  color: resolvedCharacters[index] ? "#004362" : "#ab2260",
                }}
              >
                {character || "\u00A0"}
              </span>
            </span>
          );
        })}
      </div>
    </div>
  );
}
