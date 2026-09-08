// ------------------------------------------------------------
// CubeTest
// ------------------------------------------------------------
// This is a standalone test screen for the 3D portfolio cube.
//
// IMPORTANT ARCHITECTURE:
//
// 1. The cube is one rigid 3D object.
// 2. Every screen is permanently attached to one physical face.
// 3. We use quaternions for the cube's orientation.
// 4. Every movement is exactly one 90° roll.
// 5. SLERP smoothly animates between orientations.
// 6. We NEVER swap screen content after a rotation.
// 7. Screen orientation is intentionally NOT corrected yet.
// ------------------------------------------------------------

import { useEffect, useRef, useState } from "react";
import "./CubeTest.css";

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
// Initial physical face assignment
//
// These are physical faces.
//
// The content stays attached to these faces permanently.
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
// Create a quaternion from an axis and angle.
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
// This combines two rotations into one rotation.
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
// Normalize a quaternion.
//
// This keeps the quaternion numerically stable after
// repeated rotations.
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
// Dot product between two quaternions.
// ------------------------------------------------------------

function quaternionDot(a: Quaternion, b: Quaternion): number {
  return a.x * b.x + a.y * b.y + a.z * b.z + a.w * b.w;
}

// ------------------------------------------------------------
// Spherical interpolation between two quaternions.
//
// This gives us smooth movement from one exact cube
// orientation to another exact cube orientation.
// ------------------------------------------------------------

function slerpQuaternion(
  start: Quaternion,
  end: Quaternion,
  amount: number,
): Quaternion {
  let endQuaternion = end;

  let dot = quaternionDot(start, endQuaternion);

  // ----------------------------------------------------------
  // Quaternions q and -q represent the same rotation.
  //
  // If the dot product is negative, use the opposite
  // quaternion so that SLERP takes the shorter path.
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
  // If the two rotations are extremely close, normal
  // interpolation is sufficient.
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
// Convert quaternion into a CSS matrix3d() value.
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
// CubeTest component
// ------------------------------------------------------------

export default function CubeTest() {
  // ----------------------------------------------------------
  // Current cube orientation.
  //
  // The cube starts perfectly flat facing the camera.
  // ----------------------------------------------------------

  const [cubeRotation, setCubeRotation] = useState<Quaternion>({
    x: 0,
    y: 0,
    z: 0,
    w: 1,
  });

  // ----------------------------------------------------------
  // Prevent multiple rolls from happening simultaneously.
  // ----------------------------------------------------------

  const isMoving = useRef(false);

  // ----------------------------------------------------------
  // Store the requestAnimationFrame ID so it can be cancelled
  // if the component is removed.
  // ----------------------------------------------------------

  const animationFrame = useRef<number | null>(null);

  // ----------------------------------------------------------
  // Pointer starting position.
  //
  // A drag is only used to determine which direction the
  // user wants. It does NOT create free rotation.
  // ----------------------------------------------------------

  const pointerStart = useRef<{
    x: number;
    y: number;
  } | null>(null);

  // ----------------------------------------------------------
  // Calculate the target rotation for a LEFT movement.
  //
  // This is one exact 90° world-space roll.
  // ----------------------------------------------------------

  function moveLeft(current: Quaternion): Quaternion {
    const rotation = quaternionFromAxisAngle(0, 1, 0, Math.PI / 2);

    return normalizeQuaternion(multiplyQuaternions(rotation, current));
  }

  // ----------------------------------------------------------
  // Calculate the target rotation for a RIGHT movement.
  // ----------------------------------------------------------

  function moveRight(current: Quaternion): Quaternion {
    const rotation = quaternionFromAxisAngle(0, 1, 0, -Math.PI / 2);

    return normalizeQuaternion(multiplyQuaternions(rotation, current));
  }

  // ----------------------------------------------------------
  // Calculate the target rotation for an UP movement.
  // ----------------------------------------------------------

  function moveUp(current: Quaternion): Quaternion {
    const rotation = quaternionFromAxisAngle(1, 0, 0, Math.PI / 2);

    return normalizeQuaternion(multiplyQuaternions(rotation, current));
  }

  // ----------------------------------------------------------
  // Calculate the target rotation for a DOWN movement.
  // ----------------------------------------------------------

  function moveDown(current: Quaternion): Quaternion {
    const rotation = quaternionFromAxisAngle(1, 0, 0, -Math.PI / 2);

    return normalizeQuaternion(multiplyQuaternions(rotation, current));
  }

  // ----------------------------------------------------------
  // Perform one complete cube roll.
  //
  // IMPORTANT:
  //
  // We only rotate the physical cube.
  //
  // We do NOT change cubeState after the animation.
  //
  // Therefore CONTACT stays physically attached to the
  // physical top face. When that face rolls into the front,
  // CONTACT physically arrives at the front with it.
  // ----------------------------------------------------------

  function move(direction: Direction) {
    // --------------------------------------------------------
    // Ignore another command while the cube is already moving.
    // --------------------------------------------------------

    if (isMoving.current) {
      return;
    }

    isMoving.current = true;

    // --------------------------------------------------------
    // Save the exact starting orientation.
    // --------------------------------------------------------

    const startRotation = cubeRotation;

    // --------------------------------------------------------
    // Calculate the exact final orientation.
    // --------------------------------------------------------

    let targetRotation: Quaternion;

    if (direction === "left") {
      targetRotation = moveLeft(startRotation);
    } else if (direction === "right") {
      targetRotation = moveRight(startRotation);
    } else if (direction === "up") {
      targetRotation = moveUp(startRotation);
    } else {
      targetRotation = moveDown(startRotation);
    }

    // --------------------------------------------------------
    // Animation timing.
    // --------------------------------------------------------

    const duration = 700;
    const startTime = performance.now();

    // --------------------------------------------------------
    // Animate from the current orientation to the target
    // orientation.
    // --------------------------------------------------------

    function animate(currentTime: number) {
      const elapsed = currentTime - startTime;

      const rawProgress = Math.min(elapsed / duration, 1);

      // ------------------------------------------------------
      // Smooth ease-in / ease-out.
      // ------------------------------------------------------

      const progress =
        rawProgress < 0.5
          ? 2 * rawProgress * rawProgress
          : 1 - Math.pow(-2 * rawProgress + 2, 2) / 2;

      // ------------------------------------------------------
      // Calculate the current physical orientation.
      // ------------------------------------------------------

      const currentRotation = slerpQuaternion(
        startRotation,
        targetRotation,
        progress,
      );

      setCubeRotation(currentRotation);

      // ------------------------------------------------------
      // Continue until the cube reaches the exact target.
      // ------------------------------------------------------

      if (rawProgress < 1) {
        animationFrame.current = requestAnimationFrame(animate);

        return;
      }

      // ------------------------------------------------------
      // Force the exact final orientation.
      //
      // This prevents tiny floating-point errors from
      // accumulating over many movements.
      // ------------------------------------------------------

      setCubeRotation(targetRotation);

      // ------------------------------------------------------
      // IMPORTANT:
      //
      // We DO NOT change cubeState here.
      //
      // The screens are physical objects attached to their
      // cube faces.
      //
      // The quaternion already moved those physical faces
      // into their new positions.
      //
      // Swapping the labels here would make the screen
      // suddenly change after the animation finishes.
      // ------------------------------------------------------

      isMoving.current = false;
      animationFrame.current = null;
    }

    // --------------------------------------------------------
    // Start animation.
    // --------------------------------------------------------

    animationFrame.current = requestAnimationFrame(animate);
  }

  // ------------------------------------------------------------
  // Pointer down
  // ------------------------------------------------------------

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    pointerStart.current = {
      x: event.clientX,
      y: event.clientY,
    };
  }

  // ------------------------------------------------------------
  // Pointer up
  //
  // The drag distance decides which ONE 90° movement should
  // happen.
  //
  // The user can never stop the cube halfway through.
  // ------------------------------------------------------------

  function handlePointerUp(event: React.PointerEvent<HTMLDivElement>) {
    if (!pointerStart.current) {
      return;
    }

    const deltaX = event.clientX - pointerStart.current.x;

    const deltaY = event.clientY - pointerStart.current.y;

    pointerStart.current = null;

    // --------------------------------------------------------
    // Ignore very small movements.
    // --------------------------------------------------------

    const minimumDrag = 40;

    if (Math.abs(deltaX) < minimumDrag && Math.abs(deltaY) < minimumDrag) {
      return;
    }

    // --------------------------------------------------------
    // Whichever axis has the larger movement wins.
    //
    // This prevents diagonal drags from accidentally
    // triggering two movements.
    // --------------------------------------------------------

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // --------------------------------------------------------
      // Horizontal drag.
      //
      // The horizontal movement is intentionally mapped opposite
      // to the physical drag direction so the cube follows the
      // expected "grab and roll" behavior.
      // --------------------------------------------------------

      if (deltaX > 0) {
        move("left");
      } else {
        move("right");
      }
    } else {
      // --------------------------------------------------------
      // Vertical drag is already behaving correctly.
      // --------------------------------------------------------

      if (deltaY > 0) {
        move("down");
      } else {
        move("up");
      }
    }
  }

  // ------------------------------------------------------------
  // Cleanup animation when component is removed.
  // ------------------------------------------------------------

  useEffect(() => {
    return () => {
      if (animationFrame.current !== null) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, []);

  // ------------------------------------------------------------
  // Render
  // ------------------------------------------------------------

  return (
    <div
      className="cubeTestPage"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
    >
      {/* ----------------------------------------------------
          Direction controls
      ----------------------------------------------------- */}

      <button className="cubeButton cubeButtonUp" onClick={() => move("up")}>
        ↑
      </button>

      <button
        className="cubeButton cubeButtonDown"
        onClick={() => move("down")}
      >
        ↓
      </button>

      <button
        className="cubeButton cubeButtonLeft"
        onClick={() => move("left")}
      >
        ←
      </button>

      <button
        className="cubeButton cubeButtonRight"
        onClick={() => move("right")}
      >
        →
      </button>

      {/* ----------------------------------------------------
          3D scene
      ----------------------------------------------------- */}

      <div className="cubeScene">
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
            <div className="cubeScreen">{screenNames[cubeState.front]}</div>
          </div>

          {/* ------------------------------------------------
              BACK
          ------------------------------------------------- */}

          <div className="cubeFace cubeBack">
            <div className="cubeScreen">{screenNames[cubeState.back]}</div>
          </div>

          {/* ------------------------------------------------
              RIGHT
          ------------------------------------------------- */}

          <div className="cubeFace cubeRight">
            <div className="cubeScreen">{screenNames[cubeState.right]}</div>
          </div>

          {/* ------------------------------------------------
              LEFT
          ------------------------------------------------- */}

          <div className="cubeFace cubeLeft">
            <div className="cubeScreen">{screenNames[cubeState.left]}</div>
          </div>

          {/* ------------------------------------------------
              TOP
          ------------------------------------------------- */}

          <div className="cubeFace cubeTop">
            <div className="cubeScreen">{screenNames[cubeState.top]}</div>
          </div>

          {/* ------------------------------------------------
              BOTTOM
          ------------------------------------------------- */}

          <div className="cubeFace cubeBottom">
            <div className="cubeScreen">{screenNames[cubeState.bottom]}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
