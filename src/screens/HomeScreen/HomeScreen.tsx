import "./HomeScreen.css";
import WireframeCubeObject from "../../components/3DObjects/WireframeCubeObject/WireframeCubeObject";

type CubeConfig = {
  left: string;
  top: string;
  size: number;
  rotateX: number;
  rotateY: number;
  rotateZ: number;
  jiggleDuration: number;
  jiggleDelay: number;
};

/*
  Creates a cube configuration.

  Each cube receives:
  - A different position.
  - A different size.
  - A different starting rotation.
  - A different animation duration.
  - A different animation delay.
*/
function createCube(
  left: string,
  top: string,
  size: number,
  rotateX: number,
  rotateY: number,
  rotateZ: number,
  jiggleDuration: number,
  jiggleDelay: number,
): CubeConfig {
  return {
    left,
    top,
    size,
    rotateX,
    rotateY,
    rotateZ,
    jiggleDuration,
    jiggleDelay,
  };
}

/*
  All cubes surrounding the Home screen.

  The coordinates intentionally go slightly outside the screen:
  - Top: -1%
  - Right: 101%
  - Bottom: 101%
  - Left: -1%

  This keeps the cubes attached to the border without placing
  their entire bodies inside the screen.
*/
const edgeCubes: CubeConfig[] = [
  // ==========================================
  // TOP EDGE
  // ==========================================

  createCube("0%", "-1%", 18, -20, 30, -10, 4.8, 0.2),
  createCube("8.33%", "-1%", 15, 25, -20, 15, 6.1, 2.4),
  createCube("16.66%", "-1%", 20, -30, 20, 8, 5.3, 4.1),
  createCube("25%", "-1%", 16, 20, 35, -18, 7.0, 1.3),
  createCube("33.33%", "-1%", 21, -15, -30, 20, 5.7, 3.6),
  createCube("41.66%", "-1%", 15, 35, 20, -10, 6.5, 5.0),
  createCube("50%", "-1%", 19, -25, 25, 12, 4.9, 0.8),
  createCube("58.33%", "-1%", 16, 30, -15, -20, 7.3, 2.9),
  createCube("66.66%", "-1%", 20, -20, 40, 18, 5.6, 4.4),
  createCube("75%", "-1%", 15, 15, -35, -8, 6.8, 1.7),
  createCube("83.33%", "-1%", 19, -35, 20, 14, 5.1, 3.2),
  createCube("91.66%", "-1%", 16, 25, -25, -16, 6.4, 5.5),
  createCube("100%", "-1%", 18, -15, 35, 10, 5.8, 2.1),

  // ==========================================
  // RIGHT EDGE
  // ==========================================

  createCube("101%", "5%", 16, 30, -20, 12, 5.6, 2.0),
  createCube("101%", "15%", 19, -25, 30, -15, 7.2, 4.6),
  createCube("101%", "25%", 15, 20, -35, 18, 4.9, 1.1),
  createCube("101%", "35%", 21, -30, 20, -10, 6.3, 3.8),
  createCube("101%", "45%", 17, 25, 15, 20, 5.4, 5.2),
  createCube("101%", "55%", 20, -20, -30, -18, 6.9, 2.7),
  createCube("101%", "65%", 15, 35, 25, 10, 5.2, 0.6),
  createCube("101%", "75%", 19, -15, 35, -20, 7.5, 4.0),
  createCube("101%", "85%", 16, 20, -25, 15, 4.7, 1.9),
  createCube("101%", "95%", 18, -35, 15, -12, 6.1, 5.0),

  // ==========================================
  // BOTTOM EDGE
  // ==========================================

  createCube("100%", "101%", 17, 25, -30, 18, 5.9, 3.5),
  createCube("91.66%", "101%", 15, -20, 25, -15, 6.7, 5.8),
  createCube("83.33%", "101%", 20, 30, 20, 10, 4.5, 1.4),
  createCube("75%", "101%", 16, -30, -20, 20, 7.3, 3.0),
  createCube("66.66%", "101%", 19, 15, 35, -18, 5.6, 4.7),
  createCube("58.33%", "101%", 15, -25, 15, 12, 6.5, 0.9),
  createCube("50%", "101%", 21, 35, -25, -10, 4.8, 5.4),
  createCube("41.66%", "101%", 16, -15, 30, 16, 7.0, 2.2),
  createCube("33.33%", "101%", 20, 20, -35, -20, 5.3, 3.9),
  createCube("25%", "101%", 15, -30, 20, 8, 6.2, 1.6),
  createCube("16.66%", "101%", 19, 25, -15, 14, 5.7, 4.8),
  createCube("8.33%", "101%", 16, -20, 35, -12, 7.1, 0.4),
  createCube("0%", "101%", 18, 30, -25, 16, 5.0, 2.6),

  // ==========================================
  // LEFT EDGE
  // ==========================================

  createCube("-1%", "95%", 20, 30, -25, 16, 5.5, 2.8),
  createCube("-1%", "85%", 15, -20, 30, -18, 6.4, 5.1),
  createCube("-1%", "75%", 21, 25, 20, 10, 4.9, 1.2),
  createCube("-1%", "65%", 17, -35, -15, 20, 7.2, 3.7),
  createCube("-1%", "55%", 19, 15, 35, -15, 5.8, 0.7),
  createCube("-1%", "45%", 15, -25, 25, 12, 6.6, 4.3),
  createCube("-1%", "35%", 20, 35, -20, -10, 5.1, 2.5),
  createCube("-1%", "25%", 16, -15, 30, 18, 7.4, 5.6),
  createCube("-1%", "15%", 19, 20, -35, -8, 5.4, 1.8),
  createCube("-1%", "5%", 15, -30, 15, 15, 6.9, 4.9),
];

export default function HomeScreen() {
  return (
    <div className="homeScreen">
      {/* Normal flat content layer. */}
      <div className="homeScreenContent">
        {/* HOME content will be added later. */}
      </div>

      {/* Decorative 3D cube border. */}
      <div className="homeScreenObjects">
        {edgeCubes.map((cube, index) => (
          <div
            key={index}
            className="homeScreenCubeAnchor"
            style={{
              left: cube.left,
              top: cube.top,
            }}
          >
            <WireframeCubeObject
              size={cube.size}
              color="#00ffff"
              rotateX={cube.rotateX}
              rotateY={cube.rotateY}
              rotateZ={cube.rotateZ}
              jiggle
              /*
                Small movement values keep the cubes close
                to their assigned border positions.
              */
              jiggleX={6}
              jiggleY={6}
              jiggleZ={5}
              jiggleRotateX={5}
              jiggleRotateY={5}
              jiggleRotateZ={4}
              jiggleDuration={cube.jiggleDuration}
              jiggleDelay={cube.jiggleDelay}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
