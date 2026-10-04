import { useEffect, useMemo, useState } from "react";

type DecodeTextProps = {
  text: string;
  fontFamily?: string;
  fontSize?: string | number;
  rotationStartDelay?: number;
  rotationSpeed?: number;
  resolveStartDelay?: number;
  resolveDelay?: number;
  padding?: string | number;
  wrap?: boolean;
};

type TextToken = {
  value: string;
  start: number;
  isWhitespace: boolean;
};

type DecodeFrame = {
  key: string;
  characters: string[];
  resolved: boolean[];
};

type CharacterState = {
  target: string;
  characterSet: string;
  initialIndex: number;
  started: boolean;
  resolved: boolean;
  canResolve: boolean;
};

const UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
const NUMBERS = "0123456789";

export default function DecodeText({
  text,
  fontFamily = "Chillax",
  fontSize = "16px",
  rotationStartDelay = 7,
  rotationSpeed = 67,
  resolveStartDelay = 700,
  resolveDelay = 10,
  padding = "1%",
  wrap = false,
}: DecodeTextProps) {
  const [prefersReducedMotion] = useState(() =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const animationKey = [
    text,
    rotationStartDelay,
    rotationSpeed,
    resolveStartDelay,
    resolveDelay,
  ].join("\u0000");

  const [frame, setFrame] = useState<DecodeFrame>(() => ({
    key: animationKey,
    characters: prefersReducedMotion ? text.split("") : [],
    resolved: text.split("").map(() => prefersReducedMotion),
  }));

  const tokens = useMemo<TextToken[]>(
    () =>
      Array.from(text.matchAll(/\s+|\S+/g), (match) => ({
        value: match[0],
        start: match.index ?? 0,
        isWhitespace: /^\s+$/.test(match[0]),
      })),
    [text],
  );

  useEffect(() => {
    if (prefersReducedMotion || text.length === 0) return;

    const targets = text.split("");
    const states: CharacterState[] = targets.map((target) => {
      const isUppercase = /[A-Z]/.test(target);
      const isLowercase = /[a-z]/.test(target);
      const isNumber = /[0-9]/.test(target);
      const shouldRotate = isUppercase || isLowercase || isNumber;
      const characterSet = isUppercase
        ? UPPERCASE
        : isLowercase
          ? LOWERCASE
          : NUMBERS;

      return {
        target,
        characterSet,
        initialIndex: shouldRotate
          ? Math.floor(Math.random() * characterSet.length)
          : 0,
        started: false,
        resolved: false,
        canResolve: false,
      };
    });

    let visibleCharacters = targets.map(() => "");
    let resolvedCharacters = targets.map(() => false);
    let unresolvedCount = targets.length;
    const startTime = performance.now();
    let animationFrame = 0;

    const updateFrame = (time: number) => {
      const elapsed = time - startTime;
      let nextCharacters: string[] | null = null;
      let nextResolved: boolean[] | null = null;

      states.forEach((state, index) => {
        if (state.resolved) return;

        const target = state.target;
        const isRotatingCharacter = /[A-Za-z0-9]/.test(target);
        const startAt = index * rotationStartDelay;
        const resolveAt = resolveStartDelay + index * resolveDelay;

        if (!isRotatingCharacter) {
          if (elapsed < resolveAt) return;

          state.resolved = true;
          unresolvedCount -= 1;
          nextCharacters ??= visibleCharacters.slice();
          nextResolved ??= resolvedCharacters.slice();
          nextCharacters[index] = target;
          nextResolved[index] = true;
          return;
        }

        if (elapsed < startAt) return;
        state.started = true;

        const step = Math.floor((elapsed - startAt) / rotationSpeed);
        const currentIndex = (state.initialIndex + step) % state.characterSet.length;
        const currentCharacter = state.characterSet[currentIndex];

        if (!state.canResolve && elapsed >= resolveAt) {
          state.canResolve = true;
        }

        if (
          state.canResolve &&
          currentCharacter.toLowerCase() === target.toLowerCase()
        ) {
          state.resolved = true;
          unresolvedCount -= 1;
          nextCharacters ??= visibleCharacters.slice();
          nextResolved ??= resolvedCharacters.slice();
          nextCharacters[index] = target;
          nextResolved[index] = true;
          return;
        }

        if (visibleCharacters[index] !== currentCharacter) {
          nextCharacters ??= visibleCharacters.slice();
          nextCharacters[index] = currentCharacter;
        }
      });

      if (nextCharacters) visibleCharacters = nextCharacters;
      if (nextResolved) resolvedCharacters = nextResolved;

      if (nextCharacters || nextResolved) {
        setFrame({
          key: animationKey,
          characters: visibleCharacters,
          resolved: resolvedCharacters,
        });
      }

      if (unresolvedCount > 0) {
        animationFrame = window.requestAnimationFrame(updateFrame);
      }
    };

    animationFrame = window.requestAnimationFrame(updateFrame);

    return () => window.cancelAnimationFrame(animationFrame);
  }, [
    animationKey,
    rotationStartDelay,
    rotationSpeed,
    resolveStartDelay,
    resolveDelay,
    text,
    prefersReducedMotion,
  ]);

  const hasCurrentFrame = frame.key === animationKey;
  const characters = hasCurrentFrame ? frame.characters : [];
  const resolvedCharacters = hasCurrentFrame ? frame.resolved : [];

  return (
    <div
      role="group"
      aria-label={text}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        boxSizing: "border-box",
        fontFamily,
      }}
    >
      <div
        aria-hidden="true"
        style={{
          width: "100%",
          visibility: "hidden",
          whiteSpace: wrap ? "pre-wrap" : "pre",
          overflowWrap: "normal",
          boxSizing: "border-box",
          padding,
          fontFamily,
          fontSize,
          lineHeight: 1,
        }}
      >
        {text}
      </div>

      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          display: "block",
          width: "100%",
          height: "100%",
          boxSizing: "border-box",
          padding,
          overflow: "hidden",
          whiteSpace: wrap ? "pre-wrap" : "pre",
          wordBreak: "normal",
          overflowWrap: "normal",
          fontFamily,
          fontSize,
          lineHeight: 1,
        }}
      >
        {tokens.map((token, tokenIndex) => {
          if (token.isWhitespace) {
            return <span key={tokenIndex}> </span>;
          }

          return (
            <span
              key={tokenIndex}
              style={{ display: "inline-block", whiteSpace: "nowrap" }}
            >
              {token.value.split("").map((_, characterOffset) => {
                const index = token.start + characterOffset;
                const targetCharacter = text[index];
                const character =
                  characters[index] ?? (prefersReducedMotion ? targetCharacter : "\u00a0");
                const isResolved = resolvedCharacters[index] ?? prefersReducedMotion;

                return (
                  <span
                    key={index}
                    style={{
                      position: "relative",
                      display: "inline-block",
                      whiteSpace: "pre",
                    }}
                  >
                    <span style={{ visibility: "hidden" }}>{targetCharacter}</span>
                    <span
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        fontFamily,
                        color: isResolved
                          ? "var(--palette-neutral-resolved)"
                          : "var(--palette-neutral-unresolved)",
                      }}
                    >
                      {character}
                    </span>
                  </span>
                );
              })}
            </span>
          );
        })}
      </div>
    </div>
  );
}
