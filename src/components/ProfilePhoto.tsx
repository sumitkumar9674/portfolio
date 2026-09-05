import { useEffect, useRef, useState } from "react";

// Profile photo assets
import background from "../assets/Profile_Photo/background.png";
import idle from "../assets/Profile_Photo/idle.png";
import eyebrow from "../assets/Profile_Photo/eyebrow.png";
import left from "../assets/Profile_Photo/left.png";
import right from "../assets/Profile_Photo/right.png";
import gun from "../assets/Profile_Photo/gun.png";
import bullet from "../assets/Profile_Photo/bullet.png";

// All animation timings can be controlled from this object.
type ProfilePhotoTimings = {
  idleDuration: number; // How long idle.png stays visible
  eyebrowDuration: number; // How long eyebrow.png stays visible

  bulletDuration: number; // How long the bullet stays visible
};

// Default timings for the profile photo
const DEFAULT_TIMINGS: ProfilePhotoTimings = {
  idleDuration: 4500,
  eyebrowDuration: 2000,

  bulletDuration: 1000,
};

type ProfilePhotoProps = {
  // Optional custom timings
  timings?: Partial<ProfilePhotoTimings>;

  // Optional size of the square profile area
  size?: number;
};

type ProfileState = "idle" | "eyebrow" | "left" | "right";

type MousePosition = {
  x: number;
  y: number;
};

export default function ProfilePhoto({
  timings = {},
  size = 300,
}: ProfilePhotoProps) {
  // Merge custom timings with the defaults.
  const animationTimings = {
    ...DEFAULT_TIMINGS,
    ...timings,
  };

  // Current profile image
  const [profileState, setProfileState] = useState<ProfileState>("idle");

  // Whether the mouse is currently over the profile area
  const [isHovering, setIsHovering] = useState(false);

  // Whether the gun should currently be visible
  const [showGun, setShowGun] = useState(false);

  // Whether the bullet should currently be visible
  const [showBullet, setShowBullet] = useState(false);

  // Bullet position relative to the profile square
  const [bulletPosition, setBulletPosition] = useState<MousePosition>({
    x: 0,
    y: 0,
  });

  // Gun position relative to the profile square
  const [gunPosition, setGunPosition] = useState<MousePosition>({
    x: 0,
    y: 0,
  });

  // Reference to the profile container
  const containerRef = useRef<HTMLDivElement>(null);

  // Used to cancel the current idle/eyebrow timer when a dodge happens.
  const idleTimerRef = useRef<number | null>(null);

  // Used to cancel the bullet timer.
  const bulletTimerRef = useRef<number | null>(null);

  // Used to cancel the dodge timer.

  // Select the correct profile image.
  const getProfileImage = () => {
    switch (profileState) {
      case "eyebrow":
        return eyebrow;

      case "left":
        return left;

      case "right":
        return right;

      default:
        return idle;
    }
  };

  // Start the normal idle → eyebrow → idle animation.
  const startIdleAnimation = () => {
    // Clear any previous idle timer.
    if (idleTimerRef.current !== null) {
      window.clearTimeout(idleTimerRef.current);
    }

    // Start from the normal idle image.
    setProfileState("idle");

    // Wait for the idle duration before showing the eyebrow image.
    idleTimerRef.current = window.setTimeout(() => {
      setProfileState("eyebrow");

      // Keep the eyebrow image visible for its duration.
      idleTimerRef.current = window.setTimeout(() => {
        // Return to idle.
        setProfileState("idle");

        // Start the cycle again.
        startIdleAnimation();
      }, animationTimings.eyebrowDuration);
    }, animationTimings.idleDuration);
  };

  // Start the idle animation when the component appears.
  useEffect(() => {
    startIdleAnimation();

    // Clean up the timer when the component is removed.
    return () => {
      if (idleTimerRef.current !== null) {
        window.clearTimeout(idleTimerRef.current);
      }
    };
  }, [animationTimings.idleDuration, animationTimings.eyebrowDuration]);

  // Handle mouse movement over the profile.
  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const container = containerRef.current;

    if (!container) return;

    const rect = container.getBoundingClientRect();

    // Convert screen coordinates into coordinates
    // relative to the profile square.
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    setGunPosition({
      x,
      y,
    });

    // Show the gun only when the mouse actually moves.
    setShowGun(true);
  };

  // Handle entering the profile area.
  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  // Handle leaving the profile area.
  const handleMouseLeave = () => {
    setIsHovering(false);

    // Hide the gun when the mouse leaves.
    setShowGun(false);
  };

  // Handle a click/tap on the profile.
  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const container = containerRef.current;

    if (!container) return;

    const rect = container.getBoundingClientRect();

    // Find where the user clicked inside the square.
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Store the bullet position.
    setBulletPosition({
      x,
      y,
    });

    // Immediately hide the gun.
    setShowGun(false);

    // Show the bullet.
    setShowBullet(true);

    // Cancel the current idle/eyebrow animation.
    if (idleTimerRef.current !== null) {
      window.clearTimeout(idleTimerRef.current);
    }

    // Cancel any previous dodge timer.

    // Cancel any previous bullet timer.
    if (bulletTimerRef.current !== null) {
      window.clearTimeout(bulletTimerRef.current);
    }

    // Determine which side of the square was clicked.
    const clickedLeftSide = x < rect.width / 2;

    // If the user clicks the LEFT side,
    // the character dodges to the RIGHT.
    if (clickedLeftSide) {
      setProfileState("right");
    } else {
      // If the user clicks the RIGHT side,
      // the character dodges to the LEFT.
      setProfileState("left");
    }

    // Keep the dodge image visible for the configured duration.

    // Remove the bullet after its configured duration.
    bulletTimerRef.current = window.setTimeout(() => {
      // Remove the bullet.
      setShowBullet(false);

      // Return to the normal idle image.
      setProfileState("idle");

      // Restart the normal idle → eyebrow → idle cycle.
      startIdleAnimation();
    }, animationTimings.bulletDuration);
  };

  // Prevent the browser cursor from appearing while hovering.
  const cursorStyle = isHovering && showGun ? "none" : "default";
  return (
    <div
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      onClick={handleClick}
      style={{
        position: "relative",

        // Always keep the profile perfectly square.
        width: size,
        aspectRatio: "1 / 1",

        // Prevent anything from escaping the square.
        overflow: "hidden",

        // Used for positioning the gun and bullet.
        cursor: cursorStyle,

        // Makes the component behave nicely as a standalone element.
        userSelect: "none",
        touchAction: "manipulation",
      }}
    >
      {/* Permanent background layer */}
      <img
        src={background}
        alt=""
        draggable={false}
        style={{
          position: "absolute",
          inset: 0,

          width: "100%",
          height: "100%",

          objectFit: "cover",

          pointerEvents: "none",
        }}
      />

      {/* Current profile image */}
      <img
        src={getProfileImage()}
        alt="Profile"
        draggable={false}
        style={{
          position: "absolute",
          inset: 0,

          width: "100%",
          height: "100%",

          objectFit: "cover",

          pointerEvents: "none",
        }}
      />

      {/* Bullet appears exactly where the user clicked */}
      {showBullet && (
        <img
          src={bullet}
          alt=""
          draggable={false}
          style={{
            position: "absolute",

            left: bulletPosition.x,
            top: bulletPosition.y,

            // Center the bullet on the click position.
            transform: "translate(-50%, -50%)",

            // Bullet size can be adjusted here later.
            width: "27px",
            height: "27px",

            pointerEvents: "none",
          }}
        />
      )}

      {/* Gun follows the mouse while hovering */}
      {showGun && (
        <img
          src={gun}
          alt=""
          draggable={false}
          style={{
            position: "absolute",

            left: gunPosition.x,
            top: gunPosition.y,

            // Center the gun around the cursor.
            transform: "translate(-50%, -50%)",

            // Gun size can be adjusted here later.
            width: "64px",
            height: "64px",

            pointerEvents: "none",

            // Keep the gun above everything else.
            zIndex: 10,
          }}
        />
      )}
    </div>
  );
}
