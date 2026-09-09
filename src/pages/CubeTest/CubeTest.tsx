// ------------------------------------------------------------
// CubeTest
// ------------------------------------------------------------
// Standalone test screen for the 3D portfolio cube.
//
// IMPORTANT ARCHITECTURE:
//
// 1. The cube is one rigid 3D object.
// 2. Every screen is permanently attached to one physical face.
// 3. Quaternions control the cube's complete orientation.
// 4. Every navigation movement is exactly one 90° roll.
// 5. SLERP smoothly animates between exact orientations.
// 6. Screen content is NEVER swapped after a rotation.
// 7. Screens are NEVER rotated independently.
// 8. Orientation is checked only after navigation finishes.
// 9. Orientation correction rotates the ENTIRE cube.
// 10. Dragging is handled only by the cube scene.
// 11. The joystick is temporary testing navigation.
// ------------------------------------------------------------

import { useEffect, useRef, useState } from "react";
import "./CubeTest.css";
import CubeScreenNavigation from "../../components/CubeScreenNavigation/CubeScreenNavigation";
import HomeScreen from "../../screens/HomeScreen/HomeScreen";
import ProjectsScreen from "../../screens/ProjectsScreen/ProjectsScreen";
import SkillsScreen from "../../screens/SkillsScreen/SkillsScreen";
import AboutScreen from "../../screens/AboutScreen/AboutScreen";
import BlogScreen from "../../screens/BlogScreen/BlogScreen";
import ContactScreen from "../../screens/ContactScreen/ContactScreen";

// ------------------------------------------------------------
// Quaternion type
// ------------------------------------------------------------

type Quaternion = {
  x: number;
  y: number;
  z: number;
  w: number;
};

// ------------------------------------------------------------
// Cube movement directions
// ------------------------------------------------------------

type Direction = "left" | "right" | "up" | "down";

// ------------------------------------------------------------
// Screen names
// ------------------------------------------------------------

const screenNames = {
  home: "HOME",
  projects: "PROJECTS",
  skills: "SKILLS",
  about: "ABOUT",
  blog: "BLOG",
  contact: "CONTACT",
};

// ------------------------------------------------------------
// A screen that can be used as a navigation target.
// ------------------------------------------------------------

type ScreenId = keyof typeof screenNames;

// ------------------------------------------------------------
// Physical cube face assignment.
//
// These screens NEVER change physical faces.
//
// The content is permanently attached to these faces.
// ------------------------------------------------------------

const cubeState = {
  front: "home",
  back: "projects",
  left: "skills",
  right: "about",
  top: "blog",
  bottom: "contact",
} as const;

// ------------------------------------------------------------
// Create quaternion from axis + angle.
// ------------------------------------------------------------

function quaternionFromAxisAngle(
  axisX: number,
  axisY: number,
  axisZ: number,
  angle: number,
): Quaternion {
  const halfAngle = angle / 2;
  const sinHalfAngle = Math.sin(halfAngle);

  return {
    x: axisX * sinHalfAngle,
    y: axisY * sinHalfAngle,
    z: axisZ * sinHalfAngle,
    w: Math.cos(halfAngle),
  };
}

// ------------------------------------------------------------
// Multiply two quaternions.
//
// This combines two rotations.
// ------------------------------------------------------------

function multiplyQuaternions(a: Quaternion, b: Quaternion): Quaternion {
  return {
    x: a.w * b.x + a.x * b.w + a.y * b.z - a.z * b.y,

    y: a.w * b.y - a.x * b.z + a.y * b.w + a.z * b.x,

    z: a.w * b.z + a.x * b.y - a.y * b.x + a.z * b.w,

    w: a.w * b.w - a.x * b.x - a.y * b.y - a.z * b.z,
  };
}

// ------------------------------------------------------------
// Normalize quaternion.
// ------------------------------------------------------------

function normalizeQuaternion(quaternion: Quaternion): Quaternion {
  const length = Math.sqrt(
    quaternion.x * quaternion.x +
      quaternion.y * quaternion.y +
      quaternion.z * quaternion.z +
      quaternion.w * quaternion.w,
  );

  return {
    x: quaternion.x / length,
    y: quaternion.y / length,
    z: quaternion.z / length,
    w: quaternion.w / length,
  };
}

// ------------------------------------------------------------
// Quaternion dot product.
// ------------------------------------------------------------

function quaternionDot(a: Quaternion, b: Quaternion): number {
  return a.x * b.x + a.y * b.y + a.z * b.z + a.w * b.w;
}

// ------------------------------------------------------------
// Spherical interpolation between two quaternions.
// ------------------------------------------------------------

function slerpQuaternion(
  start: Quaternion,
  end: Quaternion,
  amount: number,
): Quaternion {
  let endQuaternion = end;

  let dot = quaternionDot(start, endQuaternion);

  // ----------------------------------------------------------
  // q and -q represent the same rotation.
  // Use the shortest path.
  // ----------------------------------------------------------

  if (dot < 0) {
    endQuaternion = {
      x: -endQuaternion.x,
      y: -endQuaternion.y,
      z: -endQuaternion.z,
      w: -endQuaternion.w,
    };

    dot = -dot;
  }

  // ----------------------------------------------------------
  // If the rotations are almost identical, use linear
  // interpolation and normalize the result.
  // ----------------------------------------------------------

  if (dot > 0.9995) {
    return normalizeQuaternion({
      x: start.x + amount * (endQuaternion.x - start.x),

      y: start.y + amount * (endQuaternion.y - start.y),

      z: start.z + amount * (endQuaternion.z - start.z),

      w: start.w + amount * (endQuaternion.w - start.w),
    });
  }

  const theta = Math.acos(dot);
  const sinTheta = Math.sin(theta);

  const weightStart = Math.sin((1 - amount) * theta) / sinTheta;

  const weightEnd = Math.sin(amount * theta) / sinTheta;

  return {
    x: start.x * weightStart + endQuaternion.x * weightEnd,

    y: start.y * weightStart + endQuaternion.y * weightEnd,

    z: start.z * weightStart + endQuaternion.z * weightEnd,

    w: start.w * weightStart + endQuaternion.w * weightEnd,
  };
}

// ------------------------------------------------------------
// Rotate a 3D vector by a quaternion.
// ------------------------------------------------------------

function rotateVectorByQuaternion(
  quaternion: Quaternion,
  vector: {
    x: number;
    y: number;
    z: number;
  },
) {
  const vectorQuaternion: Quaternion = {
    x: vector.x,
    y: vector.y,
    z: vector.z,
    w: 0,
  };

  const inverse: Quaternion = {
    x: -quaternion.x,
    y: -quaternion.y,
    z: -quaternion.z,
    w: quaternion.w,
  };

  const rotated = multiplyQuaternions(
    multiplyQuaternions(quaternion, vectorQuaternion),
    inverse,
  );

  return {
    x: rotated.x,
    y: rotated.y,
    z: rotated.z,
  };
}

// ------------------------------------------------------------
// Convert quaternion to CSS matrix3d().
// ------------------------------------------------------------

function quaternionToCSSMatrix(quaternion: Quaternion): string {
  const { x, y, z, w } = quaternion;

  const xx = x * x;
  const yy = y * y;
  const zz = z * z;

  const xy = x * y;
  const xz = x * z;
  const yz = y * z;

  const wx = w * x;
  const wy = w * y;
  const wz = w * z;

  const m11 = 1 - 2 * (yy + zz);
  const m12 = 2 * (xy - wz);
  const m13 = 2 * (xz + wy);

  const m21 = 2 * (xy + wz);
  const m22 = 1 - 2 * (xx + zz);
  const m23 = 2 * (yz - wx);

  const m31 = 2 * (xz - wy);
  const m32 = 2 * (yz + wx);
  const m33 = 1 - 2 * (xx + yy);

  return `
    matrix3d(
      ${m11}, ${m21}, ${m31}, 0,
      ${m12}, ${m22}, ${m32}, 0,
      ${m13}, ${m23}, ${m33}, 0,
      0, 0, 0, 1
    )
  `;
}

// ------------------------------------------------------------
// CubeTest props
// ------------------------------------------------------------

type CubeTestProps = {
  // ----------------------------------------------------------
  // Controls the speed of every cube movement.
  //
  // Lower value = faster.
  // Higher value = slower.
  // ----------------------------------------------------------

  rotationDuration?: number;
};

// ------------------------------------------------------------
// CubeTest component
// ------------------------------------------------------------

export default function CubeTest({ rotationDuration = 350 }: CubeTestProps) {
  // ----------------------------------------------------------
  // Current physical orientation of the entire cube.
  // ----------------------------------------------------------

  const [cubeRotation, setCubeRotation] = useState<Quaternion>({
    x: 0,
    y: 0,
    z: 0,
    w: 1,
  });

  // ----------------------------------------------------------
  // Prevent another movement while an animation is active.
  // ----------------------------------------------------------

  const isMoving = useRef(false);

  // ----------------------------------------------------------
  // Current animation frame.
  // ----------------------------------------------------------

  const animationFrame = useRef<number | null>(null);
  const searchAxisDirection = useRef<Direction>("left");

  // ----------------------------------------------------------
  // Starting pointer position for drag detection.
  // ----------------------------------------------------------

  const pointerStart = useRef<{
    x: number;
    y: number;
  } | null>(null);

  // ----------------------------------------------------------
  // LEFT navigation roll.
  // ----------------------------------------------------------

  function moveLeft(current: Quaternion): Quaternion {
    const rotation = quaternionFromAxisAngle(0, 1, 0, Math.PI / 2);

    return normalizeQuaternion(multiplyQuaternions(rotation, current));
  }

  // ----------------------------------------------------------
  // RIGHT navigation roll.
  // ----------------------------------------------------------

  function moveRight(current: Quaternion): Quaternion {
    const rotation = quaternionFromAxisAngle(0, 1, 0, -Math.PI / 2);

    return normalizeQuaternion(multiplyQuaternions(rotation, current));
  }

  // ----------------------------------------------------------
  // UP navigation roll.
  // ----------------------------------------------------------

  function moveUp(current: Quaternion): Quaternion {
    const rotation = quaternionFromAxisAngle(1, 0, 0, Math.PI / 2);

    return normalizeQuaternion(multiplyQuaternions(rotation, current));
  }

  // ----------------------------------------------------------
  // DOWN navigation roll.
  // ----------------------------------------------------------

  function moveDown(current: Quaternion): Quaternion {
    const rotation = quaternionFromAxisAngle(1, 0, 0, -Math.PI / 2);

    return normalizeQuaternion(multiplyQuaternions(rotation, current));
  }

  // ----------------------------------------------------------
  // Local geometry of every physical cube face.
  //
  // normal = direction the face points
  // up     = direction considered "up" on that screen
  // ----------------------------------------------------------

  function getFaceVectors() {
    return {
      front: {
        normal: {
          x: 0,
          y: 0,
          z: 1,
        },

        up: {
          x: 0,
          y: 1,
          z: 0,
        },
      },

      back: {
        normal: {
          x: 0,
          y: 0,
          z: -1,
        },

        up: {
          x: 0,
          y: 1,
          z: 0,
        },
      },

      right: {
        normal: {
          x: 1,
          y: 0,
          z: 0,
        },

        up: {
          x: 0,
          y: 1,
          z: 0,
        },
      },

      left: {
        normal: {
          x: -1,
          y: 0,
          z: 0,
        },

        up: {
          x: 0,
          y: 1,
          z: 0,
        },
      },

      top: {
        normal: {
          x: 0,
          y: 1,
          z: 0,
        },

        up: {
          x: 0,
          y: 0,
          z: -1,
        },
      },

      bottom: {
        normal: {
          x: 0,
          y: -1,
          z: 0,
        },

        up: {
          x: 0,
          y: 0,
          z: 1,
        },
      },
    };
  }

  // ----------------------------------------------------------
  // Determine which physical face is currently facing the
  // camera.
  //
  // The camera sees the face whose normal points most strongly
  // toward +Z.
  // ----------------------------------------------------------

  function getFrontFace(rotation: Quaternion): keyof typeof cubeState {
    const faceVectors = getFaceVectors();

    let bestFace: keyof typeof cubeState | null = null;

    let bestScore = -Infinity;

    (Object.keys(faceVectors) as Array<keyof typeof cubeState>).forEach(
      (face) => {
        const transformedNormal = rotateVectorByQuaternion(
          rotation,
          faceVectors[face].normal,
        );

        if (transformedNormal.z > bestScore) {
          bestScore = transformedNormal.z;

          bestFace = face;
        }
      },
    );

    return bestFace!;
  }

  // ----------------------------------------------------------
  // Determine how the current front face is oriented.
  //
  // We only care about the screen that is currently facing
  // the camera.
  //
  // The result is rounded to the nearest 90°.
  // ----------------------------------------------------------

  function getOrientationCorrection(rotation: Quaternion): number {
    const faceVectors = getFaceVectors();

    const frontFace = getFrontFace(rotation);

    // --------------------------------------------------------
    // Transform the "up" direction of the physical front face
    // into world/camera coordinates.
    // --------------------------------------------------------

    const transformedUp = rotateVectorByQuaternion(
      rotation,
      faceVectors[frontFace].up,
    );

    // --------------------------------------------------------
    // Only the X/Y direction matters on the computer screen.
    // --------------------------------------------------------

    const screenX = transformedUp.x;

    const screenY = transformedUp.y;

    // --------------------------------------------------------
    // Calculate the screen's current rotation.
    //
    // 0°   = upright
    // 90°  = sideways
    // 180° = upside down
    // 270° = sideways the other way
    // --------------------------------------------------------

    const currentAngle = Math.atan2(screenX, screenY);

    // --------------------------------------------------------
    // Convert to the nearest exact quarter-turn.
    // --------------------------------------------------------

    const quarterTurns = Math.round(currentAngle / (Math.PI / 2));

    // --------------------------------------------------------
    // IMPORTANT:
    //
    // The previous version used the opposite sign here.
    //
    // That worked for 180° because clockwise and
    // counter-clockwise both produce the same result.
    //
    // But for a sideways screen, that made the correction
    // rotate toward the upside-down orientation instead of
    // the upright orientation.
    //
    // The positive direction is the correct whole-cube
    // correction for the screen's measured orientation.
    // --------------------------------------------------------

    return quarterTurns * (Math.PI / 2);
  }

  // ----------------------------------------------------------
  // Animate the entire cube to a target quaternion.
  //
  // This is shared by navigation and automatic orientation
  // correction.
  // ----------------------------------------------------------

  function animateCubeTo(
    startRotation: Quaternion,
    targetRotation: Quaternion,
    onComplete?: () => void,
  ) {
    const startTime = performance.now();

    function animate(currentTime: number) {
      const elapsed = currentTime - startTime;

      const rawProgress = Math.min(elapsed / rotationDuration, 1);

      // ------------------------------------------------------
      // Smooth ease-in / ease-out.
      // ------------------------------------------------------

      const progress =
        rawProgress < 0.5
          ? 2 * rawProgress * rawProgress
          : 1 - Math.pow(-2 * rawProgress + 2, 2) / 2;

      // ------------------------------------------------------
      // Calculate current physical cube orientation.
      // ------------------------------------------------------

      const currentRotation = slerpQuaternion(
        startRotation,
        targetRotation,
        progress,
      );

      setCubeRotation(currentRotation);

      // ------------------------------------------------------
      // Continue until the exact target.
      // ------------------------------------------------------

      if (rawProgress < 1) {
        animationFrame.current = requestAnimationFrame(animate);

        return;
      }

      // ------------------------------------------------------
      // Force exact final orientation.
      // ------------------------------------------------------

      setCubeRotation(targetRotation);

      animationFrame.current = null;

      // ------------------------------------------------------
      // Only after the animation has fully finished do we
      // execute the next stage.
      // ------------------------------------------------------

      if (onComplete) {
        onComplete();
      }
    }

    animationFrame.current = requestAnimationFrame(animate);
  }

  // ----------------------------------------------------------
  // Perform one navigation movement.
  //
  // IMPORTANT:
  //
  // Orientation is checked ONLY after this navigation roll
  // completely finishes.
  //
  // Later, when multi-roll navigation is added, the same
  // principle will be used: orientation checking happens only
  // after the FINAL navigation roll.
  // ----------------------------------------------------------

  // ----------------------------------------------------------
  // Get the physical screen currently facing the camera.
  //
  // IMPORTANT:
  //
  // This reads the actual physical cube orientation.
  //
  // We do NOT change cubeState.
  // We do NOT swap screens.
  // ----------------------------------------------------------

  function getFrontScreen(rotation: Quaternion): ScreenId {
    const frontFace = getFrontFace(rotation);

    return cubeState[frontFace];
  }

  // ----------------------------------------------------------
  // Calculate the target quaternion for one 90° roll.
  // ----------------------------------------------------------

  function getMovementRotation(
    direction: Direction,
    currentRotation: Quaternion,
  ): Quaternion {
    if (direction === "left") {
      return moveLeft(currentRotation);
    }

    if (direction === "right") {
      return moveRight(currentRotation);
    }

    if (direction === "up") {
      return moveUp(currentRotation);
    }

    return moveDown(currentRotation);
  }

  // ----------------------------------------------------------
  // Apply the existing Z-axis orientation correction.
  //
  // This is intentionally kept separate from navigation.
  //
  // Manual movement calls this after ONE roll.
  //
  // Target-screen navigation calls this ONLY after the
  // requested physical screen has reached the front.
  // ----------------------------------------------------------

  function correctCubeOrientation(
    rotation: Quaternion,
    onComplete: () => void,
  ) {
    const correctionAngle = getOrientationCorrection(rotation);

    // --------------------------------------------------------
    // The screen is already upright.
    // --------------------------------------------------------

    if (Math.abs(correctionAngle) < 0.01) {
      onComplete();

      return;
    }

    // --------------------------------------------------------
    // Rotate the ENTIRE cube around the front/back axis.
    //
    // The screen itself is never rotated independently.
    // --------------------------------------------------------

    const correctionRotation = quaternionFromAxisAngle(
      0,
      0,
      1,
      correctionAngle,
    );

    const correctedTarget = normalizeQuaternion(
      multiplyQuaternions(correctionRotation, rotation),
    );

    // --------------------------------------------------------
    // Animate the final orientation correction.
    // --------------------------------------------------------

    animateCubeTo(rotation, correctedTarget, onComplete);
  }

  // ----------------------------------------------------------
  // Perform ONE physical 90° cube roll.
  //
  // This function does NOT perform orientation correction.
  //
  // That is extremely important for multi-roll navigation.
  //
  // Navigation can therefore do:
  //
  // 90° → check
  // 90° → check
  // 90° → check
  //
  // without the cube being corrected between rolls.
  // ----------------------------------------------------------

  function performNavigationRoll(
    direction: Direction,
    currentRotation: Quaternion,
    onComplete: (nextRotation: Quaternion) => void,
  ) {
    const targetRotation = getMovementRotation(direction, currentRotation);

    animateCubeTo(currentRotation, targetRotation, () => {
      onComplete(targetRotation);
    });
  }

  // ----------------------------------------------------------
  // Pick a random direction on one axis.
  //
  // horizontal = LEFT or RIGHT
  // vertical   = UP or DOWN
  // ----------------------------------------------------------

  function getRandomDirection(axis: "horizontal" | "vertical"): Direction {
    if (axis === "horizontal") {
      return Math.random() < 0.5 ? "left" : "right";
    }

    return Math.random() < 0.5 ? "up" : "down";
  }

  // ----------------------------------------------------------
  // Navigate to a specific physical screen.
  //
  // The search works in two guaranteed finite stages:
  //
  // 1. Pick X or Y randomly.
  // 2. Pick a random direction on that axis.
  // 3. Roll 90° and check.
  // 4. Roll another 90° and check.
  // 5. Roll another 90° and check.
  //
  // If the target wasn't found after the 270° sweep,
  // switch to the other axis.
  //
  // Once the target reaches the front:
  //
  // ONLY THEN perform the Z-axis orientation correction.
  //
  // There is no infinite random loop.
  // ----------------------------------------------------------

  function navigateToScreen(targetScreen: ScreenId) {
    // --------------------------------------------------------
    // Ignore navigation requests while the cube is moving.
    // --------------------------------------------------------

    if (isMoving.current) {
      return;
    }

    // --------------------------------------------------------
    // If the requested screen is already in front,
    // we don't need any X/Y movement.
    //
    // We only perform the normal orientation correction.
    // --------------------------------------------------------

    if (getFrontScreen(cubeRotation) === targetScreen) {
      isMoving.current = true;

      correctCubeOrientation(cubeRotation, () => {
        isMoving.current = false;
      });

      return;
    }

    // --------------------------------------------------------
    // Lock the cube for the complete navigation sequence.
    // --------------------------------------------------------

    isMoving.current = true;

    // --------------------------------------------------------
    // Randomly choose which axis we search first.
    //
    // X = vertical movement
    // Y = horizontal movement
    // --------------------------------------------------------

    const firstAxis = Math.random() < 0.5 ? "horizontal" : "vertical";

    const secondAxis = firstAxis === "horizontal" ? "vertical" : "horizontal";

    // --------------------------------------------------------
    // Search one axis.
    //
    // Three 90° rolls = 270°.
    //
    // The fourth orientation is the original orientation,
    // so checking after three rolls covers all four positions.
    // --------------------------------------------------------

    const searchAxis = (
      axis: "horizontal" | "vertical",
      currentRotation: Quaternion,
      rollCount: number,
      onFinished: (found: boolean, finalRotation: Quaternion) => void,
    ) => {
      // ------------------------------------------------------
      // Check the current physical front face.
      // ------------------------------------------------------

      if (getFrontScreen(currentRotation) === targetScreen) {
        onFinished(true, currentRotation);

        return;
      }

      // ------------------------------------------------------
      // Three rolls have now been attempted on this axis.
      //
      // Switch to the other axis.
      // ------------------------------------------------------

      if (rollCount >= 3) {
        onFinished(false, currentRotation);

        return;
      }

      // ------------------------------------------------------
      // Pick ONE random direction for this axis sweep.
      //
      // The direction stays the same for all three rolls.
      // ------------------------------------------------------

      const direction =
        rollCount === 0
          ? getRandomDirection(axis)
          : (searchAxisDirection.current as Direction);

      searchAxisDirection.current = direction;

      // ------------------------------------------------------
      // Perform exactly one physical 90° roll.
      // ------------------------------------------------------

      performNavigationRoll(direction, currentRotation, (nextRotation) => {
        // --------------------------------------------------
        // Check immediately after the completed 90° roll.
        // --------------------------------------------------

        if (getFrontScreen(nextRotation) === targetScreen) {
          onFinished(true, nextRotation);

          return;
        }

        // --------------------------------------------------
        // Continue the same axis sweep.
        // --------------------------------------------------

        searchAxis(axis, nextRotation, rollCount + 1, onFinished);
      });
    };

    // --------------------------------------------------------
    // Start with the randomly selected axis.
    // --------------------------------------------------------

    searchAxis(firstAxis, cubeRotation, 0, (found, rotationAfterFirstAxis) => {
      if (found) {
        // ----------------------------------------------
        // Target reached.
        //
        // NOW perform the ONE final Z correction.
        // ----------------------------------------------

        correctCubeOrientation(rotationAfterFirstAxis, () => {
          isMoving.current = false;
        });

        return;
      }

      // --------------------------------------------------
      // First axis failed.
      //
      // Switch to the other axis.
      // --------------------------------------------------

      searchAxis(
        secondAxis,
        rotationAfterFirstAxis,
        0,
        (foundOnSecondAxis, finalRotation) => {
          if (foundOnSecondAxis) {
            // --------------------------------------------
            // Target reached on second axis.
            //
            // NOW perform the ONE final Z correction.
            // --------------------------------------------

            correctCubeOrientation(finalRotation, () => {
              isMoving.current = false;
            });

            return;
          }

          // ------------------------------------------------
          // This should theoretically never happen for a
          // valid cube navigation target, because the two
          // complete axis sweeps cover the cube orientations.
          //
          // Keep this as a safety exit.
          // ------------------------------------------------

          isMoving.current = false;
        },
      );
    });
  }

  // ----------------------------------------------------------
  // Direction used during the current axis sweep.
  //
  // We intentionally keep the same random direction for all
  // three 90° rolls of one axis.
  // ----------------------------------------------------------

  // ----------------------------------------------------------
  // Manual cube movement.
  //
  // Manual movement still performs:
  //
  // ONE 90° roll
  //      ↓
  // Z orientation correction
  //
  // Multi-roll navigation uses navigateToScreen() instead.
  // ----------------------------------------------------------

  function move(direction: Direction) {
    // --------------------------------------------------------
    // Ignore commands while moving.
    // --------------------------------------------------------

    if (isMoving.current) {
      return;
    }

    isMoving.current = true;

    // --------------------------------------------------------
    // Save current physical orientation.
    // --------------------------------------------------------

    const startRotation = cubeRotation;

    // --------------------------------------------------------
    // Calculate the 90° target orientation.
    // --------------------------------------------------------

    const targetRotation = getMovementRotation(direction, startRotation);

    // --------------------------------------------------------
    // Perform exactly one physical cube roll.
    // --------------------------------------------------------

    animateCubeTo(startRotation, targetRotation, () => {
      // ----------------------------------------------------
      // Only after the roll completely finishes do we
      // perform the orientation correction.
      // ----------------------------------------------------

      correctCubeOrientation(targetRotation, () => {
        isMoving.current = false;
      });
    });
  }

  // ----------------------------------------------------------
  // Pointer down for the CUBE ONLY.
  //
  // This is deliberately NOT attached to the entire page.
  // That keeps buttons and the joystick independent.
  // ----------------------------------------------------------

  function handleCubePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    // --------------------------------------------------------
    // Capture the pointer so pointer-up still reaches the cube
    // even if the pointer leaves the cube while dragging.
    // --------------------------------------------------------

    event.currentTarget.setPointerCapture(event.pointerId);

    pointerStart.current = {
      x: event.clientX,
      y: event.clientY,
    };
  }

  // ----------------------------------------------------------
  // Pointer up for the CUBE ONLY.
  // ----------------------------------------------------------

  function handleCubePointerUp(event: React.PointerEvent<HTMLDivElement>) {
    if (!pointerStart.current) {
      return;
    }

    const deltaX = event.clientX - pointerStart.current.x;

    const deltaY = event.clientY - pointerStart.current.y;

    pointerStart.current = null;

    // --------------------------------------------------------
    // Release pointer capture immediately.
    // --------------------------------------------------------

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    // --------------------------------------------------------
    // Ignore tiny movements.
    // --------------------------------------------------------

    const minimumDrag = 40;

    if (Math.abs(deltaX) < minimumDrag && Math.abs(deltaY) < minimumDrag) {
      return;
    }

    // --------------------------------------------------------
    // Whichever axis moved more determines the command.
    // --------------------------------------------------------

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // ------------------------------------------------------
      // Horizontal drag.
      //
      // Right drag → LEFT cube roll.
      // Left drag  → RIGHT cube roll.
      // ------------------------------------------------------

      if (deltaX > 0) {
        move("left");
      } else {
        move("right");
      }
    } else {
      // ------------------------------------------------------
      // Vertical drag.
      // ------------------------------------------------------

      if (deltaY > 0) {
        move("down");
      } else {
        move("up");
      }
    }
  }

  // ----------------------------------------------------------
  // Prevent accidental browser drag behavior.
  // ----------------------------------------------------------

  function handleCubeDragStart(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
  }

  // ----------------------------------------------------------
  // Cleanup animation when component is removed.
  // ----------------------------------------------------------

  useEffect(() => {
    return () => {
      if (animationFrame.current !== null) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, []);

  // ----------------------------------------------------------
  // Render
  // ----------------------------------------------------------

  return (
    <div className="cubeTestPage">
      {/* ----------------------------------------------------
          TEMPORARY TEST JOYSTICK
      ----------------------------------------------------- */}

      {/* --------------------------------------------------------
    Temporary screen navigation.

    These buttons directly test the target-screen navigation
    system before we build the final navigation dock.
--------------------------------------------------------- */}

      <CubeScreenNavigation onNavigate={navigateToScreen} />

      <div className="cubeJoystick">
        <button
          className="joystickButton joystickUp"
          onPointerDown={(event) => event.stopPropagation()}
          onClick={() => move("up")}
          aria-label="Move cube up"
        >
          ↑
        </button>

        <button
          className="joystickButton joystickLeft"
          onPointerDown={(event) => event.stopPropagation()}
          onClick={() => move("left")}
          aria-label="Move cube left"
        >
          ←
        </button>

        <div className="joystickCenter">●</div>

        <button
          className="joystickButton joystickRight"
          onPointerDown={(event) => event.stopPropagation()}
          onClick={() => move("right")}
          aria-label="Move cube right"
        >
          →
        </button>

        <button
          className="joystickButton joystickDown"
          onPointerDown={(event) => event.stopPropagation()}
          onClick={() => move("down")}
          aria-label="Move cube down"
        >
          ↓
        </button>
      </div>

      {/* ----------------------------------------------------
          3D scene
          
          ONLY THIS AREA responds to cube dragging.
      ----------------------------------------------------- */}

      <div
        className="cubeScene"
        onPointerDown={handleCubePointerDown}
        onPointerUp={handleCubePointerUp}
        onDragStart={handleCubeDragStart}
      >
        <div
          className="cube"
          style={{
            transform: quaternionToCSSMatrix(cubeRotation),
          }}
        >
          {/* ------------------------------------------------
              FRONT
          ------------------------------------------------- */}

          <div className="cubeFace cubeFront">
            <HomeScreen />

            {/* Temporary 3D object used to test objects attached to a cube face. */}
            <div className="test3DObject">
              <div className="test3DObjectFace test3DObjectFront" />
              <div className="test3DObjectFace test3DObjectBack" />
              <div className="test3DObjectFace test3DObjectRight" />
              <div className="test3DObjectFace test3DObjectLeft" />
              <div className="test3DObjectFace test3DObjectTop" />
              <div className="test3DObjectFace test3DObjectBottom" />
            </div>
          </div>

          {/* ------------------------------------------------
              BACK
          ------------------------------------------------- */}
          <div className="cubeFace cubeBack">
            <ProjectsScreen />
          </div>

          {/* ------------------------------------------------
              RIGHT
          ------------------------------------------------- */}

          <div className="cubeFace cubeRight">
            <AboutScreen />
          </div>

          {/* ------------------------------------------------
              LEFT
          ------------------------------------------------- */}
          <div className="cubeFace cubeLeft">
            <SkillsScreen />
          </div>

          {/* ------------------------------------------------
              TOP
          ------------------------------------------------- */}

          <div className="cubeFace cubeTop">
            <BlogScreen />
          </div>

          {/* ------------------------------------------------
              BOTTOM
          ------------------------------------------------- */}

          <div className="cubeFace cubeBottom">
            <ContactScreen />
          </div>
        </div>
      </div>
    </div>
  );
}
