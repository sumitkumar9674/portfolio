import "./WireframeCubeObject.css";

type WireframeCubeObjectProps = {
  size?: number;
  color?: string;
  lineWidth?: number;

  x?: number;
  y?: number;
  z?: number;

  rotateX?: number;
  rotateY?: number;
  rotateZ?: number;

  jiggle?: boolean;

  jiggleX?: number;
  jiggleY?: number;
  jiggleZ?: number;

  jiggleRotateX?: number;
  jiggleRotateY?: number;
  jiggleRotateZ?: number;

  jiggleDuration?: number;
  jiggleDelay?: number;
};

export default function WireframeCubeObject({
  size = 100,
  color = "#00ffff",
  lineWidth = 2,

  x = 0,
  y = 0,
  z = 0,

  rotateX = -20,
  rotateY = -35,
  rotateZ = 0,

  jiggle = false,

  jiggleX = 4,
  jiggleY = 4,
  jiggleZ = 3,

  jiggleRotateX = 3,
  jiggleRotateY = 3,
  jiggleRotateZ = 2,

  jiggleDuration = 5,
  jiggleDelay = 0,
}: WireframeCubeObjectProps) {
  const halfSize = size / 2;

  return (
    <div
      className="wireframeCubeScene"
      style={{
        width: `${size}px`,
        height: `${size}px`,

        // Local position inside the Home screen 3D scene.
        transform: `translate3d(${x}px, ${y}px, ${z}px)`,
      }}
    >
      {/* This wrapper handles jiggle movement only. */}
      <div
        className={`wireframeCubeJiggle ${jiggle ? "isJiggling" : ""}`}
        style={
          {
            "--wireframe-cube-jiggle-x": `${jiggleX}px`,
            "--wireframe-cube-jiggle-y": `${jiggleY}px`,
            "--wireframe-cube-jiggle-z": `${jiggleZ}px`,

            "--wireframe-cube-jiggle-rotate-x": `${jiggleRotateX}deg`,
            "--wireframe-cube-jiggle-rotate-y": `${jiggleRotateY}deg`,
            "--wireframe-cube-jiggle-rotate-z": `${jiggleRotateZ}deg`,

            "--wireframe-cube-jiggle-duration": `${jiggleDuration}s`,
            "--wireframe-cube-jiggle-delay": `${jiggleDelay}s`,
          } as React.CSSProperties
        }
      >
        {/* This inner element keeps the cube's permanent 3D rotation. */}
        <div
          className="wireframeCube"
          style={
            {
              "--wireframe-cube-size": `${size}px`,
              "--wireframe-cube-half": `${halfSize}px`,
              "--wireframe-cube-color": color,
              "--wireframe-cube-line-width": `${lineWidth}px`,

              "--wireframe-cube-rotate-x": `${rotateX}deg`,
              "--wireframe-cube-rotate-y": `${rotateY}deg`,
              "--wireframe-cube-rotate-z": `${rotateZ}deg`,
            } as React.CSSProperties
          }
        >
          <div className="wireframeCubeFace wireframeCubeFront" />
          <div className="wireframeCubeFace wireframeCubeBack" />
          <div className="wireframeCubeFace wireframeCubeRight" />
          <div className="wireframeCubeFace wireframeCubeLeft" />
          <div className="wireframeCubeFace wireframeCubeTop" />
          <div className="wireframeCubeFace wireframeCubeBottom" />
        </div>
      </div>
    </div>
  );
}
